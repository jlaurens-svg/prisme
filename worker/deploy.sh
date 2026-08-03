#!/usr/bin/env bash
#
# Branche les lectures par IA de PRISME, en une commande.
#
#   cd worker && ./deploy.sh
#
# Le script fait tout ce qui peut être fait sans vous : il déploie le relais,
# récupère son adresse, l'écrit dans config.js, vérifie que le relais répond, et
# vous donne les deux lignes de git à lancer.
#
# Deux moments demandent votre main, et ils ne peuvent pas être automatisés :
#   1. la connexion à Cloudflare — une fenêtre s'ouvre, vous autorisez ;
#   2. la clé d'API Anthropic — vous la collez, elle part chiffrée chez
#      Cloudflare et n'est écrite nulle part sur votre disque.
#
# Rien de tout cela ne touche à votre site tant que vous n'avez pas poussé.

set -euo pipefail

ICI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RACINE="$(dirname "$ICI")"
CONFIG="$RACINE/config.js"
SEC=0        # 1 si l'on saute la mise en place de la clé
ESSAI=0      # 1 pour vérifier la mécanique sans rien déployer

for arg in "$@"; do
  case "$arg" in
    --garder-cle) SEC=1 ;;
    --essai|--dry-run) ESSAI=1 ;;
    -h|--help)
      sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "Option inconnue : $arg" >&2; exit 2 ;;
  esac
done

titre(){ printf '\n\033[1m%s\033[0m\n' "$1"; }
info(){  printf '  %s\n' "$1"; }
bien(){  printf '  \033[32m✓\033[0m %s\n' "$1"; }
souci(){ printf '  \033[31m✗\033[0m %s\n' "$1" >&2; }

# ---------------------------------------------------------------- prérequis
titre "Vérifications"
command -v node >/dev/null || { souci "node n'est pas installé — https://nodejs.org"; exit 1; }
command -v npx  >/dev/null || { souci "npx n'est pas disponible (il vient avec node)"; exit 1; }
bien "node $(node --version)"
[ -f "$ICI/wrangler.toml" ] || { souci "lancez le script depuis le dossier worker/"; exit 1; }
[ -f "$CONFIG" ]            || { souci "config.js introuvable à la racine du site"; exit 1; }
bien "worker/ et config.js en place"

if [ "$ESSAI" = 1 ]; then
  titre "Essai à blanc"
  info "Rien ne sera déployé. On vérifie seulement l'écriture de config.js."
  URL="https://prisme-mediation.essai.workers.dev"
else
  # -------------------------------------------------------------- connexion
  titre "1/4 · Connexion à Cloudflare"
  if npx --yes wrangler whoami >/dev/null 2>&1; then
    bien "déjà connecté"
  else
    info "Une fenêtre de navigateur va s'ouvrir : autorisez, puis revenez ici."
    npx --yes wrangler login
    bien "connecté"
  fi

  # -------------------------------------------------------------- la clé
  titre "2/4 · Clé d'API Anthropic"
  if [ "$SEC" = 1 ]; then
    info "Ignorée (--garder-cle) : la clé déjà en place est conservée."
  else
    info "Créez-la sur https://console.anthropic.com/settings/keys"
    info "Collez-la quand c'est demandé — elle ne s'affiche pas, et elle ne"
    info "sera écrite ni dans ce dépôt ni sur votre disque."
    ( cd "$ICI" && npx --yes wrangler secret put ANTHROPIC_API_KEY )
    bien "clé enregistrée, chiffrée chez Cloudflare"
  fi

  # -------------------------------------------------------------- déploiement
  titre "3/4 · Déploiement du relais"
  SORTIE="$(cd "$ICI" && npx --yes wrangler deploy 2>&1 | tee /dev/stderr)"
  URL="$(printf '%s' "$SORTIE" | grep -oE 'https://[A-Za-z0-9._-]+\.workers\.dev' | head -1)"
  if [ -z "$URL" ]; then
    souci "l'adresse du relais n'a pas pu être lue dans la sortie ci-dessus."
    info  "Repérez la ligne en https://…workers.dev et écrivez-la à la main dans config.js :"
    info  "  window.PRISME_AI_ENDPOINT = \"https://…workers.dev\";"
    exit 1
  fi
  bien "relais en ligne : $URL"
fi

# ---------------------------------------------------------------- config.js
titre "4/4 · Adresse du relais dans config.js"
python3 - "$CONFIG" "$URL" <<'PY'
import io, re, sys
chemin, url = sys.argv[1], sys.argv[2]
s = io.open(chemin, encoding="utf-8").read()
motif = re.compile(r'(window\.PRISME_AI_ENDPOINT\s*=\s*)"[^"]*"')
if not motif.search(s):
    print("  ✗ ligne window.PRISME_AI_ENDPOINT introuvable dans config.js", file=sys.stderr)
    sys.exit(1)
neuf = motif.sub(lambda m: m.group(1) + '"' + url + '"', s, count=1)
if neuf == s:
    print("  ✓ config.js contenait déjà cette adresse")
else:
    io.open(chemin, "w", encoding="utf-8").write(neuf)
    print("  ✓ config.js mis à jour")
PY

# ---------------------------------------------------------------- vérification
if [ "$ESSAI" != 1 ]; then
  titre "Le relais répond-il ?"
  # Une requête vide doit être refusée proprement (400), ce qui prouve que le
  # Worker tourne et que la clé est en place. Un 500 signalerait la clé absente.
  CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$URL" \
            -H 'content-type: application/json' \
            -H 'origin: https://the-prisme.com' \
            --data '{}' || echo 000)"
  case "$CODE" in
    400) bien "le relais tourne et refuse les requêtes vides — c'est le bon signe" ;;
    500) souci "le relais tourne mais la clé manque : relancez sans --garder-cle" ;;
    403) souci "origine refusée : vérifiez ALLOWED_ORIGINS dans wrangler.toml" ;;
    000) souci "aucune réponse — le déploiement vient peut-être de se terminer, réessayez dans une minute" ;;
    *)   info  "réponse inattendue ($CODE) — vérifiez le tableau de bord Cloudflare" ;;
  esac
fi

titre "Il reste une chose, et elle est à vous"
cat <<TXT
  Le site ne changera pour vos visiteurs qu'après un push :

    git -C "$RACINE" add config.js
    git -C "$RACINE" commit -m "Brancher les lectures par IA"
    git -C "$RACINE" push

  Ensuite, les trois lectures s'activent d'un coup :
    · Mon miroir  — la lecture du tiers
    · Mes rêves   — la lecture jungienne d'un rêve
    · Moi         — la lecture d'ensemble des prismes

  Coût indicatif : 4 à 5 centimes par lecture. Vous pouvez plafonner la dépense
  depuis la console Anthropic, onglet Limits.
TXT
