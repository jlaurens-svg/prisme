/* Génère les bases de villes de PRISME depuis GeoNames.
   Sortie :
     cities-data.js   villes de 15 000 habitants et plus  (chargé au besoin)
     cities-extra.js  communes plus petites               (chargé à la demande)

   Format compact — une ligne par ville, groupée par pays :
     @CC                              en-tête de pays (ISO 3166-1 alpha-2)
     nom|admin|lat|lon|tz|rang        lat/lon en centièmes de degré, base 36
                                      tz  = index dans la table CITY_TZ
                                      rang = log(population), base 36
   L'admin (région/état) n'est écrit que si le couple nom+pays est ambigu.

   Usage : node gen.js <dossier-de-sortie>
*/
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const cities = require("all-the-cities");
const tzLookup = require("tz-lookup");
const ic = require("i18n-iso-countries");
ic.registerLocale(require("i18n-iso-countries/langs/fr.json"));
ic.registerLocale(require("i18n-iso-countries/langs/en.json"));

const OUT = process.argv[2] || ".";
const TIER1_MIN_POP = 15000;

/* Exonymes français : GeoNames mélange l'anglais (Rome, Warsaw, Beijing) et les
   noms locaux (Köln, Genève). On mappe la saisie française vers le nom réel. */
const ALIASES = {
  londres: "London", pekin: "Beijing", "le caire": "Cairo", caire: "Cairo",
  moscou: "Moscow", vienne: "Vienna", lisbonne: "Lisbon", bruxelles: "Brussels",
  barcelone: "Barcelona", copenhague: "Copenhagen", singapour: "Singapore",
  athenes: "Athens", cologne: "Köln", munich: "Munich", francfort: "Frankfurt am Main",
  hambourg: "Hamburg", nuremberg: "Nürnberg",
  seville: "Sevilla", cordoue: "Córdoba", saragosse: "Zaragoza", grenade: "Granada",
  venise: "Venice", genes: "Genoa",
  varsovie: "Warsaw", cracovie: "Kraków", bucarest: "Bucharest",
  kiev: "Kyiv", odessa: "Odessa", "saint petersbourg": "Saint Petersburg",
  bale: "Basel", berne: "Bern", geneve: "Genève", zurich: "Zürich",
  anvers: "Antwerp", gand: "Gent", liege: "Liège", bruges: "Bruges",
  "la haye": "The Hague", "aix la chapelle": "Aachen",
  alger: "Algiers", tanger: "Tangier", marrakech: "Marrakesh", fes: "Fès",
  "la mecque": "Mecca", damas: "Damascus", bagdad: "Baghdad", teheran: "Tehran",
  ryad: "Riyadh", beyrouth: "Beirut",
  bombay: "Mumbai", calcutta: "Kolkata", madras: "Chennai", bangalore: "Bengaluru",
  canton: "Guangzhou", nankin: "Nanjing", macao: "Macau",
  "ho chi minh ville": "Ho Chi Minh City", saigon: "Ho Chi Minh City",
  djakarta: "Jakarta", manille: "Manila",
  "la nouvelle orleans": "New Orleans", mexico: "Mexico City", "la havane": "Havana",
  "saint domingue": "Santo Domingo", bogota: "Bogotá", medellin: "Medellín",
  "le cap": "Cape Town", "addis abeba": "Addis Ababa",
};

const norm = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
   .replace(/[^a-z0-9]+/g, " ").trim();

const b36 = (n) => (n < 0 ? "-" : "") + Math.abs(n).toString(36);
/* Rang de population en un caractère base 36 : log base 1,6 borné à [0,35].
   Sert au classement des résultats — Paris (FR) doit passer avant Paris (Texas). */
const rank36 = (p) =>
  Math.max(0, Math.min(35, Math.round(Math.log(Math.max(p, 1)) / Math.log(1.6)))).toString(36);

/* ---------- lecture de la source ---------- */
const tzIndex = new Map(), tzList = [];
const all = [];
let skipped = 0;
for (const c of cities) {
  const [lon, lat] = c.loc.coordinates;
  let tz;
  try { tz = tzLookup(lat, lon); } catch { skipped++; continue; }
  if (!tzIndex.has(tz)) { tzIndex.set(tz, tzList.length); tzList.push(tz); }
  all.push({ n: c.name, cc: c.country, a: c.adminCode || "",
             lat: Math.round(lat * 100), lon: Math.round(lon * 100),
             tz: tzIndex.get(tz), pop: c.population });
}

/* ---------- garde-fous sur le format ---------- */
const bad = all.filter((c) => /[|\n@]/.test(c.n) || /[|\n]/.test(c.a));
if (bad.length) {
  console.error("ABANDON : " + bad.length + " noms contiennent un séparateur (| @ retour ligne) :");
  bad.slice(0, 10).forEach((c) => console.error("   ", JSON.stringify(c.n), c.cc));
  process.exit(1);
}

