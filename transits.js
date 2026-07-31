/* ============================================================
   PRISME — le ciel du moment
   Positions des planètes et détection des rétrogradations,
   calculées localement (méthode Schlyter, comme la Lune).

   Une rétrogradation n'est pas un recul réel : vue de la Terre, la
   planète semble revenir en arrière parce que nous la dépassons sur
   notre orbite. On la détecte donc sur le signe de la variation de
   longitude géocentrique d'un jour sur l'autre — robuste, là où la
   position absolue n'est précise qu'à quelques minutes d'arc.
   ============================================================ */

const T_DEG = Math.PI / 180;
const trev  = x => ((x % 360) + 360) % 360;
const trad  = x => x * T_DEG;
const tdeg  = x => x / T_DEG;
const tsin  = x => Math.sin(trad(x));
const tcos  = x => Math.cos(trad(x));

/* Éléments orbitaux, d = jours depuis le 31/12/1999 00:00 UT */
const ORBITES = {
  mercure: d => ({ N: 48.3313 + 3.24587e-5*d, i: 7.0047 + 5.00e-8*d,  w: 29.1241 + 1.01444e-5*d,
                   a: 0.387098,               e: 0.205635 + 5.59e-10*d, M: 168.6562 + 4.0923344368*d }),
  venus:   d => ({ N: 76.6799 + 2.46590e-5*d, i: 3.3946 + 2.75e-8*d,  w: 54.8910 + 1.38374e-5*d,
                   a: 0.723330,               e: 0.006773 - 1.302e-9*d, M: 48.0052 + 1.6021302244*d }),
  mars:    d => ({ N: 49.5574 + 2.11081e-5*d, i: 1.8497 - 1.78e-8*d,  w: 286.5016 + 2.92961e-5*d,
                   a: 1.523688,               e: 0.093405 + 2.516e-9*d, M: 18.6021 + 0.5240207766*d }),
  jupiter: d => ({ N: 100.4542 + 2.76854e-5*d, i: 1.3030 - 1.557e-7*d, w: 273.8777 + 1.64505e-5*d,
                   a: 5.20256,                e: 0.048498 + 4.469e-9*d, M: 19.8950 + 0.0830853001*d }),
  saturne: d => ({ N: 113.6634 + 2.38980e-5*d, i: 2.4886 - 1.081e-7*d, w: 339.3939 + 2.97661e-5*d,
                   a: 9.55475,                e: 0.055546 - 9.499e-9*d, M: 316.9670 + 0.0334442282*d }),
  uranus:  d => ({ N: 74.0005 + 1.3978e-5*d,  i: 0.7733 + 1.9e-8*d,   w: 96.6612 + 3.0565e-5*d,
                   a: 19.18171 - 1.55e-8*d,   e: 0.047318 + 7.45e-9*d, M: 142.5905 + 0.011725806*d }),
  neptune: d => ({ N: 131.7806 + 3.0173e-5*d, i: 1.7700 - 2.55e-7*d,  w: 272.8461 - 6.027e-6*d,
                   a: 30.05826 + 3.313e-8*d,  e: 0.008606 + 2.15e-9*d, M: 260.2471 + 0.005995147*d }),
};

/* Position du Soleil vue de la Terre — sert aussi de repère pour passer
   des coordonnées héliocentriques aux géocentriques. */
function soleilRect(d){
  const w = 282.9404 + 4.70935e-5*d;
  const e = 0.016709 - 1.151e-9*d;
  const M = trev(356.0470 + 0.9856002585*d);
  const E = M + tdeg(e) * tsin(M) * (1 + e*tcos(M));
  const xv = tcos(E) - e, yv = Math.sqrt(1 - e*e) * tsin(E);
  const v = tdeg(Math.atan2(yv, xv)), r = Math.hypot(xv, yv);
  const lon = trev(v + w);
  return { x: r*tcos(lon), y: r*tsin(lon), lon, r };
}
/* Longitude écliptique du Soleil (degrés) — utile pour le thème natal. */
function sunLongitude(jd){ return soleilRect(jd - 2451543.5).lon; }

