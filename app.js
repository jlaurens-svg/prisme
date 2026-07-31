/* ============================================================
   PRISME — logique applicative
   i18n (FR/EN) · calculs · ascendant+lune · localStorage · impression
   Tout est local. Rien n'est envoyé.
   ============================================================ */

/* ---------------- Langue ---------------- */
let LANG = localStorage.getItem("prisme-lang") || "fr";
const L = () => I18N[LANG];
const U = () => I18N[LANG].ui;
function resolve(obj, path){ return path.split(".").reduce((o,k)=> (o||{})[k], obj); }

/* ---------------- Navigation ---------------- */
function go(name){
  /* L'histoire de vie a rejoint le profil : plus de vue à elle. On garde le nom
     pour les anciens liens et on emmène au bon endroit. */
  if(name === "histoire"){
    if(!lastProfile) return go("create");
    go("profile");
    setTimeout(histScroll, 80);
    return;
  }
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.dataset.view === name));
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.toggle("is-current", a.dataset.nav === name));
  window.scrollTo({ top:0, behavior:"smooth" });
}
document.querySelectorAll("[data-nav]").forEach(el => { el.dataset.navBound = "1"; el.addEventListener("click", e => { e.preventDefault(); go(el.dataset.nav); }); });
/* Les blocs rendus après coup (profil, histoire) contiennent aussi des
   data-nav : on délègue pour ne pas avoir à recâbler à chaque rendu. */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-nav]");
  if(!el || el.dataset.navBound) return;
  e.preventDefault(); go(el.dataset.nav);
});

/* ---------------- Calculs : Astrologie (soleil) ---------------- */
function sunSign(month, day){
  const t=[["capricorne",20],["verseau",19],["poissons",21],["belier",20],["taureau",21],["gemeaux",21],
    ["cancer",23],["lion",23],["vierge",23],["balance",23],["scorpion",22],["sagittaire",22],["capricorne",32]];
  return day < t[month-1][1] ? t[month-1][0] : t[month][0];
}

/* ---------------- Calculs : Numérologie ---------------- */
const MASTER_NUMS = new Set([11,22,33]);
function digitSum(n){ return String(n).split("").reduce((s,d)=>s+(+d),0); }
function reduceNum(n){ while(n>9 && !MASTER_NUMS.has(n)) n = digitSum(n); return n; }
/* Racine à un chiffre, nombres maîtres inclus : 11 → 2, 22 → 4, 33 → 6.
   Sert aux comparaisons (11 et 2 partagent le même fil de fond). */
function numRoot(n){ while(n>9) n = digitSum(n); return n; }
/* Notation d'usage : un nombre maître s'écrit avec sa racine — 11/2, 22/4, 33/6. */
function numLabel(n){ return MASTER_NUMS.has(n) ? `${n}/${numRoot(n)}` : String(n); }
/* Chemin de vie : on additionne les chiffres du jour, du mois et de l'année
   sans réduire chaque partie au préalable — réduire d'abord détruit le nombre
   maître avant la fin du calcul (27/12/1979 donnait 2 au lieu de 11). */
function lifePath(dateStr){ const [y,m,d]=dateStr.split("-").map(Number); return reduceNum(digitSum(y)+digitSum(m)+digitSum(d)); }
const LETTER_VALUES={a:1,j:1,s:1,b:2,k:2,t:2,c:3,l:3,u:3,d:4,m:4,v:4,e:5,n:5,w:5,f:6,o:6,x:6,g:7,p:7,y:7,h:8,q:8,z:8,i:9,r:9};
const VOWELS=new Set(["a","e","i","o","u","y"]);
function normalize(str){ return str.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z]/g,""); }
function nameNumber(name, onlyVowels){
  let sum=0;
  for(const ch of normalize(name)){
    if(onlyVowels===true && !VOWELS.has(ch)) continue;
    if(onlyVowels===false && VOWELS.has(ch)) continue;
    sum += LETTER_VALUES[ch]||0;
  }
  return reduceNum(sum);
}

/* ---------------- Scoring relationnel (neutre) ---------------- */
function elementScore(a,b){ if(a===b) return 78; const h={feu:"air",air:"feu",terre:"eau",eau:"terre"}; return h[a]===b?85:60; }
/* Comparaison sur la racine : 11 et 2 ne sont pas deux chemins opposés. */
function lifeScore(a,b){ if(a===b) return 75; const ra=numRoot(a), rb=numRoot(b);
  if(ra===rb) return 78; return Math.abs(ra-rb)<=2 ? 80 : 66; }
function mbtiShared(a,b){ let s=0; for(let i=0;i<4;i++) if(a[i]===b[i]) s++; return s; }
function mbtiScore(a,b){ const sh=mbtiShared(a,b), comp=a[1]===b[1];
  if(sh>=3) return 80; if(sh===2&&comp) return 84; if(sh===2) return 74; if(sh===1) return 66; return 58; }

/* ---------------- Rendu de l'interface (i18n) ---------------- */
function fillSelectMbti(sel){
  sel.innerHTML="";
  const o0=document.createElement("option"); o0.value=""; o0.textContent=U().mbtiPick; sel.appendChild(o0);
  Object.keys(L().mbti).forEach(k=>{ const o=document.createElement("option"); o.value=k; o.textContent=`${k} — ${L().mbti[k].nom}`; sel.appendChild(o); });
}
/* ---------------- Champ « ville de naissance » ----------------
   Recherche dans la base mondiale (voir cities.js). La base est téléchargée à
   la première interaction avec le champ, pas au chargement de la page ; les
   petites communes ne sont téléchargées que si la recherche ne donne rien. */
let chosenCity = null;          // ville retenue, ou null
let cityHilite = -1;            // index survolé au clavier dans la liste
let cityResults = [];
let cityLoadFailed = false;

function cityEls(){
  return { input: document.getElementById("f-city"),
           list:  document.getElementById("f-city-list"),
           status:document.getElementById("f-city-status"),
           clear: document.getElementById("f-city-clear") };
}
function setCityStatus(msg, kind){
  const { status } = cityEls();
  if(!status) return;
  status.textContent = msg || "";
  status.className = "city-status" + (kind ? " is-" + kind : "");
}
function closeCityList(){
  const { input, list } = cityEls();
  if(!list) return;
  list.hidden = true; list.innerHTML = "";
  input.setAttribute("aria-expanded","false");
  input.removeAttribute("aria-activedescendant");
  cityHilite = -1; cityResults = [];
}
function renderCityList(results){
  const { input, list } = cityEls();
  cityResults = results; cityHilite = -1;
  if(!results.length){ closeCityList(); return; }
  const lang = LANG;
  list.innerHTML = results.map((c,i)=>
    `<li role="option" id="city-opt-${i}" aria-selected="false" data-i="${i}">${escapeHtml(Geo.label(c,lang))}</li>`
  ).join("");
  list.hidden = false;
  input.setAttribute("aria-expanded","true");
  setCityStatus(U().cityCount(results.length));
}
function moveCityHilite(delta){
  const { input, list } = cityEls();
  if(list.hidden || !cityResults.length) return;
  const items = list.querySelectorAll("li");
  if(cityHilite >= 0) items[cityHilite].setAttribute("aria-selected","false");
  cityHilite = (cityHilite + delta + items.length) % items.length;
  const li = items[cityHilite];
  li.setAttribute("aria-selected","true");
  li.scrollIntoView({ block:"nearest" });
  input.setAttribute("aria-activedescendant", li.id);
}
function pickCity(c){
  const { input, clear } = cityEls();
  chosenCity = c;
  input.value = Geo.label(c, LANG);
  if(clear) clear.hidden = false;
  closeCityList();
  setCityStatus(U().cityChosen(Geo.zoneName(c) || "—"), "ok");
}
function clearCity(){
  const { input, clear } = cityEls();
  chosenCity = null;
  input.value = "";
  if(clear) clear.hidden = true;
  closeCityList();
  setCityStatus(U().cityHint);
  input.focus();
}

/* Recherche : d'abord dans les villes déjà chargées ; si rien ne sort, on
   télécharge les petites communes et on retente une seule fois. */
function runCitySearch(q, allowExtra){
  const results = Geo.search(q, 40);
  if(results.length){ renderCityList(results); return; }
  if(allowExtra && !Geo.readyExtra()){
    closeCityList();
    setCityStatus(U().cityNoneYet, "wait");
    Geo.ensureExtra()
      .then(()=>{ const { input } = cityEls();
                  if(Geo.normQuery(input.value) === q) runCitySearch(q, false); })
      .catch(()=> setCityStatus(U().cityLoadErr, "err"));
    return;
  }
  closeCityList();
  setCityStatus(U().cityNone, "err");
}

