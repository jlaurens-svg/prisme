/* ---------------------------------------------------------------------------
   PRISME — Lieux de naissance
   Recherche dans la base mondiale GeoNames et conversion heure locale → UT.

   Deux paliers, chargés seulement quand on en a besoin :
     cities-data.js    24 323 villes de 15 000 habitants et plus  (~277 Ko gzip)
     cities-extra.js  110 910 communes plus petites               (~1,1 Mo gzip)
   Le second palier n'est téléchargé que si la recherche ne donne rien dans le
   premier — la plupart des visites ne le chargent jamais.

   Aucune requête vers un service tiers : les fichiers viennent du même domaine
   et tout le calcul reste dans le navigateur.
--------------------------------------------------------------------------- */
const Geo = (function(){

  const PLAIN = /^[a-zA-Z0-9 ]*$/;
  /* Clé de recherche : sans accents, minuscules, ponctuation ramenée à l'espace.
     Noms et saisies passent par la même normalisation, pour que « saint-denis »
     et « Saint Denis » se rejoignent. Voie rapide quand il n'y a rien à faire
     d'autre que passer en minuscules — le cas de la plupart des noms. */
  function normKey(s){
    if(PLAIN.test(s)) return s.toLowerCase();
    return s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()
            .replace(/[^a-z0-9]+/g," ").trim();
  }
  const normQuery = normKey;
  /* Abréviations d'usage dans les noms de lieux. */
  const SHORTHAND = [[/\bst\b/g, "saint"], [/\bste\b/g, "sainte"], [/\bmt\b/g, "mount"]];

  let tier1 = [], tier2 = [];
  let meta = null;                       // { tz, countries, aliases }
  const pending = {};                    // promesses de chargement en cours

  /* ---------------- chargement des paliers ---------------- */
  function loadScript(src, readyEvent, isDone){
    if(isDone()) return Promise.resolve();
    if(pending[src]) return pending[src];
    pending[src] = new Promise((resolve, reject) => {
      const done = () => { if(isDone()) resolve(); else reject(new Error("données absentes : "+src)); };
      window.addEventListener(readyEvent, done, { once:true });
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onerror = () => reject(new Error("téléchargement impossible : "+src));
      document.head.appendChild(s);
    });
    pending[src].catch(()=>{ delete pending[src]; });   // réessai possible
    return pending[src];
  }

  /* Décode le format compact : en-têtes « @CC » puis nom|admin|lat|lon|tz|rang. */
  function parseRows(rows){
    const out = [];
    let cc = null;
    for(const line of rows.split("\n")){
      if(line.charCodeAt(0) === 64){ cc = line.slice(1); continue; }   // 64 = '@'
      const f = line.split("|");
      out.push({
        n: f[0], cc, a: f[1],
        lat: parseInt(f[2],36) / 100,
        lon: parseInt(f[3],36) / 100,
        tzi: parseInt(f[4],36),
        rank: parseInt(f[5],36),
        k: normKey(f[0]),
      });
    }
    return out;
  }

  const ready      = () => tier1.length > 0;
  const readyExtra = () => tier2.length > 0;

  function ensure(){
    return loadScript("cities-data.js", "prisme-cities-ready", () => !!window.CITY_DATA)
      .then(() => { if(!ready()){ meta = window.CITY_DATA; tier1 = parseRows(meta.rows); } });
  }
  function ensureExtra(){
    return ensure()
      .then(() => loadScript("cities-extra.js", "prisme-cities-extra-ready", () => !!window.CITY_DATA_EXTRA))
      .then(() => { if(!readyExtra()) tier2 = parseRows(window.CITY_DATA_EXTRA); });
  }

  /* ---------------- recherche ---------------- */
  /* Score : plus bas = meilleur. Nom exact, puis début de nom, puis début d'un
     mot du nom, puis n'importe où dans le nom. */
  function scoreOf(key, q){
    if(key === q) return 0;
    if(key.startsWith(q)) return 1;
    const at = key.indexOf(q);
    if(at < 0) return -1;
    return /[^a-z0-9]/.test(key[at-1] || "") ? 2 : 3;
  }

  /* Les exonymes français ne figurent pas dans GeoNames (« Londres » → London).
     On ajoute donc la cible de tout alias dont la clé commence par la saisie. */
  function expand(q){
    const terms = [q];
    const add = (t) => { if(t && terms.indexOf(t) < 0) terms.push(t); };
    for(const [re, full] of SHORTHAND) add(q.replace(re, full));
    if(!meta) return terms;
    const exact = meta.aliases[q];
    if(exact) add(exact);
    else for(const key in meta.aliases) if(key.startsWith(q)) add(meta.aliases[key]);
    return terms;
  }

  function searchIn(list, terms, hits, seen){
    for(let i = 0; i < list.length; i++){
      const c = list[i];
      let best = -1;
      for(const q of terms){
        const s = scoreOf(c.k, q);
        if(s >= 0 && (best < 0 || s < best)) best = s;
      }
      if(best < 0) continue;
      const id = c.cc + "|" + c.n + "|" + c.lat + "|" + c.lon;
      if(seen.has(id)) continue;
      seen.add(id);
      hits.push({ c, s: best });
    }
  }

  /* Renvoie au plus `limit` villes, classées par qualité de correspondance puis
     par population. Ne cherche que dans les paliers déjà chargés. */
  function search(input, limit){
    limit = limit || 40;
    const q = normQuery(input);
    if(!q || !ready()) return [];
    const terms = expand(q);
    const hits = [], seen = new Set();
    searchIn(tier1, terms, hits, seen);
    if(readyExtra()) searchIn(tier2, terms, hits, seen);
    hits.sort((x, y) => x.s - y.s || y.c.rank - x.c.rank || x.c.n.localeCompare(y.c.n));
    return hits.slice(0, limit).map(h => h.c);
  }

  /* ---------------- libellés ---------------- */
  function countryName(cc, lang){
    const e = meta && meta.countries[cc];
    return e ? (lang === "en" ? e[1] : e[0]) : cc;
  }
  /* « Lima · Pérou » ou, si le nom est ambigu dans le pays, « Paris (TX) · États-Unis ». */
  function label(c, lang){
    return c.n + (c.a ? " (" + c.a + ")" : "") + " · " + countryName(c.cc, lang);
  }
  /* Forme conservée dans un profil : on fige les deux langues, pour que le lieu
     suive la bascule FR/EN même si la base n'est plus chargée (profil rouvert). */
  function ref(c){
    return { n: c.n, a: c.a, fr: countryName(c.cc, "fr"), en: countryName(c.cc, "en") };
  }
  /* Libellé d'un lieu enregistré. Accepte aussi l'ancien format (simple chaîne). */
  function refLabel(place, lang){
    if(!place) return "";
    if(typeof place === "string") return place === "—" ? "" : place;
    return place.n + (place.a ? " (" + place.a + ")" : "") + " · " + (lang === "en" ? place.en : place.fr);
  }
  const zoneName = (c) => (meta ? meta.tz[c.tzi] : null);

  /* ---------------- heure locale → décalage UTC ----------------
     On lit le décalage réel du fuseau IANA à la date de naissance, via la base
     tzdata du navigateur : les règles historiques (heure d'été variable selon
     les années, changements de fuseau) sont donc prises en compte, là où une
     règle « dernier dimanche de mars » ne vaut que pour l'époque récente. */
  const dtfCache = {};
  function dtf(tz){
    if(!dtfCache[tz]) dtfCache[tz] = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23",
      year:"numeric", month:"2-digit", day:"2-digit",
      hour:"2-digit", minute:"2-digit", second:"2-digit",
    });
    return dtfCache[tz];
  }
  function utcAt(y, mo, d, hh, mm){
    const ms = Date.UTC(2000, mo-1, d, hh, mm, 0);
    const dt = new Date(ms);
    dt.setUTCFullYear(y);            // évite l'interprétation 19xx des années < 100
    return dt.getTime();
  }
  /* Décalage du fuseau à un instant UTC donné, en heures. */
  function offsetAtInstant(tz, ms){
    const p = {};
    for(const part of dtf(tz).formatToParts(ms)) p[part.type] = part.value;
    const local = utcAt(+p.year, +p.month, +p.day, +p.hour % 24, +p.minute);
    return (local + (+p.second) * 1000 - ms) / 3600000;
  }
  /* Décalage applicable à une heure *locale*. Deux passes : l'heure locale ne
     détermine pas directement l'instant, il faut corriger le premier essai. */
  function offsetForLocal(tz, y, mo, d, hh, mm){
    const guess = utcAt(y, mo, d, hh, mm);
    const first = offsetAtInstant(tz, guess);
    return offsetAtInstant(tz, guess - first * 3600000);
  }

  /* Décalage UTC d'une naissance. dateStr = "AAAA-MM-JJ", time = "HH:MM".
     Renvoie { tz, dst, zone } — dst indique une heure d'été effective, pour
     pouvoir le signaler dans le profil. En cas de fuseau inconnu du navigateur,
     repli sur la longitude (15° = 1 h). */
  function birthOffset(zone, dateStr, time, lon){
    const [y, mo, d] = dateStr.split("-").map(Number);
    const [hh, mm]   = time.split(":").map(Number);
    try {
      const off = offsetForLocal(zone, y, mo, d, hh, mm);
      // heure d'été = décalage supérieur au minimum de l'année (marche aussi
      // dans l'hémisphère sud, où l'été est à cheval sur le nouvel an)
      const jan = offsetForLocal(zone, y, 1, 15, 12, 0);
      const jul = offsetForLocal(zone, y, 7, 15, 12, 0);
      return { tz: off, dst: off > Math.min(jan, jul), zone };
    } catch(e) {
      return { tz: Math.round(lon / 15), dst: false, zone: null };
    }
  }

  return { ensure, ensureExtra, ready, readyExtra, search, label, ref, refLabel,
           countryName, zoneName, birthOffset, normQuery };
})();
