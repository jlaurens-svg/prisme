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

/* Villes : nom, latitude, longitude (est +), décalage UTC standard (hors heure d'été) */
const CITIES = [
  { n:"Paris",            lat:48.8566, lon:2.3522,   tz:1 },
  { n:"Marseille",        lat:43.2965, lon:5.3698,   tz:1 },
  { n:"Lyon",             lat:45.7640, lon:4.8357,   tz:1 },
  { n:"Toulouse",         lat:43.6047, lon:1.4442,   tz:1 },
  { n:"Nice",             lat:43.7102, lon:7.2620,   tz:1 },
  { n:"Nantes",           lat:47.2184, lon:-1.5536,  tz:1 },
  { n:"Strasbourg",       lat:48.5734, lon:7.7521,   tz:1 },
  { n:"Bordeaux",         lat:44.8378, lon:-0.5792,  tz:1 },
  { n:"Lille",            lat:50.6292, lon:3.0573,   tz:1 },
  { n:"Rennes",           lat:48.1173, lon:-1.6778,  tz:1 },
  { n:"Bruxelles",        lat:50.8503, lon:4.3517,   tz:1 },
  { n:"Genève",           lat:46.2044, lon:6.1432,   tz:1 },
  { n:"Luxembourg",       lat:49.6116, lon:6.1319,   tz:1 },
  { n:"Madrid",           lat:40.4168, lon:-3.7038,  tz:1 },
  { n:"Barcelone",        lat:41.3874, lon:2.1686,   tz:1 },
  { n:"Lisbonne",         lat:38.7223, lon:-9.1393,  tz:0 },
  { n:"Londres",          lat:51.5074, lon:-0.1278,  tz:0 },
  { n:"Dublin",           lat:53.3498, lon:-6.2603,  tz:0 },
  { n:"Rome",             lat:41.9028, lon:12.4964,  tz:1 },
  { n:"Milan",            lat:45.4642, lon:9.1900,   tz:1 },
  { n:"Berlin",           lat:52.5200, lon:13.4050,  tz:1 },
  { n:"Amsterdam",        lat:52.3676, lon:4.9041,   tz:1 },
  { n:"Vienne",           lat:48.2082, lon:16.3738,  tz:1 },
  { n:"Zurich",           lat:47.3769, lon:8.5417,   tz:1 },
  { n:"Copenhague",       lat:55.6761, lon:12.5683,  tz:1 },
  { n:"Stockholm",        lat:59.3293, lon:18.0686,  tz:1 },
  { n:"Oslo",             lat:59.9139, lon:10.7522,  tz:1 },
  { n:"Athènes",          lat:37.9838, lon:23.7275,  tz:2 },
  { n:"Istanbul",         lat:41.0082, lon:28.9784,  tz:3 },
  { n:"Moscou",           lat:55.7558, lon:37.6173,  tz:3 },
  { n:"Le Caire",         lat:30.0444, lon:31.2357,  tz:2 },
  { n:"Casablanca",       lat:33.5731, lon:-7.5898,  tz:1 },
  { n:"Alger",            lat:36.7538, lon:3.0588,   tz:1 },
  { n:"Tunis",            lat:36.8065, lon:10.1815,  tz:1 },
  { n:"Dakar",            lat:14.7167, lon:-17.4677, tz:0 },
  { n:"Abidjan",          lat:5.3600,  lon:-4.0083,  tz:0 },
  { n:"Dubaï",            lat:25.2048, lon:55.2708,  tz:4 },
  { n:"Beyrouth",         lat:33.8938, lon:35.5018,  tz:2 },
  { n:"New York",         lat:40.7128, lon:-74.0060, tz:-5 },
  { n:"Los Angeles",      lat:34.0522, lon:-118.2437,tz:-8 },
  { n:"Chicago",          lat:41.8781, lon:-87.6298, tz:-6 },
  { n:"Montréal",         lat:45.5017, lon:-73.5673, tz:-5 },
  { n:"Mexico",           lat:19.4326, lon:-99.1332, tz:-6 },
  { n:"São Paulo",        lat:-23.5505,lon:-46.6333, tz:-3 },
  { n:"Buenos Aires",     lat:-34.6037,lon:-58.3816, tz:-3 },
  { n:"Tokyo",            lat:35.6762, lon:139.6503, tz:9 },
  { n:"Séoul",            lat:37.5665, lon:126.9780, tz:9 },
  { n:"Pékin",            lat:39.9042, lon:116.4074, tz:8 },
  { n:"Shanghai",         lat:31.2304, lon:121.4737, tz:8 },
  { n:"Hong Kong",        lat:22.3193, lon:114.1694, tz:8 },
  { n:"Singapour",        lat:1.3521,  lon:103.8198, tz:8 },
  { n:"Bangkok",          lat:13.7563, lon:100.5018, tz:7 },
  { n:"Mumbai",           lat:19.0760, lon:72.8777,  tz:5.5 },
  { n:"New Delhi",        lat:28.6139, lon:77.2090,  tz:5.5 },
  { n:"Sydney",           lat:-33.8688,lon:151.2093, tz:10 },
  { n:"Melbourne",        lat:-37.8136,lon:144.9631, tz:10 },
  { n:"Auckland",         lat:-36.8485,lon:174.7633, tz:12 },
  { n:"Johannesburg",     lat:-26.2041,lon:28.0473,  tz:2 }
];