let cityDebounce = null;
function onCityInput(){
  const { input, clear } = cityEls();
  chosenCity = null;
  if(clear) clear.hidden = !input.value;
  const q = Geo.normQuery(input.value);
  clearTimeout(cityDebounce);
  if(q.length < 2){ closeCityList(); setCityStatus(U().cityHint); return; }
  cityDebounce = setTimeout(()=>{
    ensureCityData().then(()=> runCitySearch(q, true)).catch(()=>{});
  }, 120);
}
function ensureCityData(){
  if(Geo.ready()) return Promise.resolve();
  if(cityLoadFailed) return Promise.reject();
  setCityStatus(U().cityLoading, "wait");
  return Geo.ensure().then(()=> setCityStatus(""))
    .catch(err=>{ cityLoadFailed = true; setCityStatus(U().cityLoadErr, "err"); throw err; });
}

function initCityField(){
  const { input, list, clear } = cityEls();
  if(!input || input.dataset.bound) return;
  input.dataset.bound = "1";
  input.addEventListener("input", onCityInput);
  // précharge dès que le champ reçoit le focus : la frappe trouve la base prête
  input.addEventListener("focus", ()=>{ ensureCityData().catch(()=>{}); });
  input.addEventListener("keydown", (e)=>{
    if(e.key === "ArrowDown"){ e.preventDefault(); moveCityHilite(1); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); moveCityHilite(-1); }
    else if(e.key === "Enter"){
      if(!list.hidden && cityHilite >= 0){ e.preventDefault(); pickCity(cityResults[cityHilite]); }
      else if(!list.hidden && cityResults.length === 1){ e.preventDefault(); pickCity(cityResults[0]); }
    }
    else if(e.key === "Escape"){ if(!list.hidden){ e.stopPropagation(); closeCityList(); } }
  });
  list.addEventListener("mousedown", (e)=>{
    const li = e.target.closest("li[data-i]");
    if(li){ e.preventDefault(); pickCity(cityResults[+li.dataset.i]); }
  });
  if(clear) clear.addEventListener("click", clearCity);
  document.addEventListener("click", (e)=>{
    if(!e.target.closest(".city-combo")) closeCityList();
  });
  // la base est volumineuse : on la charge dès l'ouverture du volet naissance
  const panel = input.closest("details");
  if(panel) panel.addEventListener("toggle", ()=>{ if(panel.open) ensureCityData().catch(()=>{}); });
}

function fillCities(){
  const { input, clear } = cityEls();
  if(!input) return;
  input.placeholder = U().fCityPh;
  if(clear) clear.setAttribute("aria-label", U().cityClear);
  // au changement de langue, on réécrit le libellé de la ville déjà choisie
  if(chosenCity){ input.value = Geo.label(chosenCity, LANG); setCityStatus(U().cityChosen(Geo.zoneName(chosenCity) || "—"), "ok"); }
  else if(!input.value) setCityStatus(U().cityHint);
  initCityField();
}
let relCtx = "couple";
function renderContextCards(){
  const box=document.getElementById("r-context-cards"); if(!box) return;
  const t=U();
  box.innerHTML = Object.keys(t.ctx).map(k=>
    `<button type="button" class="ctx-card${k===relCtx?" is-active":""}" data-ctx="${k}" role="radio" aria-checked="${k===relCtx}">
       <b>${t.ctx[k]}</b><small>${t.ctxSub[k]}</small></button>`).join("");
  box.querySelectorAll(".ctx-card").forEach(btn=>btn.addEventListener("click",()=>{
    relCtx=btn.dataset.ctx;
    box.querySelectorAll(".ctx-card").forEach(b=>{ const on=b===btn; b.classList.toggle("is-active",on); b.setAttribute("aria-checked",on?"true":"false"); });
  }));
}
const CONSULT_LINK = ""; // ← mettre ici un lien Calendly / une URL de réservation pour activer le bouton
function renderConsult(){
  const c=U().consult;
  const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set("consult-eyebrow",c.eyebrow); set("consult-title",c.title); set("consult-text",c.text);
  const feats=document.getElementById("consult-feats"); if(feats) feats.innerHTML=c.feats.map(f=>`<li>${f}</li>`).join("");
  const btn=document.getElementById("consult-btn"); if(btn) btn.textContent=c.button;
  const note=document.getElementById("consult-note"); if(note) note.textContent=c.note;
  const pr=document.getElementById("consult-price"); if(pr) pr.textContent=c.price||"";
  const pu=document.getElementById("consult-price-unit"); if(pu) pu.textContent=c.priceUnit||"";
}
function navTo(to){
  if(to==="relation-famille"){ relCtx="famille"; renderContextCards(); go("relation"); return; }
  if(to==="consult"){ const el=document.getElementById("consult"); go("home"); if(el) el.scrollIntoView({behavior:"smooth"}); return; }
  go(to);
}
function renderFamille(){
  const f=U().famille; const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set("fam-eyebrow",f.eyebrow); set("fam-title",f.title); set("fam-text",f.text);
  const g=document.getElementById("fam-grid"); if(g) g.innerHTML=f.items.map(it=>`<div class="fam-item"><h4>${it.h}</h4><p>${it.p}</p></div>`).join("");
  const b=document.getElementById("fam-cta"); if(b){ b.textContent=f.cta; b.onclick=()=>navTo(f.to); }
}
function renderTarifs(){
  const t=U().tarifs; const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set("tarifs-eyebrow",t.eyebrow); set("tarifs-title",t.title); set("tarifs-note",t.note);
  const badge = LANG==="fr" ? "Le plus complet" : "Most complete";
  const g=document.getElementById("tarifs-grid"); if(!g) return;
  g.innerHTML=t.cards.map(c=>`
    <div class="tarif-card${c.featured?" featured":""}">
      ${c.featured?`<span class="tarif-badge">${badge}</span>`:""}
      <span class="tarif-name">${c.name}</span>
      <p class="tarif-desc">${c.desc}</p>
      <p class="tarif-price"><b>${c.price}</b><small>${c.unit}</small></p>
      <button class="btn ${c.featured?"btn-accent":"btn-accent-outline"}" data-to="${c.to}">${c.cta}</button>
    </div>`).join("");
  g.querySelectorAll("button[data-to]").forEach(b=>b.onclick=()=>navTo(b.dataset.to));
}
function renderJung(){
  const t=U();
  const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set("jung-eyebrow",t.jung.eyebrow);
  set("jung-quote", LANG==="fr" ? "« "+t.jung.quote+" »" : "“"+t.jung.quote+"”");
  set("jung-who",t.jung.who);
  set("jung-link",t.jung.link);
  const p=document.getElementById("jung-portrait");
  if(p) p.innerHTML = (typeof PORTRAITS!=="undefined"&&PORTRAITS.jung) ? medallionPhoto("jung",PORTRAITS.jung) : "";
}
function buildQuiz(){
  const list=document.getElementById("quiz-list"); list.innerHTML="";
  L().quiz.forEach((item,i)=>{
    const div=document.createElement("div"); div.className="q";
    div.innerHTML=`<span class="q-num">${i+1} / ${L().quiz.length}</span>
      <p class="q-text">${item.q}</p>
      <div class="q-opts">
        <label class="q-opt"><input type="radio" name="q${i}" value="a"><span>${item.a.t}</span></label>
        <label class="q-opt"><input type="radio" name="q${i}" value="b"><span>${item.b.t}</span></label>
      </div>`;
    list.appendChild(div);
  });
}
document.getElementById("quiz-list").addEventListener("change", e=>{
  if(e.target.type!=="radio") return;
  e.target.closest(".q-opts").querySelectorAll(".q-opt").forEach(o=>o.classList.toggle("is-picked", o.contains(e.target)));
});

/* ---------------- Héritage : constellations, nombres, figures ---------------- */
// Cartes d'étoiles stylisées (coordonnées en viewBox 0–100). s=[x,y,rayon], l=chemins d'indices.
const CONST_DATA = {
  capricorne:{ s:[[16,40,1.7],[28,32,1.3],[44,45,1.1],[58,39,1.2],[75,32,1.6],[83,55,1.8],[65,67,1.3],[46,64,1.1],[31,56,1.3]],
    l:[[0,1,3,4,5,6,7,8,0]] },
  balance:{ s:[[30,28,1.7],[56,22,1.4],[71,43,1.6],[48,51,1.1],[25,59,1.3],[80,68,1.3]],
    l:[[0,1,2,3,0],[3,4],[2,5]] },
  gemeaux:{ s:[[32,15,1.9],[57,19,1.9],[30,38,1.2],[28,60,1.1],[34,82,1.3],[59,42,1.2],[62,64,1.1],[67,85,1.3],[20,88,1.0],[74,90,1.0]],
    l:[[0,2,3,4,8],[1,5,6,7,9],[0,1]] }
};
function buildConstellationSVG(key){
  const d=CONST_DATA[key];
  const lines=d.l.map(seq=>`<polyline points="${seq.map(i=>d.s[i][0]+","+d.s[i][1]).join(" ")}"/>`).join("");
  const stars=d.s.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}"/>`).join("");
  return `<svg viewBox="0 0 100 100" class="const-svg" aria-hidden="true"><g class="c-lines">${lines}</g><g class="c-stars">${stars}</g></svg>`;
}

