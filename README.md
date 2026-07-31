# PRISME

Se comprendre — et comprendre ses proches — à travers trois lentilles :
**astrologie · numérologie · MBTI**. Moderne, sans genre, bilingue (FR/EN).

Tout est calculé **localement** dans le navigateur, à une exception près : la
*lecture du tiers* du Miroir envoie les deux récits à un modèle d'IA, après
consentement explicite (voir `worker/`). Portraits : domaine public (Wikimedia
Commons).

*Understand yourself and those close to you through three lenses:
astrology, numerology, MBTI. A symbolic, reflective tool with no predictive value.*

## Structure

Site statique, sans étape de compilation — il suffit de servir le dossier.

| Fichier | Rôle |
|---|---|
| `index.html` | structure des vues |
| `styles.css` | mise en forme |
| `astro.js` | calculs astronomiques (lune, ascendant) |
| `transits.js` | positions des planètes, rétrogradations, aspects |
| `mirror-ai.js` | médiation du Miroir par IA (consigne, schéma, appel) |
| `config.js` | adresse du relais d'API (vide = mode clé personnelle) |
| `cities.js` | recherche de ville et conversion heure locale → UT |
| `data.js` | contenus et traductions FR/EN |
| `portraits.js` | portraits Wikimedia |
| `app.js` | interface et rendu |

### Bases de villes

`cities-data.js` (24 323 villes de 15 000 habitants et plus) et
`cities-extra.js` (110 910 communes plus petites) sont **générés** — ne pas les
éditer à la main. Aucun des deux n'est chargé au démarrage : le premier arrive
à l'ouverture du volet « heure et lieu de naissance », le second seulement si
une recherche n'y trouve rien.

Pour les régénérer :

```sh
cd tools
npm install
npm run cities
```

Sources : [GeoNames](https://www.geonames.org/) via `all-the-cities`, fuseaux
horaires via `tz-lookup`, noms de pays via `i18n-iso-countries`. La couverture
s'arrête aux localités d'environ 1 000 habitants ; pour un hameau, choisir la
commune voisine (à 10 km près l'ascendant est identique) ou saisir les
coordonnées à la main.

Le décalage UTC appliqué est celui qui valait **à la date de naissance**, lu
dans la base tzdata du navigateur — les règles historiques d'heure d'été sont
donc respectées.

### Médiation du Miroir

La section Miroir peut faire relire les deux récits par un tiers — une analyse
produite par Claude, qui nomme le malentendu et l'angle mort de chacun sans
donner raison à personne. C'est **la seule fonction qui sort du navigateur**, et
elle demande l'accord des deux personnes avant l'envoi.

Une clé d'API ne peut pas vivre dans une page publique. `worker/` contient un
relais Cloudflare Worker qui la détient côté serveur — voir `worker/README.md`
pour le déployer (~5 min) puis renseigner `config.js`. Tant que `config.js` est
vide, l'interface propose un mode « clé personnelle » pour tester : la clé reste
dans le navigateur de la machine.

Le relais impose le modèle et `max_tokens`, filtre les origines et borne la
taille des requêtes — sans quoi une clé derrière un relais ouvert reste
consommable par n'importe qui. Coût indicatif : 4 à 5 centimes par médiation.

### Le ciel du moment

`transits.js` calcule les positions géocentriques des huit planètes (méthode
Schlyter, avec les perturbations de Jupiter, Saturne et Uranus) et détecte les
rétrogradations sur le signe de la variation de longitude d'un jour sur
l'autre. L'accueil affiche les rétrogradations en cours et leurs dates ; le
profil n'affiche que les transits qui touchent réellement un point du thème.

Rien n'est codé en dur : la page dit ce que le ciel fait le jour de la visite.

### Histoire de vie

Une section où l'on enregistre les moments marquants par âge. Chacun donne une
« version de soi » : ce que cet âge pouvait faire de l'événement, ce qu'elle en
a conclu, ce qu'elle protège depuis, ce qui la réveille et ce qui la calme.
Sous tension, ce sont les versions les plus jeunes qui répondent en premier —
c'est ce que la section rend visible.

Ces données sont les plus sensibles du site : elles restent dans le stockage
local de l'appareil, et ne sont transmises à la médiation du Miroir que si une
case dédiée est cochée. Cadre non diagnostique, avec orientation explicite vers
un professionnel quand un événement est encore vif.
