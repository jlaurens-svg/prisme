# Relais des lectures par IA

Petite fonction serveur dont le seul rôle est de **détenir la clé d'API** pour
que la page publique n'ait pas à la contenir. Une clé placée dans `app.js`
serait lisible par n'importe qui et consommée à vos frais en quelques heures.

Elle sert les deux lectures du site : la médiation du Miroir et la lecture d'un
rêve. Un seul déploiement suffit pour les deux.

## Déployer (une seule fois, ~5 minutes)

Il faut un compte [Cloudflare](https://dash.cloudflare.com/sign-up) (le palier
gratuit suffit largement) et une clé d'API Anthropic
([console](https://console.anthropic.com/settings/keys)).

```sh
cd worker
npx wrangler login                        # ouvre le navigateur
npx wrangler secret put ANTHROPIC_API_KEY # colle la clé, elle est chiffrée
npx wrangler deploy
```

`deploy` affiche une adresse de la forme
`https://prisme-mediation.VOTRE-SOUS-DOMAINE.workers.dev`.

Reportez-la dans `config.js` à la racine du site :

```js
window.PRISME_AI_ENDPOINT = "https://prisme-mediation.VOTRE-SOUS-DOMAINE.workers.dev";
```

Committez, poussez : la médiation est active pour tous les visiteurs.

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
