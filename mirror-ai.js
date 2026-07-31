/* ---------------------------------------------------------------------------
   PRISME — Médiation par IA de la section Miroir

   Les deux récits sont envoyés à Claude, qui rend une lecture de tiers :
   bienveillante mais objective, sans donner tort ni raison.

   ATTENTION — c'est la seule partie du site qui sort du navigateur. Le reste
   de PRISME calcule tout localement ; ici les deux textes sont transmis à
   l'API Anthropic. L'interface le dit explicitement et demande l'accord des
   deux personnes avant l'envoi.

   Une clé d'API ne peut pas vivre dans une page publique : elle serait lisible
   par n'importe qui. Deux modes, donc :

     • relais   — le site appelle une petite fonction serveur qui détient la
                  clé (voir worker/, à déployer une fois). Mode de production.
     • clé personnelle — la clé est saisie dans le navigateur et reste dans le
                  stockage local de la machine. Pour tester sans rien déployer,
                  ou pour un usage personnel. À ne pas proposer au public.

   Configuration : voir config.js à la racine.
--------------------------------------------------------------------------- */
const MirrorAI = (function(){

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
  const SCHEMA = {
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
  const CONSIGNE = {
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

  function requete(a, b, ctx, lang){
    const relation = (CTX[lang] || CTX.fr)[ctx] || (CTX[lang] || CTX.fr).couple;
    const intro = lang === "en"
      ? `Context: ${relation}. Here are the two accounts.`
      : `Contexte : ${relation}. Voici les deux récits.`;
    return {
      model: MODEL,
      max_tokens: 16000,
      system: (CONSIGNE[lang] || CONSIGNE.fr),
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: [{ role: "user", content: `${intro}\n\n${bloc(a, lang)}\n\n${bloc(b, lang)}` }],
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
  async function analyse(a, b, ctx, lang){
    return lire(await envoyer(requete(a, b, ctx, lang || "fr")));
  }

  return { mode, analyse, setKey, hasKey: () => !!storedKey(), MODEL };
})();