// Médaillons : portraits photographiques (domaine public) enchâssés dans un cadre circulaire.
function medallionPhoto(key, src){
  return `<svg viewBox="0 0 120 120" class="medallion" role="img">
    <circle class="med-bg" cx="60" cy="60" r="56"/>
    <clipPath id="mcp_${key}"><circle cx="60" cy="60" r="52"/></clipPath>
    <image href="${src}" x="8" y="8" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#mcp_${key})"/>
    <circle class="med-ring2" cx="60" cy="60" r="49"/>
    <circle class="med-rim" cx="60" cy="60" r="56"/>
  </svg>`;
}
const _HAS_PORTRAITS = (typeof PORTRAITS !== "undefined");
const FIGURE_ART = ["pythagore","cleopatre","tesla"].reduce((o,k)=>{
  o[k] = (_HAS_PORTRAITS && PORTRAITS[k]) ? medallionPhoto(k, PORTRAITS[k]) : "";
  return o;
}, {});

/* ---------------- Le ciel du moment ----------------
   Positions et rétrogradations calculées à la volée (voir transits.js).
   Rien n'est codé en dur : la page dit ce que le ciel fait aujourd'hui. */
function fmtJour(d){
  if(!d) return "";
  return d.toLocaleDateString(LANG === "en" ? "en-GB" : "fr-FR", { day:"numeric", month:"long" });
}
/* Cache : le calcul est rapide mais inutile à refaire à chaque bascule de langue. */
let cielDuJour = null;
function ciel(){ if(!cielDuJour) cielDuJour = skyAt(new Date()); return cielDuJour; }

function nomPlanete(nom){ return U().sky.planets[nom]; }
function nomSigne(s){ return L().signs[s].name; }

/* Ligne « Saturne en Bélier, 14° · depuis le 26 juillet, jusqu'au 10 décembre » */
function ligneCorps(c, s){
  const p = nomPlanete(c.nom);
  const dates = [c.debut ? s.since(fmtJour(c.debut)) : "", c.fin ? s.until(fmtJour(c.fin)) : ""]
    .filter(Boolean).join(" · ");
  return `
    <article class="sky-card${c.lente ? " is-slow" : ""}">
      <div class="sky-head">
        <span class="sky-glyph" aria-hidden="true">${p.symbole}</span>
        <div>
          <h4>${s.inSign(p.nom, nomSigne(c.signe), c.degre)}</h4>
          <p class="sky-theme">${p.theme}</p>
        </div>
        <span class="sky-badge">℞</span>
      </div>
      <p>${p.retro}</p>
      ${dates ? `<p class="sky-dates">${dates}</p>` : ""}
      ${c.lente ? `<p class="sky-slow">${s.slowNote}</p>` : ""}
    </article>`;
}

function renderSky(){
  const box = document.getElementById("sky-now");
  if(!box) return;
  const s = U().sky, c = ciel();
  const retro = c.retrogrades;
  // les cycles longs passent après : ils concernent une génération, pas un jour
  const ordre = [...retro].sort((a, b) => (a.lente - b.lente));
  box.innerHTML = `
    <div class="sky-wrap">
      <p class="eyebrow">${s.eyebrow}</p>
      <h2 class="sky-title">${s.title}</h2>
      <p class="sky-lead">${s.lead}</p>
      ${retro.length ? `
        <h3 class="sky-sub">${s.retroTitle}</h3>
        <div class="sky-grid">${ordre.map(x => ligneCorps(x, s)).join("")}</div>
      ` : `<p class="sky-calm">${s.calm}</p>`}
      <p class="sky-note">${s.disclaimer}</p>
    </div>`;
}

/* ---------------- Le ciel appliqué à un profil ----------------
   Un transit ne dit rien tout seul : il faut qu'il touche un point du thème.
   Sans heure de naissance on n'a que le Soleil, et on le signale. */
function transitBlock(p, t){
  const s = U().sky;
  const points = {
    soleil: p.lonSun,
    lune: p.moon ? p.moon.lon : null,
    ascendant: p.asc ? p.asc.lon : null,
  };
  const { touches } = transitsFor(points, new Date());
  // on garde les rencontres les plus parlantes, sans noyer la page
  const retenus = touches.slice(0, 4);

  const ligne = (x) => {
    const pl = nomPlanete(x.planete);
    const cible = s.points[x.point];
    return `
      <div class="tr-row">
        <div class="tr-head">
          <span class="sky-glyph" aria-hidden="true">${pl.symbole}</span>
          <strong>${pl.nom}${x.corps.retro ? " ℞" : ""} ${LANG==="en"?"in":"en"} ${nomSigne(x.corps.signe)}</strong>
          ${x.exact ? `<span class="tr-exact">${s.exact}</span>` : ""}
        </div>
        <p>${s.aspects[x.cle](pl.nom, cible)}</p>
        <p class="tr-theme">${x.corps.retro ? pl.retro : pl.direct}</p>
      </div>`;
  };

  return `
    <section class="synth sky-profile">
      <div class="card-tag"><span class="dot"></span><span>${s.eyebrow}</span></div>
      <h3>${s.profileTitle}</h3>
      <p>${s.profileLead}</p>
      ${retenus.length ? retenus.map(ligne).join("") : `<p class="sky-calm">${s.none}</p>`}
      ${p.birth ? "" : `<p class="sky-note">${s.noteNoBirth}</p>`}
      <p class="sky-note">${s.disclaimer}</p>
    </section>`;
}

function renderHeritage(){
  const t=U(), Lp=L(), h=t.heritage;
  const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set("her-eyebrow",h.eyebrow); set("her-title",h.title); set("her-intro",h.intro); set("milkyway-cap",h.milkyway);
  set("sky-label",h.skyLabel); set("num-label",h.numLabel); set("fig-label",h.figLabel);

  document.getElementById("constellations").innerHTML =
    ["capricorne","balance","gemeaux"].map(k=>{ const s=Lp.signs[k];
      return `<figure class="const-card">${buildConstellationSVG(k)}
        <figcaption><span class="const-name">${s.symbol} ${s.name}</span><span class="const-cap">${h.constellations[k]}</span></figcaption></figure>`;
    }).join("");

  document.getElementById("num-triptych").innerHTML =
    [11,9,2].map(n=>{ const num=Lp.numbers[n];
      return `<div class="num-card"><span class="num-big">${n}</span><span class="num-title">${num.titre}</span><span class="num-word">${num.mots[0]}</span></div>`;
    }).join("");

  document.getElementById("figures").innerHTML =
    h.figures.map(f=>`<figure class="fig-card">${FIGURE_ART[f.key]}
      <figcaption><span class="fig-name">${escapeHtml(f.name)}</span><span class="fig-dates">${f.dates}</span><span class="fig-note">${f.note}</span></figcaption></figure>`).join("");

  set("bcta-eyebrow",t.birthCta.eyebrow); set("bcta-title",t.birthCta.title); set("bcta-text",t.birthCta.text);
  const bt=document.getElementById("bcta-btn"); if(bt) bt.textContent=t.birthCta.button;
}

