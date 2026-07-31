/* ---------------------------------------------------------------------------
   PRISME — le thème natal

   Les dix corps du thème, leur signe, leur degré et leur maison ; les aspects
   qu'ils forment entre eux ; et — tout aussi parlant — ce qui manque : les
   éléments et les modalités qu'aucune planète n'occupe, les maisons vides, et
   les planètes qui n'aspectent personne.

   Maisons égales, à partir de l'Ascendant. C'est un choix, et il vaut d'être
   dit : Placidus est plus répandu, mais il s'effondre au-delà des cercles
   polaires et demande une résolution itérative dont l'erreur passerait
   inaperçue. Les maisons égales sont exactes partout, et le Milieu du Ciel est
   affiché à part plutôt que confondu avec la dixième cuspide.

   Dépend de astro.js (Lune, Ascendant) et de transits.js (planètes).
--------------------------------------------------------------------------- */
const Natal = (function(){

  const CORPS = ["soleil","lune","mercure","venus","mars","jupiter","saturne","uranus","neptune","pluton"];
  /* Les luminaires et les planètes rapides parlent de la personne ; les lentes
     parlent d'abord d'une génération. La distinction sert la lecture en creux :
     une absence d'élément ne pèse pas pareil selon qui la cause. */
  const PERSO = new Set(["soleil","lune","mercure","venus","mars"]);

  const SIGNES = ["belier","taureau","gemeaux","cancer","lion","vierge",
                  "balance","scorpion","sagittaire","capricorne","verseau","poissons"];
  const ELEMENTS = { belier:"feu", lion:"feu", sagittaire:"feu",
                     taureau:"terre", vierge:"terre", capricorne:"terre",
                     gemeaux:"air", balance:"air", verseau:"air",
                     cancer:"eau", scorpion:"eau", poissons:"eau" };
  const MODALITES = { belier:"cardinal", cancer:"cardinal", balance:"cardinal", capricorne:"cardinal",
                      taureau:"fixe", lion:"fixe", scorpion:"fixe", verseau:"fixe",
                      gemeaux:"mutable", vierge:"mutable", sagittaire:"mutable", poissons:"mutable" };

  const ASPECTS = [
    { cle:"conjonction", angle:0,   orbe:8 },
    { cle:"opposition",  angle:180, orbe:8 },
    { cle:"trigone",     angle:120, orbe:7 },
    { cle:"carre",       angle:90,  orbe:6 },
    { cle:"sextile",     angle:60,  orbe:4 },
  ];

  const rev360 = x => ((x % 360) + 360) % 360;
  const ecartAngle = (a, b) => { const d = Math.abs(rev360(a - b)); return d > 180 ? 360 - d : d; };

  /* Le Milieu du Ciel : la longitude écliptique du méridien. Même temps sidéral
     que l'ascendant, sans le terme de latitude — d'où un calcul plus court. */
  function milieuDuCiel(jd, lonEst){
    const T = (jd - 2451545) / 36525;
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545)
             + 0.000387933 * T * T - (T * T * T) / 38710000;
    const lst = rev360(gmst + lonEst);
    const obl = 23.4392911 - 0.0130042 * T;
    const r = Math.PI / 180;
    let mc = Math.atan2(Math.tan(lst * r), Math.cos(obl * r)) / r;
    mc = rev360(mc);
    // atan2 ramène sur une demi-tour : on remet le MC dans le bon hémisphère
    if(Math.abs(rev360(mc - lst)) > 90 && Math.abs(rev360(mc - lst)) < 270) mc = rev360(mc + 180);
    return mc;
  }

  /* Maisons égales : la première commence exactement sur l'Ascendant. */
  function maisonDe(lon, asc){ return Math.floor(rev360(lon - asc) / 30) + 1; }

  /* Le thème complet. birth : { time, lat, lon, tz } ; date : "AAAA-MM-JJ". */
  function theme(dateStr, birth){
    if(!birth || !birth.time || birth.lat == null || birth.lon == null || birth.tz == null) return null;
    const [Y, M, D] = dateStr.split("-").map(Number);
    const [hh, mm] = birth.time.split(":").map(Number);
    const ut = hh + mm / 60 - birth.tz;
    const jd = julianDay(Y, M, D, ut);

    const asc = ascendantLongitude(jd, birth.lat, birth.lon);
    const mc  = milieuDuCiel(jd, birth.lon);

    const corps = CORPS.map(nom => {
      const lon = nom === "soleil" ? sunLongitude(jd)
                : nom === "lune"   ? moonLongitude(jd)
                : planetLongitude(nom, jd);
      // la Lune ne rétrograde jamais ; le Soleil non plus
      const retro = PERSO.has(nom) && nom !== "soleil" && nom !== "lune"
                    ? vitesse(nom, jd) < 0
                    : (nom === "soleil" || nom === "lune" ? false : vitesse(nom, jd) < 0);
      const signe = SIGNES[Math.floor(rev360(lon) / 30)];
      return {
        nom, lon: rev360(lon), retro,
        signe, degre: Math.floor(rev360(lon) % 30),
        maison: maisonDe(lon, asc),
        element: ELEMENTS[signe], modalite: MODALITES[signe],
        perso: PERSO.has(nom),
      };
    });

    /* Aspects entre corps : on garde le plus serré par paire. */
    const aspects = [];
    for(let i = 0; i < corps.length; i++){
      for(let j = i + 1; j < corps.length; j++){
        const d = ecartAngle(corps[i].lon, corps[j].lon);
        let meilleur = null;
        for(const a of ASPECTS){
          const orbe = Math.abs(d - a.angle);
          if(orbe <= a.orbe && (!meilleur || orbe < meilleur.orbe))
            meilleur = { cle:a.cle, orbe:+orbe.toFixed(1) };
        }
        if(meilleur) aspects.push({ a:corps[i].nom, b:corps[j].nom, ...meilleur,
                                    exact: meilleur.orbe <= 1 });
      }
    }
    aspects.sort((x, y) => x.orbe - y.orbe);

    /* ---- la lecture en creux ---- */
    const compte = (cle) => {
      const n = {};
      corps.forEach(c => { n[c[cle]] = (n[c[cle]] || 0) + 1; });
      return n;
    };
    const parElement = compte("element"), parModalite = compte("modalite");
    const maisonsPleines = new Set(corps.map(c => c.maison));
    const aspectes = new Set();
    aspects.forEach(a => { aspectes.add(a.a); aspectes.add(a.b); });

    const absences = {
      elements: ["feu","terre","air","eau"].filter(e => !parElement[e]),
      modalites: ["cardinal","fixe","mutable"].filter(m => !parModalite[m]),
      maisons: Array.from({ length:12 }, (_, i) => i + 1).filter(h => !maisonsPleines.has(h)),
      solitaires: corps.filter(c => !aspectes.has(c.nom)).map(c => c.nom),
      /* Un élément tenu par une seule planète est presque une absence : on le
         signale à part plutôt que de le compter comme présent. */
      tenus: ["feu","terre","air","eau"].filter(e => parElement[e] === 1)
              .map(e => ({ element:e, par: corps.find(c => c.element === e).nom })),
    };

    return { jd, asc, mc, corps, aspects, absences,
             parElement, parModalite,
             ascSigne: SIGNES[Math.floor(rev360(asc) / 30)],
             ascDegre: Math.floor(rev360(asc) % 30),
             mcSigne:  SIGNES[Math.floor(rev360(mc) / 30)],
             mcDegre:  Math.floor(rev360(mc) % 30) };
  }

  return { theme, CORPS, SIGNES, ELEMENTS, MODALITES, maisonDe, ecartAngle, rev360 };
})();
