# PRISME

Se comprendre — et comprendre ses proches — à travers six prismes :
**astrologie · numérologie · MBTI · histoire de vie · rêves · graphologie**.
Moderne, sans genre, bilingue (FR/EN).

Tout est calculé **localement** dans le navigateur, à deux exceptions près, toutes
deux facultatives et explicites : la *lecture du tiers* du Miroir envoie les deux
récits à un modèle d'IA, et la *lecture d'un rêve* envoie ce rêve-là (voir
`worker/`). Portraits : domaine public (Wikimedia Commons).

*Understand yourself and those close to you through six prisms: astrology,
numerology, MBTI, life history, dreams, graphology. A symbolic, reflective tool
with no predictive value.*

## Structure

Site statique, sans étape de compilation — il suffit de servir le dossier.

| Fichier | Rôle |
|---|---|
| `index.html` | structure des vues |
| `CNAME` | domaine personnalisé servi par GitHub Pages |
| `styles.css` | mise en forme |
| `astro.js` | calculs astronomiques (lune, ascendant) |
| `transits.js` | positions des planètes, rétrogradations, aspects |
| `natal.js` | thème natal : maisons, aspects, et ce qui manque |
| `ai.js` | lectures par IA : Miroir, rêve, profil d’ensemble |
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

### Le schéma relationnel

Sous « Mes proches », un bloc compte ce qui se répète parmi les gens enregistrés
dans le compte : l'élément dominant et ceux qui manquent, une lettre MBTI qui
revient, un chemin de vie partagé, et — le plus parlant — l'homogénéité par type
de lien, parce qu'elle ne mélange plus les amitiés et les amours.

Les seuils sont volontairement hauts : rien sous quatre personnes, la moitié
pour un élément, les deux tiers pour une lettre. En dessous, le hasard produit
des « schémas » à volonté. Les personnes sans type MBTI ne pèsent pas dans le
comptage des lettres. Retirer quelqu'un du compte le retire du schéma : il se
recalcule à chaque ouverture.

Le cadre est posé : un schéma n'est pas un destin, et la question utile n'est
pas « pourquoi eux ? » mais « qu'est-ce que ça me permet de ne pas faire ? ».

### Le type MBTI est facultatif

Un troisième choix, « je ne le connais pas », permet de créer un profil sans
type. C'est le cas d'un enfant : le MBTI décrit des préférences qui ne se
stabilisent pas avant la fin de l'adolescence, alors que l'astrologie et la
numérologie se calculent dès la naissance. Le portrait se lit alors sur deux
prismes — la synthèse dit « deux facettes », la carte MBTI dit pourquoi elle est
vide, et la comparaison de deux personnes retombe sur les deux autres prismes
plutôt que d'inventer un score.

### Mon compte

Un compte **local**, ouvert avec un prénom : il rassemble votre profil et ceux de
vos proches, avec le lien qui vous unit à chacun. Accessible par le bouton rond
de l'en-tête, hors du menu — c'est un espace de rangement, pas une lecture.

Il sert surtout à ne pas resaisir une date de naissance à chaque fois, et à voir
ce qui manque : la section « ce qu'il reste à alimenter » liste, personne par
personne, l'heure de naissance absente, le lien non précisé, l'histoire de vie
ou le journal de rêves encore vides.

Pas de serveur, pas de mot de passe, pas d'adresse e-mail : rien à pirater, mais
rien à récupérer non plus en changeant d'appareil. L'export produit un fichier
JSON contenant tout (compte, proches, histoire de vie, rêves) et l'import le
restitue — y compris avant d'avoir ouvert un compte, ce qui est précisément le
cas du nouvel appareil. L'interface dit pourquoi il n'y a pas de compte en
ligne : il faudrait confier des traumas, des rêves et des disputes à un serveur,
et c'est un choix, pas un détail technique.

### Les rêves