/* ---------------- Voie lactée (Canvas) ---------------- */
function initMilkyWay(){
  const c=document.getElementById("milkyway"); if(!c) return;
  const ctx=c.getContext("2d");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars=[], W=0, H=0, dpr=Math.min(window.devicePixelRatio||1, 2);
  function build(){
    W=c.clientWidth; H=c.clientHeight; if(W===0) return;
    c.width=W*dpr; c.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    stars=[];
    const band=200; // stars concentrées le long d'une diagonale = la bande galactique
    for(let i=0;i<band;i++){
      const t=Math.random(); const bx=t*W; const by=H*0.85 - t*H*0.7;
      const spread=(Math.random()+Math.random()+Math.random()-1.5)*46; // ~gaussien
      const nx=-0.7, ny=-0.7;
      stars.push({ x:bx+spread*(-ny), y:by+spread*(nx), r:Math.random()*1.1+0.3, a:Math.random()*0.5+0.4, ph:Math.random()*6.28, band:true });
    }
    for(let i=0;i<90;i++){ stars.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*0.9+0.2, a:Math.random()*0.4+0.2, ph:Math.random()*6.28, band:false }); }
  }
  function draw(time){
    if(W===0){ build(); }
    ctx.clearRect(0,0,W,H);
    // halo diffus de la bande
    const g=ctx.createLinearGradient(0,H,W,0);
    g.addColorStop(0,"rgba(120,110,180,0)"); g.addColorStop(0.5,"rgba(150,135,210,0.10)"); g.addColorStop(1,"rgba(120,110,180,0)");
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    for(const s of stars){
      const tw = reduce ? 1 : (0.65+0.35*Math.sin(time/900+s.ph));
      ctx.globalAlpha=s.a*tw; ctx.fillStyle="#f3f0ea";
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.2832); ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  build();
  if(reduce){ draw(0); }
  else { let raf; const loop=t=>{ draw(t); raf=requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  let rt; window.addEventListener("resize", ()=>{ clearTimeout(rt); rt=setTimeout(()=>{ build(); if(reduce) draw(0); }, 200); });
}

function applyI18n(){
  document.documentElement.lang = LANG;
  document.getElementById("lang-toggle").textContent = LANG==="fr" ? "EN" : "FR";
  // textes simples
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const v=resolve(U(), el.dataset.i18n); if(v!=null) el.textContent=v; });
  // hero riche
  const h=U().hero;
  document.getElementById("h-t1").textContent=h.t1;
  document.getElementById("h-t2").textContent=h.t2;
  document.getElementById("h-t3").textContent=h.t3;
  document.getElementById("h-sub").textContent=h.sub;
  document.getElementById("h-cta1").textContent=h.cta1;
  document.getElementById("h-cta2").textContent=h.cta2;
  document.getElementById("h-note").textContent=h.note;
  // lentilles (avec CTA)
  const lensBox=document.getElementById("lenses");
  lensBox.innerHTML = U().lenses.map(x=>
    `<article class="lens">
       <span class="lens-idx">${x.i}</span>
       <h3>${x.h}</h3>
       <p>${x.p}</p>
       ${x.tag?`<span class="lens-tag">${x.tag}</span>`:""}
       <button class="lens-cta" ${x.to==="consult"?`data-scroll="consult"`:`data-nav="${x.to}"`}>${x.cta} <span aria-hidden="true">→</span></button>
     </article>`).join("");
  lensBox.querySelectorAll(".lens-cta").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.scroll){ const el=document.getElementById(b.dataset.scroll); if(el) el.scrollIntoView({behavior:"smooth"}); }
    else go(b.dataset.nav);
  }));
  // CTA de synthèse sous les lentilles
  const lct=document.getElementById("lenses-cta-text"); if(lct) lct.textContent=U().lensesCta.text;
  const lcb=document.getElementById("lenses-cta-btn"); if(lcb) lcb.textContent=U().lensesCta.button;
  // manifeste
  document.getElementById("m1").textContent=U().manifesto1;
  document.getElementById("mem").textContent=U().manifestoEm;
  document.getElementById("m2").textContent=U().manifesto2;
  // méthode + footer
  document.getElementById("method-body").innerHTML=L().method;
  document.getElementById("footer-text").textContent=U().footer;
  // placeholders
  document.getElementById("f-name").placeholder=U().fNamePh;
  document.getElementById("ra-name").placeholder=U().youOften;
  document.getElementById("rb-name").placeholder=U().theOther;
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{ const v=resolve(U(), el.dataset.i18nPh); if(v!=null) el.placeholder=v; });
  // contexte du miroir
  const mc=document.getElementById("mir-ctx");
  if(mc){ const cur=mc.value; mc.innerHTML=Object.keys(U().ctx).map(k=>`<option value="${k}">${U().ctx[k]}</option>`).join(""); if(cur) mc.value=cur; }
  // selects
  fillSelectMbti(document.getElementById("f-mbti"));
  fillSelectMbti(document.getElementById("ra-mbti"));
  fillSelectMbti(document.getElementById("rb-mbti"));
  fillCities(); renderContextCards(); buildQuiz();
  renderSky();
  renderHeritage();
  renderJung();
  renderFamille();
  renderConsult();
  renderTarifs();
  renderSavedPicker();
}

document.getElementById("lang-toggle").addEventListener("click", ()=>{
  LANG = LANG==="fr" ? "en" : "fr";
  localStorage.setItem("prisme-lang", LANG);
  applyI18n();
  // re-rendu des résultats affichés
  if(lastProfile) renderProfile(lastProfile);
  if(lastRelation) renderRelation(lastRelation.a, lastRelation.b, lastRelation.ctx);
  if(lastMirror) renderMirrorResult(lastMirror.a, lastMirror.b, lastMirror.ctx);
});

