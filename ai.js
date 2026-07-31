/* ---------------------------------------------------------------------------
   PRISME — les lectures par IA

   Deux usages, un seul transport :

     • mediation(a, b, ctx, lang) — le Miroir. Les deux récits d'un désaccord
       sont envoyés à Claude, qui rend une lecture de tiers : bienveillante mais
       objective, sans donner tort ni raison.
     • reve(reve, lang) — un rêve raconté est relu comme une mise en scène, au
       conditionnel. Aucune prédiction, aucun dictionnaire mécanique.

   ATTENTION — c'est la seule partie du site qui sort du navigateur. Le reste de
   PRISME calcule tout localement ; ici le texte saisi est transmis à l'API
   Anthropic. L'interface le dit explicitement et demande l'accord avant l'envoi.

   Une clé d'API ne peut pas vivre dans une page publique : elle serait lisible
   par n'importe qui. Deux modes, donc :

     • relais   — le site appelle une petite fonction serveur qui détient la
                  clé (voir worker/, à déployer une fois). Mode de production.
     • clé personnelle — la clé est saisie dans le navigateur et reste dans le
                  stockage local de la machine. Pour tester sans rien déployer,
                  ou pour un usage personnel. À ne pas proposer au public.

   Configuration : voir config.js à la racine.
--------------------------------------------------------------------------- */
const PrismeAI = (function(){

  const MODEL   = "claude-opus-5";
  const API_URL = "https://api.anthropic.com/v1/messages";
  const KEY_STORE = "prisme-ai-key";

  /* ---------------- mode disponible ---------------- */
  const endpoint = () => (window.PRISME_AI_ENDPOINT || "").trim();
  const storedKey = () => { try { return localStorage.getItem(KEY_STORE) || ""; } catch(_) { return ""; } };
  function setKey(k){
    try { k ? localStorage.setItem(KEY_STORE, k) : localStorage.removeItem(KEY_STORE); } catch(_){}
  }
  /* « relais » si un endpoint est configuré, sinon « cle » si l'utilisateur en
     a saisi une, sinon « aucun » — l'interface propose alors la saisie. */
  function mode(){
    if(endpoint()) return "relais";
    if(storedKey()) return "cle";
    return "aucun";
  }

  /* ---------------- forme de la réponse attendue ----------------
     Un schéma JSON strict : le modèle est contraint de répondre dans cette
     structure, donc l'affichage n'a jamais à deviner ni à parser du texte. */
  const PERSONNE = {
    type: "object",
    properties: {
      nom:       { type: "string", description: "Le prénom de la personne, tel qu'il a été donné." },
      entend:    { type: "string", description: "Ce que cette personne dit vraiment, sous ses mots. Deux ou trois phrases." },
      besoin:    { type: "string", description: "Le besoin non formulé qui se tient dessous. Une phrase." },
      angleMort: { type: "string", description: "Ce que cette personne ne voit pas de la position de l'autre. Dit avec franchise et sans dureté. Une ou deux phrases." },
    },
    required: ["nom", "entend", "besoin", "angleMort"],
    additionalProperties: false,
  };
  const PHRASE = {
    type: "object",
    properties: {
      nom:    { type: "string" },
      phrase: { type: "string", description: "Une phrase que cette personne pourrait dire à l'autre, à la première personne." },
    },
    required: ["nom", "phrase"],
    additionalProperties: false,
  };
  const SCHEMA_MEDIATION = {
    type: "object",
    properties: {
      alerte: {
        type: "string",
        enum: ["aucune", "vigilance", "danger"],
        description: "danger si les récits décrivent des violences, des menaces, de la contrainte ou de la peur ; vigilance si un déséquilibre marqué de pouvoir apparaît ; aucune sinon.",
      },
      alerteTexte: { type: "string", description: "Vide si alerte vaut aucune. Sinon, ce qu'il faut dire — sans médiation symétrique." },
      resume:  { type: "string", description: "Ce qui s'est passé, en termes factuels et neutres, à partir des deux récits. Trois ou quatre phrases." },
      noeud:   { type: "string", description: "Le malentendu réel — l'endroit précis où les deux lectures divergent. C'est le cœur de l'analyse." },
      chacun:  { type: "array", items: PERSONNE, minItems: 2, maxItems: 2 },
      accords: { type: "array", items: { type: "string" }, description: "Ce sur quoi ils sont déjà d'accord sans le voir. Deux à quatre points." },
      pistes:  { type: "array", items: { type: "string" }, description: "Deux à quatre pas concrets et faisables, pas des conseils généraux." },
      aDire:   { type: "array", items: PHRASE, minItems: 2, maxItems: 2 },
    },
    required: ["alerte", "alerteTexte", "resume", "noeud", "chacun", "accords", "pistes", "aDire"],
    additionalProperties: false,
  };

  /* ---------------- consigne au modèle ---------------- */
  const CONSIGNE_MEDIATION = {
    fr: `Tu es un tiers de médiation. Deux personnes ont décrit le même désaccord, chacune de son côté, sans lire ce que l'autre a écrit. Tu es le seul à voir les deux versions.

Ton travail n'est pas de départager. Il est de rendre lisible ce que chacun ne peut pas voir depuis sa place.

Comment tu travailles :
— Bienveillant, mais objectif. La bienveillance n'est pas la complaisance : si l'un des deux se trompe sur les intentions de l'autre, tu le dis, avec ménagement mais sans détour.
— Aucun camp. Pas de tort, pas de raison, pas de verdict. Si une responsabilité est partagée, tu la nommes des deux côtés.
— Tu ne t'appuies que sur ce qui est écrit. Tu n'inventes ni faits, ni antécédents, ni intentions. Si un élément manque pour comprendre, tu le signales plutôt que de le combler.
— Pas de diagnostic psychologique, pas d'étiquette de personnalité, pas de pronostic sur le couple ou la relation.
— Tu parles d'eux à la troisième personne, par leur prénom, puisque les deux liront ce texte. Français simple et direct, sans jargon de thérapie.
— Le « nœud » est la partie la plus importante : cherche l'endroit précis où les deux lectures d'un même fait divergent, pas une généralité sur la communication.

Sécurité — priorité absolue : si les récits font apparaître des violences physiques, des menaces, de la contrainte, de la peur d'une des deux personnes, un contrôle des ressources ou de l'entourage, alors la médiation à deux voix n'est pas l'outil approprié et la symétrie serait nuisible. Mets alerte sur « danger », et écris dans alerteTexte ce qu'il faut dire à la personne concernée, y compris l'orientation vers un professionnel ou un service d'aide. Dans ce cas les autres champs restent brefs et ne renvoient pas les deux dos à dos.`,

    en: `You are a third-party mediator. Two people have described the same disagreement, each on their own, without reading what the other wrote. You are the only one who sees both versions.

Your job is not to decide who is right. It is to make visible what neither can see from where they stand.

How you work:
— Kind, but objective. Kindness is not indulgence: if one of them is wrong about the other's intentions, say so — gently, but plainly.
— No side. No blame, no vindication, no verdict. Where responsibility is shared, name it on both sides.
— Rely only on what is written. Invent no facts, no history, no intentions. If something is missing, flag the gap rather than filling it.
— No psychological diagnosis, no personality labels, no prediction about the relationship.
— Refer to them in the third person by first name, since both will read this. Plain, direct English, no therapy jargon.
— The "knot" is the most important part: find the precise point where two readings of the same event diverge, not a generality about communication.

Safety — absolute priority: if the accounts reveal physical violence, threats, coercion, fear on either side, or control over money or contacts, then two-voice mediation is the wrong tool and symmetry would be harmful. Set alerte to "danger" and write in alerteTexte what needs to be said to the person concerned, including a pointer to a professional or a support service. In that case keep the other fields brief and do not place the two on equal footing.`,
  };

  /* Contexte de la relation, pour situer la lecture. */
  const CTX = {
    fr: { couple:"un couple", famille:"une famille", travail:"une relation de travail", amitie:"une amitié" },
    en: { couple:"a couple", famille:"a family", travail:"a working relationship", amitie:"a friendship" },
  };

  function bloc(p, lang){
    const L = lang === "en"
      ? { recit:"What happened, in their words", ressenti:"What they felt", besoin:"What they needed", autre:"What they think the other felt", rien:"(not filled in)" }
      : { recit:"Ce qui s'est passé, dans ses mots", ressenti:"Ce qu'iel a ressenti", besoin:"Ce dont iel avait besoin", autre:"Ce qu'iel imagine que l'autre a ressenti", rien:"(non renseigné)" };
    const v = (s) => (s && s.trim()) ? s.trim() : L.rien;
    return `### ${p.name}\n`
      + `${L.recit} : ${v(p.recit)}\n`
      + `${L.ressenti} : ${v(p.ressenti)}\n`
      + `${L.besoin} : ${v(p.besoin)}\n`
      + `${L.autre} : ${v(p.autre)}`;
  }

  /* L'histoire de vie, si elle est jointe : elle explique pourquoi une phrase
     anodine touche si fort. Transmise seulement sur demande explicite. */
  function blocHistoire(a, b, lang){
    if(!a.histoire && !b.histoire) return "";
    const L = lang === "en"
      ? { t:"Life history each person recorded (age : what happened). Use it to explain why a given sentence lands so hard — never as a diagnosis, and never to excuse a behaviour.", none:"(not filled in)" }
      : { t:"Histoire de vie que chacun a renseignée (âge : ce qui est arrivé). Sers-t'en pour expliquer pourquoi telle phrase touche si fort — jamais comme un diagnostic, jamais pour excuser un comportement.", none:"(non renseignée)" };
    return `\n\n## ${L.t}\n\n### ${a.name}\n${a.histoire || L.none}\n\n### ${b.name}\n${b.histoire || L.none}`;
  }

  function requeteMediation(a, b, ctx, lang){
    const relation = (CTX[lang] || CTX.fr)[ctx] || (CTX[lang] || CTX.fr).couple;
    const intro = lang === "en"
      ? `Context: ${relation}. Here are the two accounts.`
      : `Contexte : ${relation}. Voici les deux récits.`;
    return {
      model: MODEL,
      max_tokens: 16000,
      system: (CONSIGNE_MEDIATION[lang] || CONSIGNE_MEDIATION.fr),
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: SCHEMA_MEDIATION },
      },
      messages: [{ role: "user",
        content: `${intro}\n\n${bloc(a, lang)}\n\n${bloc(b, lang)}${blocHistoire(a, b, lang)}` }],
    };
  }

  /* ---------------- appel ---------------- */
  function erreur(code, detail){
    const e = new Error(detail || code);
    e.code = code;
    return e;
  }

  async function envoyer(corps){
    const url = endpoint();
    let reponse;
    try {
      if(url){
        // Relais : la clé reste côté serveur, le navigateur ne la voit jamais.
        reponse = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(corps),
        });
      } else {
        const cle = storedKey();
        if(!cle) throw erreur("config");
        reponse = await fetch(API_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": cle,
            "anthropic-version": "2023-06-01",
            // requis pour appeler l'API directement depuis une page web
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify(corps),
        });
      }
    } catch(e){
      if(e.code) throw e;
      throw erreur("reseau", e.message);
    }

    if(!reponse.ok){
      const txt = await reponse.text().catch(()=> "");
      if(reponse.status === 401 || reponse.status === 403) throw erreur("cle", txt);
      if(reponse.status === 429) throw erreur("quota", txt);
      throw erreur("api", `${reponse.status} ${txt.slice(0,300)}`);
    }
    return reponse.json();
  }

  /* Extrait l'objet JSON du message. Avec output_config.format, le premier
     bloc de texte contient exactement le JSON attendu. */
  function lire(message){
    if(message && message.stop_reason === "refusal") throw erreur("refus");
    const blocs = (message && message.content) || [];
    const texte = blocs.filter(b => b.type === "text").map(b => b.text).join("");
    if(!texte) throw erreur("vide");
    try { return JSON.parse(texte); }
    catch(_){ throw erreur("format", texte.slice(0, 300)); }
  }

  /* Rend la médiation pour deux récits. a et b : { name, recit, ressenti, besoin, autre }. */
  async function mediation(a, b, ctx, lang){
    return lire(await envoyer(requeteMediation(a, b, ctx, lang || "fr")));
  }

  /* ---------------- lecture d'un rêve ----------------
     Un rêve n'annonce rien. Ce qu'on peut en dire, c'est ce qu'il met en scène
     et la question qu'il pose — au conditionnel, et rien de plus. */
  const IMAGE = {
    type: "object",
    properties: {
      image:   { type: "string", description: "L'image du rêve, telle qu'elle a été racontée. Quelques mots." },
      lecture: { type: "string", description: "Ce que cette image pourrait mettre en scène. Au conditionnel. Deux phrases au plus." },
    },
    required: ["image", "lecture"],
    additionalProperties: false,
  };
  const SCHEMA_REVE = {
    type: "object",
    properties: {
      alerte: {
        type: "string",
        enum: ["aucune", "vigilance"],
        description: "vigilance si le rêve rejoue un traumatisme, revient à l'identique de façon envahissante, ou contient des idées de mort dirigées contre soi ; aucune sinon.",
      },
      alerteTexte: { type: "string", description: "Vide si alerte vaut aucune. Sinon, ce qu'il faut dire, avec une orientation vers un professionnel." },
      resume:  { type: "string", description: "Le rêve reformulé en termes neutres, sans interprétation. Deux ou trois phrases." },
      scene:   { type: "string", description: "Ce que le rêve met en scène : la situation, pas le symbole. C'est le cœur de la lecture." },
      images:  { type: "array", items: IMAGE, minItems: 2, maxItems: 4 },
      tension: { type: "string", description: "Le conflit ou le manque que la scène rejoue. Une ou deux phrases." },
      questions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3,
        description: "Trois questions à se poser au réveil. Ouvertes, précises, sans réponse suggérée." },
      garde:   { type: "string", description: "Ce qu'il ne faut PAS conclure de ce rêve. Une phrase, ferme." },
    },
    required: ["alerte", "alerteTexte", "resume", "scene", "images", "tension", "questions", "garde"],
    additionalProperties: false,
  };

  const CONSIGNE_REVE = {
    fr: `Vous relisez un rêve que quelqu'un vient de raconter. Cette personne lira votre texte.

Un rêve n'annonce rien et ne se décode pas avec un dictionnaire. Ce qu'on peut en dire, c'est ce qu'il met en scène, et la question qu'il pose au réveil.

Comment vous travaillez :
— Au conditionnel, toujours. « Cette image pourrait mettre en scène… », jamais « cela signifie que… ». Vous proposez des hypothèses, la personne tranche.
— Vous ne vous appuyez que sur ce qui est raconté. Vous n'inventez ni personnage, ni passé, ni détail absent du récit. Si le récit est trop mince pour dire quelque chose, vous le dites plutôt que de broder.
— Aucune prédiction, aucun présage, aucune correspondance fixe entre une image et un sens. Un serpent n'est pas « la trahison » ; dans ce rêve-ci, il fait quelque chose de précis.
— Pas de diagnostic psychologique, pas d'étiquette, pas de verdict sur la vie de la personne.
— La scène compte plus que les symboles : cherchez la situation que le rêve rejoue — être poursuivi sans pouvoir crier, arriver trop tard, chercher une pièce qui n'existe pas — avant de commenter les objets.
— Vous vouvoyez la personne. Français simple, sans jargon d'analyse.
— « garde » est obligatoire et sert de garde-fou : dites ce qu'il ne faut surtout pas conclure de ce rêve.

Sécurité : si le rêve rejoue à l'identique un événement traumatique, revient de façon envahissante nuit après nuit, ou contient des idées de mort dirigées contre soi, mettez alerte sur « vigilance » et écrivez dans alerteTexte qu'un rêve qui insiste ainsi se travaille avec un professionnel, pas seul devant un écran.`,

    en: `You are re-reading a dream someone has just recounted. That person will read your text.

A dream announces nothing and cannot be decoded with a dictionary. What can be said of it is what it stages, and the question it leaves on waking.

How you work:
— Always in the conditional. "This image could be staging…", never "this means that…". You offer hypotheses; the person decides.
— Rely only on what is recounted. Invent no character, no past, no detail absent from the account. If the account is too thin to say anything, say so rather than embroider.
— No prediction, no omen, no fixed correspondence between an image and a meaning. A snake is not "betrayal"; in this dream, it is doing something specific.
— No psychological diagnosis, no labels, no verdict on the person's life.
— The scene matters more than the symbols: look for the situation the dream re-enacts — being chased unable to shout, arriving too late, searching for a room that doesn't exist — before commenting on objects.
— Plain, direct English, no analytic jargon.
— "garde" is required and acts as a guardrail: say what must not be concluded from this dream.

Safety: if the dream re-enacts a traumatic event unchanged, returns intrusively night after night, or contains thoughts of death directed at oneself, set alerte to "vigilance" and write in alerteTexte that a dream insisting like this is worked through with a professional, not alone in front of a screen.`,
  };

  /* reve : { texte, date, emotion, tags, recurrent } — seuls texte et emotion
     sont vraiment utiles au modèle, le reste situe le rêve. */
  function requeteReve(reve, lang){
    const L = lang === "en"
      ? { intro:"Here is the dream, as it was written down.", quand:"Night of", ressenti:"Felt on waking",
          tags:"The person marked this dream as", rien:"(not filled in)" }
      : { intro:"Voici le rêve, tel qu'il a été noté.", quand:"Nuit du", ressenti:"Ressenti au réveil",
          tags:"La personne a marqué ce rêve comme", rien:"(non renseigné)" };
    const bouts = [L.intro, "", reve.texte.trim()];
    if(reve.date)    bouts.push("", `${L.quand} : ${reve.date}`);
    if(reve.emotion) bouts.push(`${L.ressenti} : ${reve.emotion}`);
    if(reve.tags && reve.tags.length) bouts.push(`${L.tags} : ${reve.tags.join(", ")}`);
    return {
      model: MODEL,
      max_tokens: 16000,
      system: (CONSIGNE_REVE[lang] || CONSIGNE_REVE.fr),
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: SCHEMA_REVE },
      },
      messages: [{ role: "user", content: bouts.join("\n") }],
    };
  }

  async function reve(r, lang){
    return lire(await envoyer(requeteReve(r, lang || "fr")));
  }

  return { mode, mediation, reve, setKey, hasKey: () => !!storedKey(), MODEL };
})();
