/* ============================================================
   PRISME — contenu bilingue (FR / EN)
   Clés de calcul neutres (element: feu/terre/air/eau, clés de signe,
   codes MBTI, pôles du quiz). Seuls les textes changent de langue.
   Le scoring vit dans app.js ; ici, les données + la prose localisée.
   ============================================================ */

const I18N = {

/* ==========================================================
   FRANÇAIS
   ========================================================== */
fr: {
  code: "fr", label: "FR",
  ui: {
    nav: { home:"Accueil", create:"Mon profil", relation:"Relation", method:"Méthode" },
    brandTag: "Astrologie · Numérologie · MBTI",
    hero: {
      eyebrow:"Astrologie · Numérologie · MBTI",
      t1:"Vous êtes", t2:"plus d’une", t3:"lecture.",
      sub:"PRISME décompose ce que vous êtes à travers trois lentilles anciennes et modernes — puis les recompose en un portrait lisible. Pour vous comprendre, comprendre vos proches, et travailler mieux ensemble.",
      cta1:"Créer mon profil", cta2:"Comparer deux personnes",
      note:"Aucune inscription. Rien n’est envoyé : tout est calculé sur votre appareil."
    },
    lenses: [
      { i:"01", h:"Astrologie", p:"Non pas un horoscope, mais une grammaire des tempéraments : éléments, modalités, énergies. Ce vers quoi vous penchez, et ce que vous avez à travailler." },
      { i:"02", h:"Numérologie", p:"Votre date et votre nom, réduits à des nombres porteurs de sens. Le fil de fond d’une vie, la façon d’agir, ce qui vous meut intimement." },
      { i:"03", h:"MBTI", p:"Une cartographie cognitive éprouvée : comment vous prenez l’énergie, percevez, décidez, vous organisez. Seize façons d’habiter le monde." }
    ],
    manifesto1:"Ni dogme, ni ésotérisme. ", manifestoEm:"Des savoirs anciens,", manifesto2:" que l’humanité affine depuis des millénaires et que toutes les cultures du monde ont fait vivre — comme sociétés et comme individus — pour mieux se comprendre et mieux habiter ce qui les entoure.",
    heritage:{
      eyebrow:"Un héritage vivant",
      title:"Lus par l’humanité, depuis toujours",
      intro:"Le ciel, les nombres, les tempéraments : partout et de tout temps, on s’en est servi pour se situer. Trois constellations, trois nombres, trois figures qui les ont fait vivre.",
      milkyway:"La Voie lactée — le même ciel, d’une civilisation à l’autre.",
      skyLabel:"Le ciel", numLabel:"Les nombres", figLabel:"Celles et ceux qui les ont portés",
      constellations:{ capricorne:"La chèvre-poisson : patience et hauteur.", balance:"Le seul signe-objet : équilibre et justice.", gemeaux:"Les jumeaux : le double et l’échange." },
      figures:[
        {key:"pythagore",name:"Pythagore",dates:"vers 570 av. J.-C.",note:"Le mathématicien grec dont la méthode fonde encore la numérologie occidentale."},
        {key:"cleopatre",name:"Cléopâtre",dates:"69 – 30 av. J.-C.",note:"L’Égypte des temples, où le ciel se lisait gravé dans la pierre."},
        {key:"tesla",name:"Nikola Tesla",dates:"1856 – 1943",note:"« Si vous compreniez la magnificence du 3, du 6 et du 9… »"}
      ]
    },
    birthCta:{ eyebrow:"Passez à la pratique", title:"Tout commence par une date", text:"Votre date de naissance ouvre les trois lectures. Une minute suffit.", button:"Créer mon portrait" },

    createEyebrow:"Étape par étape", createTitle:"Votre portrait",
    createLead:"Quelques informations suffisent. Prenez le questionnaire ou indiquez directement votre type si vous le connaissez.",
    fName:"Prénom et nom", fNamePh:"Ex. Camille Durand", fNameHint:"Le nom complet de naissance, pour la numérologie.",
    fDate:"Date de naissance",
    fBirthOpt:"Heure et lieu de naissance",
    fBirthOptHint:"Facultatif — mais nécessaires pour calculer votre ascendant et votre signe lunaire.",
    fTime:"Heure de naissance", fCity:"Ville de naissance", fCityPh:"Choisir une ville…",
    fManual:"Coordonnées manuelles", fLat:"Latitude", fLon:"Longitude (est +)", fTz:"Décalage UTC (h)",
    dstNote:"Astuce : si vous êtes né en période d’heure d’été, ajoutez 1 au décalage. L’ascendant y est très sensible.",
    mbtiLegend:"Votre type de personnalité (MBTI)",
    segQuiz:"Je passe le test (2 min)", segKnown:"Je connais mon type",
    mbtiPick:"Choisir…", quizHint:"Répondez spontanément — la première réaction est la bonne.",
    submitProfile:"Révéler mon portrait",
    errFields:"Un prénom, un nom et une date de naissance, s’il vous plaît.",
    errName:"Ce nom semble incomplet pour la numérologie.",
    errQuiz:"Merci de répondre à toutes les questions du test.",
    errMbti:"Choisissez votre type MBTI, ou passez le test.",
    errBirth:"Pour l’ascendant et la lune : indiquez l’heure et un lieu (ville ou coordonnées).",

    resultEyebrow:"Portrait PRISME",
    bSign:"", bLife:"Chemin de vie", bMbti:"MBTI", bAsc:"Ascendant", bMoon:"Lune",
    lens01:"Lentille 01 — Astrologie", lens02:"Lentille 02 — Numérologie", lens03:"Lentille 03 — MBTI",
    modalite:"", planet:"",
    force:"Force", chantier:"Chantier",
    sunLabel:"Soleil", ascLabel:"Ascendant", moonLabel:"Lune",
    ascExplain:"Le masque, la première impression, la façon d’aborder le monde.",
    moonExplain:"Le monde émotionnel, les besoins intimes, l’enfant intérieur.",
    otherNumbers:"Vos autres nombres",
    masterNum:"nombre maître",
    synthTag:"La recomposition", synthTitle:"Ce que les trois disent ensemble",
    actCompare:"Comparer avec quelqu’un", actRedo:"Refaire mon portrait",
    actSave:"Enregistrer ce profil", actSaved:"✓ Enregistré", actPrint:"Télécharger / imprimer",

    relEyebrow:"Mode relationnel", relTitle:"Deux personnes, un terrain commun",
    relLead:"Amour, amitié, famille, collègue. PRISME met en regard deux portraits et éclaire ce qui rapproche, ce qui frotte, et comment faire avec.",
    personA:"Personne A", personB:"Personne B", youOften:"Vous, souvent", theOther:"L’autre",
    typeMbti:"Type MBTI", relContext:"Contexte de la relation",
    ctx:{ couple:"Couple / amour", amitie:"Amitié", famille:"Famille", travail:"Travail" },
    fromSaved:"Depuis mes profils enregistrés",
    submitRelation:"Lire la relation",
    errRelation:"Complétez les deux profils (nom, date et type MBTI) pour lancer la lecture.",
    relReadFor:"Lecture relationnelle", resonance:"résonance",
    relDisclaimer:"Une résonance, pas un verdict : les liens les plus vivants naissent souvent des écarts bien tenus.",
    relHowTitle:"Comment cultiver ce lien",

    savedTitle:"Profils enregistrés", savedEmpty:"Aucun profil enregistré pour l’instant.",
    savedLoad:"Voir", savedA:"→ A", savedB:"→ B", savedDelete:"Supprimer",

    methodEyebrow:"Ce que PRISME fait, et ne fait pas", methodTitle:"La méthode",

    footer:"PRISME — un langage pour se comprendre. Outil symbolique et réflexif, sans valeur prédictive."
  },

  elements: {
    feu:   { name:"Feu",   desc:"l’élan, l’action, l’enthousiasme" },
    terre: { name:"Terre", desc:"l’ancrage, le concret, la constance" },
    air:   { name:"Air",   desc:"les idées, le lien, la parole" },
    eau:   { name:"Eau",   desc:"l’émotion, l’intuition, la profondeur" }
  },

  signs: {
    belier:{name:"Bélier",symbol:"♈",element:"feu",modalite:"Cardinal",astre:"Mars",dates:"21 mars – 19 avril",mots:["initiative","courage","franchise"],desc:"Une énergie de départ. Le Bélier avance avant de calculer, préfère l’erreur à l’attente et ouvre les chemins que d’autres emprunteront. Sa force est l’élan ; son travail, la patience.",force:"Décide vite, protège les siens, n’a pas peur du conflit nécessaire.",travail:"Apprendre à finir ce qui est commencé et à écouter avant d’agir."},
    taureau:{name:"Taureau",symbol:"♉",element:"terre",modalite:"Fixe",astre:"Vénus",dates:"20 avril – 20 mai",mots:["constance","sensualité","ancrage"],desc:"Un besoin de solidité. Le Taureau construit lentement mais rarement en vain : il veut du concret, du beau, du durable. Sa force est la fiabilité ; son travail, le lâcher-prise.",force:"Tient dans la durée, apaise, sait profiter du réel.",travail:"Assouplir ses habitudes et accueillir le changement sans le vivre comme une menace."},
    gemeaux:{name:"Gémeaux",symbol:"♊",element:"air",modalite:"Mutable",astre:"Mercure",dates:"21 mai – 20 juin",mots:["curiosité","verbe","agilité"],desc:"Un esprit en mouvement. Les Gémeaux relient, traduisent, questionnent — deux idées valent mieux qu’une certitude. Leur force est l’adaptation ; leur travail, la profondeur.",force:"Comprend vite, parle à tout le monde, transforme l’ennui en jeu.",travail:"Choisir, approfondir, rester quand la nouveauté s’essouffle."},
    cancer:{name:"Cancer",symbol:"♋",element:"eau",modalite:"Cardinal",astre:"Lune",dates:"21 juin – 22 juillet",mots:["mémoire","soin","intuition"],desc:"Une mémoire du cœur. Le Cancer sent avant de comprendre et protège ce qui compte comme on garde un feu. Sa force est l’empathie ; son travail, ne pas se dissoudre dans l’autre.",force:"Crée du foyer partout, devine les émotions, reste loyal.",travail:"Poser des limites et distinguer ses émotions de celles des autres."},
    lion:{name:"Lion",symbol:"♌",element:"feu",modalite:"Fixe",astre:"Soleil",dates:"23 juillet – 22 août",mots:["présence","générosité","création"],desc:"Un besoin de rayonner. Le Lion veut être vu pour ce qu’il crée et donne largement quand on lui fait confiance. Sa force est la chaleur ; son travail, l’humilité.",force:"Inspire, encourage, ose être pleinement lui-même.",travail:"Ne pas confondre reconnaissance et valeur ; laisser de la lumière aux autres."},
    vierge:{name:"Vierge",symbol:"♍",element:"terre",modalite:"Mutable",astre:"Mercure",dates:"23 août – 22 septembre",mots:["précision","service","discernement"],desc:"Un souci du juste. La Vierge remarque le détail que tout le monde manque et améliore ce qu’elle touche. Sa force est la rigueur ; son travail, la douceur envers soi.",force:"Analyse finement, rend service utilement, fiabilise le réel.",travail:"Accepter l’imparfait et cesser de tout porter seule."},
    balance:{name:"Balance",symbol:"♎",element:"air",modalite:"Cardinal",astre:"Vénus",dates:"23 septembre – 22 octobre",mots:["équité","esthétique","lien"],desc:"Une recherche d’équilibre. La Balance pèse, relie et cherche l’accord juste entre les êtres. Sa force est la diplomatie ; son travail, oser le désaccord.",force:"Apaise les tensions, crée de l’harmonie, comprend plusieurs camps.",travail:"Décider pour soi sans attendre l’assentiment de tous."},
    scorpion:{name:"Scorpion",symbol:"♏",element:"eau",modalite:"Fixe",astre:"Pluton",dates:"23 octobre – 21 novembre",mots:["intensité","vérité","transformation"],desc:"Un goût du fond. Le Scorpion va sous la surface, ne se contente pas des apparences et renaît de ses crises. Sa force est la profondeur ; son travail, la confiance.",force:"Voit ce qui se cache, s’engage totalement, sait se réinventer.",travail:"Lâcher le contrôle et pardonner sans tout garder en mémoire."},
    sagittaire:{name:"Sagittaire",symbol:"♐",element:"feu",modalite:"Mutable",astre:"Jupiter",dates:"22 novembre – 21 décembre",mots:["sens","liberté","élan"],desc:"Une soif d’horizon. Le Sagittaire cherche le sens plus que le confort et a besoin d’espace pour croire. Sa force est l’enthousiasme ; son travail, la constance.",force:"Ouvre des perspectives, dit franchement, garde l’espoir.",travail:"Tenir ses engagements et nuancer ses vérités."},
    capricorne:{name:"Capricorne",symbol:"♑",element:"terre",modalite:"Cardinal",astre:"Saturne",dates:"22 décembre – 19 janvier",mots:["ambition","structure","endurance"],desc:"Une patience de bâtisseur. Le Capricorne vise loin, gravit méthodiquement et respecte l’effort. Sa force est la discipline ; son travail, se permettre la légèreté.",force:"Structure, tient ses promesses, mûrit avec le temps.",travail:"Alléger le sérieux et demander de l’aide sans y voir un échec."},
    verseau:{name:"Verseau",symbol:"♒",element:"air",modalite:"Fixe",astre:"Uranus",dates:"20 janvier – 18 février",mots:["vision","indépendance","collectif"],desc:"Un regard décalé. Le Verseau pense contre l’évidence, se sent concerné par l’ensemble et invente d’autres manières de faire. Sa force est l’originalité ; son travail, l’intimité.",force:"Anticipe, défend le juste, relie les gens autour d’une idée.",travail:"Descendre de la tête au cœur et se laisser vraiment approcher."},
    poissons:{name:"Poissons",symbol:"♓",element:"eau",modalite:"Mutable",astre:"Neptune",dates:"19 février – 20 mars",mots:["sensibilité","imaginaire","compassion"],desc:"Une porosité au monde. Le Poissons ressent tout, rêve large et se relie à plus grand que lui. Sa force est la compassion ; son travail, l’ancrage.",force:"Console, crée, perçoit l’invisible entre les êtres.",travail:"Se protéger, distinguer le rêve du réel, s’ancrer dans le concret."}
  },

  numbers: {
    1:{titre:"L’Initiateur",mots:["autonomie","volonté","leadership"],desc:"Une énergie de commencement et d’affirmation. Besoin d’avancer par soi-même, d’ouvrir la voie. Le défi : écouter sans perdre son cap."},
    2:{titre:"Le Diplomate",mots:["sensibilité","coopération","patience"],desc:"Une énergie de relation et de nuance. Sait relier, apaiser, accompagner. Le défi : s’affirmer sans craindre le conflit."},
    3:{titre:"L’Expressif",mots:["créativité","joie","communication"],desc:"Une énergie d’expression et de contact. Vit par la parole, l’art, le partage. Le défi : approfondir plutôt que se disperser."},
    4:{titre:"Le Bâtisseur",mots:["méthode","fiabilité","effort"],desc:"Une énergie de structure et de durée. Construit du solide, tient dans le temps. Le défi : assouplir le cadre et oser le changement."},
    5:{titre:"L’Explorateur",mots:["liberté","mouvement","adaptabilité"],desc:"Une énergie de mouvement et d’expérience. A besoin d’espace, de nouveauté, de sens. Le défi : s’engager sans se sentir enfermé."},
    6:{titre:"Le Gardien",mots:["responsabilité","harmonie","soin"],desc:"Une énergie de soin et d’équilibre. Prend soin des autres, crée du beau et du juste. Le défi : s’occuper de soi autant que des autres."},
    7:{titre:"Le Chercheur",mots:["réflexion","profondeur","intériorité"],desc:"Une énergie d’analyse et de recul. Cherche le vrai sous les apparences, a besoin de solitude. Le défi : partager son monde intérieur."},
    8:{titre:"Le Réalisateur",mots:["puissance","ambition","matière"],desc:"Une énergie de concrétisation et de pouvoir. Vise grand, sait organiser et diriger. Le défi : mettre la force au service d’un sens."},
    9:{titre:"L’Humaniste",mots:["générosité","idéal","compassion"],desc:"Une énergie de don et d’ouverture. Se sent relié à plus grand que soi. Le défi : accueillir aussi ses propres besoins."},
    11:{titre:"L’Inspiré",mots:["intuition","vision","sensibilité"],maitre:true,desc:"Nombre maître. Une intensité de perception et d’inspiration. Porte une vision, ressent fort. Le défi : ancrer l’idéal dans le réel sans se laisser submerger."},
    22:{titre:"Le Constructeur",mots:["vision concrète","ampleur","responsabilité"],maitre:true,desc:"Nombre maître. Capacité à donner forme aux grandes idées. Rêve large et bâtit. Le défi : oser la mesure de son potentiel sans s’écraser."},
    33:{titre:"Le Passeur",mots:["altruisme","guidance","cœur"],maitre:true,desc:"Nombre maître. Une vocation d’accompagnement et de transmission. Donne beaucoup. Le défi : ne pas s’oublier dans le soin des autres."}
  },
  numFrames: {
    expression:{ label:"Nombre d’expression", role:"la manière dont on agit et se montre au monde" },
    intime:{ label:"Nombre intime", role:"ce qui motive en profondeur, le désir du cœur" }
  },

  mbti: {
    INTJ:{nom:"L’Architecte",groupe:"Analystes",desc:"Stratège indépendant. Voit les systèmes, planifie loin, améliore sans relâche. Efficace et exigeant, d’abord envers soi.",force:"Vision, autonomie, résolution de problèmes complexes.",relation:"loyal et fiable ; gagne à verbaliser ce qu’il ressent."},
    INTP:{nom:"Le Logicien",groupe:"Analystes",desc:"Esprit curieux et théorique. Démonte les idées pour comprendre comment elles tiennent. Aime la précision et la liberté de penser.",force:"Analyse, originalité, cohérence intellectuelle.",relation:"sincère et tolérant ; gagne à traduire ses idées en gestes concrets."},
    ENTJ:{nom:"Le Commandant",groupe:"Analystes",desc:"Meneur naturel, orienté objectifs. Organise, décide, entraîne. Voit l’inefficacité comme un problème à résoudre.",force:"Leadership, stratégie, énergie de réalisation.",relation:"engagé et protecteur ; gagne à laisser de la place à l’émotion."},
    ENTP:{nom:"L’Innovateur",groupe:"Analystes",desc:"Débatteur inventif. Génère des idées, questionne les évidences, adore le possible. S’ennuie de la routine.",force:"Créativité, adaptabilité, sens du débat.",relation:"stimulant et ouvert ; gagne à finir ce qu’il commence à deux."},
    INFJ:{nom:"Le Conseiller",groupe:"Diplomates",desc:"Idéaliste perspicace. Comprend les gens en profondeur et agit selon des valeurs fortes. Discret mais déterminé.",force:"Empathie, vision, sens éthique.",relation:"dévoué et attentif ; gagne à exprimer ses limites tôt."},
    INFP:{nom:"Le Médiateur",groupe:"Diplomates",desc:"Rêveur fidèle à ses valeurs. Cherche du sens, de l’authenticité, de la beauté. Sensible au monde intérieur des autres.",force:"Imagination, empathie, intégrité.",relation:"tendre et loyal ; gagne à ne pas idéaliser ni fuir le conflit."},
    ENFJ:{nom:"Le Mentor",groupe:"Diplomates",desc:"Guide chaleureux. Fait grandir les autres, fédère, inspire. Ressent le climat d’un groupe instantanément.",force:"Charisme, altruisme, sens du collectif.",relation:"généreux et présent ; gagne à recevoir autant qu’il donne."},
    ENFP:{nom:"L’Inspirateur",groupe:"Diplomates",desc:"Enthousiaste et libre. Voit le potentiel partout, relie les gens et les idées. Vit d’élans et de connexions.",force:"Spontanéité, chaleur, créativité relationnelle.",relation:"passionné et attentionné ; gagne à ancrer ses élans dans la durée."},
    ISTJ:{nom:"Le Logisticien",groupe:"Sentinelles",desc:"Pilier fiable. Respecte les faits, les engagements, l’ordre. Fait ce qu’il dit, calmement.",force:"Rigueur, constance, sens du devoir.",relation:"loyal et stable ; gagne à exprimer sa tendresse en mots."},
    ISFJ:{nom:"Le Protecteur",groupe:"Sentinelles",desc:"Gardien discret. Attentif aux besoins concrets des autres, fidèle et dévoué. Se souvient de tout ce qui compte.",force:"Attention, loyauté, sens pratique du soin.",relation:"prévenant et fidèle ; gagne à oser demander pour soi."},
    ESTJ:{nom:"Le Directeur",groupe:"Sentinelles",desc:"Organisateur efficace. Aime les règles claires, les résultats, la responsabilité. Prend les choses en main.",force:"Organisation, fiabilité, sens de la décision.",relation:"solide et engagé ; gagne à assouplir et à écouter les nuances."},
    ESFJ:{nom:"Le Facilitateur",groupe:"Sentinelles",desc:"Fédérateur attentionné. Crée du lien, prend soin du groupe, aime que chacun se sente bien. Sensible à l’harmonie.",force:"Chaleur, sens du collectif, fiabilité.",relation:"dévoué et présent ; gagne à ne pas dépendre de l’approbation."},
    ISTP:{nom:"L’Artisan",groupe:"Explorateurs",desc:"Pragmatique et calme. Comprend en manipulant, résout dans l’instant, garde son sang-froid. Aime la liberté d’action.",force:"Sang-froid, ingéniosité, adaptabilité concrète.",relation:"fiable dans l’action ; gagne à partager davantage ses ressentis."},
    ISFP:{nom:"L’Artiste",groupe:"Explorateurs",desc:"Sensible et discret. Vit dans l’instant, cherche le beau et l’authentique, agit plus qu’il ne parle. Doux mais indépendant.",force:"Sensibilité esthétique, authenticité, présence.",relation:"tendre et libre ; gagne à verbaliser ses besoins."},
    ESTP:{nom:"Le Meneur d’action",groupe:"Explorateurs",desc:"Vif et concret. Adore l’action, le risque mesuré, le contact direct. Décide dans le feu du moment.",force:"Réactivité, audace, sens pratique.",relation:"vivant et généreux ; gagne à penser au long terme du lien."},
    ESFP:{nom:"L’Animateur",groupe:"Explorateurs",desc:"Solaire et spontané. Aime la vie, les gens, le présent. Met de l’énergie et de la joie partout où il passe.",force:"Enthousiasme, générosité, présence chaleureuse.",relation:"affectueux et fun ; gagne à affronter ce qui est inconfortable."}
  },
  axes:[
    {code:"E / I",nom:"Énergie",g:"Extraversion — vers l’extérieur, l’action, les autres",d:"Introversion — vers l’intérieur, la réflexion, le calme"},
    {code:"S / N",nom:"Perception",g:"Sensation — le concret, les faits, l’expérience",d:"Intuition — les possibles, les liens, le sens"},
    {code:"T / F",nom:"Décision",g:"Pensée — la logique, la cohérence, l’objectivité",d:"Sentiment — les valeurs, l’humain, l’harmonie"},
    {code:"J / P",nom:"Mode de vie",g:"Jugement — structuré, planifié, décidé",d:"Perception — souple, ouvert, spontané"}
  ],
  quiz:[
    {axe:0,q:"Après une journée intense entre les gens, je me sens…",a:{t:"rechargé, prêt à continuer",pole:"E"},b:{t:"vidé, j’ai besoin de calme",pole:"I"}},
    {axe:0,q:"Dans un groupe nouveau, spontanément…",a:{t:"je vais vers les autres",pole:"E"},b:{t:"j’observe avant d’aborder",pole:"I"}},
    {axe:0,q:"Je réfléchis mieux…",a:{t:"en parlant à voix haute",pole:"E"},b:{t:"seul, dans ma tête",pole:"I"}},
    {axe:0,q:"Mon idéal de week-end penche vers…",a:{t:"des sorties, du monde",pole:"E"},b:{t:"du temps à moi, au calme",pole:"I"}},
    {axe:1,q:"Je fais d’abord confiance à…",a:{t:"ce que je constate concrètement",pole:"S"},b:{t:"mon intuition, les liens que je perçois",pole:"N"}},
    {axe:1,q:"Une idée me séduit surtout si elle est…",a:{t:"utile et applicable",pole:"S"},b:{t:"originale et pleine de possibles",pole:"N"}},
    {axe:1,q:"On me dirait plutôt…",a:{t:"les pieds sur terre",pole:"S"},b:{t:"la tête dans les possibles",pole:"N"}},
    {axe:1,q:"Je retiens surtout…",a:{t:"les détails et les faits",pole:"S"},b:{t:"l’ambiance et le sens global",pole:"N"}},
    {axe:2,q:"Face à un choix difficile, je m’appuie sur…",a:{t:"la logique et les faits",pole:"T"},b:{t:"les valeurs et l’impact humain",pole:"F"}},
    {axe:2,q:"On m’a plutôt reproché d’être…",a:{t:"trop direct ou froid",pole:"T"},b:{t:"trop sensible ou conciliant",pole:"F"}},
    {axe:2,q:"Un bon feedback est d’abord…",a:{t:"honnête, même s’il pique",pole:"T"},b:{t:"bienveillant, qui préserve la personne",pole:"F"}},
    {axe:2,q:"Ce qui me convainc le plus…",a:{t:"un raisonnement solide",pole:"T"},b:{t:"une histoire qui me touche",pole:"F"}},
    {axe:3,q:"Face à une échéance, je préfère…",a:{t:"planifier et avancer tôt",pole:"J"},b:{t:"garder de la souplesse jusqu’au bout",pole:"P"}},
    {axe:3,q:"Mon rapport aux plans…",a:{t:"j’aime savoir ce qui est prévu",pole:"J"},b:{t:"j’aime laisser venir",pole:"P"}},
    {axe:3,q:"Une liste de tâches me donne…",a:{t:"un sentiment de contrôle agréable",pole:"J"},b:{t:"une légère envie de la fuir",pole:"P"}},
    {axe:3,q:"Je me sens mieux quand une décision est…",a:{t:"prise et actée",pole:"J"},b:{t:"encore ouverte, révisable",pole:"P"}}
  ],

  method: `
    <h3>Trois systèmes, trois statuts</h3>
    <p>L’<strong>astrologie</strong> et la <strong>numérologie</strong> sont des systèmes symboliques : ils ne prédisent pas l’avenir et n’ont pas de validité scientifique. PRISME les utilise comme des <em>langages</em> — des cadres pour mettre des mots sur des tendances, ouvrir la conversation, se raconter autrement.</p>
    <p>Le <strong>MBTI</strong> est un outil de psychologie des préférences, très répandu en développement personnel et en entreprise. Utile pour se situer, il reste une simplification : les nuances comptent plus que les quatre lettres.</p>
    <h3>Comment nous calculons</h3>
    <ul>
      <li><strong>Signe solaire</strong> — déduit de votre date de naissance selon les dates tropicales usuelles.</li>
      <li><strong>Ascendant & signe lunaire</strong> — calculés à partir de l’heure et du lieu, par des formules astronomiques standard (Lune ~ Schlyter). Précision volontairement modeste ; l’heure exacte et le fuseau (heure d’été comprise) influencent fortement l’ascendant.</li>
      <li><strong>Chemin de vie</strong> — somme réduite de votre date de naissance (les nombres maîtres 11, 22, 33 sont conservés).</li>
      <li><strong>Nombre d’expression & nombre intime</strong> — valeur des lettres de votre nom (méthode pythagoricienne), tout le nom puis les voyelles.</li>
      <li><strong>Type MBTI</strong> — issu de votre questionnaire ou de votre saisie directe.</li>
    </ul>
    <h3>Notre parti pris</h3>
    <p>Un langage <strong>sans genre</strong>, sans injonction, sans fatalité. Chaque portrait nomme une force <em>et</em> un chantier, parce qu’une personne n’est jamais un verdict. Prenez ce qui résonne, laissez le reste.</p>
    <h3>Vos données</h3>
    <p>Tout est calculé localement, dans votre navigateur. Les profils que vous enregistrez restent sur votre appareil (stockage local). Rien n’est envoyé sur un serveur.</p>
  `,

  build: {
    synthesis(p, L){
      const sign=L.signs[p.sign], lp=L.numbers[p.life], type=L.mbti[p.mbti], el=p.el, elName=L.elements[el].name;
      const lead=`Sous une même lumière, trois facettes : le tempérament ${elName.toLowerCase()} du ${sign.name}, le fil du ${lp.titre.toLowerCase()} (${p.life}) et le regard ${type.nom.toLowerCase()}.`;
      const p1=`Votre astrologie vous oriente vers ${L.elements[el].desc}. C’est votre pente naturelle, la façon dont vous réagissez avant de réfléchir. Là où le ${sign.name} brille — ${sign.force.toLowerCase()} — vous êtes déjà chez vous.`;
      const p2=`Votre chemin de vie ${p.life}, celui du ${lp.titre.toLowerCase()}, ajoute une direction de fond : ${lp.desc.toLowerCase()} C’est moins une humeur qu’une trajectoire — la leçon qui revient, sous des formes différentes, tout au long d’une vie.`;
      const p3=`Votre type ${p.mbti} décrit comment tout cela s’organise concrètement : ${type.desc.toLowerCase()} En relation, ${type.relation}`;
      let converge="Là où les trois lentilles se rejoignent : ";
      const m=p.mbti, notes=[], isF=m.includes("F"), isN=m.includes("N"), isJ=m.includes("J");
      if((el==="feu"||el==="air")&&m.includes("E")) notes.push("une énergie tournée vers l’extérieur, qui a besoin d’agir et d’échanger pour exister");
      if((el==="eau"||el==="terre")&&m.includes("I")) notes.push("un monde intérieur riche, qui se nourrit de calme avant de se donner");
      if(isF&&el==="eau") notes.push("une sensibilité forte, à la fois ressource et zone de vigilance");
      if(!isF&&el==="terre") notes.push("un rapport concret et fiable au réel, qui rassure autour de vous");
      if(isN&&[3,5,7,9,11,22,33].includes(p.life)) notes.push("un besoin de sens et d’ouverture qui traverse presque tout ce que vous faites");
      if(isJ&&[1,4,8,22].includes(p.life)) notes.push("une vraie capacité à structurer et à mener les choses à terme");
      if(notes.length===0) notes.push("un équilibre entre des forces contrastées — c’est souvent là que se trouve votre singularité");
      converge+=notes.slice(0,2).join(" ; ")+". "+`Le chantier commun, lui, se lit dans ce que le ${sign.name} a à travailler — ${sign.travail.toLowerCase()}`;
      return { lead, paras:[p1,p2,p3], converge };
    },
    celestial(p, L){
      const asc=L.signs[p.asc.sign], moon=L.signs[p.moon.sign];
      return `Votre <strong>ascendant ${asc.name}</strong> nuance tout le reste : c’est votre abord du monde, la première impression que vous laissez — ici colorée de ${asc.mots[0]} et de ${asc.mots[1]}. Votre <strong>Lune en ${moon.name}</strong> décrit vos besoins profonds, votre manière d’aimer et d’être rassuré : une sensibilité tournée vers ${moon.mots[0]} et ${moon.mots[2]}.`;
    },
    relElement(aKey,bKey,score,L){
      const a=L.elements[aKey].name, b=L.elements[bKey].name;
      if(aKey===bKey) return `Deux tempéraments ${a.toLowerCase()} : vous vous comprenez d’instinct, au risque parfois de vous ressembler un peu trop.`;
      const harmon={feu:"air",air:"feu",terre:"eau",eau:"terre"};
      if(harmon[aKey]===bKey) return `${a} et ${b} se nourrissent : l’un anime, l’autre approfondit. Un accord naturel, à condition d’en respecter les rythmes différents.`;
      return `${a} et ${b} fonctionnent autrement — friction possible, mais complémentarité forte si chacun apprend la langue de l’autre.`;
    },
    relLife(a,b,score){
      if(a===b) return `Mêmes fils de fond (${a}) : des valeurs et un rythme de vie proches, un terrain d’entente immédiat.`;
      const diff=Math.abs(a-b);
      if(diff<=2) return `Des chemins voisins (${a} et ${b}) : assez proches pour se comprendre, assez distincts pour se compléter.`;
      return `Des chemins contrastés (${a} et ${b}) : vous n’avancez pas au même pas, ce qui peut autant enrichir qu’exiger des ajustements.`;
    },
    relMbti(a,b,shared,comp){
      if(shared>=3) return `Types très proches (${a} & ${b}) : communication fluide, vision du monde partagée. Attention à vos angles morts communs.`;
      if(shared===2&&comp) return `${a} & ${b} : un socle commun (même façon de percevoir) et des différences qui s’équilibrent. Combinaison souvent très solide.`;
      if(shared===2) return `${a} & ${b} : moitié semblables, moitié complémentaires. De belles synergies, quelques traductions à faire.`;
      if(shared===1) return `${a} & ${b} : vous abordez les choses différemment. Riche mais exigeant — nommez vos fonctionnements pour éviter les malentendus.`;
      return `${a} & ${b} : profils opposés. Fascination possible et vraie complémentarité, à condition d’une patience mutuelle.`;
    },
    relContext(ctx){
      return {
        couple:"En amour, misez sur ce qui vous relie sans gommer vos différences : elles sont le moteur du désir autant que la source des frictions.",
        amitie:"En amitié, votre force est la liberté : peu d’attentes, beaucoup de sincérité. Dites-vous les choses avant qu’elles ne s’accumulent.",
        famille:"En famille, l’enjeu est d’accueillir l’autre tel qu’il est, sans vouloir le corriger. Vos différences sont un héritage, pas un problème à résoudre.",
        travail:"Au travail, répartissez les rôles selon vos forces respectives plutôt que selon les habitudes : c’est là que la complémentarité paie."
      }[ctx];
    },
    relLead:"Ce qui vous rapproche vous rend fluides ; ce qui vous sépare vous rend utiles l’un à l’autre.",
    relClosing(na,ra,nb,rb){ return `${na}, ${ra} ${nb}, de son côté, ${rb} Reconnaître ces différences, c’est déjà la moitié du chemin.`; }
  }
},

/* ==========================================================
   ENGLISH
   ========================================================== */
en: {
  code: "en", label: "EN",
  ui: {
    nav: { home:"Home", create:"My profile", relation:"Relationship", method:"Method" },
    brandTag: "Astrology · Numerology · MBTI",
    hero: {
      eyebrow:"Astrology · Numerology · MBTI",
      t1:"You are", t2:"more than one", t3:"reading.",
      sub:"PRISME breaks down who you are through three lenses — ancient and modern — then recomposes them into a legible portrait. To understand yourself, understand those close to you, and work better together.",
      cta1:"Create my profile", cta2:"Compare two people",
      note:"No sign-up. Nothing is sent: everything is computed on your device."
    },
    lenses: [
      { i:"01", h:"Astrology", p:"Not a horoscope, but a grammar of temperaments: elements, modalities, energies. What you lean toward, and what you have to work on." },
      { i:"02", h:"Numerology", p:"Your date and name, reduced to numbers that carry meaning. The underlying thread of a life, the way you act, what moves you within." },
      { i:"03", h:"MBTI", p:"A well-worn cognitive map: how you draw energy, perceive, decide, organize. Sixteen ways of inhabiting the world." }
    ],
    manifesto1:"No dogma, no mysticism. ", manifestoEm:"Age-old bodies of knowledge,", manifesto2:" refined by humanity over millennia and kept alive by cultures the world over — as societies and as individuals — to better understand ourselves and better inhabit what surrounds us.",
    heritage:{
      eyebrow:"A living lineage",
      title:"Read by humanity, since the beginning",
      intro:"The sky, numbers, temperaments: everywhere and in every age, people have used them to find their bearings. Three constellations, three numbers, three figures who kept them alive.",
      milkyway:"The Milky Way — the same sky, from one civilization to the next.",
      skyLabel:"The sky", numLabel:"The numbers", figLabel:"Those who carried them",
      constellations:{ capricorne:"The sea-goat: patience and heights.", balance:"The only inanimate sign: balance and justice.", gemeaux:"The twins: the double, the exchange." },
      figures:[
        {key:"pythagore",name:"Pythagoras",dates:"c. 570 BCE",note:"The Greek mathematician whose method still underlies Western numerology."},
        {key:"cleopatre",name:"Cleopatra",dates:"69 – 30 BCE",note:"The Egypt of temples, where the sky was read carved in stone."},
        {key:"tesla",name:"Nikola Tesla",dates:"1856 – 1943",note:"“If you only knew the magnificence of the 3, 6 and 9…”"}
      ]
    },
    birthCta:{ eyebrow:"Try it", title:"It all starts with a date", text:"Your date of birth opens all three readings. A minute is enough.", button:"Create my portrait" },

    createEyebrow:"Step by step", createTitle:"Your portrait",
    createLead:"A few details are enough. Take the questionnaire, or enter your type directly if you know it.",
    fName:"First and last name", fNamePh:"E.g. Camille Durand", fNameHint:"Your full birth name, for numerology.",
    fDate:"Date of birth",
    fBirthOpt:"Time and place of birth",
    fBirthOptHint:"Optional — but needed to compute your rising sign and moon sign.",
    fTime:"Time of birth", fCity:"City of birth", fCityPh:"Choose a city…",
    fManual:"Manual coordinates", fLat:"Latitude", fLon:"Longitude (east +)", fTz:"UTC offset (h)",
    dstNote:"Tip: if you were born during daylight saving time, add 1 to the offset. The rising sign is very sensitive to it.",
    mbtiLegend:"Your personality type (MBTI)",
    segQuiz:"Take the test (2 min)", segKnown:"I know my type",
    mbtiPick:"Choose…", quizHint:"Answer spontaneously — your first reaction is the right one.",
    submitProfile:"Reveal my portrait",
    errFields:"A first name, last name and date of birth, please.",
    errName:"That name seems too short for numerology.",
    errQuiz:"Please answer all the questions of the test.",
    errMbti:"Choose your MBTI type, or take the test.",
    errBirth:"For the rising and moon signs: enter a time and a place (city or coordinates).",

    resultEyebrow:"PRISME portrait",
    bSign:"", bLife:"Life path", bMbti:"MBTI", bAsc:"Rising", bMoon:"Moon",
    lens01:"Lens 01 — Astrology", lens02:"Lens 02 — Numerology", lens03:"Lens 03 — MBTI",
    modalite:"", planet:"",
    force:"Strength", chantier:"Growth edge",
    sunLabel:"Sun", ascLabel:"Rising", moonLabel:"Moon",
    ascExplain:"The mask, the first impression, how you approach the world.",
    moonExplain:"The emotional world, inner needs, the inner child.",
    otherNumbers:"Your other numbers",
    masterNum:"master number",
    synthTag:"The recomposition", synthTitle:"What the three say together",
    actCompare:"Compare with someone", actRedo:"Redo my portrait",
    actSave:"Save this profile", actSaved:"✓ Saved", actPrint:"Download / print",

    relEyebrow:"Relationship mode", relTitle:"Two people, common ground",
    relLead:"Love, friendship, family, colleague. PRISME sets two portraits side by side and shows what draws you together, what rubs, and how to work with it.",
    personA:"Person A", personB:"Person B", youOften:"Often you", theOther:"The other",
    typeMbti:"MBTI type", relContext:"Relationship context",
    ctx:{ couple:"Couple / love", amitie:"Friendship", famille:"Family", travail:"Work" },
    fromSaved:"From my saved profiles",
    submitRelation:"Read the relationship",
    errRelation:"Complete both profiles (name, date and MBTI type) to run the reading.",
    relReadFor:"Relationship reading", resonance:"resonance",
    relDisclaimer:"A resonance, not a verdict: the most alive bonds often grow from well-held differences.",
    relHowTitle:"How to nurture this bond",

    savedTitle:"Saved profiles", savedEmpty:"No saved profile yet.",
    savedLoad:"View", savedA:"→ A", savedB:"→ B", savedDelete:"Delete",

    methodEyebrow:"What PRISME does, and doesn’t", methodTitle:"The method",

    footer:"PRISME — a language to understand ourselves. A symbolic, reflective tool with no predictive value."
  },

  elements: {
    feu:   { name:"Fire",  desc:"drive, action, enthusiasm" },
    terre: { name:"Earth", desc:"grounding, the concrete, steadiness" },
    air:   { name:"Air",   desc:"ideas, connection, words" },
    eau:   { name:"Water", desc:"emotion, intuition, depth" }
  },

  signs: {
    belier:{name:"Aries",symbol:"♈",element:"feu",modalite:"Cardinal",astre:"Mars",dates:"21 Mar – 19 Apr",mots:["initiative","courage","frankness"],desc:"A starting energy. Aries moves before calculating, prefers a mistake to waiting, and opens the paths others will follow. Its strength is momentum; its work, patience.",force:"Decides fast, protects its own, isn’t afraid of necessary conflict.",travail:"Learning to finish what’s begun and to listen before acting."},
    taureau:{name:"Taurus",symbol:"♉",element:"terre",modalite:"Fixed",astre:"Venus",dates:"20 Apr – 20 May",mots:["steadiness","sensuality","grounding"],desc:"A need for solidity. Taurus builds slowly but rarely in vain: it wants the concrete, the beautiful, the lasting. Its strength is reliability; its work, letting go.",force:"Endures, soothes, knows how to enjoy the real.",travail:"Loosening its habits and welcoming change without feeling threatened."},
    gemeaux:{name:"Gemini",symbol:"♊",element:"air",modalite:"Mutable",astre:"Mercury",dates:"21 May – 20 Jun",mots:["curiosity","words","agility"],desc:"A mind in motion. Gemini connects, translates, questions — two ideas beat one certainty. Its strength is adaptability; its work, depth.",force:"Grasps quickly, talks to anyone, turns boredom into play.",travail:"Choosing, going deeper, staying when novelty fades."},
    cancer:{name:"Cancer",symbol:"♋",element:"eau",modalite:"Cardinal",astre:"Moon",dates:"21 Jun – 22 Jul",mots:["memory","care","intuition"],desc:"A memory of the heart. Cancer feels before it understands and guards what matters like a kept fire. Its strength is empathy; its work, not dissolving into others.",force:"Makes a home anywhere, senses emotions, stays loyal.",travail:"Setting limits and telling its emotions from others’."},
    lion:{name:"Leo",symbol:"♌",element:"feu",modalite:"Fixed",astre:"Sun",dates:"23 Jul – 22 Aug",mots:["presence","generosity","creation"],desc:"A need to shine. Leo wants to be seen for what it creates and gives generously when trusted. Its strength is warmth; its work, humility.",force:"Inspires, encourages, dares to be fully itself.",travail:"Not mistaking recognition for worth; leaving light for others."},
    vierge:{name:"Virgo",symbol:"♍",element:"terre",modalite:"Mutable",astre:"Mercury",dates:"23 Aug – 22 Sep",mots:["precision","service","discernment"],desc:"A concern for what’s right. Virgo notices the detail everyone else misses and improves whatever it touches. Its strength is rigor; its work, gentleness toward itself.",force:"Analyzes finely, helps usefully, makes the real dependable.",travail:"Accepting the imperfect and no longer carrying everything alone."},
    balance:{name:"Libra",symbol:"♎",element:"air",modalite:"Cardinal",astre:"Venus",dates:"23 Sep – 22 Oct",mots:["fairness","aesthetics","connection"],desc:"A search for balance. Libra weighs, connects, and seeks the fair accord between people. Its strength is diplomacy; its work, daring to disagree.",force:"Eases tension, creates harmony, understands several sides.",travail:"Deciding for itself without waiting for everyone’s approval."},
    scorpion:{name:"Scorpio",symbol:"♏",element:"eau",modalite:"Fixed",astre:"Pluto",dates:"23 Oct – 21 Nov",mots:["intensity","truth","transformation"],desc:"A taste for the depths. Scorpio goes beneath the surface, isn’t satisfied with appearances, and is reborn from its crises. Its strength is depth; its work, trust.",force:"Sees what’s hidden, commits fully, knows how to reinvent itself.",travail:"Releasing control and forgiving without keeping everything on record."},
    sagittaire:{name:"Sagittarius",symbol:"♐",element:"feu",modalite:"Mutable",astre:"Jupiter",dates:"22 Nov – 21 Dec",mots:["meaning","freedom","momentum"],desc:"A thirst for horizons. Sagittarius seeks meaning over comfort and needs room to believe. Its strength is enthusiasm; its work, constancy.",force:"Opens perspectives, speaks frankly, keeps hope.",travail:"Keeping its commitments and nuancing its truths."},
    capricorne:{name:"Capricorn",symbol:"♑",element:"terre",modalite:"Cardinal",astre:"Saturn",dates:"22 Dec – 19 Jan",mots:["ambition","structure","endurance"],desc:"A builder’s patience. Capricorn aims far, climbs methodically, and respects effort. Its strength is discipline; its work, allowing itself lightness.",force:"Structures, keeps its promises, ripens with time.",travail:"Lightening the seriousness and asking for help without seeing it as failure."},
    verseau:{name:"Aquarius",symbol:"♒",element:"air",modalite:"Fixed",astre:"Uranus",dates:"20 Jan – 18 Feb",mots:["vision","independence","the collective"],desc:"An off-center gaze. Aquarius thinks against the obvious, feels concerned by the whole, and invents other ways of doing things. Its strength is originality; its work, intimacy.",force:"Anticipates, defends what’s just, connects people around an idea.",travail:"Coming down from the head to the heart and letting itself truly be reached."},
    poissons:{name:"Pisces",symbol:"♓",element:"eau",modalite:"Mutable",astre:"Neptune",dates:"19 Feb – 20 Mar",mots:["sensitivity","imagination","compassion"],desc:"A porousness to the world. Pisces feels everything, dreams wide, and connects to something larger. Its strength is compassion; its work, grounding.",force:"Comforts, creates, senses the invisible between people.",travail:"Protecting itself, telling dream from real, anchoring in the concrete."}
  },

  numbers: {
    1:{titre:"The Initiator",mots:["autonomy","will","leadership"],desc:"An energy of beginning and assertion. A need to move on one’s own, to open the way. The challenge: to listen without losing one’s course."},
    2:{titre:"The Diplomat",mots:["sensitivity","cooperation","patience"],desc:"An energy of relationship and nuance. Knows how to connect, soothe, accompany. The challenge: to assert oneself without fearing conflict."},
    3:{titre:"The Expressive",mots:["creativity","joy","communication"],desc:"An energy of expression and contact. Lives through words, art, sharing. The challenge: to go deep rather than scatter."},
    4:{titre:"The Builder",mots:["method","reliability","effort"],desc:"An energy of structure and duration. Builds solidly, holds over time. The challenge: to loosen the frame and dare to change."},
    5:{titre:"The Explorer",mots:["freedom","movement","adaptability"],desc:"An energy of motion and experience. Needs space, novelty, meaning. The challenge: to commit without feeling trapped."},
    6:{titre:"The Guardian",mots:["responsibility","harmony","care"],desc:"An energy of care and balance. Looks after others, creates beauty and fairness. The challenge: to care for oneself as much as for others."},
    7:{titre:"The Seeker",mots:["reflection","depth","inwardness"],desc:"An energy of analysis and stepping back. Seeks the true beneath appearances, needs solitude. The challenge: to share one’s inner world."},
    8:{titre:"The Realizer",mots:["power","ambition","matter"],desc:"An energy of realization and power. Aims big, knows how to organize and lead. The challenge: to put strength in service of meaning."},
    9:{titre:"The Humanist",mots:["generosity","ideals","compassion"],desc:"An energy of giving and openness. Feels connected to something larger. The challenge: to welcome one’s own needs too."},
    11:{titre:"The Inspired",mots:["intuition","vision","sensitivity"],maitre:true,desc:"Master number. An intensity of perception and inspiration. Carries a vision, feels strongly. The challenge: to ground the ideal in the real without being overwhelmed."},
    22:{titre:"The Master Builder",mots:["concrete vision","scale","responsibility"],maitre:true,desc:"Master number. The capacity to give form to great ideas. Dreams wide and builds. The challenge: to dare the measure of one’s potential without shrinking."},
    33:{titre:"The Guide",mots:["altruism","guidance","heart"],maitre:true,desc:"Master number. A calling to accompany and transmit. Gives a great deal. The challenge: not to forget oneself in caring for others."}
  },
  numFrames: {
    expression:{ label:"Expression number", role:"how one acts and shows up in the world" },
    intime:{ label:"Soul urge number", role:"what motivates deep down, the heart’s desire" }
  },

  mbti: {
    INTJ:{nom:"The Architect",groupe:"Analysts",desc:"An independent strategist. Sees systems, plans far ahead, improves relentlessly. Effective and demanding — first of all with itself.",force:"Vision, autonomy, solving complex problems.",relation:"loyal and dependable; grows by putting feelings into words."},
    INTP:{nom:"The Logician",groupe:"Analysts",desc:"A curious, theoretical mind. Takes ideas apart to see how they hold together. Loves precision and freedom of thought.",force:"Analysis, originality, intellectual coherence.",relation:"sincere and tolerant; grows by turning ideas into concrete gestures."},
    ENTJ:{nom:"The Commander",groupe:"Analysts",desc:"A natural leader, goal-oriented. Organizes, decides, drives. Sees inefficiency as a problem to solve.",force:"Leadership, strategy, drive to deliver.",relation:"committed and protective; grows by making room for emotion."},
    ENTP:{nom:"The Innovator",groupe:"Analysts",desc:"An inventive debater. Generates ideas, questions the obvious, loves the possible. Bored by routine.",force:"Creativity, adaptability, a taste for debate.",relation:"stimulating and open; grows by finishing what it starts together."},
    INFJ:{nom:"The Counselor",groupe:"Diplomats",desc:"An insightful idealist. Understands people deeply and acts on strong values. Quiet but determined.",force:"Empathy, vision, an ethical compass.",relation:"devoted and attentive; grows by naming its limits early."},
    INFP:{nom:"The Mediator",groupe:"Diplomats",desc:"A dreamer true to its values. Seeks meaning, authenticity, beauty. Attuned to others’ inner worlds.",force:"Imagination, empathy, integrity.",relation:"tender and loyal; grows by not idealizing nor avoiding conflict."},
    ENFJ:{nom:"The Mentor",groupe:"Diplomats",desc:"A warm guide. Grows others, brings people together, inspires. Feels a group’s climate instantly.",force:"Charisma, altruism, a sense of the collective.",relation:"generous and present; grows by receiving as much as it gives."},
    ENFP:{nom:"The Campaigner",groupe:"Diplomats",desc:"Enthusiastic and free. Sees potential everywhere, connects people and ideas. Lives on impulses and connection.",force:"Spontaneity, warmth, relational creativity.",relation:"passionate and caring; grows by grounding its impulses over time."},
    ISTJ:{nom:"The Logistician",groupe:"Sentinels",desc:"A dependable pillar. Respects facts, commitments, order. Does what it says, calmly.",force:"Rigor, constancy, a sense of duty.",relation:"loyal and steady; grows by putting tenderness into words."},
    ISFJ:{nom:"The Defender",groupe:"Sentinels",desc:"A quiet guardian. Attentive to others’ concrete needs, faithful and devoted. Remembers everything that matters.",force:"Attention, loyalty, practical care.",relation:"considerate and faithful; grows by daring to ask for itself."},
    ESTJ:{nom:"The Executive",groupe:"Sentinels",desc:"An effective organizer. Likes clear rules, results, responsibility. Takes charge.",force:"Organization, reliability, decisiveness.",relation:"solid and committed; grows by softening and hearing nuance."},
    ESFJ:{nom:"The Consul",groupe:"Sentinels",desc:"A caring connector. Builds bonds, looks after the group, wants everyone to feel well. Sensitive to harmony.",force:"Warmth, a sense of the collective, reliability.",relation:"devoted and present; grows by not depending on approval."},
    ISTP:{nom:"The Craftsman",groupe:"Explorers",desc:"Pragmatic and calm. Understands by handling, solves in the moment, keeps cool. Loves freedom of action.",force:"Composure, ingenuity, hands-on adaptability.",relation:"dependable in action; grows by sharing its feelings more."},
    ISFP:{nom:"The Artist",groupe:"Explorers",desc:"Sensitive and quiet. Lives in the moment, seeks the beautiful and authentic, acts more than it speaks. Gentle but independent.",force:"Aesthetic sensitivity, authenticity, presence.",relation:"tender and free; grows by voicing its needs."},
    ESTP:{nom:"The Doer",groupe:"Explorers",desc:"Quick and concrete. Loves action, measured risk, direct contact. Decides in the heat of the moment.",force:"Reactivity, boldness, practical sense.",relation:"alive and generous; grows by thinking about the bond long-term."},
    ESFP:{nom:"The Entertainer",groupe:"Explorers",desc:"Sunny and spontaneous. Loves life, people, the present. Brings energy and joy wherever it goes.",force:"Enthusiasm, generosity, warm presence.",relation:"affectionate and fun; grows by facing what’s uncomfortable."}
  },
  axes:[
    {code:"E / I",nom:"Energy",g:"Extraversion — outward, toward action and others",d:"Introversion — inward, toward reflection and calm"},
    {code:"S / N",nom:"Perception",g:"Sensing — the concrete, facts, experience",d:"Intuition — possibilities, connections, meaning"},
    {code:"T / F",nom:"Decision",g:"Thinking — logic, coherence, objectivity",d:"Feeling — values, people, harmony"},
    {code:"J / P",nom:"Lifestyle",g:"Judging — structured, planned, decided",d:"Perceiving — flexible, open, spontaneous"}
  ],
  quiz:[
    {axe:0,q:"After an intense day around people, I feel…",a:{t:"recharged, ready for more",pole:"E"},b:{t:"drained, I need quiet",pole:"I"}},
    {axe:0,q:"In a new group, spontaneously…",a:{t:"I go toward others",pole:"E"},b:{t:"I observe before approaching",pole:"I"}},
    {axe:0,q:"I think best…",a:{t:"talking out loud",pole:"E"},b:{t:"alone, in my head",pole:"I"}},
    {axe:0,q:"My ideal weekend leans toward…",a:{t:"going out, being around people",pole:"E"},b:{t:"time to myself, quiet",pole:"I"}},
    {axe:1,q:"I first trust…",a:{t:"what I concretely observe",pole:"S"},b:{t:"my intuition, the links I sense",pole:"N"}},
    {axe:1,q:"An idea appeals to me mostly if it’s…",a:{t:"useful and applicable",pole:"S"},b:{t:"original and full of possibility",pole:"N"}},
    {axe:1,q:"People would call me rather…",a:{t:"down to earth",pole:"S"},b:{t:"head in the possibilities",pole:"N"}},
    {axe:1,q:"I mostly remember…",a:{t:"the details and facts",pole:"S"},b:{t:"the mood and the big picture",pole:"N"}},
    {axe:2,q:"Facing a hard choice, I rely on…",a:{t:"logic and facts",pole:"T"},b:{t:"values and human impact",pole:"F"}},
    {axe:2,q:"I’ve rather been told I’m…",a:{t:"too blunt or cold",pole:"T"},b:{t:"too sensitive or accommodating",pole:"F"}},
    {axe:2,q:"Good feedback is above all…",a:{t:"honest, even if it stings",pole:"T"},b:{t:"kind, sparing the person",pole:"F"}},
    {axe:2,q:"What convinces me most…",a:{t:"a solid line of reasoning",pole:"T"},b:{t:"a story that moves me",pole:"F"}},
    {axe:3,q:"Facing a deadline, I prefer to…",a:{t:"plan and start early",pole:"J"},b:{t:"keep flexibility to the end",pole:"P"}},
    {axe:3,q:"My relationship to plans…",a:{t:"I like knowing what’s set",pole:"J"},b:{t:"I like letting things come",pole:"P"}},
    {axe:3,q:"A to-do list gives me…",a:{t:"a pleasant sense of control",pole:"J"},b:{t:"a slight urge to flee it",pole:"P"}},
    {axe:3,q:"I feel better when a decision is…",a:{t:"made and settled",pole:"J"},b:{t:"still open, revisable",pole:"P"}}
  ],

  method: `
    <h3>Three systems, three statuses</h3>
    <p><strong>Astrology</strong> and <strong>numerology</strong> are symbolic systems: they don’t predict the future and have no scientific validity. PRISME uses them as <em>languages</em> — frames to put words on tendencies, open a conversation, tell your story differently.</p>
    <p><strong>MBTI</strong> is a tool from the psychology of preferences, widely used in personal development and business. Useful for locating yourself, it’s still a simplification: nuance matters more than the four letters.</p>
    <h3>How we compute</h3>
    <ul>
      <li><strong>Sun sign</strong> — from your date of birth, using the usual tropical dates.</li>
      <li><strong>Rising & moon sign</strong> — from time and place, using standard astronomical formulas (Moon ~ Schlyter). Precision is deliberately modest; exact time and time zone (including daylight saving) strongly affect the rising sign.</li>
      <li><strong>Life path</strong> — the reduced sum of your date of birth (master numbers 11, 22, 33 are kept).</li>
      <li><strong>Expression & soul urge numbers</strong> — the value of your name’s letters (Pythagorean method), the whole name then the vowels.</li>
      <li><strong>MBTI type</strong> — from your questionnaire or your direct entry.</li>
    </ul>
    <h3>Our stance</h3>
    <p>A <strong>genderless</strong> language, with no injunction, no fate. Every portrait names a strength <em>and</em> a growth edge, because a person is never a verdict. Take what resonates, leave the rest.</p>
    <h3>Your data</h3>
    <p>Everything is computed locally, in your browser. Profiles you save stay on your device (local storage). Nothing is sent to a server.</p>
  `,

  build: {
    synthesis(p, L){
      const sign=L.signs[p.sign], lp=L.numbers[p.life], type=L.mbti[p.mbti], el=p.el, elName=L.elements[el].name;
      const lead=`Under one light, three facets: the ${elName.toLowerCase()} temperament of ${sign.name}, the thread of ${lp.titre.toLowerCase()} (${p.life}), and the ${type.nom.toLowerCase()}’s gaze.`;
      const p1=`Your astrology orients you toward ${L.elements[el].desc}. That’s your natural lean, the way you react before you think. Where ${sign.name} shines — ${sign.force.toLowerCase()} — you’re already at home.`;
      const p2=`Your life path ${p.life}, that of ${lp.titre.toLowerCase()}, adds an underlying direction: ${lp.desc.toLowerCase()} Less a mood than a trajectory — the lesson that keeps returning, in different forms, across a life.`;
      const p3=`Your ${p.mbti} type describes how all of this organizes concretely: ${type.desc.toLowerCase()} In relationships, it’s ${type.relation}`;
      let converge="Where the three lenses meet: ";
      const m=p.mbti, notes=[], isF=m.includes("F"), isN=m.includes("N"), isJ=m.includes("J");
      if((el==="feu"||el==="air")&&m.includes("E")) notes.push("an energy turned outward, that needs to act and exchange to exist");
      if((el==="eau"||el==="terre")&&m.includes("I")) notes.push("a rich inner world, fed by calm before it gives itself");
      if(isF&&el==="eau") notes.push("a strong sensitivity, both a resource and a watch-point");
      if(!isF&&el==="terre") notes.push("a concrete, dependable relationship to reality that reassures those around you");
      if(isN&&[3,5,7,9,11,22,33].includes(p.life)) notes.push("a need for meaning and openness that runs through almost everything you do");
      if(isJ&&[1,4,8,22].includes(p.life)) notes.push("a real ability to structure and carry things through");
      if(notes.length===0) notes.push("a balance between contrasting forces — often exactly where your singularity lives");
      converge+=notes.slice(0,2).join("; ")+". "+`The shared growth edge shows in what ${sign.name} has to work on — ${sign.travail.toLowerCase()}`;
      return { lead, paras:[p1,p2,p3], converge };
    },
    celestial(p, L){
      const asc=L.signs[p.asc.sign], moon=L.signs[p.moon.sign];
      return `Your <strong>${asc.name} rising</strong> shades everything else: it’s how you approach the world, the first impression you leave — here colored by ${asc.mots[0]} and ${asc.mots[1]}. Your <strong>Moon in ${moon.name}</strong> describes your deep needs, your way of loving and being reassured: a sensitivity turned toward ${moon.mots[0]} and ${moon.mots[2]}.`;
    },
    relElement(aKey,bKey,score,L){
      const a=L.elements[aKey].name, b=L.elements[bKey].name;
      if(aKey===bKey) return `Two ${a.toLowerCase()} temperaments: you understand each other instinctively, at the risk of sometimes being a little too alike.`;
      const harmon={feu:"air",air:"feu",terre:"eau",eau:"terre"};
      if(harmon[aKey]===bKey) return `${a} and ${b} feed each other: one animates, the other deepens. A natural accord — as long as you respect your different rhythms.`;
      return `${a} and ${b} run on different logics — friction is possible, but the complementarity is strong if each learns the other’s language.`;
    },
    relLife(a,b,score){
      if(a===b) return `Same underlying thread (${a}): close values and life rhythm, immediate common ground.`;
      const diff=Math.abs(a-b);
      if(diff<=2) return `Neighboring paths (${a} and ${b}): close enough to understand each other, distinct enough to complete each other.`;
      return `Contrasting paths (${a} and ${b}): you don’t move at the same pace, which can enrich as much as it demands adjustment.`;
    },
    relMbti(a,b,shared,comp){
      if(shared>=3) return `Very close types (${a} & ${b}): fluid communication, a shared worldview. Mind your common blind spots.`;
      if(shared===2&&comp) return `${a} & ${b}: a common base (same way of perceiving) and differences that balance out. Often a very solid combination.`;
      if(shared===2) return `${a} & ${b}: half alike, half complementary. Fine synergies, a few translations to make.`;
      if(shared===1) return `${a} & ${b}: you approach things differently. Rich but demanding — name how each of you works to avoid misunderstandings.`;
      return `${a} & ${b}: opposite profiles. Fascination is likely and the complementarity real — provided mutual patience.`;
    },
    relContext(ctx){
      return {
        couple:"In love, lean on what connects you without erasing your differences: they drive desire as much as they spark friction.",
        amitie:"In friendship, your strength is freedom: few expectations, a lot of honesty. Say things before they pile up.",
        famille:"In family, the point is to accept the other as they are, not to correct them. Your differences are an inheritance, not a problem to solve.",
        travail:"At work, divide roles by your respective strengths rather than by habit: that’s where complementarity pays off."
      }[ctx];
    },
    relLead:"What brings you together makes you fluid; what separates you makes you useful to each other.",
    relClosing(na,ra,nb,rb){ return `${na} is ${ra} ${nb}, in turn, is ${rb} Recognizing these differences is already half the way.`; }
  }
}

};