/* ---------------- Segmented control quiz/known ---------------- */
let mbtiMode="quiz";
document.querySelectorAll(".seg-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".seg-btn").forEach(b=>b.classList.remove("is-active"));
    btn.classList.add("is-active"); mbtiMode=btn.dataset.mode;
    document.querySelector(".mbti-quiz").hidden = mbtiMode!=="quiz";
    document.querySelector(".mbti-known").hidden = mbtiMode!=="known";
  });
});
function scoreQuiz(){
  const tally={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  for(let i=0;i<L().quiz.length;i++){
    const picked=document.querySelector(`input[name="q${i}"]:checked`);
    if(!picked) return null;
    tally[L().quiz[i][picked.value].pole]++;
  }
  const pick=(a,b)=> tally[a]>=tally[b]?a:b;
  return pick("E","I")+pick("S","N")+pick("T","F")+pick("J","P");
}

/* ---------------- Construction d'un profil ---------------- */
function computeProfile(name, dateStr, mbti, birth){
  const [ ,m,d]=dateStr.split("-").map(Number);
  const p={ name, date:dateStr, mbti, sign:sunSign(m,d), life:lifePath(dateStr),
            expr:nameNumber(name,false), intime:nameNumber(name,true) };
  // longitude solaire exacte : sert aux transits. Sans heure connue, midi UT —
  // le Soleil bouge d'un degré par jour, l'erreur reste sous le demi-degré.
  {
    const [Y,Mo,D]=dateStr.split("-").map(Number);
    const ut = (birth && birth.time) ? (()=>{ const [hh,mm]=birth.time.split(":").map(Number);
                                              return hh + mm/60 - birth.tz; })() : 12;
    p.lonSun = sunLongitude(julianDay(Y,Mo,D,ut));
  }
  p.el = L().signs[p.sign].element;
  if(birth && birth.time && birth.lat!=null && birth.lon!=null && birth.tz!=null){
    p.birth=birth;
    const c=computeCelestial(dateStr, birth.time, birth.tz, birth.lat, birth.lon);
    p.moon=c.moon; p.asc=c.asc;
  }
  return p;
}

/* ---------------- Rendu profil ---------------- */
let lastProfile=null;
function renderProfile(p){
  lastProfile=p;
  // recalcule les données célestes selon les nouvelles clés de langue si besoin
  if(p.birth){ const c=computeCelestial(p.date, p.birth.time, p.birth.tz, p.birth.lat, p.birth.lon); p.moon=c.moon; p.asc=c.asc; }
  p.el = L().signs[p.sign].element;
  const t=U(), Lp=L();
  const sign=Lp.signs[p.sign], lp=Lp.numbers[p.life], expr=Lp.numbers[p.expr], intime=Lp.numbers[p.intime], type=Lp.mbti[p.mbti];
  const synth=Lp.build.synthesis(p, Lp);

  const ascBadge = p.asc ? `<span class="badge">${t.bAsc} <b>${Lp.signs[p.asc.sign].symbol} ${Lp.signs[p.asc.sign].name}</b></span>` : "";
  const moonBadge = p.moon ? `<span class="badge">${t.bMoon} <b>${Lp.signs[p.moon.sign].symbol} ${Lp.signs[p.moon.sign].name}</b></span>` : "";

  const celestialBlock = (p.asc||p.moon) ? `
    <div class="mini celestial">
      <div class="cel-row"><span class="cel-lab">☉ ${t.sunLabel}</span><span>${sign.symbol} ${sign.name}</span></div>
      ${p.asc?`<div class="cel-row"><span class="cel-lab">↑ ${t.ascLabel}</span><span>${Lp.signs[p.asc.sign].symbol} ${Lp.signs[p.asc.sign].name} · ${p.asc.deg}°</span></div>`:""}
      ${p.moon?`<div class="cel-row"><span class="cel-lab">☾ ${t.moonLabel}</span><span>${Lp.signs[p.moon.sign].symbol} ${Lp.signs[p.moon.sign].name} · ${p.moon.deg}°</span></div>`:""}
      ${placeRow(p, t)}
      <p class="cel-explain">${Lp.build.celestial(p, Lp)}</p>
      ${(p.birth&&p.birth.dst)?`<p class="cel-dst">☀ ${t.dstApplied}</p>`:""}
    </div>` : "";

  const saved = isSaved(p);
  document.getElementById("profile-out").innerHTML=`
    <div class="result-head">
      <p class="eyebrow">${t.resultEyebrow}</p>
      <h1 class="result-name">${escapeHtml(p.name)}</h1>
      <div class="result-badges">
        <span class="badge">${sign.symbol} <b>${sign.name}</b> · ${Lp.elements[p.el].name}</span>
        ${ascBadge}${moonBadge}
        <span class="badge">${t.bLife} <b>${numLabel(p.life)}</b> · ${lp.titre}</span>
        <span class="badge">${t.bMbti} <b>${p.mbti}</b> · ${type.nom}</span>
      </div>
    </div>

    <div class="cards">
      <article class="card">
        <div class="card-tag"><span class="dot"></span><span>${t.lens01}</span></div>
        <h3>${sign.symbol} ${sign.name}</h3>
        <p class="sub">${Lp.elements[p.el].name} · ${sign.modalite} · ${sign.astre} · ${sign.dates}</p>
        <div class="chips">${sign.mots.map(m=>`<span class="chip">${m}</span>`).join("")}</div>
        <p>${sign.desc}</p>
        <div class="mini"><strong>${t.force}</strong><p>${sign.force}</p></div>
        <div class="mini"><strong>${t.chantier}</strong><p>${sign.travail}</p></div>
        ${celestialBlock}
      </article>

      <article class="card">
        <div class="card-tag"><span class="dot"></span><span>${t.lens02}</span></div>
        <h3>${numLabel(p.life)} · ${lp.titre}</h3>
        <p class="sub">${t.bLife}${lp.maitre?` · ${t.masterNum}`:""}</p>
        <div class="chips">${lp.mots.map(m=>`<span class="chip">${m}</span>`).join("")}</div>
        <p>${lp.desc}</p>
        <div class="mini"><strong>${t.otherNumbers}</strong>
          <dl class="kv">
            <dt>${Lp.numFrames.expression.label} · ${numLabel(p.expr)}</dt><dd>${expr.titre} — ${Lp.numFrames.expression.role}</dd>
            <dt>${Lp.numFrames.intime.label} · ${numLabel(p.intime)}</dt><dd>${intime.titre} — ${Lp.numFrames.intime.role}</dd>
          </dl>
        </div>
      </article>

      <article class="card">
        <div class="card-tag"><span class="dot"></span><span>${t.lens03}</span></div>
        <h3>${p.mbti}</h3>
        <p class="sub">${type.nom} · ${type.groupe}</p>
        <p>${type.desc}</p>
        <div class="mini"><strong>${t.force}</strong><p>${type.force}</p></div>
      </article>

      ${histCard(t)}
    </div>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${t.synthTag}</span></div>
      <h3>${t.synthTitle}</h3>
      <p class="lead">${synth.lead}</p>
      ${synth.paras.map(x=>`<p>${x}</p>`).join("")}
      <p>${synth.converge}</p>
    </section>

    ${transitBlock(p, t)}
    ${histPanel(t)}
    <div class="result-actions no-print">
      <button class="btn btn-primary" id="act-compare">${t.actCompare}</button>
      <button class="btn btn-ghost" id="act-save">${saved?t.actSaved:t.actSave}</button>
      <button class="btn btn-ghost" id="act-print">${t.actPrint}</button>
      <button class="btn btn-ghost" id="act-redo">${t.actRedo}</button>
    </div>
  `;

  bindHist();

  document.getElementById("act-compare").addEventListener("click", ()=>{
    document.getElementById("ra-name").value=p.name;
    document.getElementById("ra-date").value=p.date;
    document.getElementById("ra-mbti").value=p.mbti;
    go("relation");
  });
  document.getElementById("act-redo").addEventListener("click", ()=>go("create"));
  document.getElementById("act-print").addEventListener("click", ()=>window.print());
  document.getElementById("act-save").addEventListener("click", e=>{
    saveProfile(p); e.target.textContent=t.actSaved; renderSavedPicker();
  });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
/* Décalage horaire lisible : 1 → « 1 », 5,75 → « 5:45 » (Népal, Inde, etc.). */
function fmtOffset(h){
  const m=Math.round(h*60), hh=Math.floor(m/60), mm=m%60;
  return mm ? `${hh}:${String(mm).padStart(2,"0")}` : String(hh);
}
/* Ligne « lieu » du bloc céleste : ville, pays et décalage réellement appliqué. */
function placeRow(p, t){
  const txt = p.birth ? Geo.refLabel(p.birth.place, LANG) : "";
  if(!txt) return "";
  const off = `${t.utcShort}${p.birth.tz>=0?"+":"−"}${fmtOffset(Math.abs(p.birth.tz))}`;
  return `<div class="cel-row"><span class="cel-lab">⌖ ${t.placeLabel}</span><span>${escapeHtml(txt)} · ${off}</span></div>`;
}
function showErr(el,msg){ el.textContent=msg; el.hidden=false; }
function firstName(n){ return n.trim().split(/\s+/)[0]; }

/* ---------------- Soumission profil ---------------- */
document.getElementById("profile-form").addEventListener("submit", e=>{
  e.preventDefault();
  const err=document.getElementById("form-error"); err.hidden=true;
  const name=document.getElementById("f-name").value.trim();
  const date=document.getElementById("f-date").value;
  if(!name||!date) return showErr(err,U().errFields);
  if(normalize(name).length<2) return showErr(err,U().errName);

  let mbti;
  if(mbtiMode==="quiz"){ mbti=scoreQuiz(); if(!mbti) return showErr(err,U().errQuiz); }
  else { mbti=document.getElementById("f-mbti").value; if(!mbti) return showErr(err,U().errMbti); }

  // heure & lieu
  const time=document.getElementById("f-time").value;
  let birth=null;
  if(time){
    const latM=parseFloat(document.getElementById("f-lat").value);
    const lonM=parseFloat(document.getElementById("f-lon").value);
    const tzM =parseFloat(document.getElementById("f-tz").value);
    if(!Number.isNaN(latM)&&!Number.isNaN(lonM)&&!Number.isNaN(tzM)){
      birth={ time, lat:latM, lon:lonM, tz:tzM, place:"—" };
    } else if(chosenCity){
      const c=chosenCity;
      // décalage réel du fuseau à cette date : règles historiques comprises
      const off=Geo.birthOffset(Geo.zoneName(c), date, time, c.lon);
      birth={ time, lat:c.lat, lon:c.lon, tz:off.tz, place:Geo.ref(c), dst:off.dst, zone:off.zone };
    } else {
      return showErr(err,U().errBirth);
    }
  }
  renderProfile(computeProfile(name,date,mbti,birth));
  go("profile");
});

/* ---------------- Relation ---------------- */
let lastRelation=null;
function renderRelation(pa, pb, ctx){
  lastRelation={ a:pa, b:pb, ctx };
  const t=U(), Lp=L();
  pa.el=Lp.signs[pa.sign].element; pb.el=Lp.signs[pb.sign].element;
  const elS=elementScore(pa.el,pb.el), liS=lifeScore(pa.life,pb.life), mbS=mbtiScore(pa.mbti,pb.mbti);
  const global=Math.round((elS+liS+mbS)/3);
  const sh=mbtiShared(pa.mbti,pb.mbti), comp=pa.mbti[1]===pb.mbti[1];
  const sa=Lp.signs[pa.sign], sb=Lp.signs[pb.sign];

  document.getElementById("relation-out").innerHTML=`
    <div class="rel-head">
      <p class="eyebrow">${t.relReadFor} · ${t.ctx[ctx].toLowerCase()}</p>
      <div class="rel-names">${escapeHtml(firstName(pa.name))} <span class="rel-plus">+</span> ${escapeHtml(firstName(pb.name))}</div>
      <div class="rel-score">
        <div class="meter"><div class="meter-fill" style="width:0%"></div></div>
        <span class="meter-val">${global}/100 · ${t.resonance}</span>
      </div>
      <p class="hero-note">${t.relDisclaimer}</p>
    </div>

    <div class="cards">
      <article class="card">
        <div class="card-tag"><span class="dot"></span><span>${Lp.elements[pa.el].name} & ${Lp.elements[pb.el].name}</span></div>
        <h3>${sa.symbol} ${sa.name} &amp; ${sb.symbol} ${sb.name}</h3>
        <p>${Lp.build.relElement(pa.el,pb.el,elS,Lp)}</p>
      </article>
      <article class="card">
        <div class="card-tag"><span class="dot"></span><span>${t.bLife} · ${numLabel(pa.life)} & ${numLabel(pb.life)}</span></div>
        <h3>${t.bLife} ${numLabel(pa.life)} &amp; ${numLabel(pb.life)}</h3>
        <p>${Lp.build.relLife(pa.life,pb.life,liS,numRoot(pa.life),numRoot(pb.life))}</p>
      </article>
      <article class="card">
        <div class="card-tag"><span class="dot"></span><span>MBTI · ${pa.mbti} & ${pb.mbti}</span></div>
        <h3>${Lp.mbti[pa.mbti].nom} &amp; ${Lp.mbti[pb.mbti].nom}</h3>
        <p>${Lp.build.relMbti(pa.mbti,pb.mbti,sh,comp)}</p>
      </article>
    </div>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${t.relHowTitle}</span></div>
      <h3>${t.relHowTitle}</h3>
      <p class="lead">${Lp.build.relLead}</p>
      <p>${Lp.build.relContext(ctx)}</p>
      <p>${Lp.build.relClosing(firstName(pa.name), Lp.mbti[pa.mbti].relation, firstName(pb.name), Lp.mbti[pb.mbti].relation)}</p>
    </section>

    <div class="rel-mirror-cta">
      <p>${t.relMirror.text}</p>
      <button class="btn btn-accent-outline" id="rel-to-mirror">${t.relMirror.button}</button>
    </div>

    <div class="result-actions no-print">
      <button class="btn btn-ghost" id="rel-print">${t.actPrint}</button>
    </div>
  `;
  document.getElementById("rel-print").addEventListener("click", ()=>window.print());
  document.getElementById("rel-to-mirror").addEventListener("click", ()=>{
    const mc=document.getElementById("mir-ctx"); if(mc) mc.value=ctx;
    const ma=document.getElementById("ma-name"), mb=document.getElementById("mb-name");
    if(ma) ma.value=firstName(pa.name);
    if(mb) mb.value=firstName(pb.name);
    go("mirror");
  });
  document.getElementById("relation-out").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>{ const f=document.querySelector("#relation-out .meter-fill"); if(f) f.style.width=global+"%"; },120);
}

document.getElementById("relation-form").addEventListener("submit", e=>{
  e.preventDefault();
  const err=document.getElementById("relation-error"); err.hidden=true;
  const na=document.getElementById("ra-name").value.trim(), da=document.getElementById("ra-date").value, ma=document.getElementById("ra-mbti").value;
  const nb=document.getElementById("rb-name").value.trim(), db=document.getElementById("rb-date").value, mb=document.getElementById("rb-mbti").value;
  const ctx=relCtx;
  if(!na||!da||!ma||!nb||!db||!mb) return showErr(err,U().errRelation);
  renderRelation(computeProfile(na,da,ma,null), computeProfile(nb,db,mb,null), ctx);
});

/* ---------------- Miroir (médiation de conflit) ---------------- */
let lastMirror=null;
function renderMirrorResult(a, b, ctx){
  lastMirror={ a, b, ctx };
  const m=U().mirror, t=U();
  const q=s=> s ? `<q>${escapeHtml(s)}</q>` : "<q>—</q>";
  const recap=(p)=>`
    <dl class="mirror-recap">
      <dt>${m.recitLabel}</dt><dd>${escapeHtml(p.recit)||"—"}</dd>
      <dt>${m.ressentiLabel}</dt><dd>${escapeHtml(p.ressenti)||"—"}</dd>
      ${p.besoin?`<dt>${m.besoinLabel}</dt><dd>${escapeHtml(p.besoin)}</dd>`:""}
    </dl>`;
  const gapRow=(x, y)=>`
    <div class="gap-row">
      <p><span class="who">${escapeHtml(firstName(x.name))}</span> ${m.imagined} ${q(x.autre)}.</p>
      <p><span class="who">${escapeHtml(firstName(y.name))}</span> ${m.reallyFelt} ${q(y.ressenti)}${y.besoin?` — ${m.theirNeed} ${q(y.besoin)}`:""}.</p>
    </div>`;

  document.getElementById("mirror-out").innerHTML=`
    <div class="rel-head">
      <p class="eyebrow">${m.rTitle} · ${t.ctx[ctx].toLowerCase()}</p>
      <div class="rel-names">${escapeHtml(firstName(a.name))} <span class="rel-plus">⇄</span> ${escapeHtml(firstName(b.name))}</div>
      <p class="hero-note">${m.rIntro}</p>
    </div>
    <div class="cards">
      <article class="card"><div class="card-tag"><span class="dot"></span><span>${escapeHtml(firstName(a.name))}</span></div>${recap(a)}</article>
      <article class="card"><div class="card-tag"><span class="dot"></span><span>${escapeHtml(firstName(b.name))}</span></div>${recap(b)}</article>
    </div>
    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${m.gapTitle}</span></div>
      <h3>${m.gapTitle}</h3>
      <div class="mirror-gap">${gapRow(a,b)}${gapRow(b,a)}</div>
    </section>
    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${m.promptsTitle}</span></div>
      <h3>${m.promptsTitle}</h3>
      <ul class="prose-list">${m.prompts.map(p=>`<li>${p}</li>`).join("")}</ul>
      <p class="lead">${m.closing}</p>
    </section>
    <section class="synth mir-ai" id="mir-ai"></section>
    <div class="result-actions no-print">
      <button class="btn btn-ghost" id="mir-restart">${m.restart}</button>
      <button class="btn btn-ghost" id="mir-print">${t.actPrint}</button>
    </div>`;
  renderMirrorAI();
  document.getElementById("mir-restart").addEventListener("click", ()=>{ document.getElementById("mirror-form").reset(); document.getElementById("mirror-out").innerHTML=""; lastMirror=null; lastMediation=null; window.scrollTo({top:0,behavior:"smooth"}); });
  document.getElementById("mir-print").addEventListener("click", ()=>window.print());
  document.getElementById("mirror-out").scrollIntoView({behavior:"smooth"});
}

document.getElementById("mirror-form").addEventListener("submit", e=>{
  e.preventDefault();
  const err=document.getElementById("mirror-error"); err.hidden=true;
  const g=id=>document.getElementById(id).value.trim();
  const a={ name:g("ma-name")||"A", recit:g("ma-recit"), ressenti:g("ma-ressenti"), besoin:g("ma-besoin"), autre:g("ma-autre") };
  const b={ name:g("mb-name")||"B", recit:g("mb-recit"), ressenti:g("mb-ressenti"), besoin:g("mb-besoin"), autre:g("mb-autre") };
  const ctx=document.getElementById("mir-ctx").value||"couple";
  if(!a.recit||!a.ressenti||!b.recit||!b.ressenti) return showErr(err, U().mirror.err);
  lastMediation=null;
  renderMirrorResult(a, b, ctx);
});

/* ---------------- Miroir : la lecture du tiers (IA) ----------------
   Seule fonction du site qui sort du navigateur : les deux récits sont
   envoyés pour analyse. D'où le consentement explicite avant l'envoi, et le
   rappel affiché à côté du bouton. Voir mirror-ai.js. */
let lastMediation = null;

function renderMirrorAI(){
  const box = document.getElementById("mir-ai");
  if(!box || !lastMirror) return;
  if(lastMediation){ paintMediation(lastMediation); return; }

  const m = U().mirror.ai;
  const pret = MirrorAI.mode() !== "aucun";
  box.innerHTML = `
    <div class="card-tag"><span class="dot"></span><span>${m.tag}</span></div>
    <h3>${m.title}</h3>
    <p>${m.text}</p>
    <p class="ai-privacy">⚠ ${m.privacy}</p>
    ${pret ? `
      <label class="ai-consent"><input type="checkbox" id="mir-ai-ok" /> <span>${m.consent}</span></label>
      ${/* L'histoire est celle du profil ouvert : sans profil affiché, rien à joindre. */
        histLoad().length ? `<label class="ai-consent"><input type="checkbox" id="mir-ai-hist" /> <span>${U().histoire.mirrorConsent}</span></label>` : ""}
      <button class="btn btn-accent" id="mir-ai-go" disabled>${m.button}</button>
    ` : `
      <p class="ai-setup">${m.setup} ${m.setupKey}</p>
      <div class="ai-key">
        <input type="password" id="mir-ai-key" autocomplete="off" spellcheck="false" placeholder="${m.keyPh}" />
        <button class="btn btn-ghost" id="mir-ai-key-save">${m.keySave}</button>
      </div>
    `}
    <p class="ai-status" id="mir-ai-status" role="status" aria-live="polite"></p>`;

  const ok = document.getElementById("mir-ai-ok");
  const go = document.getElementById("mir-ai-go");
  if(ok && go){
    ok.addEventListener("change", ()=>{ go.disabled = !ok.checked; });
    go.addEventListener("click", runMediation);
  }
  const save = document.getElementById("mir-ai-key-save");
  if(save) save.addEventListener("click", ()=>{
    const v = document.getElementById("mir-ai-key").value.trim();
    if(!v) return;
    MirrorAI.setKey(v);
    renderMirrorAI();                       // repasse en mode « prêt »
    setAiStatus(U().mirror.ai.keyOk, "ok");
  });
}

function setAiStatus(msg, kind){
  const el = document.getElementById("mir-ai-status");
  if(!el) return;
  el.textContent = msg || "";
  el.className = "ai-status" + (kind ? " is-" + kind : "");
}

async function runMediation(){
  const m = U().mirror.ai;
  const go = document.getElementById("mir-ai-go");
  const ok = document.getElementById("mir-ai-ok");
  if(go){ go.disabled = true; go.textContent = m.loading; }
  if(ok) ok.disabled = true;
  setAiStatus(m.loadingLong, "wait");
  try {
    const { a, b, ctx } = lastMirror;
    // l'histoire de vie n'est jointe que si la case dédiée est cochée
    const joindre = document.getElementById("mir-ai-hist");
    const avec = (joindre && joindre.checked)
      ? [{ ...a, histoire: histPourAnalyse() }, { ...b }] : [a, b];
    lastMediation = await MirrorAI.analyse(avec[0], avec[1], ctx, LANG);
    paintMediation(lastMediation);
  } catch(e){
    const detail = m.errs[e.code] || m.errs.api;
    setAiStatus(detail, "err");
    if(go){ go.disabled = false; go.textContent = m.retry; }
    if(ok) ok.disabled = false;
    // une clé refusée : on la retire pour laisser ressaisir
    if(e.code === "cle" && MirrorAI.hasKey()){ MirrorAI.setKey(""); }
  }
}

/* Affiche la médiation. En cas d'alerte, elle passe avant tout le reste et le
   reste est volontairement réduit — une médiation symétrique serait à côté. */
function paintMediation(d){
  const box = document.getElementById("mir-ai");
  if(!box) return;
  const m = U().mirror.ai;
  const p = (s)=>`<p>${escapeHtml(s||"")}</p>`;
  const alerte = (d.alerte && d.alerte !== "aucune" && d.alerteTexte) ? `
    <div class="ai-alert ai-alert-${escapeHtml(d.alerte)}">
      <strong>${m.alertTitle}</strong>
      ${p(d.alerteTexte)}
    </div>` : "";

  const personne = (x)=>`
    <article class="card ai-person">
      <div class="card-tag"><span class="dot"></span><span>${escapeHtml(x.nom||"")}</span></div>
      <div class="mini"><strong>${m.lEntend}</strong>${p(x.entend)}</div>
      <div class="mini"><strong>${m.lBesoin}</strong>${p(x.besoin)}</div>
      <div class="mini"><strong>${m.lAngle}</strong>${p(x.angleMort)}</div>
    </article>`;

  const liste = (arr)=>`<ul class="prose-list">${(arr||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>`;

  box.innerHTML = `
    <div class="card-tag"><span class="dot"></span><span>${m.rTag}</span></div>
    <h3>${m.rTitle}</h3>
    ${alerte}
    <div class="mini"><strong>${m.sResume}</strong>${p(d.resume)}</div>
    <div class="ai-knot"><strong>${m.sNoeud}</strong>${p(d.noeud)}</div>
    <h4 class="ai-sub">${m.sChacun}</h4>
    <div class="cards cards-2">${(d.chacun||[]).map(personne).join("")}</div>
    <div class="mini"><strong>${m.sAccords}</strong>${liste(d.accords)}</div>
    <div class="mini"><strong>${m.sPistes}</strong>${liste(d.pistes)}</div>
    <div class="mini"><strong>${m.sADire}</strong>
      ${(d.aDire||[]).map(x=>`<p class="ai-say"><span class="who">${escapeHtml(x.nom||"")}</span> <q>${escapeHtml(x.phrase||"")}</q></p>`).join("")}
    </div>
    <p class="ai-disclaimer">${m.disclaimer}</p>`;
  box.scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ---------------- Sauvegarde (localStorage) ---------------- */
function loadSaved(){ try{ return JSON.parse(localStorage.getItem("prisme-profiles")||"[]"); }catch(_){ return []; } }
function storeSaved(list){ localStorage.setItem("prisme-profiles", JSON.stringify(list)); }
function profileKey(p){ return normalize(p.name)+"|"+p.date+"|"+p.mbti; }
function isSaved(p){ return loadSaved().some(x=>profileKey(x)===profileKey(p)); }
function saveProfile(p){
  const list=loadSaved();
  if(list.some(x=>profileKey(x)===profileKey(p))) return;
  list.push({ name:p.name, date:p.date, mbti:p.mbti, birth:p.birth||null });
  storeSaved(list);
}
function deleteSaved(key){ storeSaved(loadSaved().filter(x=>profileKey(x)!==key)); renderSavedPicker(); }

function renderSavedPicker(){
  const box=document.getElementById("saved-picker"); if(!box) return;
  const list=loadSaved(); const t=U();
  if(list.length===0){ box.hidden=true; return; }
  box.hidden=false;
  box.innerHTML=`<p class="saved-title">${t.savedTitle}</p>
    <div class="saved-list">${list.map(p=>`
      <div class="saved-chip">
        <span class="saved-name">${escapeHtml(firstName(p.name))} · ${p.mbti}</span>
        <span class="saved-acts">
          <button data-act="view" data-k="${escapeHtml(profileKey(p))}">${t.savedLoad}</button>
          <button data-act="a" data-k="${escapeHtml(profileKey(p))}">${t.savedA}</button>
          <button data-act="b" data-k="${escapeHtml(profileKey(p))}">${t.savedB}</button>
          <button data-act="del" data-k="${escapeHtml(profileKey(p))}" class="del">✕</button>
        </span>
      </div>`).join("")}</div>`;
  box.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    const p=loadSaved().find(x=>profileKey(x)===btn.dataset.k); if(!p) return;
    const act=btn.dataset.act;
    if(act==="del"){ deleteSaved(btn.dataset.k); return; }
    if(act==="view"){ renderProfile(computeProfile(p.name,p.date,p.mbti,p.birth)); go("profile"); return; }
    const pre = act==="a" ? "ra" : "rb";
    document.getElementById(pre+"-name").value=p.name;
    document.getElementById(pre+"-date").value=p.date;
    document.getElementById(pre+"-mbti").value=p.mbti;
  }));
}