/* ---------- encodage ---------- */
const dupCount = new Map();
for (const c of all) { const k = c.cc + "|" + c.n; dupCount.set(k, (dupCount.get(k) || 0) + 1); }

function encode(list) {
  const byCC = {};
  for (const c of list) (byCC[c.cc] || (byCC[c.cc] = [])).push(c);
  return Object.keys(byCC).sort().map((cc) =>
    "@" + cc + "\n" + byCC[cc]
      .sort((a, b) => a.n.localeCompare(b.n, "en"))
      .map((c) => [
        c.n,
        dupCount.get(c.cc + "|" + c.n) > 1 ? c.a : "",
        b36(c.lat), b36(c.lon), b36(c.tz), rank36(c.pop),
      ].join("|"))
      .join("\n")
  ).join("\n");
}

const tier1 = all.filter((c) => c.pop >= TIER1_MIN_POP);
const tier2 = all.filter((c) => c.pop < TIER1_MIN_POP);

/* ---------- alias : on vérifie que chaque cible existe ---------- */
const knownNames = new Set(all.map((c) => norm(c.n)));
const missing = Object.entries(ALIASES).filter(([, t]) => !knownNames.has(norm(t)));
if (missing.length) {
  console.error("ABANDON : alias sans cible dans la base :");
  missing.forEach(([k, v]) => console.error("   ", k, "->", v));
  process.exit(1);
}
const aliases = Object.fromEntries(Object.entries(ALIASES).map(([k, v]) => [k, norm(v)]));

/* ---------- noms de pays (FR, EN) ----------
   i18n-iso-countries donne les formes officielles longues ; dans une liste de
   choix on veut l'usage courant. */
const COUNTRY_OVERRIDES = {
  US: ["États-Unis", "United States"],
  RU: ["Russie", "Russia"],
  CZ: ["Tchéquie", "Czechia"],
  IR: ["Iran", "Iran"],
  SY: ["Syrie", "Syria"],
  LA: ["Laos", "Laos"],
  MD: ["Moldavie", "Moldova"],
  MK: ["Macédoine du Nord", "North Macedonia"],
  TW: ["Taïwan", "Taiwan"],
  TZ: ["Tanzanie", "Tanzania"],
  CD: ["Congo-Kinshasa", "DR Congo"],
  CG: ["Congo-Brazzaville", "Congo"],
  CF: ["Centrafrique", "Central African Republic"],
  DO: ["République dominicaine", "Dominican Republic"],
  AE: ["Émirats arabes unis", "United Arab Emirates"],
  VA: ["Vatican", "Vatican"],
  FM: ["Micronésie", "Micronesia"],
  BN: ["Brunei", "Brunei"],
  CI: ["Côte d'Ivoire", "Ivory Coast"],
  BO: ["Bolivie", "Bolivia"],
  VE: ["Venezuela", "Venezuela"],
};
const countries = {};
for (const cc of [...new Set(all.map((c) => c.cc))].sort())
  countries[cc] = COUNTRY_OVERRIDES[cc] || [ic.getName(cc, "fr") || cc, ic.getName(cc, "en") || cc];

/* ---------- écriture ---------- */
const head = (n) =>
  `/* Généré par tools/gen-cities.js — ne pas éditer à la main.\n` +
  `   Sources : GeoNames (all-the-cities), tz-lookup, i18n-iso-countries.\n   ${n} */\n`;

const f1 = path.join(OUT, "cities-data.js");
const f2 = path.join(OUT, "cities-extra.js");

fs.writeFileSync(f1,
  head(`${tier1.length} villes de ${TIER1_MIN_POP.toLocaleString("fr-FR")} habitants et plus.`) +
  `window.CITY_DATA = {\n` +
  `tz:${JSON.stringify(tzList)},\n` +
  `countries:${JSON.stringify(countries)},\n` +
  `aliases:${JSON.stringify(aliases)},\n` +
  `rows:${JSON.stringify(encode(tier1))}\n};\n` +
  `window.dispatchEvent(new Event("prisme-cities-ready"));\n`);

fs.writeFileSync(f2,
  head(`${tier2.length} communes de moins de ${TIER1_MIN_POP.toLocaleString("fr-FR")} habitants.`) +
  `window.CITY_DATA_EXTRA = ${JSON.stringify(encode(tier2))};\n` +
  `window.dispatchEvent(new Event("prisme-cities-extra-ready"));\n`);

const rep = (f) => {
  const raw = fs.statSync(f).size, gz = zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length;
  return `${(raw / 1024).toFixed(0)} Ko (gzip ${(gz / 1024).toFixed(0)} Ko)`;
};
console.log(`source : ${all.length} villes, ${skipped} ignorées | ${tzList.length} fuseaux | ${Object.keys(countries).length} pays`);
console.log(`alias  : ${Object.keys(aliases).length}, toutes les cibles résolues`);
console.log(`cities-data.js  : ${tier1.length} villes — ${rep(f1)}`);
console.log(`cities-extra.js : ${tier2.length} communes — ${rep(f2)}`);