**Une section à part**, dans le menu. Ils ne sont pas un chapitre du portrait :
c'est l'inverse, l'analyse va chercher le portrait pour éclairer le rêve. Le
journal suit le titulaire du compte, pas le profil qu'on est en train de
regarder — on peut y arriver sans avoir ouvert de portrait.

Un journal tenu au réveil, puis trois lectures qui se complètent :

- les **images repérées** dans le récit — une vingtaine de motifs très attestés,
  cherchés par mots entiers (« ours » ne doit pas se reconnaître dans
  « poursuivi ») et dans les deux langues, pour qui note ses rêves en français et
  lit l'interface en anglais ;
- **ce qui revient** d'une nuit à l'autre : les images vues dans plusieurs rêves,
  l'émotion dominante au réveil, les récurrents et les cauchemars ;
- la **lecture par IA** d'un rêve choisi, d'inspiration jungienne : ce que le rêve
  compense de l'attitude consciente (le cœur du travail chez Jung), les figures
  qui le traversent — l'ombre, la mère, l'enfant, le passeur — dites sans jargon,
  ce qu'il rejoue du parcours, et ce qu'il travaille dans le mouvement de devenir
  soi. Au conditionnel, sans prédiction, avec un champ obligatoire qui dit ce
  qu'il ne faut *pas* en conclure.

Cette lecture peut aller chercher **tout le parcours** : le thème natal et les
nombres, l'histoire de vie, les autres rêves du journal. Chacun derrière sa
propre case à cocher, décochée par défaut. La consigne interdit d'expliquer le
rêve par le parcours, et demande de laisser le champ vide plutôt que de forcer
un lien ; si l'histoire transmise contient des violences, de ne pas les rejouer
dans le détail.

Le répertoire d'images propose ce qu'un motif met souvent en scène, jamais un
sens fixe : c'est l'intérêt et la limite d'un dictionnaire, et la page des
prismes le dit. Seul le rêve sélectionné est transmis, et seulement après accord
coché ; les lectures obtenues restent en mémoire et ne sont pas écrites sur le
disque.

### La lecture d'ensemble du profil

La synthèse composée additionne les prismes ; elle ne peut pas voir là où ils se
contredisent. `PrismeAI.profil()` croise tout ce qui est renseigné — thème natal
complet (positions, maisons, aspects, absences), nombres, type MBTI, histoire de
vie et journal de rêves si les cases sont cochées, ciel du jour — et rend un
portrait, un fil, les **accords**, les **tensions**, l'angle mort, un chantier,
une question et un garde-fou.

Les tensions sont le champ obligatoire du schéma : une synthèse qui n'a trouvé
aucune contradiction n'a pas regardé. La consigne interdit explicitement la
phrase d'horoscope (« aucune phrase ne doit pouvoir s'appliquer à tous les
Capricornes »), la causalité astrologique (« pas *parce que* Saturne est en
maison 5 »), la prédiction et le diagnostic.

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
consommable par n'importe qui. Coût indicatif : 4 à 5 centimes par médiation, un
peu moins par rêve. Le même relais sert les deux lectures.

### Le thème natal

`natal.js` place les dix corps en signe, en degré et en maison, calcule le
Milieu du Ciel, les aspects majeurs entre planètes — et surtout ce qui manque.
La roue est dessinée à la main en SVG : ascendant à gauche, zodiaque
antihoraire, maisons égales, aspects tirés au centre, colorés par nature.