/* ---------------- Appel : date de naissance ---------------- */
document.getElementById("bcta-form").addEventListener("submit", e=>{
  e.preventDefault();
  const d=document.getElementById("bcta-date").value;
  if(d) document.getElementById("f-date").value=d;
  go("create");
  const nameEl=document.getElementById("f-name"); if(nameEl) nameEl.focus();
});

/* ---------------- Prise de rendez-vous ---------------- */
(function(){
  const btn=document.getElementById("consult-btn"); if(!btn) return;
  btn.addEventListener("click", ()=>{
    if(CONSULT_LINK){ window.open(CONSULT_LINK, "_blank", "noopener"); return; }
    const note=document.getElementById("consult-note"); if(note) note.hidden=false;
  });
})();

/* ---------------- Init ---------------- */
applyI18n();
initMilkyWay();

/* ---------------- Histoire de vie ----------------
   Chaque événement, lu à travers l'âge qu'on avait, laisse une « version » de
   soi. Ces versions se taisent quand tout va bien et reprennent la parole sous
   tension : c'est ce que cette section rend visible.

   Données sensibles : elles restent dans le stockage local de l'appareil et ne
   partent que si l'utilisateur demande explicitement la lecture du tiers. */
const HIST_STORE = "prisme-histoire";
/* Une histoire par profil : les versions de soi appartiennent à une personne,
   pas à l'appareil. Sans ça, l'histoire de l'un s'afficherait sous le profil de
   l'autre dès qu'on en consulte deux sur la même machine. */
