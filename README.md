# PRISME

Se comprendre — et comprendre ses proches — à travers trois lentilles :
**astrologie · numérologie · MBTI**. Moderne, sans genre, bilingue (FR/EN).

Tout est calculé **localement** dans le navigateur (aucune donnée envoyée).
Portraits : domaine public (Wikimedia Commons).

*Understand yourself and those close to you through three lenses:
astrology, numerology, MBTI. A symbolic, reflective tool with no predictive value.*

## Structure

Site statique, sans étape de compilation — il suffit de servir le dossier.

| Fichier | Rôle |
|---|---|
| `index.html` | structure des vues |
| `styles.css` | mise en forme |
| `astro.js` | calculs astronomiques (lune, ascendant) |
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