**Maisons égales depuis l'Ascendant**, et c'est un choix assumé : Placidus est
plus répandu mais s'effondre au-delà des cercles polaires et demande une
résolution itérative dont l'erreur passerait inaperçue. Le Milieu du Ciel est
calculé à part (vérifié à ±2° du Soleil à midi TU au méridien de Greenwich, soit
l'équation du temps) plutôt que confondu avec la dixième cuspide.

La **lecture en creux** vaut la lecture pleine : éléments et modalités
qu'aucune planète n'occupe, éléments tenus par une seule planète, maisons vides,
planètes sans aucun aspect. Chacune a son texte — une absence de Feu n'est pas
une infirmité, c'est un registre qu'on ira chercher ailleurs.

Les lectures de position sont **composées** : fonction de la planète × manière
du signe × domaine de la maison. Vingt-deux fragments plutôt que cent vingt
textes, sans que deux positions se ressemblent.

### Le ciel du moment

`transits.js` calcule les positions géocentriques des huit planètes (méthode
Schlyter, avec les perturbations de Jupiter, Saturne et Uranus) et détecte les
rétrogradations sur le signe de la variation de longitude d'un jour sur
l'autre. L'accueil affiche les rétrogradations en cours et leurs dates ; le
profil n'affiche que les transits qui touchent réellement un point du thème.

Rien n'est codé en dur : la page dit ce que le ciel fait le jour de la visite.

### Histoire de vie

C'est le **prisme 4 du profil**, pas une section à part : on le trouve dans
« Moi », sous les trois autres prismes. On y enregistre les moments
marquants par âge, et chacun donne une « version de soi » : ce que cet âge
pouvait faire de l'événement, ce qu'elle en a conclu, ce qu'elle protège depuis,
ce qui la réveille et ce qui la calme. Sous tension, ce sont les versions les
plus jeunes qui répondent en premier — c'est ce que le prisme rend visible.

Les trois premiers moments proposés précèdent la mémoire : une grossesse ou une
naissance difficile, la dépression d'un parent après la naissance, des premiers
mois marqués par une séparation ou un lien difficile. La première année a sa
propre lecture, appuyée sur **Melanie Klein** : un monde d'abord fait de ce qui
apaise et de ce qui manque, puis la découverte que c'est la même personne — et
avec elle le souci de l'avoir abîmée, et l'envie de réparer. Rien de tout cela
ne se souvient ; tout se dépose. L'âge 0 couvre donc la grossesse, la naissance
et la première année, et le formulaire le dit.

Une histoire par profil, et non une par appareil : sans quoi l'histoire de l'un
s'afficherait sous le portrait de l'autre dès qu'on en consulte deux sur la même
machine. Les moments saisis avant ce découpage rejoignent le premier profil
ouvert.

Un moment est **une épreuve ou une victoire**. Les victoires ne sont pas un
contrepoids décoratif : ce sont les seules versions de soi qui savent déjà s'en
sortir, elles ont leurs propres champs (ce qu'elles ont prouvé, ce qu'elles
savent faire, comment les rappeler) et elles ne figurent pas dans « qui parle
quand ça chauffe » — on ne les subit pas, on les appelle.

**La gravité n'est pas plate.** Chaque épreuve porte un poids — c'est passé, ça
compte encore, ça pèse, c'est encore à vif — qui change le texte affiché et
l'ordre sous tension (le plus lourd d'abord, la version la plus jeune ensuite).
Neuf types sont marqués `grave` (violences sexuelles, inceste, violences
physiques, témoin de violences, maltraitance, emprise, suicide d'un proche,
addiction et maladie psychique d'un parent) : ils ouvrent un champ
« ce qui n'est pas négociable » qui nomme la responsabilité sans détour, et ils
disent eux-mêmes qu'une grille générale ne suffit pas. Un champ de texte libre
permet enfin de raconter, plutôt que de cocher.

Dès qu'un moment grave ou lourd est enregistré, un bloc d'aide passe **avant**
la lecture, avec les numéros français (3919, 0 800 05 95 95, 119, 116 006,
3114) et un renvoi vers les services locaux hors de France.

Ces données sont les plus sensibles du site : elles restent dans le stockage
local de l'appareil, et ne sont transmises à la médiation du Miroir que si une
case dédiée est cochée — le texte libre compris. Cadre non diagnostique.
