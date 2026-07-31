/* ============================================================
   PRISME — module d'astronomie
   Ascendant + signe lunaire, calculés localement.
   Précision volontairement modeste (langage symbolique) :
   Lune ~ Schlyter (précision ~2'), Ascendant formule standard.
   L'heure exacte et le fuseau influencent fortement l'ascendant.
   ============================================================ */

const SIGN_ORDER = [
  "belier","taureau","gemeaux","cancer","lion","vierge",
  "balance","scorpion","sagittaire","capricorne","verseau","poissons"
];

const DEG = Math.PI / 180;
const rev = x => ((x % 360) + 360) % 360;
const rad = x => x * DEG;
const deg = x => x / DEG;

/* Jour julien à partir d'une date + heure UT (décimale) */
function julianDay(y, m, d, utHours){
  if(m <= 2){ y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1))
         + d + B - 1524.5 + utHours / 24;
}

/* Longitude écliptique de la Lune (degrés, 0–360) — Schlyter */
function moonLongitude(jd){
  const d = jd - 2451543.5;
  const N = rev(125.1228 - 0.0529538083 * d);
  const i = 5.1454;
  const w = rev(318.0634 + 0.1643573223 * d);
  const a = 60.2666;
  const e = 0.054900;
  const M = rev(115.3654 + 13.0649929509 * d);

  // Kepler
  let E = M + deg(e) * Math.sin(rad(M)) * (1 + e * Math.cos(rad(M)));
  for(let k = 0; k < 5; k++){
    E = E - (E - deg(e) * Math.sin(rad(E)) - M) / (1 - e * Math.cos(rad(E)));
  }
  const x = a * (Math.cos(rad(E)) - e);
  const y = a * Math.sqrt(1 - e * e) * Math.sin(rad(E));
  const r = Math.sqrt(x * x + y * y);
  const v = rev(deg(Math.atan2(y, x)));

  // écliptique
  const xe = r * (Math.cos(rad(N)) * Math.cos(rad(v + w)) - Math.sin(rad(N)) * Math.sin(rad(v + w)) * Math.cos(rad(i)));
  const ye = r * (Math.sin(rad(N)) * Math.cos(rad(v + w)) + Math.cos(rad(N)) * Math.sin(rad(v + w)) * Math.cos(rad(i)));
  let lon = rev(deg(Math.atan2(ye, xe)));

  // perturbations principales
  const Ms = rev(356.0470 + 0.9856002585 * d);
  const ws = 282.9404 + 4.70935e-5 * d;
  const Ls = rev(ws + Ms);
  const Lm = rev(N + w + M);
  const D = rev(Lm - Ls);
  const F = rev(Lm - N);
  lon += -1.274 * Math.sin(rad(M - 2*D))
       +  0.658 * Math.sin(rad(2*D))
       -  0.186 * Math.sin(rad(Ms))
       -  0.059 * Math.sin(rad(2*M - 2*D))
       -  0.057 * Math.sin(rad(M - 2*D + Ms))
       +  0.053 * Math.sin(rad(M + 2*D))
       +  0.046 * Math.sin(rad(2*D - Ms))
       +  0.041 * Math.sin(rad(M - Ms))
       -  0.035 * Math.sin(rad(D))
       -  0.031 * Math.sin(rad(M + Ms))
       -  0.015 * Math.sin(rad(2*F - 2*D))
       +  0.011 * Math.sin(rad(M - 4*D));
  return rev(lon);
}

/* Ascendant : longitude écliptique du point levant (degrés) */
function ascendantLongitude(jd, latDeg, lonEastDeg){
  const T = (jd - 2451545.0) / 36525;
  const eps = 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
  const gmst = rev(280.46061837 + 360.98564736629 * (jd - 2451545.0)
             + 0.000387933 * T * T - (T * T * T) / 38710000);
  const ramc = rev(gmst + lonEastDeg);
  const asc = deg(Math.atan2(
    Math.cos(rad(ramc)),
    -(Math.sin(rad(ramc)) * Math.cos(rad(eps)) + Math.tan(rad(latDeg)) * Math.sin(rad(eps)))
  ));
  return rev(asc);
}

function signFromLongitude(lon){
  return SIGN_ORDER[Math.floor(rev(lon) / 30) % 12];
}
function degreeInSign(lon){
  return Math.floor(rev(lon) % 30);
}

/* Calcule lune + ascendant à partir d'une naissance locale.
   time = "HH:MM" ; utcOffset en heures (ex. +2) ; lat/lon en degrés (est +). */
function computeCelestial(dateStr, time, utcOffset, lat, lon){
  const [Y, Mo, D] = dateStr.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const localDec = hh + mm / 60;
  const utDec = localDec - utcOffset;   // conversion vers UT
  // report de jour si l'UT franchit minuit
  let y = Y, mo = Mo, d = D, ut = utDec;
  const jd = julianDay(y, mo, d, ut);   // julianDay gère les fractions négatives correctement
  const moonLon = moonLongitude(jd);
  const ascLon  = ascendantLongitude(jd, lat, lon);
  return {
    moon: { sign: signFromLongitude(moonLon), deg: degreeInSign(moonLon), lon: moonLon },
    asc:  { sign: signFromLongitude(ascLon),  deg: degreeInSign(ascLon),  lon: ascLon }
  };
}