/* Résout l'équation de Kepler, puis rend la position héliocentrique. */
function helio(o){
  let E = o.M + tdeg(o.e) * tsin(o.M) * (1 + o.e * tcos(o.M));
  for(let k = 0; k < 8; k++){
    const dE = (E - tdeg(o.e)*tsin(E) - o.M) / (1 - o.e*tcos(E));
    E -= dE;
    if(Math.abs(dE) < 1e-9) break;
  }
  const xv = o.a * (tcos(E) - o.e);
  const yv = o.a * Math.sqrt(1 - o.e*o.e) * tsin(E);
  const v = tdeg(Math.atan2(yv, xv)), r = Math.hypot(xv, yv);
  const u = v + o.w;
  return {
    x: r * (tcos(o.N)*tcos(u) - tsin(o.N)*tsin(u)*tcos(o.i)),
    y: r * (tsin(o.N)*tcos(u) + tcos(o.N)*tsin(u)*tcos(o.i)),
    z: r * (tsin(u) * tsin(o.i)),
  };
}

/* Pluton : Schlyter donne une série approchée, valable de 1800 à 2050. */
function plutonHelio(d){
  const S = trev(50.03 + 0.033459652*d);
  const P = trev(238.95 + 0.003968789*d);
  const lon = trev(238.9508 + 0.00400703*d
    - 19.799*tsin(P)   + 19.848*tcos(P)
    +  0.897*tsin(2*P) -  4.956*tcos(2*P)
    +  0.610*tsin(3*P) +  1.211*tcos(3*P)
    -  0.341*tsin(4*P) -  0.190*tcos(4*P)
    +  0.128*tsin(5*P) -  0.034*tcos(5*P)
    -  0.038*tsin(6*P) +  0.031*tcos(6*P)
    +  0.020*tsin(S-P) -  0.010*tcos(S-P));
  const lat = -3.9082
    - 5.453*tsin(P)   - 14.975*tcos(P)
    + 3.527*tsin(2*P) +  1.673*tcos(2*P)
    - 1.051*tsin(3*P) -  0.328*tcos(3*P)
    + 0.179*tsin(4*P) -  0.037*tcos(4*P)
    + 0.019*tsin(5*P) -  0.010*tcos(5*P);
  const r = 40.72
    + 6.68*tsin(P)   + 6.90*tcos(P)
    - 1.18*tsin(2*P) - 0.03*tcos(2*P)
    + 0.15*tsin(3*P) - 0.14*tcos(3*P);
  return { x: r*tcos(lat)*tcos(lon), y: r*tcos(lat)*tsin(lon), z: r*tsin(lat) };
}

/* Perturbations principales (Schlyter). Sans elles, Saturne dérive de près
   d'un degré — assez pour se tromper de signe en bord de cusp. */
function perturbation(nom, d){
  const Mj = trev(19.8950 + 0.0830853001*d);
  const Ms = trev(316.9670 + 0.0334442282*d);
  const Mu = trev(142.5905 + 0.011725806*d);
  if(nom === "jupiter")
    return -0.332*tsin(2*Mj - 5*Ms - 67.6) - 0.056*tsin(2*Mj - 2*Ms + 21)
         +  0.042*tsin(3*Mj - 5*Ms + 21)   - 0.036*tsin(Mj - 2*Ms)
         +  0.022*tcos(Mj - Ms)            + 0.023*tsin(2*Mj - 3*Ms + 52)
         -  0.016*tsin(Mj - 5*Ms - 69);
  if(nom === "saturne")
    return  0.812*tsin(2*Mj - 5*Ms - 67.6) - 0.229*tcos(2*Mj - 4*Ms - 2)
         +  0.119*tsin(Mj - 2*Ms - 3)      + 0.046*tsin(2*Mj - 6*Ms - 69)
         +  0.014*tsin(Mj - 3*Ms + 32);
  if(nom === "uranus")
    return  0.040*tsin(Ms - 2*Mu + 6) + 0.035*tsin(Ms - 3*Mu + 33)
         -  0.015*tsin(Mj - Mu + 20);
  return 0;
}

/* Longitude écliptique géocentrique d'une planète (degrés, 0–360). */
function planetLongitude(nom, jd){
  const d = jd - 2451543.5;
  const s = soleilRect(d);
  const h = (nom === "pluton") ? plutonHelio(d) : helio(ORBITES[nom](d));
  const lon = tdeg(Math.atan2(h.y + s.y, h.x + s.x));
  return trev(lon + perturbation(nom, d));
}

/* Écart signé le plus court entre deux longitudes (−180…+180). */
function ecart(a, b){ let x = (a - b + 540) % 360 - 180; return x; }

/* Vitesse apparente en degrés par jour. Négative = rétrograde. */
function vitesse(nom, jd){
  return ecart(planetLongitude(nom, jd + 0.5), planetLongitude(nom, jd - 0.5));
}

