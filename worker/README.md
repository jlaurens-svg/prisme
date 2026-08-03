# Relais des lectures par IA

Petite fonction serveur dont le seul rôle est de **détenir la clé d'API** pour
que la page publique n'ait pas à la contenir. Une clé placée dans `app.js`
serait lisible par n'importe qui et consommée à vos frais en quelques heures.

Elle sert les trois lectures du site : la médiation du Miroir, la lecture d'un
rêve et la lecture d'ensemble du profil. Un seul déploiement suffit pour les
trois.

## Déployer (une seule fois, ~5 minutes)

Il faut un compte [Cloudflare](https://dash.cloudflare.com/sign-up) (le palier
gratuit suffit largement) et une clé d'API Anthropic
([console](https://console.anthropic.com/settings/keys)).

```sh
cd worker
./deploy.sh
```

Le script fait tout ce qui peut l'être sans intervention : il déploie le relais,
lit son adresse, l'écrit dans `config.js`, vérifie que le relais répond, puis
affiche les lignes de git à lancer.

Deux moments demandent votre main, et **aucun des deux ne peut être automatisé** :
la connexion à votre compte Cloudflare (une fenêtre s'ouvre, vous autorisez) et
la clé d'API (vous la collez ; elle part chiffrée chez Cloudflare, elle n'est
écrite ni dans le dépôt ni sur votre disque).

Options : `--garder-cle` pour redéployer sans retoucher à la clé, `--essai` pour
vérifier la mécanique sans rien déployer.

### À la main, si vous préférez

```sh
cd worker
npx wrangler login                        # ouvre le navigateur
npx wrangler secret put ANTHROPIC_API_KEY # colle la clé, elle est chiffrée
npx wrangler deploy
```

`deploy` affiche une adresse de la forme
`https://prisme-mediation.VOTRE-SOUS-DOMAINE.workers.dev`. Reportez-la dans
`config.js` à la racine du site :

```js
window.PRISME_AI_ENDPOINT = "https://prisme-mediation.VOTRE-SOUS-DOMAINE.workers.dev";
```

Committez, poussez : les trois lectures sont actives pour tous les visiteurs.

### Vérifier que c'est branché

Un `POST` vide sur l'adresse du relais doit répondre **400**
`{"error":"messages_required"}` : le Worker tourne et la clé est en place. Un
**500** `server_not_configured` veut dire que la clé manque, un **403**
`origin_not_allowed` que le domaine n'est pas dans `ALLOWED_ORIGINS`. Le script
fait ce test tout seul en fin de course.

## Ce que le relais vérifie

Un relais qui transmet tout est aussi exposé qu'une clé publique. Celui-ci :

- **impose le modèle et `max_tokens`** — le client ne peut pas les changer, donc
  pas de requête coûteuse déguisée ;
- **filtre les origines** (`ALLOWED_ORIGINS` dans `wrangler.toml`) — seuls vos
  domaines peuvent l'appeler ;
- **borne la taille** du corps (24 Ko) et du texte transmis (12 000 caractères) ;
- ne journalise ni les récits ni la clé.

Pour changer les domaines autorisés, éditez `wrangler.toml` puis redéployez.

Le domaine du site (`the-prisme.com` et son `www`) y figure déjà. Si vous en
ajoutez un autre plus tard, pensez à cette liste : sans elle, la médiation
renvoie `403 origin_not_allowed` depuis le nouveau domaine.

## Coût

Environ **4 à 5 centimes par médiation** (Claude Opus 5, ~1 500 jetons en
entrée, ~1 500 en sortie), un peu moins par lecture de rêve — un rêve est plus
court que deux récits. Cloudflare est gratuit jusqu'à 100 000 requêtes par jour.
Pour surveiller ou plafonner la dépense, utilisez les limites de la console
Anthropic.

## Autres hébergeurs

Le module client ne dépend pas de Cloudflare : il fait un `POST` JSON sur
l'adresse configurée. Le même code se transpose en fonction Vercel, Netlify ou
Deno Deploy — gardez les mêmes vérifications.

## Tester sans rien déployer

L'interface propose un mode « clé personnelle » : la clé est saisie dans le
navigateur et reste dans le stockage local de la machine. Elle sert aux deux
lectures. Pratique pour essayer la fonctionnalité tout de suite, **à ne pas
proposer au public** — chaque visiteur devrait fournir sa propre clé.