const HIST_ORPHAN = " sans-profil";

function histAll(){
  let brut = null;
  try { brut = localStorage.getItem(HIST_STORE); } catch(_){ return {}; }
  let v;
  try { v = JSON.parse(brut || "{}"); } catch(_){ return {}; }
  // Ancien format : un seul tableau, rattaché à personne.
  if(Array.isArray(v)) return v.length ? { [HIST_ORPHAN]: v } : {};
  return (v && typeof v === "object") ? v : {};
}
function histStore(all){
  try { localStorage.setItem(HIST_STORE, JSON.stringify(all)); } catch(_){}
}
/* L'histoire lue et écrite est celle du profil affiché. Hors profil, il n'y a
   rien à montrer — d'où le tableau vide. */
function histKey(){ return lastProfile ? profileKey(lastProfile) : ""; }

function histLoad(){
  const k = histKey();
  if(!k) return [];
  const all = histAll();
  if(Array.isArray(all[k])) return all[k];
  /* Reprise de l'ancien format : les moments saisis quand l'histoire était une
     section à part rejoignent le premier profil ouvert — celui de la personne
     qui les a saisis, dans la quasi-totalité des cas. */
  const sansProfil = all[HIST_ORPHAN];
  if(Array.isArray(sansProfil) && sansProfil.length){
    delete all[HIST_ORPHAN];
    all[k] = sansProfil;
    histStore(all);
    return sansProfil;
  }
  return [];
}
function histSave(list){
  const k = histKey();
  if(!k) return;
  const all = histAll();
  if(list.length) all[k] = list; else delete all[k];
  histStore(all);
}
/* L'étape de développement atteinte à cet âge : elle détermine ce que la
   personne pouvait faire de l'événement, pas sa gravité. */
function histStage(age){
  const st = U().histoire.stages;
  return st.find(s => age <= s.max) || st[st.length - 1];
}
function histTypes(){ return U().histoire.events; }