/* Cherche la date de changement de sens autour de jd, dans la direction
   donnée (+1 vers l'avenir, −1 vers le passé). Balayage au jour, puis
   bissection pour la précision. Rend null si rien dans la fenêtre. */
function station(nom, jd, sens, fenetre){
  const retroDepart = vitesse(nom, jd) < 0;
  let precedent = jd;
  for(let k = 1; k <= fenetre; k++){
    const t = jd + sens * k;
    if((vitesse(nom, t) < 0) !== retroDepart){
      let lo = sens > 0 ? precedent : t, hi = sens > 0 ? t : precedent;
      for(let n = 0; n < 20; n++){
        const mid = (lo + hi) / 2;
        if((vitesse(nom, mid) < 0) === retroDepart) { if(sens > 0) lo = mid; else hi = mid; }
        else { if(sens > 0) hi = mid; else lo = mid; }
      }
      return (lo + hi) / 2;
    }
    precedent = t;
  }
  return null;
}

/* Jour julien d'une date JS (UTC). */
function jdFromDate(date){
  const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate();
  const ut = date.getUTCHours() + date.getUTCMinutes()/60;
  return julianDay(y, m, d, ut);
}
/* Date JS depuis un jour julien. */
function dateFromJd(jd){ return new Date((jd - 2440587.5) * 86400000); }

const PLANETES = ["mercure","venus","mars","jupiter","saturne","uranus","neptune","pluton"];
/* Au-delà de Saturne, une rétrogradation dure des mois et concerne des
   générations entières : on ne la met pas en avant comme un événement. */
const LENTES = new Set(["uranus","neptune","pluton"]);

/* État du ciel à une date donnée.
   Rend, pour chaque planète : son signe, son degré, si elle rétrograde,
   et les dates de début et de fin de la phase en cours. */
function skyAt(date){
  const jd = jdFromDate(date || new Date());
  const corps = PLANETES.map(nom => {
    const lon = planetLongitude(nom, jd);
    const v = vitesse(nom, jd);
    const retro = v < 0;
    // fenêtre de recherche : large pour les lentes, courte pour Mercure
    const f = LENTES.has(nom) ? 400 : (nom === "mercure" ? 90 : 300);
    const finJd = station(nom, jd, +1, f);
    const debJd = station(nom, jd, -1, f);
    return {
      nom, lon, retro,
      vitesse: v,
      signe: signFromLongitude(lon),
      degre: degreeInSign(lon),
      lente: LENTES.has(nom),
      debut: debJd ? dateFromJd(debJd) : null,
      fin:   finJd ? dateFromJd(finJd) : null,
    };
  });
  return {
    date: date || new Date(),
    soleil: { lon: sunLongitude(jd), signe: signFromLongitude(sunLongitude(jd)) },
    corps,
    retrogrades: corps.filter(c => c.retro),
  };
}

/* ---------------- aspects entre le ciel du moment et un thème ----------------
   Un transit ne « fait » quelque chose que s'il touche un point du thème.
   On mesure donc l'angle entre la planète et le Soleil, la Lune ou
   l'ascendant de naissance, avec les orbes usuels. */
const ASPECTS = [
  { cle:"conjonction", angle:0,   orbe:8 },
  { cle:"opposition",  angle:180, orbe:8 },
  { cle:"trigone",     angle:120, orbe:7 },
  { cle:"carre",       angle:90,  orbe:7 },
  { cle:"sextile",     angle:60,  orbe:5 },
];

function aspectEntre(lonA, lonB){
  const separation = Math.abs(ecart(lonA, lonB));
  let meilleur = null;
  for(const a of ASPECTS){
    const marge = Math.abs(separation - a.angle);
    if(marge <= a.orbe && (!meilleur || marge < meilleur.marge))
      meilleur = { cle: a.cle, marge, exact: marge < 1.5 };
  }
  return meilleur;
}

/* Transits actifs sur un profil, classés par importance.
   points : { soleil: lon, lune: lon|null, ascendant: lon|null } */
function transitsFor(points, date){
  const ciel = skyAt(date);
  const touches = [];
  for(const c of ciel.corps){
    for(const [point, lon] of Object.entries(points)){
      if(lon == null) continue;
      const a = aspectEntre(c.lon, lon);
      if(a) touches.push({ ...a, planete: c.nom, corps: c, point });
    }
  }
  // priorité : aspect exact, puis planète rétrograde, puis orbe serré
  touches.sort((x, y) =>
    (y.exact - x.exact) || (y.corps.retro - x.corps.retro) || (x.marge - y.marge));
  return { ciel, touches };
}
