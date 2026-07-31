/* ---------------------------------------------------------------------------
   PRISME — relais d'API pour la médiation du Miroir

   Cloudflare Worker. Son seul rôle : détenir la clé d'API pour que la page
   publique n'ait pas à la contenir. Il valide la requête, appelle l'API
   Anthropic, et renvoie la réponse telle quelle.

   Ce qu'il refuse : un modèle ou des paramètres imposés par le client, un
   corps trop gros, une origine non autorisée. Sans ces vérifications, une clé
   protégée derrière un relais ouvert reste consommable par n'importe qui.

   Déploiement : voir worker/README.md
--------------------------------------------------------------------------- */

const MODEL = "claude-opus-5";
const MAX_TOKENS = 16000;
const MAX_CORPS = 24 * 1024;      // 24 Ko : deux récits, large
const MAX_TEXTE = 12000;          // caractères du message utilisateur

function cors(env, origine){
  const autorisees = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const ok = autorisees.length === 0 || autorisees.includes(origine);
  return {
    ok,
    entetes: {
      "access-control-allow-origin": ok && origine ? origine : (autorisees[0] || "*"),
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
      "vary": "origin",
    },
  };
}

const json = (donnees, statut, entetes) =>
  new Response(JSON.stringify(donnees), {
    status: statut,
    headers: { "content-type": "application/json", ...entetes },
  });

export default {
  async fetch(requete, env) {
    const origine = requete.headers.get("origin") || "";
    const { ok, entetes } = cors(env, origine);

    if(requete.method === "OPTIONS") return new Response(null, { status: 204, headers: entetes });
    if(requete.method !== "POST")    return json({ error: "method_not_allowed" }, 405, entetes);
    if(!ok)                          return json({ error: "origin_not_allowed" }, 403, entetes);
    if(!env.ANTHROPIC_API_KEY)       return json({ error: "server_not_configured" }, 500, entetes);

    const brut = await requete.text();
    if(brut.length > MAX_CORPS) return json({ error: "payload_too_large" }, 413, entetes);

    let recu;
    try { recu = JSON.parse(brut); }
    catch(_){ return json({ error: "invalid_json" }, 400, entetes); }

    // Le client ne choisit ni le modèle ni les limites : on les impose ici.
    // Seuls le system, les messages et le format de sortie sont repris.
    const messages = Array.isArray(recu.messages) ? recu.messages : null;
    if(!messages || !messages.length) return json({ error: "messages_required" }, 400, entetes);

    const taille = messages.reduce((n, m) =>
      n + (typeof m.content === "string" ? m.content.length : JSON.stringify(m.content || "").length), 0);
    if(taille > MAX_TEXTE) return json({ error: "text_too_long" }, 413, entetes);

    const corps = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages,
      ...(typeof recu.system === "string" ? { system: recu.system } : {}),
      ...(recu.output_config && typeof recu.output_config === "object"
            ? { output_config: recu.output_config } : {}),
    };

    let reponse;
    try {
      reponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(corps),
      });
    } catch(e){
      return json({ error: "upstream_unreachable", detail: String(e) }, 502, entetes);
    }

    // On relaie le statut et le corps sans les réinterpréter : le client sait
    // déjà distinguer 401, 429 et le reste.
    return new Response(await reponse.text(), {
      status: reponse.status,
      headers: { "content-type": "application/json", ...entetes },
    });
  },
};