function fillHistTypes(){
  const sel = document.getElementById("hist-type");
  if(!sel) return;
  const cur = sel.value, h = U().histoire;
  sel.innerHTML = `<option value="">${h.typePick}</option>` +
    Object.entries(h.events).map(([k, v]) => `<option value="${k}">${escapeHtml(v.label)}</option>`).join("");
  if(cur) sel.value = cur;
}

/* Liste des moments enregistrés, du plus jeune au plus récent. */
function renderHistList(){
  const box = document.getElementById("hist-list");
  if(!box) return;
  const h = U().histoire, list = histLoad().slice().sort((a, b) => a.age - b.age);
  if(!list.length){ box.innerHTML = `<p class="hist-empty">${h.empty}</p>`; return; }
  box.innerHTML = `
    <h3 class="hist-sub">${h.timelineTitle}</h3>
    <ol class="hist-line">
      ${list.map((e, i) => `
        <li class="hist-item">
          <span class="hist-age">${escapeHtml(h.ageLabel(e.age))}</span>
          <span class="hist-what">${escapeHtml((h.events[e.type] || h.events.autre).label)}
            ${e.note ? `<em>— ${escapeHtml(e.note)}</em>` : ""}</span>
          <button type="button" class="hist-del" data-i="${i}" aria-label="${h.remove}">×</button>
        </li>`).join("")}
    </ol>
    <button type="button" class="btn btn-ghost hist-clear" id="hist-clear">${h.clearAll}</button>`;

  box.querySelectorAll(".hist-del").forEach(b => b.addEventListener("click", () => {
    const l = histLoad().slice().sort((a, b2) => a.age - b2.age);
    l.splice(+b.dataset.i, 1); histSave(l); histRefresh();
  }));
  const clr = document.getElementById("hist-clear");
  if(clr) clr.addEventListener("click", () => { histSave([]); histRefresh(); });
}

/* Une carte par version : ce que l'âge pouvait en faire, ce qu'elle en a
   conclu, ce qu'elle garde, ce qui la réveille, ce qui la calme. */
function histVersionCard(e){
  const h = U().histoire;
  const t = h.events[e.type] || h.events.autre;
  const st = histStage(e.age);
  return `
    <article class="card hist-version">
      <div class="card-tag"><span class="dot"></span><span>${escapeHtml(h.ageLabel(e.age))}</span></div>
      <h3>${escapeHtml(h.versionTitle(e.age))}</h3>
      <p class="sub">${escapeHtml(t.label)}${e.note ? ` — ${escapeHtml(e.note)}` : ""}</p>
      <div class="mini"><strong>${h.lRead}</strong><p>${escapeHtml(st.lecture)}</p></div>
      <div class="mini"><strong>${h.lBelief}</strong><p>${escapeHtml(t.croyance)}</p></div>
      <div class="mini"><strong>${h.lGuard}</strong><p>${escapeHtml(t.garde)}</p></div>
      <div class="mini"><strong>${h.lTrigger}</strong><p>${escapeHtml(t.declencheur)}</p></div>
      <div class="mini"><strong>${h.lSoothe}</strong><p>${escapeHtml(t.apaise)}</p></div>
    </article>`;
}

/* Sous tension, ce sont les versions les plus jeunes qui répondent en premier :
   elles se sont installées avant les mots, donc avant le recul. */
function histParTension(){
  return histLoad().slice().sort((a, b) => a.age - b.age);
}

function renderHistOut(){
  const box = document.getElementById("hist-out");
  if(!box) return;
  const h = U().histoire, list = histLoad().slice().sort((a, b) => a.age - b.age);
  if(!list.length){ box.innerHTML = ""; return; }
  const tension = histParTension().slice(0, 3);
  box.innerHTML = `
    <div class="hist-block">
      <h4>${h.versionsTitle}</h4>
      <p>${h.versionsLead}</p>
      <div class="cards hist-versions">${list.map(histVersionCard).join("")}</div>
    </div>
    <div class="hist-block">
      <h4>${h.conflictTitle}</h4>
      <p>${h.conflictLead}</p>
      <ol class="hist-tension">
        ${tension.map(e => {
          const t = h.events[e.type] || h.events.autre;
          return `<li><strong>${escapeHtml(h.versionTitle(e.age))}</strong> — ${escapeHtml(t.declencheur)}.
                  <span class="hist-soothe">${escapeHtml(t.apaise)}.</span></li>`;
        }).join("")}
      </ol>
      <p class="hist-care">${h.care}</p>
      <p class="sky-note">${h.disclaimer}</p>
    </div>`;
}

function renderHistoire(){
  fillHistTypes();
  renderHistList();
  renderHistOut();
}

/* La grille du profil et la carte de synthèse dépendent aussi des moments
   enregistrés : après un ajout ou un retrait, on refait le profil entier. */
function histRefresh(){
  if(lastProfile) renderProfile(lastProfile); else renderHistoire();
}
function histScroll(){
  const el = document.getElementById("hist-panel");
  if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
}

function histSubmit(e){
  e.preventDefault();
  const err = document.getElementById("hist-error"); err.hidden = true;
  const h = U().histoire;
  const age = parseInt(document.getElementById("hist-age").value, 10);
  const type = document.getElementById("hist-type").value;
  const note = document.getElementById("hist-note").value.trim();
  if(!Number.isInteger(age) || age < 0 || age > 120) return showErr(err, h.errAge);
  if(!type) return showErr(err, h.errType);
  histSave(histLoad().concat([{ age, type, note }]));
  histRefresh();
  histScroll();
}

/* Lentille 04 dans la grille du profil : ce que l'histoire ajoute aux trois
   autres, avec un raccourci vers le panneau qui la complète. */
function histCard(t){
  const h = U().histoire, list = histLoad();
  const tension = histParTension().slice(0, 2);
  return `
    <article class="card">
      <div class="card-tag"><span class="dot"></span><span>${t.lens04}</span></div>
      <h3>${h.profileTitle}</h3>
      <p class="sub">${escapeHtml(list.length ? h.count(list.length) : h.none)}</p>
      ${list.length ? `
        <p>${h.conflictLead}</p>
        <div class="mini"><strong>${h.conflictTitle}</strong>
          <ul class="hist-mini">${tension.map(e => {
            const ev = h.events[e.type] || h.events.autre;
            return `<li><strong>${escapeHtml(h.versionTitle(e.age))}</strong> — ${escapeHtml(ev.declencheur)}</li>`;
          }).join("")}</ul>
        </div>`
      : `<p>${h.profileNone}</p>`}
      <button class="btn btn-accent-outline hist-jump" data-hist-jump>${h.profileLink}</button>
    </article>`;
}

/* Le panneau complet vit dans le profil : on y saisit les moments et on y lit
   les versions qui en découlent. L'histoire de vie n'est pas une section à
   part — c'est une lentille du profil, au même titre que les trois autres. */
function histPanel(t){
  const h = U().histoire;
  return `
    <section class="synth hist-panel" id="hist-panel">
      <div class="card-tag"><span class="dot"></span><span>${t.lens04}</span></div>
      <h3>${h.title}</h3>
      <p class="lead">${h.lead}</p>
      <p class="hist-privacy">${h.privacy}</p>

      <form id="hist-form" class="form hist-form">
        <h4 class="hist-add-title">${h.addTitle}</h4>
        <div class="hist-fields">
          <div class="field hist-age"><label for="hist-age">${h.fAge}</label>
            <input id="hist-age" type="number" min="0" max="120" step="1" inputmode="numeric" /></div>
          <div class="field hist-type"><label for="hist-type">${h.fType}</label>
            <select id="hist-type"></select></div>
        </div>
        <div class="field"><label for="hist-note">${h.fNote}</label>
          <input id="hist-note" type="text" maxlength="120" placeholder="${escapeHtml(h.phNote)}" /></div>
        <button type="submit" class="btn btn-accent">${h.add}</button>
        <p class="form-error" id="hist-error" hidden></p>
      </form>

      <div id="hist-list"></div>
      <div id="hist-out"></div>
    </section>`;
}

/* Le panneau est rendu avec le profil : ses écouteurs sont donc à recâbler à
   chaque rendu. */
function bindHist(){
  const form = document.getElementById("hist-form");
  if(form) form.addEventListener("submit", histSubmit);
  document.querySelectorAll("[data-hist-jump]").forEach(b => b.addEventListener("click", histScroll));
  renderHistoire();
}

/* Résumé transmissible au tiers du Miroir — uniquement sur demande explicite. */
function histPourAnalyse(){
  const h = U().histoire;
  const list = histLoad().slice().sort((a, b) => a.age - b.age);
  if(!list.length) return "";
  return list.map(e => {
    const t = h.events[e.type] || h.events.autre;
    return `- ${h.ageLabel(e.age)} : ${t.label}${e.note ? ` (${e.note})` : ""}`;
  }).join("\n");
}
