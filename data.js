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
    nav: { home:"Accueil", create:"Mon profil", relation:"Relation", mirror:"Miroir", method:"Méthode" },
    brandTag: "Astrologie · Numérologie · MBTI",
    hero: {
      eyebrow:"Astrologie · Numérologie · MBTI · Graphologie",
      t1:"Vous êtes", t2:"plus d’une", t3:"lecture.",
      sub:"PRISME décompose ce que vous êtes à travers plusieurs lentilles anciennes et modernes — puis les recompose en un portrait lisible. Pour vous comprendre, comprendre vos proches, et travailler mieux ensemble.",
      cta1:"Créer mon profil", cta2:"Comparer deux personnes",
      note:"Aucune inscription. Rien n’est envoyé : tout est calculé sur votre appareil."
    },
    lenses: [
      { i:"01", h:"Astrologie", p:"Non pas un horoscope, mais une grammaire des tempéraments : éléments, modalités, énergies.", cta:"Calculer mon thème astral", to:"create" },
      { i:"02", h:"Numérologie", p:"Votre date et votre nom réduits à des nombres porteurs de sens : le fil de fond d’une vie.", cta:"Calculer mon chemin de vie", to:"create" },
      { i:"03", h:"MBTI", p:"Une cartographie cognitive éprouvée : comment vous prenez l’énergie, percevez, décidez, vous organisez.", cta:"Découvrir mon profil", to:"create" },
      { i:"04", h:"Graphologie", p:"Votre écriture comme empreinte : le trait, le rythme, l’espace. Une lecture fine, menée par un analyste.", cta:"Prendre rendez-vous", to:"consult", tag:"sur rendez-vous" }
    ],
    lensesCta:{ text:"Et surtout, les quatre réunies : ce que dit l’ensemble de votre profil.", button:"Voir l’ensemble de mon profil" },
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
    jung:{ eyebrow:"Le fil rouge", quote:"Le privilège d’une vie, c’est de devenir qui l’on est vraiment.", who:"Carl Gustav Jung", link:"Psychiatre suisse (1875–1961). Sa théorie des types psychologiques est la source directe du MBTI — et cette idée, devenir soi, est le cœur même de PRISME." },
    consult:{ eyebrow:"Aller plus loin", title:"Parler avec un psychanalyste", text:"Les algorithmes ouvrent la porte ; un regard humain va plus loin. Nos psychanalystes, formés à la pratique jungienne, reprennent vos lectures en entretien — et y ajoutent une analyse graphologique de votre écriture.", feats:["Praticiens formés à la pratique jungienne","Analyse graphologique de votre écriture","Synthèse écrite à emporter"], price:"80 €", priceUnit:"la séance · 60 min", button:"Prendre rendez-vous", note:"La réservation en ligne arrive bientôt. Donnez-nous votre lien (Calendly, e-mail…) et nous l’activons ici." },
    famille:{ eyebrow:"Au-delà de soi", title:"La constellation familiale", text:"On n’existe pas seul. PRISME lit aussi votre famille comme un système : à travers la numérologie, l’astrologie et le MBTI, explorez les rôles, les transmissions et les loyautés qui vous relient.", items:[{h:"Numérologie",p:"Les nombres qui se répètent d’une génération à l’autre."},{h:"Astrologie",p:"Les éléments et tempéraments qui se répondent dans une fratrie."},{h:"MBTI",p:"Les façons de fonctionner qui s’attirent ou se heurtent au quotidien."}], cta:"Explorer une relation familiale", to:"relation-famille" },
    tarifs:{ eyebrow:"Les formules", title:"Aller au bout de votre profil", note:"Le paiement en ligne s’active dès que vous fournissez votre lien (Stripe, etc.). Pour l’instant, les boutons ouvrent l’outil.", cards:[
      { name:"Portrait complet", desc:"Vos quatre prismes réunis — astrologie, numérologie, MBTI et graphologie — en une synthèse approfondie.", price:"15 €", unit:"l’analyse", cta:"Créer mon portrait", to:"create" },
      { name:"Analyse relationnelle", desc:"Deux personnes mises en regard : ce qui rapproche, ce qui frotte, et comment faire avec.", price:"25 €", unit:"l’analyse", cta:"Comparer deux personnes", to:"relation" },
      { name:"Consultation", desc:"60 min avec un psychanalyste formé à la pratique jungienne, analyse graphologique incluse.", price:"80 €", unit:"la séance", cta:"Prendre rendez-vous", to:"consult", featured:true }
    ] },
    mirror:{
      eyebrow:"Le miroir", title:"Comprendre un conflit, à deux voix",
      lead:"Une dispute ? Chacun a sa version — et elles divergent, c’est normal. Écrivez la vôtre, puis mettez-la en regard de celle de l’autre : le miroir révèle l’écart entre ce que l’on imagine et ce que l’autre a vraiment vécu.",
      ctxLabel:"Type de relation", aName:"Prénom (vous)", bName:"Prénom (l’autre)",
      fRecit:"Ce qui s’est passé, de mon point de vue", fRessenti:"Ce que j’ai ressenti", fBesoin:"Ce dont j’avais besoin", fAutre:"Ce que je crois que l’autre a ressenti",
      phRecit:"Racontez la situation telle que vous l’avez vécue…", phRessenti:"En colère, blessé, ignoré, inquiet…", phBesoin:"Être écouté, respecté, rassuré…", phAutre:"À votre avis, qu’a ressenti l’autre ?",
      submit:"Ouvrir le miroir", err:"Complétez au moins le récit et le ressenti des deux personnes.",
      rTitle:"Le miroir", rIntro:"Deux vérités qui coexistent — voici l’écart entre ce que chacun imaginait et ce que l’autre a vraiment vécu.",
      accountsTitle:"Les deux récits", recitLabel:"Récit", ressentiLabel:"Ressenti", besoinLabel:"Besoin",
      gapTitle:"L’écart de perception", imagined:"imaginait que l’autre ressentait", reallyFelt:"a réellement exprimé", theirNeed:"avait besoin de",
      promptsTitle:"Trois questions pour avancer",
      prompts:["Qu’est-ce qui, dans le récit de l’autre, vous surprend le plus ?","Sur quel besoin non dit pourriez-vous vous rejoindre ?","Quelle petite chose apaiserait la prochaine conversation ?"],
      closing:"Aucune version n’est « la vraie ». Comprendre celle de l’autre, ce n’est pas lui donner raison — c’est cesser de se parler à travers un mur.",
      restart:"Recommencer",
      ai:{
        tag:"Le tiers",
        title:"Faire lire les deux récits par un tiers",
        text:"Le miroir met vos deux versions côte à côte. Un tiers peut aller plus loin : lire les deux ensemble, nommer le malentendu réel, et dire à chacun ce qu’il ne peut pas voir depuis sa place. Bienveillant, mais objectif — il ne donne raison à personne.",
        privacy:"Vos deux récits quittent votre navigateur pour être analysés. C’est la seule fonction du site dans ce cas : tout le reste est calculé chez vous. Ne lancez l’analyse qu’avec l’accord des deux personnes.",
        consent:"Nous sommes d’accord tous les deux pour envoyer nos récits.",
        button:"Demander la lecture du tiers",
        loading:"Lecture des deux récits…",
        loadingLong:"L’analyse prend une trentaine de secondes.",
        retry:"Réessayer",
        rTag:"Lecture du tiers",
        rTitle:"Ce qu’un tiers voit dans vos deux récits",
        sResume:"Ce qui s’est passé",
        sNoeud:"Le nœud",
        sChacun:"Ce que chacun dit vraiment",
        lEntend:"Ce qu’iel dit, sous ses mots",
        lBesoin:"Le besoin dessous",
        lAngle:"Son angle mort",
        sAccords:"Ce sur quoi vous êtes déjà d’accord",
        sPistes:"Par où reprendre",
        sADire:"Une phrase à se dire",
        disclaimer:"Lecture produite par une IA à partir de vos seuls récits. Ce n’est ni un avis thérapeutique ni un arbitrage — gardez ce qui résonne, écartez le reste.",
        alertTitle:"Un point de vigilance avant tout le reste",
        setup:"L’analyse par un tiers n’est pas encore configurée sur ce site.",
        setupKey:"Pour l’essayer dès maintenant, saisissez votre clé d’API Anthropic. Elle reste dans ce navigateur et n’est envoyée qu’à Anthropic.",
        keyPh:"sk-ant-…",
        keySave:"Enregistrer la clé",
        keyForget:"Oublier la clé",
        keyOk:"Clé enregistrée dans ce navigateur.",
        errs:{
          config:"Aucune clé ni relais configuré.",
          cle:"Clé refusée. Vérifiez-la dans la console Anthropic.",
          quota:"Trop de requêtes ou quota atteint. Réessayez dans un moment.",
          reseau:"Connexion impossible. Vérifiez votre réseau.",
          refus:"L’analyse n’a pas pu être produite pour ces récits.",
          api:"Le service a renvoyé une erreur.",
          format:"Réponse inattendue du service.",
          vide:"Réponse vide du service."
        }
      }
    },

    sky:{
      eyebrow:"Le ciel du moment", title:"Ce que le ciel traverse en ce moment",
      lead:"Les planètes ne décident de rien. Mais leurs cycles donnent un vocabulaire pour nommer ce qui, à une période donnée, revient chez beaucoup de monde en même temps. Voici ce qui se joue aujourd’hui, et ce que ça touche chez vous.",
      calm:"Aucune planète ne rétrograde en ce moment. Les choses avancent dans le sens habituel — c’est une période pour faire, plus que pour reprendre.",
      retroTitle:"Rétrogradations en cours",
      since:(d)=>`depuis le ${d}`, until:(d)=>`jusqu’au ${d}`,
      slowNote:"Cycle long : concerne une génération entière plus qu’une journée.",
      inSign:(p,s,deg)=>`${p} en ${s}, ${deg}°`,
      what:"Ce que ça veut dire",
      profileTitle:"Ce que le ciel touche chez vous",
      profileLead:"Un transit ne fait quelque chose que s’il rencontre un point de votre thème. Voici les rencontres actives aujourd’hui.",
      none:"Aucun transit majeur ne touche vos points de naissance en ce moment. Le ciel passe à côté — ce n’est ni bon ni mauvais signe.",
      exact:"exact",
      noteNoBirth:"Ajoutez votre heure et votre lieu de naissance pour que la lune et l’ascendant entrent aussi dans le calcul.",
      disclaimer:"Positions calculées localement pour la date du jour. Langage symbolique : rien ici ne prédit un événement.",
      points:{ soleil:"votre Soleil", lune:"votre Lune", ascendant:"votre Ascendant" },
      planets:{
        mercure:{ nom:"Mercure", symbole:"☿", theme:"la parole, les échanges, les papiers, les trajets",
          retro:"La période classique du malentendu : messages mal lus, rendez-vous décalés, contrats à relire, matériel qui lâche. Rien de fatal — mais c’est un moment pour vérifier deux fois plutôt que pour lancer. Ce qui revient d’un coup — un vieux dossier, quelqu’un qu’on n’attendait plus — mérite d’être regardé, c’est souvent le sens de la période.",
          direct:"Les échanges reprennent leur rythme normal : ce qui était en attente peut se signer, se dire, se lancer." },
        venus:{ nom:"Vénus", symbole:"♀", theme:"le lien, le goût, la valeur qu’on se donne",
          retro:"Les affections et l’argent repassent à l’examen. Des liens anciens refont surface, des évidences sur ce qu’on veut vraiment se fissurent. Mauvaise période pour un engagement pris sur l’élan, bonne période pour comprendre à quoi on tient réellement.",
          direct:"Le lien et le goût circulent sans obstacle particulier." },
        mars:{ nom:"Mars", symbole:"♂", theme:"l’élan, l’action, la colère",
          retro:"L’énergie ne sort plus vers l’avant : elle rentre. Les projets s’enlisent, l’irritation monte sans trouver de porte. C’est le moment de revoir la stratégie plutôt que de forcer — pousser ici coûte deux fois plus cher.",
          direct:"L’élan est disponible : c’est un temps pour agir et trancher." },
        jupiter:{ nom:"Jupiter", symbole:"♃", theme:"l’ampleur, le sens, la confiance",
          retro:"L’expansion se fait vers l’intérieur. Les grandes promesses extérieures ralentissent, et la question devient : qu’est-ce que je crois vraiment ? Une croissance moins visible, mais plus solide.",
          direct:"Les portes s’ouvrent plus facilement ; c’est un temps pour élargir." },
        saturne:{ nom:"Saturne", symbole:"♄", theme:"la structure, la responsabilité, le temps long",
          retro:"Saturne remet en cause les fondations. Ce qui a été construit trop vite, sur une base bancale ou sur une promesse qu’on ne tenait pas, se met à craquer — pas par punition, mais parce que la structure ne porte plus. C’est aussi le retour des comptes : les engagements esquivés reviennent à la porte, et il devient très coûteux de ne pas être droit. Période exigeante, mais rien de ce qui tient après elle n’aura besoin d’être refait.",
          direct:"La structure se construit vers l’avant : les efforts déposés commencent à porter." },
        uranus:{ nom:"Uranus", symbole:"♅", theme:"la rupture, l’imprévu, l’émancipation",
          retro:"Le besoin de rompre travaille en sous-main plutôt qu’au grand jour. On mûrit un changement avant de le poser.",
          direct:"Le changement se joue à l’extérieur : ruptures, virages, libérations visibles." },
        neptune:{ nom:"Neptune", symbole:"♆", theme:"le flou, l’idéal, ce à quoi on s’abandonne",
          retro:"Le brouillard se lève par endroits. Des illusions tombent, parfois durement — mais on y voit plus clair après.",
          direct:"L’imaginaire et l’idéal circulent ; le risque est de confondre le rêve et le réel." },
        pluton:{ nom:"Pluton", symbole:"♇", theme:"le pouvoir, la mort et la reprise, ce qu’on ne montre pas",
          retro:"La transformation se fait à l’intérieur, hors du regard. Ce qui doit finir finit lentement.",
          direct:"Les rapports de pouvoir et les fins de cycle se jouent au dehors." },
      },
      aspects:{
        conjonction:(p,pt)=>`${p} se superpose à ${pt} : le thème devient central, on ne peut plus le contourner.`,
        opposition:(p,pt)=>`${p} fait face à ${pt} : le sujet arrive par l’extérieur, souvent par quelqu’un d’autre. Il faut composer, pas gagner.`,
        carre:(p,pt)=>`${p} frotte contre ${pt} : ça résiste, ça agace, et c’est précisément ce frottement qui oblige à ajuster.`,
        trigone:(p,pt)=>`${p} coule vers ${pt} : la période facilite ce thème. Peu d’effort, mais rien ne se fait tout seul non plus.`,
        sextile:(p,pt)=>`${p} tend une perche à ${pt} : une ouverture est là, à saisir — elle ne s’imposera pas.`,
      }
    },
    histoire:{
      nav:"Histoire",
      eyebrow:"L’histoire de vie", title:"Toutes les versions de vous",
      lead:"Vous n’êtes pas seulement la personne que vous êtes aujourd’hui. Vous êtes aussi l’enfant de six ans qui a vu ses parents se séparer, l’adolescent qu’on a mis à l’écart, le jeune adulte qui a encaissé un échec. Ces versions ne disparaissent pas : elles se taisent quand tout va bien, et elles reprennent la parole quand ça chauffe. Les nommer, c’est cesser de les confondre avec soi.",
      disclaimer:"Outil de réflexion, pas un diagnostic. Personne ne se réduit à ce qui lui est arrivé, et deux personnes ayant vécu la même chose n’en tirent pas la même chose.",
      care:"Si l’un de ces événements est encore vif quand vous y pensez, ce n’est pas une page web qui doit le porter. En parler à un professionnel n’est pas un aveu de faiblesse — c’est le bon endroit.",
      privacy:"Ce que vous écrivez ici reste sur cet appareil. Rien n’est envoyé, sauf si vous demandez explicitement la lecture du tiers dans le Miroir.",
      addTitle:"Ajouter un moment",
      fAge:"Votre âge à ce moment-là", fType:"De quoi s’agissait-il ?",
      fNote:"En un mot, si vous voulez (facultatif)", phNote:"Ce qui vous revient en premier…",
      typePick:"Choisir…",
      add:"Ajouter ce moment", remove:"Retirer", clearAll:"Tout effacer",
      errAge:"Indiquez un âge entre 0 et 120.", errType:"Choisissez de quoi il s’agissait.",
      empty:"Rien d’enregistré pour l’instant. Ajoutez un premier moment — vous pourrez en ajouter d’autres, ou tout effacer.",
      timelineTitle:"Votre ligne de vie",
      ageLabel:(n)=>n===0?"la naissance":(n===1?"1 an":`${n} ans`),
      versionTitle:(n)=>n===0?"Le vous des tout premiers mois":`Le vous de ${n} ans`,
      versionsTitle:"Les versions de vous",
      versionsLead:"Chaque moment a laissé une version de vous à l’âge où il est arrivé. Voici ce que chacune a compris, et ce qui la réveille.",
      lRead:"Ce que cet âge pouvait en faire",
      lBelief:"Ce qu’elle en a conclu",
      lGuard:"Ce qu’elle protège depuis",
      lTrigger:"Quand elle reprend la parole",
      lSoothe:"Ce qui la calme",
      conflictTitle:"Qui parle quand ça chauffe",
      conflictLead:"Dans une dispute, ce n’est presque jamais l’adulte d’aujourd’hui qui répond en premier. Voici les versions les plus susceptibles de prendre le volant, et à quoi les reconnaître.",
      conflictNone:"Ajoutez des moments pour voir quelles versions sont les plus susceptibles de s’exprimer sous tension.",
      profileTitle:"Ce que votre histoire ajoute",
      profileLink:"Compléter mon histoire de vie",
      profileNone:"Vous n’avez pas encore renseigné d’histoire de vie. C’est la couche que les trois lentilles ne voient pas : ce qui vous est arrivé, et à quel âge.",
      mirrorConsent:"Inclure notre histoire de vie dans l’analyse (plus juste, mais plus intime).",
      /* Ce que l'âge permet de faire d'un événement. */
      stages:[
        { max:2,   nom:"les tout premiers mois",
          lecture:"À cet âge il n’y a pas encore de mots pour ranger ce qui arrive. Rien ne s’enregistre comme un souvenir : tout passe par le corps et par le sentiment, très basique, d’être en sécurité ou non." },
        { max:6,   nom:"la petite enfance",
          lecture:"À cet âge l’enfant se croit la cause de ce qui l’entoure. Il n’a pas encore les moyens de penser que les adultes ont leurs propres raisons, alors il explique par lui ce qu’il ne comprend pas." },
        { max:11,  nom:"l’âge scolaire",
          lecture:"À cet âge tout se mesure : ce qui est juste, ce qui ne l’est pas, qui a le droit et qui ne l’a pas. L’enfant compare, tient les comptes, et retient l’injustice avec une précision d’adulte." },
        { max:17,  nom:"l’adolescence",
          lecture:"À cet âge on se construit contre ou avec les autres. L’appartenance au groupe et le regard des pairs pèsent plus que tout : ce qui touche à la place qu’on y tient laisse une marque durable." },
        { max:25,  nom:"le jeune âge adulte",
          lecture:"À cet âge on prend ses premiers engagements seul. Ce qui échoue là ne touche pas l’enfance mais la compétence : la question devient « est-ce que je suis à la hauteur ? »." },
        { max:200, nom:"l’âge adulte",
          lecture:"À cet âge on a les mots et le recul. Mais un choc ne tombe plus sur du terrain neuf : il vient ébranler des fondations déjà construites, parfois patiemment." },
      ],
      /* Chaque type de moment : ce qu'il installe, et à quoi il rend sensible. */
      events:{
        separation:{ label:"La séparation de mes parents",
          croyance:"que ce qui semblait solide peut se défaire sans prévenir, et qu’il vaut mieux voir venir",
          garde:"la stabilité — elle surveille les signes avant-coureurs, parfois là où il n’y en a pas",
          declencheur:"quand quelqu’un se ferme, prend de la distance, ou parle d’un changement",
          apaise:"qu’on lui dise clairement ce qui va se passer, même quand la nouvelle n’est pas bonne" },
        deuil:{ label:"La perte de quelqu’un",
          croyance:"que ce à quoi on tient peut disparaître, et qu’aimer coûte",
          garde:"les liens — elle en fait beaucoup, ou se retient d’en faire trop",
          declencheur:"quand un proche s’éloigne, ne répond pas, ou parle de partir",
          apaise:"un signe régulier, même minuscule, que le lien tient" },
        abandon:{ label:"L’absence ou le départ d’un parent",
          croyance:"qu’on peut être quitté sans explication, et que ce doit être de sa faute",
          garde:"sa place — elle la vérifie sans arrêt, parfois en la testant",
          declencheur:"un silence, un message sans réponse, une attention qui va ailleurs",
          apaise:"qu’on la choisisse à voix haute, pas seulement en actes" },
        demenagement:{ label:"Un déracinement (déménagement, changement d’école)",
          croyance:"qu’il faut se refaire une place à chaque fois, et vite",
          garde:"l’adaptation — elle s’ajuste tellement bien qu’elle en oublie ce qu’elle veut",
          declencheur:"un environnement nouveau, un groupe déjà constitué",
          apaise:"le temps de s’installer, sans avoir à faire ses preuves tout de suite" },
        harcelement:{ label:"Du harcèlement (école, travail)",
          croyance:"que se faire remarquer est dangereux",
          garde:"la discrétion — elle se fait petite, ou frappe la première",
          declencheur:"une moquerie, un groupe qui rit, une critique devant témoins",
          apaise:"que quelqu’un prenne position à voix haute, sans qu’elle ait à le demander" },
        maladie:{ label:"Une maladie ou un accident grave",
          croyance:"que le corps lâche et que rien n’est acquis",
          garde:"le contrôle — elle anticipe, prévoit, se prépare au pire",
          declencheur:"l’imprévu, l’attente d’un résultat, l’impuissance",
          apaise:"des faits concrets et une prochaine étape claire" },
        fratrie:{ label:"L’arrivée d’un frère ou d’une sœur",
          croyance:"que l’attention est une ressource limitée qu’il faut mériter",
          garde:"sa part — elle compte, compare, et s’en veut de compter",
          declencheur:"quand quelqu’un d’autre passe avant, même à raison",
          apaise:"un moment où elle est la seule, sans avoir à le réclamer" },
        violence:{ label:"Des violences subies ou vues",
          croyance:"que le conflit peut déraper, donc qu’il faut l’éteindre ou fuir",
          garde:"la paix — elle cède trop vite, ou coupe court",
          declencheur:"une voix qui monte, un geste brusque, une tension qui dure",
          apaise:"le calme physique d’abord, la discussion seulement ensuite" },
        precarite:{ label:"Le manque d’argent, l’insécurité matérielle",
          croyance:"qu’il faut assurer soi-même, toujours, et ne rien devoir",
          garde:"la sécurité — elle a du mal à recevoir, à dépenser, à lâcher",
          declencheur:"une dépense imprévue, une dépendance à quelqu’un",
          apaise:"une marge, une réserve, un plan de repli" },
        parentification:{ label:"Avoir dû être l’adulte trop tôt",
          croyance:"que ses besoins passent après, et qu’on l’aime pour ce qu’elle porte",
          garde:"les autres — elle s’occupe de tout le monde et ne demande rien",
          declencheur:"qu’on lui demande ce dont elle a besoin, elle ne sait pas répondre",
          apaise:"qu’on s’occupe d’elle sans qu’elle ait rien donné en échange" },
        echec:{ label:"Un échec qui a compté",
          croyance:"qu’une erreur définit, et qu’il ne faut plus se tromper en public",
          garde:"l’image — elle prépare trop, ou n’essaie pas",
          declencheur:"une évaluation, un regard sur son travail, une comparaison",
          apaise:"qu’on sépare ce qu’elle a fait de ce qu’elle vaut" },
        rupture:{ label:"Une rupture amoureuse",
          croyance:"qu’on peut être aimé puis ne plus l’être, sans avoir changé",
          garde:"le cœur — elle s’engage à moitié, ou trop vite pour ne pas sentir",
          declencheur:"un refroidissement, une hésitation, un « il faut qu’on parle »",
          apaise:"de la constance dans les petites choses, plus que des déclarations" },
        travail:{ label:"Un licenciement, une humiliation professionnelle",
          croyance:"que la place n’est jamais acquise et que la loyauté ne protège pas",
          garde:"son utilité — elle en fait trop, ou se désengage par avance",
          declencheur:"une réorganisation, un retour critique, un silence de la hiérarchie",
          apaise:"une reconnaissance explicite de ce qu’elle apporte" },
        exil:{ label:"Un exil, une migration",
          croyance:"qu’il y a un avant et un après, et qu’on n’est jamais tout à fait d’ici",
          garde:"l’appartenance — elle en fait trop pour être acceptée, ou reste en retrait",
          declencheur:"une remarque sur son origine, un code social qu’elle ne connaît pas",
          apaise:"qu’on lui reconnaisse les deux mondes, sans lui demander de choisir" },
        autre:{ label:"Autre chose",
          croyance:"quelque chose que vous êtes seul à pouvoir nommer",
          garde:"ce qui a été touché à ce moment-là",
          declencheur:"les situations qui ressemblent, même de loin, à celle-là",
          apaise:"d’être reconnue plutôt que raisonnée" },
      },
    },
    createEyebrow:"Étape par étape", createTitle:"Votre portrait",
    createLead:"Quelques informations suffisent. Prenez le questionnaire ou indiquez directement votre type si vous le connaissez.",
    fName:"Prénom et nom", fNamePh:"Ex. Camille Durand", fNameHint:"Le nom complet de naissance, pour la numérologie.",
    fDate:"Date de naissance",
    fBirthOpt:"Heure et lieu de naissance",
    fBirthOptHint:"Facultatif — mais nécessaires pour calculer votre ascendant et votre signe lunaire.",
    fTime:"Heure de naissance", fCity:"Ville de naissance", fCityPh:"Tapez les premières lettres…",
    fManual:"Coordonnées manuelles", fLat:"Latitude", fLon:"Longitude (est +)", fTz:"Décalage UTC (h)",
    dstNote:"Le fuseau horaire et l’heure d’été sont déduits de la ville et de la date de naissance, règles historiques comprises. En coordonnées manuelles, indiquez l’offset réel (heure d’été comprise).",
    dstApplied:"Heure d’été appliquée automatiquement.",
    cityLoading:"Chargement de la base des villes…",
    cityLoadErr:"Base des villes indisponible — utilisez les coordonnées manuelles.",
    cityHint:"135 000 villes dans le monde. Recherche en français ou dans la langue du pays (Londres, London).",
    cityNoneYet:"Aucune ville de plus de 15 000 habitants ne correspond — recherche étendue aux petites communes…",
    cityNone:"Aucune commune trouvée. Choisissez la ville la plus proche (à 10 km près l’ascendant est identique), ou saisissez les coordonnées manuellement.",
    cityCount:(n)=>`${n} résultat${n>1?"s":""}`,
    cityChosen:(zone)=>`Fuseau : ${zone}`,
    cityClear:"Effacer",
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
    placeLabel:"Lieu", utcShort:"UTC",
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
    ctx:{ couple:"Amoureuse", amitie:"Amicale", famille:"Familiale", travail:"Professionnelle" },
    ctxSub:{ couple:"partenaire, couple", amitie:"ami proche", famille:"parent, fratrie, enfant", travail:"collègue, associé" },
    relDimLabel:"Quelle relation lisez-vous ?",
    fromSaved:"Depuis mes profils enregistrés",
    submitRelation:"Lire la relation",
    errRelation:"Complétez les deux profils (nom, date et type MBTI) pour lancer la lecture.",
    relReadFor:"Lecture relationnelle", resonance:"résonance",
    relDisclaimer:"Une résonance, pas un verdict : les liens les plus vivants naissent souvent des écarts bien tenus.",
    relHowTitle:"Comment cultiver ce lien",
    relMirror:{ text:"Une dispute avec cette personne ? Et si vous regardiez la scène depuis sa position, pas seulement la vôtre ?", button:"Ouvrir le miroir" },

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
      <li><strong>Ascendant & signe lunaire</strong> — calculés à partir de l’heure et du lieu, par des formules astronomiques standard (Lune ~ Schlyter). Précision volontairement modeste ; l’heure exacte et le fuseau influencent fortement l’ascendant.</li>
      <li><strong>Lieu & fuseau horaire</strong> — 135 000 villes dans le monde (base GeoNames). Le décalage UTC est celui qui s’appliquait réellement <em>à votre date de naissance</em> : les règles historiques d’heure d’été sont prises en compte, y compris celles qui ont changé au fil des décennies.</li>
      <li><strong>Chemin de vie</strong> — somme des chiffres de votre date de naissance, réduite jusqu’à un seul chiffre. Les <strong>nombres maîtres 11, 22 et 33</strong> sont conservés : la somme n’est pas réduite avant la fin, sinon ils disparaîtraient. Ils s’écrivent avec leur racine — 11/2, 22/4, 33/6.</li>
      <li><strong>Nombre d’expression & nombre intime</strong> — valeur des lettres de votre nom (méthode pythagoricienne), tout le nom puis les voyelles.</li>
      <li><strong>Type MBTI</strong> — issu de votre questionnaire ou de votre saisie directe.</li>
    </ul>
    <h3>Notre parti pris</h3>
    <p>Un langage <strong>sans genre</strong>, sans injonction, sans fatalité. Chaque portrait nomme une force <em>et</em> un chantier, parce qu’une personne n’est jamais un verdict. Prenez ce qui résonne, laissez le reste.</p>
    <h3>Vos données</h3>
    <p>Les portraits, les relations et les calculs astronomiques sont faits localement, dans votre navigateur. Les profils que vous enregistrez restent sur votre appareil (stockage local).</p>
    <p><strong>Une seule exception</strong>, et elle est explicite : dans le Miroir, la <em>lecture du tiers</em> envoie vos deux récits à un modèle d’IA pour analyse. Rien n’est envoyé sans que vous cochiez l’accord des deux personnes, et la fonction est facultative — le miroir à deux voix fonctionne sans elle. Nous ne conservons pas ces récits ; ils transitent le temps de l’analyse.</p>
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
    relLife(a,b,score,ra=a,rb=b){
      if(a===b) return `Mêmes fils de fond (${a}) : des valeurs et un rythme de vie proches, un terrain d’entente immédiat.`;
      if(ra===rb) return `Même racine (${ra}) portée différemment (${a} et ${b}) : le même fond de valeurs, mais l’un le vit à une octave plus haute — proximité réelle, intensités inégales.`;
      const diff=Math.abs(ra-rb);
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
    nav: { home:"Home", create:"My profile", relation:"Relationship", mirror:"Mirror", method:"Method" },
    brandTag: "Astrology · Numerology · MBTI",
    hero: {
      eyebrow:"Astrology · Numerology · MBTI · Graphology",
      t1:"You are", t2:"more than one", t3:"reading.",
      sub:"PRISME breaks down who you are through several lenses — ancient and modern — then recomposes them into a legible portrait. To understand yourself, understand those close to you, and work better together.",
      cta1:"Create my profile", cta2:"Compare two people",
      note:"No sign-up. Nothing is sent: everything is computed on your device."
    },
    lenses: [
      { i:"01", h:"Astrology", p:"Not a horoscope, but a grammar of temperaments: elements, modalities, energies.", cta:"Calculate my birth chart", to:"create" },
      { i:"02", h:"Numerology", p:"Your date and name reduced to numbers that carry meaning: the underlying thread of a life.", cta:"Calculate my life path", to:"create" },
      { i:"03", h:"MBTI", p:"A proven cognitive map: how you draw energy, perceive, decide, organize.", cta:"Discover my profile", to:"create" },
      { i:"04", h:"Graphology", p:"Your handwriting as a fingerprint: the stroke, the rhythm, the spacing. A close reading, by an analyst.", cta:"Book a session", to:"consult", tag:"by appointment" }
    ],
    lensesCta:{ text:"And above all, the four together: what your whole profile reveals.", button:"See my full profile" },
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
    jung:{ eyebrow:"The through-line", quote:"The privilege of a lifetime is to become who you truly are.", who:"Carl Gustav Jung", link:"Swiss psychiatrist (1875–1961). His theory of psychological types is the direct source of the MBTI — and that idea, becoming yourself, is the very heart of PRISME." },
    consult:{ eyebrow:"Go further", title:"Talk with a psychoanalyst", text:"Algorithms open the door; a human gaze goes further. Our psychoanalysts, trained in the Jungian tradition, revisit your readings in a one-to-one — and add a graphological analysis of your handwriting.", feats:["Practitioners trained in the Jungian tradition","Graphological analysis of your handwriting","A written synthesis to keep"], price:"€80", priceUnit:"per session · 60 min", button:"Book a session", note:"Online booking is coming soon. Send us your link (Calendly, email…) and we’ll wire it up here." },
    famille:{ eyebrow:"Beyond the self", title:"Family constellation", text:"No one exists alone. PRISME reads your family as a system too: through numerology, astrology and MBTI, explore the roles, inheritances and loyalties that connect you.", items:[{h:"Numerology",p:"The numbers that repeat from one generation to the next."},{h:"Astrology",p:"The elements and temperaments that echo across siblings."},{h:"MBTI",p:"The ways of functioning that attract or clash day to day."}], cta:"Explore a family relationship", to:"relation-famille" },
    tarifs:{ eyebrow:"Plans", title:"Go all the way with your profile", note:"Online payment activates as soon as you provide your link (Stripe, etc.). For now, the buttons open the tool.", cards:[
      { name:"Full portrait", desc:"Your four prisms combined — astrology, numerology, MBTI and graphology — in one in-depth synthesis.", price:"€15", unit:"per analysis", cta:"Create my portrait", to:"create" },
      { name:"Relationship analysis", desc:"Two people side by side: what draws you together, what rubs, and how to work with it.", price:"€25", unit:"per analysis", cta:"Compare two people", to:"relation" },
      { name:"Consultation", desc:"60 min with a psychoanalyst trained in the Jungian tradition, graphological analysis included.", price:"€80", unit:"per session", cta:"Book a session", to:"consult", featured:true }
    ] },
    mirror:{
      eyebrow:"The mirror", title:"Understand a conflict, in two voices",
      lead:"An argument? Each side has its version — and they diverge, that’s normal. Write yours, then set it beside the other’s: the mirror reveals the gap between what you imagine and what the other truly felt.",
      ctxLabel:"Relationship type", aName:"First name (you)", bName:"First name (the other)",
      fRecit:"What happened, from my point of view", fRessenti:"What I felt", fBesoin:"What I needed", fAutre:"What I think the other felt",
      phRecit:"Tell the situation as you experienced it…", phRessenti:"Angry, hurt, ignored, worried…", phBesoin:"To be heard, respected, reassured…", phAutre:"In your view, what did the other feel?",
      submit:"Open the mirror", err:"Fill at least the account and the feeling for both people.",
      rTitle:"The mirror", rIntro:"Two truths that coexist — here is the gap between what each imagined and what the other truly felt.",
      accountsTitle:"The two accounts", recitLabel:"Account", ressentiLabel:"Feeling", besoinLabel:"Need",
      gapTitle:"The perception gap", imagined:"imagined the other felt", reallyFelt:"actually expressed", theirNeed:"needed",
      promptsTitle:"Three questions to move forward",
      prompts:["What in the other’s account surprises you most?","On which unspoken need could you meet?","What small thing would ease the next conversation?"],
      closing:"No version is “the true one.” Understanding the other’s isn’t agreeing with them — it’s no longer talking through a wall.",
      restart:"Start over",
      ai:{
        tag:"The third voice",
        title:"Have a third party read both accounts",
        text:"The mirror sets your two versions side by side. A third party can go further: read them together, name the real misunderstanding, and tell each of you what you can't see from where you stand. Kind, but objective — it takes nobody's side.",
        privacy:"Both accounts leave your browser to be analysed. This is the only feature on the site that does so — everything else is computed on your machine. Only run it with both people's agreement.",
        consent:"We both agree to send our accounts.",
        button:"Ask the third party to read",
        loading:"Reading both accounts…",
        loadingLong:"The analysis takes about thirty seconds.",
        retry:"Try again",
        rTag:"The third reading",
        rTitle:"What a third party sees in your two accounts",
        sResume:"What happened",
        sNoeud:"The knot",
        sChacun:"What each of you is really saying",
        lEntend:"What they're saying, under their words",
        lBesoin:"The need underneath",
        lAngle:"Their blind spot",
        sAccords:"What you already agree on",
        sPistes:"Where to pick it up",
        sADire:"One sentence to say",
        disclaimer:"Reading produced by an AI from your accounts alone. It is neither therapeutic advice nor a ruling — keep what resonates, leave the rest.",
        alertTitle:"Something to weigh before anything else",
        setup:"Third-party analysis isn't configured on this site yet.",
        setupKey:"To try it now, enter your Anthropic API key. It stays in this browser and is sent only to Anthropic.",
        keyPh:"sk-ant-…",
        keySave:"Save the key",
        keyForget:"Forget the key",
        keyOk:"Key saved in this browser.",
        errs:{
          config:"No key or relay configured.",
          cle:"Key refused. Check it in the Anthropic console.",
          quota:"Too many requests, or quota reached. Try again shortly.",
          reseau:"Couldn't connect. Check your network.",
          refus:"The analysis couldn't be produced for these accounts.",
          api:"The service returned an error.",
          format:"Unexpected response from the service.",
          vide:"Empty response from the service."
        }
      }
    },

    sky:{
      eyebrow:"The sky right now", title:"What the sky is going through",
      lead:"Planets decide nothing. But their cycles give us a vocabulary for what, in a given season, comes up for many people at once. Here is what's in play today, and what it touches in you.",
      calm:"No planet is retrograde right now. Things move in their usual direction — a season for doing rather than revisiting.",
      retroTitle:"Retrogrades under way",
      since:(d)=>`since ${d}`, until:(d)=>`until ${d}`,
      slowNote:"Long cycle: concerns a whole generation more than a given day.",
      inSign:(p,s,deg)=>`${p} in ${s}, ${deg}°`,
      what:"What it means",
      profileTitle:"What the sky touches in you",
      profileLead:"A transit only does something if it meets a point in your chart. Here are today's live encounters.",
      none:"No major transit is touching your birth points right now. The sky passes you by — neither a good nor a bad sign.",
      exact:"exact",
      noteNoBirth:"Add your time and place of birth so the moon and rising sign enter the calculation too.",
      disclaimer:"Positions computed locally for today's date. Symbolic language: nothing here predicts an event.",
      points:{ soleil:"your Sun", lune:"your Moon", ascendant:"your Rising sign" },
      planets:{
        mercure:{ nom:"Mercury", symbole:"☿", theme:"speech, exchanges, paperwork, journeys",
          retro:"The classic season of misunderstanding: messages read wrong, meetings moved, contracts worth rereading, hardware giving out. Nothing fatal — but a time to check twice rather than launch. What suddenly resurfaces — an old file, someone you'd stopped expecting — is worth looking at; that's often the point of the period.",
          direct:"Exchanges resume their normal pace: what was waiting can be signed, said, started." },
        venus:{ nom:"Venus", symbole:"♀", theme:"connection, taste, the value you place on yourself",
          retro:"Affections and money go back under review. Old ties resurface; certainties about what you actually want start to crack. A poor time for a commitment made on impulse, a good time to understand what you truly hold to.",
          direct:"Connection and taste move without particular obstacle." },
        mars:{ nom:"Mars", symbole:"♂", theme:"drive, action, anger",
          retro:"Energy stops going outward and turns inward. Projects bog down, irritation rises with nowhere to go. A time to revise the strategy rather than force it — pushing here costs twice as much.",
          direct:"Drive is available: a time to act and to decide." },
        jupiter:{ nom:"Jupiter", symbole:"♃", theme:"scale, meaning, confidence",
          retro:"Expansion turns inward. Big outward promises slow down, and the question becomes: what do I actually believe? Less visible growth, but sturdier.",
          direct:"Doors open more easily; a time to widen." },
        saturne:{ nom:"Saturn", symbole:"♄", theme:"structure, responsibility, the long haul",
          retro:"Saturn puts the foundations back in question. What was built too fast, on a shaky base or on a promise you weren't keeping, starts to crack — not as punishment, but because the structure no longer holds. It is also the return of the ledger: dodged commitments come back to the door, and it becomes very expensive not to be straight. A demanding season, but nothing that survives it will need rebuilding.",
          direct:"Structure builds forward: the effort laid down starts to carry." },
        uranus:{ nom:"Uranus", symbole:"♅", theme:"rupture, the unforeseen, emancipation",
          retro:"The need to break works underground rather than in the open. A change ripens before it is made.",
          direct:"Change plays out on the outside: breaks, turns, visible liberations." },
        neptune:{ nom:"Neptune", symbole:"♆", theme:"blur, the ideal, what you surrender to",
          retro:"The fog lifts in places. Illusions fall, sometimes hard — but you see more clearly afterwards.",
          direct:"Imagination and ideals circulate; the risk is mistaking the dream for the real." },
        pluton:{ nom:"Pluto", symbole:"♇", theme:"power, endings and renewal, what you don't show",
          retro:"Transformation happens inside, out of sight. What must end, ends slowly.",
          direct:"Power dynamics and endings play out in the open." },
      },
      aspects:{
        conjonction:(p,pt)=>`${p} sits on top of ${pt}: the theme becomes central, there is no going around it.`,
        opposition:(p,pt)=>`${p} faces ${pt}: the subject arrives from outside, often through someone else. Something to negotiate, not to win.`,
        carre:(p,pt)=>`${p} rubs against ${pt}: it resists, it grates, and that friction is exactly what forces an adjustment.`,
        trigone:(p,pt)=>`${p} flows toward ${pt}: the season eases this theme. Little effort — though nothing does itself either.`,
        sextile:(p,pt)=>`${p} offers ${pt} an opening: it's there to take, and it won't impose itself.`,
      }
    },
    histoire:{
      nav:"History",
      eyebrow:"Life history", title:"Every version of you",
      lead:"You are not only the person you are today. You are also the six-year-old who watched their parents separate, the teenager who was pushed out, the young adult who took a hit. Those versions don't disappear: they keep quiet when things are fine, and they speak up when things heat up. Naming them means no longer mistaking them for yourself.",
      disclaimer:"A tool for reflection, not a diagnosis. Nobody is reducible to what happened to them, and two people who lived through the same thing don't take the same thing from it.",
      care:"If one of these events is still raw when you think about it, a web page is not what should carry it. Talking to a professional isn't an admission of weakness — it's the right place.",
      privacy:"What you write here stays on this device. Nothing is sent, unless you explicitly ask for the third reading in the Mirror.",
      addTitle:"Add a moment",
      fAge:"Your age at the time", fType:"What was it?",
      fNote:"In a word, if you like (optional)", phNote:"What comes back first…",
      typePick:"Choose…",
      add:"Add this moment", remove:"Remove", clearAll:"Clear everything",
      errAge:"Enter an age between 0 and 120.", errType:"Choose what it was.",
      empty:"Nothing saved yet. Add a first moment — you can add others, or clear everything.",
      timelineTitle:"Your life line",
      ageLabel:(n)=>n===0?"birth":(n===1?"age 1":`age ${n}`),
      versionTitle:(n)=>n===0?"The you of the first months":`The you of age ${n}`,
      versionsTitle:"The versions of you",
      versionsLead:"Each moment left a version of you at the age it happened. Here is what each one understood, and what wakes it.",
      lRead:"What that age could do with it",
      lBelief:"What it concluded",
      lGuard:"What it has guarded since",
      lTrigger:"When it takes the floor",
      lSoothe:"What calms it",
      conflictTitle:"Who speaks when things heat up",
      conflictLead:"In an argument, it's almost never today's adult who answers first. Here are the versions most likely to take the wheel, and how to recognise them.",
      conflictNone:"Add moments to see which versions are most likely to speak up under pressure.",
      profileTitle:"What your history adds",
      profileLink:"Fill in my life history",
      profileNone:"You haven't filled in a life history yet. It's the layer the three lenses can't see: what happened to you, and at what age.",
      mirrorConsent:"Include our life histories in the analysis (more accurate, but more intimate).",
      stages:[
        { max:2,   nom:"the first months",
          lecture:"At that age there are no words yet to file what happens. Nothing is stored as a memory: it all goes through the body and through the very basic sense of being safe or not." },
        { max:6,   nom:"early childhood",
          lecture:"At that age a child believes they cause what surrounds them. They can't yet think that adults have their own reasons, so they explain through themselves what they don't understand." },
        { max:11,  nom:"school age",
          lecture:"At that age everything is measured: what's fair, what isn't, who's allowed and who isn't. The child compares, keeps score, and remembers injustice with adult precision." },
        { max:17,  nom:"adolescence",
          lecture:"At that age you build yourself with or against others. Belonging and the gaze of peers outweigh everything: whatever touches your place in the group leaves a lasting mark." },
        { max:25,  nom:"young adulthood",
          lecture:"At that age you make your first commitments alone. What fails there doesn't touch childhood but competence: the question becomes \"am I good enough?\"." },
        { max:200, nom:"adulthood",
          lecture:"At that age you have the words and the distance. But a shock no longer lands on new ground: it shakes foundations already built, sometimes patiently." },
      ],
      events:{
        separation:{ label:"My parents separating",
          croyance:"that what looks solid can come apart without warning, and it's better to see it coming",
          garde:"stability — it watches for early signs, sometimes where there are none",
          declencheur:"when someone closes up, pulls back, or mentions a change",
          apaise:"being told clearly what's going to happen, even when the news is bad" },
        deuil:{ label:"Losing someone",
          croyance:"that what you hold to can vanish, and that loving costs",
          garde:"attachments — it makes many, or holds back from making any",
          declencheur:"when someone close drifts, doesn't reply, or talks about leaving",
          apaise:"a regular sign, however small, that the bond holds" },
        abandon:{ label:"A parent absent or gone",
          croyance:"that you can be left without explanation, and it must be your fault",
          garde:"its place — it checks constantly, sometimes by testing it",
          declencheur:"a silence, an unanswered message, attention going elsewhere",
          apaise:"being chosen out loud, not only in deeds" },
        demenagement:{ label:"Being uprooted (moving house or school)",
          croyance:"that you have to rebuild a place each time, and fast",
          garde:"adaptation — it fits in so well it forgets what it wants",
          declencheur:"a new environment, a group already formed",
          apaise:"time to settle, without having to prove itself straight away" },
        harcelement:{ label:"Bullying (school, work)",
          croyance:"that being noticed is dangerous",
          garde:"discretion — it makes itself small, or strikes first",
          declencheur:"a joke at its expense, a group laughing, criticism with witnesses",
          apaise:"someone taking a stand out loud, without being asked" },
        maladie:{ label:"A serious illness or accident",
          croyance:"that the body gives out and nothing is guaranteed",
          garde:"control — it anticipates, plans, prepares for the worst",
          declencheur:"the unforeseen, waiting for a result, powerlessness",
          apaise:"concrete facts and a clear next step" },
        fratrie:{ label:"A brother or sister arriving",
          croyance:"that attention is a limited resource you have to earn",
          garde:"its share — it counts, compares, and resents itself for counting",
          declencheur:"when someone else comes first, even rightly",
          apaise:"a moment where it's the only one, without having to ask" },
        violence:{ label:"Violence suffered or witnessed",
          croyance:"that conflict can tip over, so it must be smothered or fled",
          garde:"peace — it gives in too fast, or cuts things short",
          declencheur:"a raised voice, an abrupt gesture, tension that lasts",
          apaise:"physical calm first, discussion only afterwards" },
        precarite:{ label:"Money short, material insecurity",
          croyance:"that you must cover it yourself, always, and owe nothing",
          garde:"security — it struggles to receive, to spend, to let go",
          declencheur:"an unplanned expense, depending on someone",
          apaise:"a margin, a reserve, a fallback plan" },
        parentification:{ label:"Having to be the adult too early",
          croyance:"that its needs come last, and that it's loved for what it carries",
          garde:"other people — it looks after everyone and asks for nothing",
          declencheur:"being asked what it needs — it has no answer",
          apaise:"being looked after without having given anything in return" },
        echec:{ label:"A failure that counted",
          croyance:"that a mistake defines you, and you must not get it wrong in public again",
          garde:"image — it over-prepares, or doesn't try",
          declencheur:"an assessment, someone looking at its work, a comparison",
          apaise:"separating what it did from what it's worth" },
        rupture:{ label:"A breakup",
          croyance:"that you can be loved and then not, without having changed",
          garde:"the heart — it commits halfway, or too fast so as not to feel",
          declencheur:"a cooling, a hesitation, a \"we need to talk\"",
          apaise:"steadiness in small things, more than declarations" },
        travail:{ label:"Being let go, or humiliated at work",
          croyance:"that a position is never secure and loyalty doesn't protect you",
          garde:"its usefulness — it overdoes it, or disengages pre-emptively",
          declencheur:"a reorganisation, critical feedback, silence from above",
          apaise:"explicit recognition of what it brings" },
        exil:{ label:"Exile, migration",
          croyance:"that there is a before and an after, and you're never quite from here",
          garde:"belonging — it overdoes it to be accepted, or stays back",
          declencheur:"a remark about where it's from, a social code it doesn't know",
          apaise:"having both worlds acknowledged, without being asked to choose" },
        autre:{ label:"Something else",
          croyance:"something only you can name",
          garde:"whatever was touched at that moment",
          declencheur:"situations that resemble it, even distantly",
          apaise:"being recognised rather than reasoned with" },
      },
    },
    createEyebrow:"Step by step", createTitle:"Your portrait",
    createLead:"A few details are enough. Take the questionnaire, or enter your type directly if you know it.",
    fName:"First and last name", fNamePh:"E.g. Camille Durand", fNameHint:"Your full birth name, for numerology.",
    fDate:"Date of birth",
    fBirthOpt:"Time and place of birth",
    fBirthOptHint:"Optional — but needed to compute your rising sign and moon sign.",
    fTime:"Time of birth", fCity:"City of birth", fCityPh:"Type the first few letters…",
    fManual:"Manual coordinates", fLat:"Latitude", fLon:"Longitude (east +)", fTz:"UTC offset (h)",
    dstNote:"The time zone and summer time are derived from the city and date of birth, historical rules included. With manual coordinates, enter the real offset (including summer time).",
    dstApplied:"Daylight saving time applied automatically.",
    cityLoading:"Loading the city database…",
    cityLoadErr:"City database unavailable — please use manual coordinates.",
    cityHint:"135,000 cities worldwide. Search in English or in the local language (London, Londres).",
    cityNoneYet:"No city above 15,000 inhabitants matches — extending the search to smaller towns…",
    cityNone:"No town found. Pick the nearest city (within 10 km the rising sign is identical), or enter coordinates manually.",
    cityCount:(n)=>`${n} result${n>1?"s":""}`,
    cityChosen:(zone)=>`Time zone: ${zone}`,
    cityClear:"Clear",
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
    placeLabel:"Place", utcShort:"UTC",
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
    ctx:{ couple:"Romantic", amitie:"Friendship", famille:"Family", travail:"Professional" },
    ctxSub:{ couple:"partner, couple", amitie:"close friend", famille:"parent, sibling, child", travail:"colleague, partner" },
    relDimLabel:"Which relationship are you reading?",
    fromSaved:"From my saved profiles",
    submitRelation:"Read the relationship",
    errRelation:"Complete both profiles (name, date and MBTI type) to run the reading.",
    relReadFor:"Relationship reading", resonance:"resonance",
    relDisclaimer:"A resonance, not a verdict: the most alive bonds often grow from well-held differences.",
    relHowTitle:"How to nurture this bond",
    relMirror:{ text:"An argument with this person? What if you looked at the scene from their side, not only yours?", button:"Open the mirror" },

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
      <li><strong>Rising & moon sign</strong> — from time and place, using standard astronomical formulas (Moon ~ Schlyter). Precision is deliberately modest; exact time and time zone strongly affect the rising sign.</li>
      <li><strong>Place & time zone</strong> — 135,000 cities worldwide (GeoNames database). The UTC offset used is the one actually in force <em>on your date of birth</em>: historical daylight-saving rules are taken into account, including those that changed over the decades.</li>
      <li><strong>Life path</strong> — the digits of your date of birth summed, then reduced to a single digit. <strong>Master numbers 11, 22 and 33</strong> are kept: the sum is not reduced before the end, or they would vanish. They are written with their root — 11/2, 22/4, 33/6.</li>
      <li><strong>Expression & soul urge numbers</strong> — the value of your name’s letters (Pythagorean method), the whole name then the vowels.</li>
      <li><strong>MBTI type</strong> — from your questionnaire or your direct entry.</li>
    </ul>
    <h3>Our stance</h3>
    <p>A <strong>genderless</strong> language, with no injunction, no fate. Every portrait names a strength <em>and</em> a growth edge, because a person is never a verdict. Take what resonates, leave the rest.</p>
    <h3>Your data</h3>
    <p>Portraits, relationships, and astronomical calculations run locally, in your browser. Profiles you save stay on your device (local storage).</p>
    <p><strong>One exception</strong>, and it is explicit: in the Mirror, the <em>third reading</em> sends both accounts to an AI model for analysis. Nothing is sent until you tick that both people agree, and the feature is optional — the two-voice mirror works without it. We don’t keep those accounts; they pass through for the length of the analysis.</p>
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
    relLife(a,b,score,ra=a,rb=b){
      if(a===b) return `Same underlying thread (${a}): close values and life rhythm, immediate common ground.`;
      if(ra===rb) return `Same root (${ra}) carried differently (${a} and ${b}): the same ground of values, but one lives it an octave higher — real closeness, uneven intensities.`;
      const diff=Math.abs(ra-rb);
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
