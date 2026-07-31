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
  /* Le compte est un état de rangement, pas un résultat figé : il se recalcule
     à chaque ouverture, sinon un profil créé entre-temps n'y apparaît pas. */
  if(name === "compte") renderCompte();
  if(name === "reves") renderReves();
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
  /* Hamal, Sheratan, Mesarthim et 41 Arietis : la corne coudée du Bélier. */
  belier:{ s:[[72,30,1.9],[46,48,1.5],[36,57,1.1],[82,55,1.2]],
    l:[[2,1,0],[0,3]] }
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
    ["capricorne","balance","belier"].map(k=>{ const s=Lp.signs[k];
      return `<figure class="const-card">${buildConstellationSVG(k)}
        <figcaption><span class="const-name">${s.symbol} ${s.name}</span><span class="const-cap">${h.constellations[k]}</span></figcaption></figure>`;
    }).join("");

  document.getElementById("num-triptych").innerHTML =
    [11,9,3].map(n=>{ const num=Lp.numbers[n];
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
  // prismes (avec CTA)
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
  // CTA de synthèse sous les prismes
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
  /* Le compte est défini plus bas dans le fichier : appelé depuis applyI18n(),
     qui tourne avant, il tomberait sur des variables pas encore initialisées. */
  renderAccountBtn();
  renderCreateCible();
  renderCompte();
  renderReves();
});

/* ---------------- Segmented control quiz/known ---------------- */
let mbtiMode="quiz";
document.querySelectorAll(".seg-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".seg-btn").forEach(b=>b.classList.remove("is-active"));
    btn.classList.add("is-active"); mbtiMode=btn.dataset.mode;
    document.querySelector(".mbti-quiz").hidden = mbtiMode!=="quiz";
    document.querySelector(".mbti-known").hidden = mbtiMode!=="known";
    document.querySelector(".mbti-unknown").hidden = mbtiMode!=="unknown";
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
  const sign=Lp.signs[p.sign], lp=Lp.numbers[p.life], expr=Lp.numbers[p.expr], intime=Lp.numbers[p.intime];
  const type=Lp.mbti[p.mbti] || null;   // absent tant que le type n'a pas de sens (un enfant)
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
        ${type ? `<span class="badge">${t.bMbti} <b>${p.mbti}</b> · ${type.nom}</span>` : ""}
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
        ${type ? `
          <h3>${p.mbti}</h3>
          <p class="sub">${type.nom} · ${type.groupe}</p>
          <p>${type.desc}</p>
          <div class="mini"><strong>${t.force}</strong><p>${type.force}</p></div>`
        : `
          <h3>${t.mbtiNone}</h3>
          <p>${t.mbtiNoneCard}</p>`}
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
  /* Le type peut rester vide : pour un enfant, il ne veut rien dire encore. */
  if(mbtiMode==="unknown"){ mbti=""; }
  else if(mbtiMode==="quiz"){ mbti=scoreQuiz(); if(!mbti) return showErr(err,U().errQuiz); }
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
  const p = computeProfile(name,date,mbti,birth);
  /* Profil demandé depuis le compte : il y est rangé tout de suite, avec son
     lien s'il en a un. Sinon on se contente de l'afficher — le bouton
     « enregistrer » du portrait reste la voie normale. */
  if(createCible){
    const lienEl = document.getElementById("f-lien");
    compteEnregistrer(p, createCible.pour, lienEl ? lienEl.value : "");
    createCible = null;
    renderCreateCible();
  }
  renderProfile(p);
  go("profile");
});

/* ---------------- Relation ---------------- */
let lastRelation=null;
function renderRelation(pa, pb, ctx){
  lastRelation={ a:pa, b:pb, ctx };
  const t=U(), Lp=L();
  pa.el=Lp.signs[pa.sign].element; pb.el=Lp.signs[pb.sign].element;
  /* Sans type des deux côtés, la résonance se calcule sur les deux autres
     prismes plutôt que d'inventer un score. */
  const duo = !!(pa.mbti && pb.mbti);
  const elS=elementScore(pa.el,pb.el), liS=lifeScore(pa.life,pb.life);
  const mbS=duo ? mbtiScore(pa.mbti,pb.mbti) : null;
  const global=Math.round(duo ? (elS+liS+mbS)/3 : (elS+liS)/2);
  const sh=duo ? mbtiShared(pa.mbti,pb.mbti) : 0, comp=duo && pa.mbti[1]===pb.mbti[1];
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
        <div class="card-tag"><span class="dot"></span><span>MBTI${duo ? ` · ${pa.mbti} & ${pb.mbti}` : ""}</span></div>
        ${duo ? `
          <h3>${Lp.mbti[pa.mbti].nom} &amp; ${Lp.mbti[pb.mbti].nom}</h3>
          <p>${Lp.build.relMbti(pa.mbti,pb.mbti,sh,comp)}</p>`
        : `
          <h3>${t.mbtiNone}</h3>
          <p>${t.relNoMbti}</p>`}
      </article>
    </div>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${t.relHowTitle}</span></div>
      <h3>${t.relHowTitle}</h3>
      <p class="lead">${Lp.build.relLead}</p>
      <p>${Lp.build.relContext(ctx)}</p>
      ${duo ? `<p>${Lp.build.relClosing(firstName(pa.name), Lp.mbti[pa.mbti].relation, firstName(pb.name), Lp.mbti[pb.mbti].relation)}</p>` : ""}
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
  if(!na||!da||!nb||!db) return showErr(err,U().errRelation);
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
   rappel affiché à côté du bouton. Voir ai.js. */
let lastMediation = null;

function renderMirrorAI(){
  const box = document.getElementById("mir-ai");
  if(!box || !lastMirror) return;
  if(lastMediation){ paintMediation(lastMediation); return; }

  const m = U().mirror.ai;
  const pret = PrismeAI.mode() !== "aucun";
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
    PrismeAI.setKey(v);
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
    lastMediation = await PrismeAI.mediation(avec[0], avec[1], ctx, LANG);
    paintMediation(lastMediation);
  } catch(e){
    const detail = m.errs[e.code] || m.errs.api;
    setAiStatus(detail, "err");
    if(go){ go.disabled = false; go.textContent = m.retry; }
    if(ok) ok.disabled = false;
    // une clé refusée : on la retire pour laisser ressaisir
    if(e.code === "cle" && PrismeAI.hasKey()){ PrismeAI.setKey(""); }
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
/* Deux journaux suivent le profil affiché : l'histoire de vie et les rêves. Même
   forme de stockage — un objet { clé de profil : entrées } — parce que ces
   contenus appartiennent à une personne, pas à l'appareil. Sans ce découpage,
   l'histoire de l'un s'afficherait sous le portrait de l'autre dès qu'on en
   consulte deux sur la même machine. */
const JOURNAL_ORPHELIN = " sans-profil";

function journal(cle, quelleCle){
  function tout(){
    let brut = null;
    try { brut = localStorage.getItem(cle); } catch(_){ return {}; }
    let v;
    try { v = JSON.parse(brut || "{}"); } catch(_){ return {}; }
    // Ancien format de l'histoire de vie : un seul tableau, rattaché à personne.
    if(Array.isArray(v)) return v.length ? { [JOURNAL_ORPHELIN]: v } : {};
    return (v && typeof v === "object") ? v : {};
  }
  function ecrire(all){ try { localStorage.setItem(cle, JSON.stringify(all)); } catch(_){} }
  const cleCourante = () => (quelleCle || journalKey)();
  function load(){
    const k = cleCourante();
    if(!k) return [];
    const all = tout();
    if(Array.isArray(all[k])) return all[k];
    /* Reprise de l'ancien format : les entrées saisies quand la section était à
       part rejoignent le premier profil ouvert — celui de la personne qui les a
       saisies, dans la quasi-totalité des cas. */
    const sansProfil = all[JOURNAL_ORPHELIN];
    if(Array.isArray(sansProfil) && sansProfil.length){
      delete all[JOURNAL_ORPHELIN];
      all[k] = sansProfil;
      ecrire(all);
      return sansProfil;
    }
    return [];
  }
  function save(list){
    const k = cleCourante();
    if(!k) return;
    const all = tout();
    if(list.length) all[k] = list; else delete all[k];
    ecrire(all);
  }
  return { load, save };
}
/* Le journal lu et écrit est celui du profil affiché. Hors profil, il n'y a rien
   à montrer — d'où le tableau vide. */
function journalKey(){ return lastProfile ? profileKey(lastProfile) : ""; }

const HISTOIRE = journal("prisme-histoire");
function histLoad(){ return HISTOIRE.load(); }
function histSave(list){ HISTOIRE.save(list); }

/* Une entrée peut être une épreuve ou une victoire. Les anciennes n'ont pas de
   nature : ce sont des épreuves. */
function histNature(e){ return e.nature === "victoire" ? "victoire" : "epreuve"; }
function histEstVictoire(e){ return histNature(e) === "victoire"; }
function histType(e){
  const h = U().histoire;
  return histEstVictoire(e)
    ? (h.victoires[e.type] || h.victoires.autreVictoire)
    : (h.events[e.type] || h.events.autre);
}
/* Le poids dit ce que ça pèse aujourd'hui — c'est lui, et non l'âge, qui décide
   du ton de la lecture et de l'ordre sous tension. Sans poids (entrées
   anciennes), on se tient au milieu plutôt que de dramatiser ou de minimiser. */
const HIST_POIDS_RANG = { vif:4, lourd:3, marquant:2, leger:1 };
function histPoidsRang(e){ return HIST_POIDS_RANG[e.poids] || 2; }
function histPoids(e){ return U().histoire.poids[e.poids] || null; }
/* Un moment grave, soit par nature, soit par ce qu'il pèse encore. */
function histEstGrave(e){
  if(histEstVictoire(e)) return false;
  return !!histType(e).grave || e.poids === "vif" || e.poids === "lourd";
}
function histAAide(){ return histLoad().some(histEstGrave); }

/* L'étape de développement atteinte à cet âge : elle détermine ce que la
   personne pouvait faire de l'événement, pas sa gravité. */
function histStage(age){
  const st = U().histoire.stages;
  return st.find(s => age <= s.max) || st[st.length - 1];
}
function histTypes(){ return U().histoire.events; }

function histNatureChoisie(){
  const btn = document.querySelector(".hist-nature .seg-btn.is-active");
  return btn ? btn.dataset.nature : "epreuve";
}
function fillHistTypes(){
  const sel = document.getElementById("hist-type");
  if(!sel) return;
  const cur = sel.value, h = U().histoire;
  const liste = histNatureChoisie() === "victoire" ? h.victoires : h.events;
  sel.innerHTML = `<option value="">${h.typePick}</option>` +
    Object.entries(liste).map(([k, v]) => `<option value="${k}">${escapeHtml(v.label)}</option>`).join("");
  if(cur && liste[cur]) sel.value = cur;
  // le poids ne concerne que les épreuves
  const champPoids = document.getElementById("hist-poids-champ");
  if(champPoids) champPoids.hidden = histNatureChoisie() === "victoire";
  const sp = document.getElementById("hist-poids");
  if(sp){
    const cp = sp.value;
    sp.innerHTML = `<option value="">${h.poidsPick}</option>` +
      Object.entries(h.poids).map(([k, v]) => `<option value="${k}">${escapeHtml(v.label)}</option>`).join("");
    if(cp) sp.value = cp;
  }
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
        <li class="hist-item${histEstVictoire(e) ? " is-victoire" : ""}${histEstGrave(e) ? " is-grave" : ""}">
          <span class="hist-age">${escapeHtml(h.ageLabel(e.age))}</span>
          <span class="hist-what">${escapeHtml(histType(e).label)}
            ${e.note ? `<em>— ${escapeHtml(e.note)}</em>` : ""}
            ${histPoids(e) ? `<span class="hist-poids">${escapeHtml(histPoids(e).label)}</span>` : ""}</span>
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
function histVersionCard(e, avecLecture){
  const h = U().histoire, t = histType(e), st = histStage(e.age);
  const dit = e.texte ? `<div class="mini"><strong>${h.lTell}</strong><p class="hist-dit">${escapeHtml(e.texte)}</p></div>` : "";
  if(histEstVictoire(e)){
    return `
      <article class="card hist-version hist-win">
        <div class="card-tag"><span class="dot"></span><span>${escapeHtml(h.ageLabel(e.age))}</span></div>
        <h3>${escapeHtml(h.versionTitle(e.age))}</h3>
        <p class="sub">${escapeHtml(t.label)}${e.note ? ` — ${escapeHtml(e.note)}` : ""}</p>
        ${dit}
        <div class="mini"><strong>${h.lProof}</strong><p>${escapeHtml(t.preuve)}</p></div>
        <div class="mini"><strong>${h.lForce}</strong><p>${escapeHtml(t.force)}</p></div>
        <div class="mini"><strong>${h.lCall}</strong><p>${escapeHtml(t.appel)}</p></div>
      </article>`;
  }
  const poids = histPoids(e);
  return `
    <article class="card hist-version${histEstGrave(e) ? " hist-grave" : ""}">
      <div class="card-tag"><span class="dot"></span><span>${escapeHtml(h.ageLabel(e.age))}</span></div>
      <h3>${escapeHtml(h.versionTitle(e.age))}</h3>
      <p class="sub">${escapeHtml(t.label)}${e.note ? ` — ${escapeHtml(e.note)}` : ""}</p>
      ${dit}
      ${t.verite ? `<div class="mini hist-verite"><strong>${h.lTruth}</strong><p>${escapeHtml(t.verite)}</p></div>` : ""}
      ${poids ? `<div class="mini"><strong>${h.lHold}</strong><p>${escapeHtml(poids.tenue)}</p></div>` : ""}
      ${avecLecture ? `<div class="mini"><strong>${h.lRead}</strong><p>${escapeHtml(st.lecture)}</p></div>` : ""}
      ${t.grave ? `<p class="hist-gridnote">${h.graveNote}</p>` : ""}
      <div class="mini"><strong>${h.lBelief}</strong><p>${escapeHtml(t.croyance)}</p></div>
      <div class="mini"><strong>${h.lGuard}</strong><p>${escapeHtml(t.garde)}</p></div>
      <div class="mini"><strong>${h.lTrigger}</strong><p>${escapeHtml(t.declencheur)}</p></div>
      <div class="mini"><strong>${h.lSoothe}</strong><p>${escapeHtml(t.apaise)}</p></div>
    </article>`;
}

/* Sous tension, ce qui pèse le plus parle en premier ; à poids égal, la version
   la plus jeune passe devant — elle s'est installée avant les mots, donc avant
   le recul. Les victoires ne sont pas dans cette course : elles ne prennent pas
   le volant, on les appelle. */
function histParTension(){
  return histLoad().filter(e => !histEstVictoire(e)).slice()
    .sort((a, b) => histPoidsRang(b) - histPoidsRang(a) || a.age - b.age);
}
function histVictoires(){
  return histLoad().filter(histEstVictoire).slice().sort((a, b) => a.age - b.age);
}
function histEpreuves(){
  return histLoad().filter(e => !histEstVictoire(e)).slice().sort((a, b) => a.age - b.age);
}

function renderHistOut(){
  const box = document.getElementById("hist-out");
  if(!box) return;
  const h = U().histoire, list = histLoad().slice().sort((a, b) => a.age - b.age);
  if(!list.length){ box.innerHTML = ""; return; }
  const tension = histParTension().slice(0, 3);
  const epreuves = histEpreuves(), victoires = histVictoires();
  box.innerHTML = `
    ${histBlocAide(h)}
    <div class="hist-block">
      <h4>${h.versionsTitle}</h4>
      <p>${h.versionsLead}</p>
      <div class="cards hist-versions">${(() => {
        /* Deux moments du même âge partagent la même lecture d'étape : on ne la
           répète pas d'une carte à l'autre. La liste est triée par âge, les
           doublons sont donc voisins. */
        let etapePrec = null;
        return epreuves.map(e => {
          const st = histStage(e.age);
          const carte = histVersionCard(e, st !== etapePrec);
          etapePrec = st;
          return carte;
        }).join("");
      })()}</div>
    </div>
    <div class="hist-block">
      <h4>${h.conflictTitle}</h4>
      <p>${h.conflictLead}</p>
      <ol class="hist-tension">
        ${tension.map(e => {
          const t = histType(e), po = histPoids(e);
          return `<li><strong>${escapeHtml(h.versionTitle(e.age))}</strong>${po ? ` <span class="hist-poids">${escapeHtml(po.label)}</span>` : ""} — ${escapeHtml(t.declencheur)}.
                  <span class="hist-soothe">${escapeHtml(t.apaise)}.</span></li>`;
        }).join("")}
      </ol>
      <p class="hist-care">${h.care}</p>
      <p class="sky-note">${h.disclaimer}</p>
    </div>
    <div class="hist-block">
      <h4>${h.victoiresTitle}</h4>
      <p>${victoires.length ? h.victoiresLead : h.victoiresNone}</p>
      ${victoires.length ? `<div class="cards hist-versions">${victoires.map(e => histVersionCard(e, false)).join("")}</div>` : ""}
    </div>`;
}

/* Quand quelque chose de lourd est enregistré, l'aide passe avant la lecture —
   pas en note de bas de page. Une grille de lecture n'est pas un soin. */
function histBlocAide(h){
  if(!histAAide()) return "";
  return `
    <div class="hist-block hist-aide">
      <h4>${h.aideTitle}</h4>
      <p>${h.aideLead}</p>
      <ul class="hist-aide-list">
        ${h.aide.map(a => `<li><b>${escapeHtml(a.num)}</b><span>${escapeHtml(a.quoi)}</span></li>`).join("")}
      </ul>
      <p class="hist-aide-out">${h.aideOut}</p>
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
  const texte = (document.getElementById("hist-texte").value || "").trim();
  const nature = histNatureChoisie();
  const poids = nature === "victoire" ? "" : (document.getElementById("hist-poids").value || "");
  if(!Number.isInteger(age) || age < 0 || age > 120) return showErr(err, h.errAge);
  if(!type) return showErr(err, h.errType);
  histSave(histLoad().concat([{ age, type, note, texte, nature, poids }]));
  histRefresh();
  histScroll();
}

/* Prisme 4 dans la grille du profil : ce que l'histoire ajoute aux trois
   autres, avec un raccourci vers le panneau qui la complète. */
function histCard(t){
  const h = U().histoire, list = histLoad();
  const tension = histParTension().slice(0, 2);
  const vics = histVictoires();
  return `
    <article class="card">
      <div class="card-tag"><span class="dot"></span><span>${t.lens04}</span></div>
      <h3>${h.profileTitle}</h3>
      <p class="sub">${escapeHtml(list.length ? h.countMix(histEpreuves().length, vics.length) : h.none)}</p>
      ${list.length ? `
        <p>${h.conflictLead}</p>
        ${tension.length ? `<div class="mini"><strong>${h.conflictTitle}</strong>
          <ul class="hist-mini">${tension.map(e => {
            const ev = histType(e);
            return `<li><strong>${escapeHtml(h.versionTitle(e.age))}</strong> — ${escapeHtml(ev.declencheur)}</li>`;
          }).join("")}</ul>
        </div>` : ""}
        ${vics.length ? `<div class="mini"><strong>${h.victoiresTitle}</strong>
          <ul class="hist-mini">${vics.slice(0, 2).map(e =>
            `<li><strong>${escapeHtml(histType(e).label)}</strong> — ${escapeHtml(histType(e).force)}</li>`).join("")}</ul>
        </div>` : ""}`
      : `<p>${h.profileNone}</p>`}
      <button class="btn btn-accent-outline hist-jump" data-hist-jump>${h.profileLink}</button>
    </article>`;
}

/* Le panneau complet vit dans le profil : on y saisit les moments et on y lit
   les versions qui en découlent. L'histoire de vie n'est pas une section à
   part — c'est un prisme du profil, au même titre que les trois autres. */
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
        <div class="field">
          <label>${h.natureLabel}</label>
          <div class="seg hist-nature">
            <button type="button" class="seg-btn is-active" data-nature="epreuve">${h.natures.epreuve}</button>
            <button type="button" class="seg-btn" data-nature="victoire">${h.natures.victoire}</button>
          </div>
        </div>
        <div class="hist-fields">
          <div class="field hist-age"><label for="hist-age">${h.fAge}</label>
            <input id="hist-age" type="number" min="0" max="120" step="1" inputmode="numeric" /></div>
          <div class="field hist-type"><label for="hist-type">${h.fType}</label>
            <select id="hist-type"></select></div>
        </div>
        <p class="hint hist-age-hint">${h.fAgeHint}</p>
        <div class="field" id="hist-poids-champ"><label for="hist-poids">${h.fPoids}</label>
          <select id="hist-poids"></select></div>
        <div class="field"><label for="hist-note">${h.fNote}</label>
          <input id="hist-note" type="text" maxlength="120" placeholder="${escapeHtml(h.phNote)}" /></div>
        <div class="field"><label for="hist-texte">${h.fTexte}</label>
          <textarea id="hist-texte" rows="4" maxlength="1500" placeholder="${escapeHtml(h.phTexte)}"></textarea></div>
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
  document.querySelectorAll(".hist-nature .seg-btn").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".hist-nature .seg-btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const sel = document.getElementById("hist-type"); if(sel) sel.value = "";
    fillHistTypes();
  }));
  document.querySelectorAll("[data-hist-jump]").forEach(b => b.addEventListener("click", histScroll));
  renderHistoire();
}

/* Résumé transmissible au tiers du Miroir — uniquement sur demande explicite. */
function histPourAnalyse(){
  const h = U().histoire;
  const list = histLoad().slice().sort((a, b) => a.age - b.age);
  if(!list.length) return "";
  return list.map(e => {
    const t = histType(e), po = histPoids(e);
    const marque = histEstVictoire(e) ? h.natures.victoire : h.natures.epreuve;
    return `- ${h.ageLabel(e.age)} — ${marque} : ${t.label}`
      + (po ? ` [${po.label}]` : "")
      + (e.note ? ` (${e.note})` : "")
      + (e.texte ? `\n  « ${e.texte} »` : "");
  }).join("\n");
}

/* ============================================================
   LES RÊVES — prisme 5 du profil

   Un rêve ne prédit rien et ne se décode pas avec un dictionnaire. Ce qu'on
   peut en faire : le noter avant qu'il s'efface, repérer les images qui
   reviennent d'une nuit à l'autre, et — sur demande explicite — le faire relire
   par un tiers qui parle au conditionnel.

   Le répertoire d'images (data.js) est le même pour tout le monde : c'est son
   intérêt et sa limite. Il propose des mises en scène, jamais des sens fixes.
   ============================================================ */
/* Les rêves appartiennent au titulaire du compte, pas au profil qu'on est en
   train de regarder : la section est à part, on peut y arriver sans avoir
   ouvert de portrait. Sans compte ni profil, ils attendent dans le tiroir des
   entrées sans propriétaire, et rejoignent le premier qui se déclare. */
function reveKey(){
  const c = compteLoad();
  if(c && c.moi) return c.moi;
  if(lastProfile) return profileKey(lastProfile);
  return JOURNAL_ORPHELIN;
}
const REVES = journal("prisme-reves", reveKey);
function reveLoad(){ return REVES.load(); }
function reveSave(list){ REVES.save(list); }

/* Rêve sélectionné dans le journal, et les lectures déjà obtenues. Les lectures
   restent en mémoire : c'est une analyse, elle n'a pas à s'installer sur le
   disque de la machine. */
let reveSel = null;
const reveLectures = {};
let reveStatut = null;

function reveJour(iso){
  if(!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if(isNaN(d)) return iso;
  return d.toLocaleDateString(LANG === "en" ? "en-GB" : "fr-FR",
                              { day:"numeric", month:"long", year:"numeric" });
}
function reveAujourdhui(){
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
}
/* Comparaison insensible aux accents et à la casse : « araignée » doit se
   reconnaître dans « une ARAIGNEE ». */
function reveNorm(s){
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "'").replace(/\s+/g, " ");
}
/* Images du répertoire repérées dans un récit. Simple recherche de sous-chaîne :
   pas de devinette, et on assume les ratés — le répertoire est court.

   On cherche les mots-clés des DEUX langues : on peut noter ses rêves en
   français et lire l'interface en anglais. Sans ça, la bascule de langue ferait
   disparaître les images d'un rêve déjà écrit. */
function reveImages(texte){
  const t = reveNorm(texte);
  const listes = ["fr", "en"].map(l => (I18N[l] && I18N[l].ui.reves.symbols) || {});
  return Object.keys(U().reves.symbols).filter(k =>
    listes.some(sym => sym[k] && sym[k].mots.some(m => reveMotif(m).test(t))));
}
/* Mot entier, pluriel toléré. En cherchant la simple sous-chaîne, « ours » se
   reconnaissait dans « poursuivi » et le rêve héritait d'un animal qu'il ne
   contenait pas. */
function reveMotif(mot){
  const m = reveNorm(mot).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${m}s?([^a-z0-9]|$)`);
}
/* Journal du plus récent au plus ancien : c'est la nuit dernière qu'on relit. */
function reveTri(){
  return reveLoad().slice().sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.id - a.id);
}
function reveCourant(){
  const list = reveTri();
  if(!list.length) return null;
  return list.find(r => r.id === reveSel) || list[0];
}

function fillReveChamps(){
  const r = U().reves;
  const em = document.getElementById("reve-emotion");
  if(em){
    const cur = em.value;
    em.innerHTML = `<option value="">${r.emotionPick}</option>` +
      Object.entries(r.emotions).map(([k, v]) => `<option value="${k}">${escapeHtml(v)}</option>`).join("");
    if(cur) em.value = cur;
  }
  const tg = document.getElementById("reve-tags");
  if(tg && !tg.dataset.rempli){
    tg.innerHTML = Object.entries(r.tags).map(([k, v]) =>
      `<label class="reve-tag"><input type="checkbox" value="${k}" /> <span>${escapeHtml(v)}</span></label>`).join("");
    tg.dataset.rempli = "1";
  } else if(tg){
    // bascule de langue : on garde les cases cochées, on retraduit les libellés
    Object.entries(r.tags).forEach(([k, v]) => {
      const sp = tg.querySelector(`input[value="${k}"] + span`);
      if(sp) sp.textContent = v;
    });
  }
  const d = document.getElementById("reve-date");
  if(d && !d.value) d.value = reveAujourdhui();
}

function renderReveList(){
  const box = document.getElementById("reve-list");
  if(!box) return;
  const r = U().reves, list = reveTri();
  if(!list.length){ box.innerHTML = `<p class="hist-empty">${r.empty}</p>`; return; }
  const cur = reveCourant();
  box.innerHTML = `
    <h4 class="hist-sub">${r.journalTitle}</h4>
    <ol class="reve-line">
      ${list.map(e => `
        <li class="reve-item${cur && e.id === cur.id ? " is-sel" : ""}">
          <button type="button" class="reve-pick" data-id="${e.id}">
            <span class="reve-date">${escapeHtml(reveJour(e.date))}</span>
            <span class="reve-extrait">${escapeHtml(e.texte.slice(0, 110))}${e.texte.length > 110 ? "…" : ""}</span>
            <span class="reve-meta">${[
              e.emotion ? escapeHtml(r.emotions[e.emotion] || "") : "",
              ...(e.tags || []).map(t => escapeHtml(r.tags[t] || "")),
            ].filter(Boolean).join(" · ")}</span>
          </button>
          <button type="button" class="hist-del reve-del" data-id="${e.id}" aria-label="${r.remove}">×</button>
        </li>`).join("")}
    </ol>
    <button type="button" class="btn btn-ghost hist-clear" id="reve-clear">${r.clearAll}</button>`;

  box.querySelectorAll(".reve-pick").forEach(b => b.addEventListener("click", () => {
    reveSel = +b.dataset.id; reveStatut = null; renderRevesInterieur();
  }));
  box.querySelectorAll(".reve-del").forEach(b => b.addEventListener("click", () => {
    const id = +b.dataset.id;
    reveSave(reveLoad().filter(x => x.id !== id));
    if(reveSel === id) reveSel = null;
    reveRefresh();
  }));
  const clr = document.getElementById("reve-clear");
  if(clr) clr.addEventListener("click", () => { reveSave([]); reveSel = null; reveRefresh(); });
}

/* Ce qui traverse plusieurs nuits. Un rêve isolé ne dit pas grand-chose ; la
   répétition, elle, insiste. */
function revePatterns(){
  const r = U().reves, list = reveLoad();
  if(list.length < 2) return `<p class="hist-empty">${r.patternsThin}</p>`;
  const compte = {};
  list.forEach(e => reveImages(e.texte).forEach(k => { compte[k] = (compte[k] || 0) + 1; }));
  const revient = Object.entries(compte).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);
  const emo = {};
  list.forEach(e => { if(e.emotion) emo[e.emotion] = (emo[e.emotion] || 0) + 1; });
  const dom = Object.entries(emo).sort((a, b) => b[1] - a[1])[0];
  const recurrents = list.filter(e => (e.tags || []).includes("recurrent")).length;
  const cauchemars = list.filter(e => (e.tags || []).includes("cauchemar")).length;
  const dates = list.map(e => e.date).filter(Boolean).sort();
  const faits = [
    dom ? r.pEmotion(r.emotions[dom[0]] || dom[0]) : "",
    recurrents ? r.pRecurrent(recurrents) : "",
    cauchemars ? r.pNightmare(cauchemars) : "",
    dates.length > 1 ? r.pSpan(reveJour(dates[0]), reveJour(dates[dates.length - 1])) : "",
  ].filter(Boolean);
  return `
    <p>${r.patternsLead}</p>
    ${revient.length ? `<ul class="reve-revient">${revient.map(([k, n]) =>
      `<li><strong>${escapeHtml(r.symbols[k].nom)}</strong> <span>${escapeHtml(r.seen(n))}</span></li>`).join("")}</ul>` : ""}
    ${faits.length ? `<ul class="reve-faits">${faits.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}`;
}

function reveImageCard(k){
  const s = U().reves.symbols[k], r = U().reves;
  return `
    <article class="card reve-image">
      <div class="card-tag"><span class="dot"></span><span>${escapeHtml(s.nom)}</span></div>
      <div class="mini"><strong>${r.lStage}</strong><p>${escapeHtml(s.lecture)}</p></div>
      <div class="mini"><strong>${r.lAsk}</strong><p>${escapeHtml(s.question)}</p></div>
    </article>`;
}

function renderReveOut(){
  const box = document.getElementById("reve-out");
  if(!box) return;
  const r = U().reves, cur = reveCourant();
  if(!cur){ box.innerHTML = ""; return; }
  const images = reveImages(cur.texte);
  box.innerHTML = `
    <div class="hist-block reve-focus">
      <h4>${escapeHtml(r.dateLabel)} ${escapeHtml(reveJour(cur.date))}</h4>
      <p class="reve-texte">${escapeHtml(cur.texte)}</p>
      <h4 class="reve-sub">${r.symbolsTitle}</h4>
      <p>${r.symbolsLead}</p>
      ${images.length
        ? `<div class="cards hist-versions">${images.map(reveImageCard).join("")}</div>`
        : `<p class="hist-empty">${r.symbolsNone}</p>`}
    </div>
    <div class="hist-block">
      <h4>${r.patternsTitle}</h4>
      ${revePatterns()}
    </div>
    <div class="hist-block" id="reve-ai"></div>
    <p class="hist-care">${r.care}</p>
    <p class="sky-note">${r.disclaimer}</p>`;
  renderReveAI();
}

/* Ce que le compte peut joindre à la lecture : le portrait du titulaire, son
   histoire de vie, ses autres rêves. Rien ne part sans une case cochée. */
function reveProfilPourAnalyse(){
  const moi = compteMoi() || lastProfile;
  if(!moi) return "";
  const p = moi.mbti !== undefined && moi.sign ? moi : computeProfile(moi.name, moi.date, moi.mbti, moi.birth);
  const Lp = L(), t = U();
  const bouts = [
    `${t.sunLabel} : ${Lp.signs[p.sign].name}`,
    p.asc ? `${t.ascLabel} : ${Lp.signs[p.asc.sign].name}` : "",
    p.moon ? `${t.moonLabel} : ${Lp.signs[p.moon.sign].name}` : "",
    `${t.bLife} ${numLabel(p.life)} — ${Lp.numbers[p.life].titre}`,
    `${Lp.numFrames.expression.label} ${numLabel(p.expr)} · ${Lp.numFrames.intime.label} ${numLabel(p.intime)}`,
    p.mbti ? `MBTI : ${p.mbti}` : "",
  ].filter(Boolean);
  return bouts.join("\n");
}
function reveHistoirePourAnalyse(){
  const k = reveKey();
  const h = U().histoire;
  let all = {};
  try { all = JSON.parse(localStorage.getItem("prisme-histoire") || "{}"); } catch(_){ return ""; }
  const list = Array.isArray(all[k]) ? all[k].slice().sort((a, b) => a.age - b.age) : [];
  if(!list.length) return "";
  return list.map(e => {
    const v = e.nature === "victoire";
    const t = v ? (h.victoires[e.type] || h.victoires.autreVictoire) : (h.events[e.type] || h.events.autre);
    const po = h.poids[e.poids];
    return `- ${h.ageLabel(e.age)} — ${v ? h.natures.victoire : h.natures.epreuve} : ${t.label}`
      + (po ? ` [${po.label}]` : "") + (e.note ? ` (${e.note})` : "")
      + (e.texte ? `\n  « ${e.texte} »` : "");
  }).join("\n");
}
function reveAutresPourAnalyse(cur){
  const r = U().reves;
  const autres = reveTri().filter(x => x.id !== cur.id).slice(0, 8);
  if(!autres.length) return "";
  return autres.map(e => `- ${r.dateLabel} ${e.date}${e.emotion ? ` (${r.emotions[e.emotion]})` : ""} : ${e.texte}`).join("\n");
}

/* ---------------- la lecture du rêve par l'IA ----------------
   Même règle que la médiation du Miroir : rien ne sort du navigateur sans un
   accord coché, et seul le rêve sélectionné est transmis. */
function renderReveAI(){
  const box = document.getElementById("reve-ai");
  if(!box) return;
  const a = U().reves.ai, cur = reveCourant();
  if(!cur){ box.innerHTML = ""; return; }
  const pret = PrismeAI.mode() !== "aucun";
  const lecture = reveLectures[cur.id];
  box.innerHTML = `
    <div class="card-tag"><span class="dot"></span><span>${a.tag}</span></div>
    <h4>${a.title}</h4>
    <p>${a.text}</p>
    <p class="ai-jung">${a.jung}</p>
    <p class="ai-privacy">⚠ ${a.privacy}</p>
    ${pret ? `
      <label class="ai-consent"><input type="checkbox" id="reve-ai-ok" /> <span>${a.consent}</span></label>
      ${reveProfilPourAnalyse() ? `<label class="ai-consent"><input type="checkbox" id="reve-ai-profil" /> <span>${a.consentProfil}</span></label>` : ""}
      ${reveHistoirePourAnalyse() ? `<label class="ai-consent"><input type="checkbox" id="reve-ai-hist" /> <span>${a.consentHistoire}</span></label>` : ""}
      ${reveAutresPourAnalyse(cur) ? `<label class="ai-consent"><input type="checkbox" id="reve-ai-autres" /> <span>${a.consentAutres}</span></label>` : ""}
      <button class="btn btn-accent" id="reve-ai-go" disabled>${lecture ? a.again : a.button}</button>
    ` : `
      <p class="ai-setup">${a.setup} ${a.setupKey}</p>
      <div class="ai-key">
        <input type="password" id="reve-ai-key" autocomplete="off" spellcheck="false" placeholder="${a.keyPh}" />
        <button class="btn btn-ghost" id="reve-ai-key-save">${a.keySave}</button>
      </div>
    `}
    <p class="ai-status" id="reve-ai-status" role="status" aria-live="polite"></p>
    <div id="reve-ai-out"></div>`;

  const ok = document.getElementById("reve-ai-ok");
  const go = document.getElementById("reve-ai-go");
  if(ok && go) ok.addEventListener("change", () => { go.disabled = !ok.checked; });
  if(go) go.addEventListener("click", lireReve);
  const save = document.getElementById("reve-ai-key-save");
  if(save) save.addEventListener("click", () => {
    const v = (document.getElementById("reve-ai-key").value || "").trim();
    if(!v) return;
    PrismeAI.setKey(v);
    renderReveAI();
  });
  if(reveStatut) setReveStatut(reveStatut.texte, reveStatut.type);
  if(lecture) peindreReve(lecture);
}

function setReveStatut(texte, type){
  reveStatut = texte ? { texte, type } : null;
  const el = document.getElementById("reve-ai-status");
  if(!el) return;
  el.textContent = texte || "";
  el.className = `ai-status${type ? " is-" + type : ""}`;
}

async function lireReve(){
  const a = U().reves.ai, r = U().reves, cur = reveCourant();
  if(!cur) return;
  const go = document.getElementById("reve-ai-go");
  if(go) go.disabled = true;
  setReveStatut(a.working, "load");
  try {
    const coche = (id) => { const el = document.getElementById(id); return !!(el && el.checked); };
    const envoi = {
      texte: cur.texte,
      date: cur.date,
      emotion: cur.emotion ? r.emotions[cur.emotion] : "",
      tags: (cur.tags || []).map(t => r.tags[t]).filter(Boolean),
      profil:   coche("reve-ai-profil") ? reveProfilPourAnalyse()   : "",
      histoire: coche("reve-ai-hist")   ? reveHistoirePourAnalyse() : "",
      autres:   coche("reve-ai-autres") ? reveAutresPourAnalyse(cur): "",
    };
    reveLectures[cur.id] = await PrismeAI.reve(envoi, LANG);
    setReveStatut("");
    peindreReve(reveLectures[cur.id]);
    /* On peut vouloir relancer avec d'autres pièces jointes : tant que l'accord
       reste coché, le bouton redevient actif. */
    const ok = document.getElementById("reve-ai-ok");
    if(go) go.disabled = !(ok && ok.checked);
    const out = document.getElementById("reve-ai-out");
    if(out) out.scrollIntoView({ behavior:"smooth", block:"nearest" });
  } catch(e){
    const msg = e.code === "cle"    ? a.errCle
              : e.code === "quota"  ? a.errQuota
              : e.code === "reseau" ? a.errReseau
              : e.code === "refus"  ? a.errRefus
              : a.errAutre;
    if(e.code === "cle" && PrismeAI.hasKey()){ PrismeAI.setKey(""); }
    setReveStatut(msg, "err");
    if(go) go.disabled = false;
    if(e.code === "cle") renderReveAI();
  }
}

function peindreReve(d){
  const a = U().reves.ai, box = document.getElementById("reve-ai-out");
  if(!box || !d) return;
  box.innerHTML = `
    ${d.alerte === "vigilance" && d.alerteTexte
      ? `<p class="ai-alerte">${escapeHtml(d.alerteTexte)}</p>` : ""}
    <div class="mini"><strong>${a.lResume}</strong><p>${escapeHtml(d.resume)}</p></div>
    <p class="ai-sub">${a.lScene}</p>
    <p class="ai-knot">${escapeHtml(d.scene)}</p>
    <p class="ai-sub">${a.lImages}</p>
    <div class="cards cards-2">
      ${d.images.map(i => `
        <article class="card ai-person">
          <div class="card-tag"><span class="dot"></span><span>${escapeHtml(i.image)}</span></div>
          <div class="mini"><p>${escapeHtml(i.lecture)}</p></div>
        </article>`).join("")}
    </div>
    <div class="mini"><strong>${a.lTension}</strong><p>${escapeHtml(d.tension)}</p></div>
    <p class="ai-sub">${a.lCompensation}</p>
    <p class="ai-knot">${escapeHtml(d.compensation || "")}</p>
    ${(d.archetypes && d.archetypes.length) ? `
      <p class="ai-sub">${a.lArchetypes}</p>
      <ul class="reve-archetypes">${d.archetypes.map(x =>
        `<li><strong>${escapeHtml(x.nom)}</strong> — ${escapeHtml(x.lecture)}</li>`).join("")}</ul>` : ""}
    ${d.parcours ? `<div class="mini"><strong>${a.lParcours}</strong><p>${escapeHtml(d.parcours)}</p></div>` : ""}
    ${d.individuation ? `<div class="mini"><strong>${a.lIndividuation}</strong><p>${escapeHtml(d.individuation)}</p></div>` : ""}
    <p class="ai-sub">${a.lQuestions}</p>
    <ol class="hist-tension">${d.questions.map(q => `<li>${escapeHtml(q)}</li>`).join("")}</ol>
    <p class="hist-care"><strong>${a.lGarde}</strong> ${escapeHtml(d.garde)}</p>`;
}

function renderRevesInterieur(){
  fillReveChamps();
  renderReveList();
  renderReveOut();
}
function reveRefresh(){ renderReves(); }
function reveScroll(){
  const el = document.getElementById("reve-panel");
  if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
}

function reveSubmit(e){
  e.preventDefault();
  const err = document.getElementById("reve-error"); err.hidden = true;
  const r = U().reves;
  const texte = document.getElementById("reve-texte").value.trim();
  if(texte.length < 10) return showErr(err, r.errTexte);
  const date = document.getElementById("reve-date").value || reveAujourdhui();
  const emotion = document.getElementById("reve-emotion").value;
  const tags = Array.from(document.querySelectorAll("#reve-tags input:checked")).map(c => c.value);
  const id = Date.now();
  reveSave(reveLoad().concat([{ id, date, texte, emotion, tags }]));
  reveSel = id;
  reveStatut = null;
  reveRefresh();
  reveScroll();
}


/* Les rêves ont leur propre section : ils ne sont pas un chapitre du portrait,
   et l'analyse va au contraire chercher le portrait pour éclairer le rêve. */
function renderReves(){
  const box = document.getElementById("reves-out");
  if(!box) return;
  const t = U(), r = t.reves;
  box.innerHTML = `
    <div class="form-wrap form-wrap-wide">
      <p class="eyebrow">${r.eyebrow}</p>
      <h2 class="view-title">${r.title}</h2>
      <p class="view-lead">${r.lead}</p>
    </div>
    ${revePanel(t)}`;
  bindReves();
}

/* Le panneau : on y note un rêve, on relit celui qui est sélectionné. */
function revePanel(t){
  const r = U().reves;
  return `
    <section class="synth hist-panel reve-panel" id="reve-panel">
      <div class="card-tag"><span class="dot"></span><span>${t.lens05}</span></div>
      <h3>${r.journalTitle}</h3>
      <p class="hist-privacy">${r.privacy}</p>

      <form id="reve-form" class="form hist-form">
        <h4 class="hist-add-title">${r.addTitle}</h4>
        <div class="field"><label for="reve-texte">${r.fTexte}</label>
          <textarea id="reve-texte" rows="5" maxlength="2000" placeholder="${escapeHtml(r.phTexte)}"></textarea></div>
        <div class="hist-fields reve-fields">
          <div class="field"><label for="reve-date">${r.fDate}</label>
            <input id="reve-date" type="date" /></div>
          <div class="field"><label for="reve-emotion">${r.fEmotion}</label>
            <select id="reve-emotion"></select></div>
        </div>
        <div class="field"><label>${r.fTags}</label>
          <div class="reve-tags" id="reve-tags"></div></div>
        <button type="submit" class="btn btn-accent">${r.add}</button>
        <p class="form-error" id="reve-error" hidden></p>
      </form>

      <div id="reve-list"></div>
      <div id="reve-out"></div>
    </section>`;
}

/* Rendu avec le profil : les écouteurs sont à recâbler à chaque fois. */
function bindReves(){
  const form = document.getElementById("reve-form");
  if(form) form.addEventListener("submit", reveSubmit);
  document.querySelectorAll("[data-reve-jump]").forEach(b => b.addEventListener("click", reveScroll));
  renderRevesInterieur();
}

/* ============================================================
   MON COMPTE — vous, et les vôtres

   Un compte local : il rassemble votre profil et ceux de vos proches, dit ce
   qu'il reste à renseigner, et sait s'exporter dans un fichier.

   Pas de serveur, pas de mot de passe, pas d'e-mail. Un vrai compte en ligne
   supposerait de confier à quelqu'un d'autre des traumas, des rêves et des
   disputes ; tant que ce choix n'est pas fait, l'export est la façon honnête de
   changer d'appareil — et l'interface le dit.
   ============================================================ */
const COMPTE_STORE = "prisme-compte";

function compteLoad(){
  let v = null;
  try { v = JSON.parse(localStorage.getItem(COMPTE_STORE) || "null"); } catch(_){ return null; }
  return (v && typeof v === "object" && v.nom) ? v : null;
}
function compteSave(c){
  try { c ? localStorage.setItem(COMPTE_STORE, JSON.stringify(c))
          : localStorage.removeItem(COMPTE_STORE); } catch(_){}
  renderAccountBtn();
}
/* Le profil du titulaire, retrouvé par sa clé. Refaire son profil avec un autre
   type MBTI change la clé : on considère alors qu'il est à recréer plutôt que
   de désigner quelqu'un d'autre. */
function compteMoi(){
  const c = compteLoad();
  if(!c || !c.moi) return null;
  return loadSaved().find(p => profileKey(p) === c.moi) || null;
}
function compteProches(){
  const c = compteLoad();
  const moi = c && c.moi;
  return loadSaved().filter(p => profileKey(p) !== moi);
}
function compteLien(p){ return (p.lien && U().compte.liens[p.lien]) ? p.lien : ""; }

/* Bouton discret dans l'en-tête : l'initiale si le compte existe, sinon un plus. */
function renderAccountBtn(){
  const el = document.getElementById("account-ini");
  const btn = document.getElementById("account-btn");
  if(!el || !btn) return;
  const c = compteLoad();
  el.textContent = c ? c.nom.trim().charAt(0).toUpperCase() : "＋";
  btn.classList.toggle("is-set", !!c);
  btn.setAttribute("aria-label", c ? U().compte.hello(c.nom) : U().compte.createTitle);
  btn.title = btn.getAttribute("aria-label");
}

/* ---------------- pour qui est le prochain profil ? ----------------
   Le formulaire « Moi » sert aussi à ajouter un proche : une cible posée avant
   d'y arriver dit à quel titre le profil sera enregistré. */
let createCible = null;   // null | { pour:"moi" } | { pour:"proche" }

function renderCreateCible(){
  const box = document.getElementById("create-cible");
  if(!box) return;
  const c = U().compte;
  if(!createCible){ box.innerHTML = ""; return; }
  const proche = createCible.pour === "proche";
  box.innerHTML = `
    <div class="create-cible">
      <p class="eyebrow">${proche ? c.addTitle : c.addMine}</p>
      <p>${proche ? c.addLead : c.addMineLead}</p>
      ${proche ? `
        <div class="field">
          <label for="f-lien">${c.lienLabel}</label>
          <select id="f-lien">
            <option value="">${c.lienNone}</option>
            ${Object.entries(c.liens).map(([k, v]) => `<option value="${k}">${escapeHtml(v)}</option>`).join("")}
          </select>
        </div>` : ""}
    </div>`;
}
function viserCreate(pour){
  createCible = { pour };
  renderCreateCible();
  ["f-name", "f-date"].forEach(id => { const el = document.getElementById(id); if(el) el.value = ""; });
  go("create");
}

/* Enregistrement d'un profil dans le compte, avec son lien s'il y en a un. */
function compteEnregistrer(p, pour, lien){
  const list = loadSaved();
  const k = profileKey(p);
  const entree = { name:p.name, date:p.date, mbti:p.mbti, birth:p.birth || null };
  if(lien) entree.lien = lien;
  const i = list.findIndex(x => profileKey(x) === k);
  if(i >= 0) list[i] = { ...list[i], ...entree }; else list.push(entree);
  storeSaved(list);
  if(pour === "moi"){
    const c = compteLoad() || { nom: firstName(p.name), cree: reveAujourdhui() };
    c.moi = k;
    compteSave(c);
  }
  renderSavedPicker();
}

/* ---------------- la vue ---------------- */
let compteMsg = null;      // { texte, type } — retour d'action, éphémère
let compteImport = null;   // sauvegarde en attente de confirmation
let compteWipe = false;    // effacement en attente de confirmation
let compteRenommer = false;

function renderCompte(){
  const box = document.getElementById("compte-out");
  if(!box) return;
  const c = U().compte, cpt = compteLoad();
  box.innerHTML = (cpt && !compteRenommer) ? compteVue(c, cpt) : compteOuverture(c, cpt);
  bindCompte();
}

function compteOuverture(c, cpt){
  return `
    <div class="form-wrap">
      <p class="eyebrow">${c.eyebrow}</p>
      <h2 class="view-title">${c.createTitle}</h2>
      <p class="view-lead">${c.createLead}</p>
      <p class="hist-privacy">${c.privacy}</p>
      <form id="compte-form" class="form">
        <div class="field">
          <label for="compte-nom">${c.fNom}</label>
          <input id="compte-nom" type="text" maxlength="40" placeholder="${escapeHtml(c.phNom)}"
                 value="${cpt ? escapeHtml(cpt.nom) : ""}" />
        </div>
        <button type="submit" class="btn btn-primary btn-block">${c.create}</button>
        <p class="form-error" id="compte-error" hidden></p>
      </form>
      ${compteMsg ? `<p class="compte-msg is-${compteMsg.type}">${escapeHtml(compteMsg.texte)}</p>` : ""}
      <!-- Nouvel appareil ou compte effacé : c'est ici qu'on récupère une
           sauvegarde, avant même d'avoir un compte. -->
      <div class="compte-reprise">
        <p class="eyebrow">${c.backupTitle}</p>
        <p>${c.backupLead}</p>
        <label class="btn btn-ghost compte-file">${c.importBtn}
          <input type="file" id="compte-import" accept="application/json,.json" hidden /></label>
        ${compteConfirmImport(c)}
      </div>
    </div>`;
}

/* Panneau de confirmation d'import, partagé par les deux écrans. */
function compteConfirmImport(c){
  if(!compteImport) return "";
  return `
    <div class="compte-confirm">
      <p>${escapeHtml(c.importSummary(compteImport.moi, compteImport.proches))}</p>
      <p class="compte-warn">${c.importWarn}</p>
      <div class="compte-acts">
        <button class="btn btn-accent" id="compte-import-ok">${c.importConfirm}</button>
        <button class="btn btn-ghost" id="compte-import-no">${c.importCancel}</button>
      </div>
    </div>`;
}

function compteVue(c, cpt){
  const moi = compteMoi(), proches = compteProches();
  return `
    <div class="compte-head">
      <p class="eyebrow">${c.eyebrow}</p>
      <h1 class="result-name">${escapeHtml(c.hello(cpt.nom))}</h1>
      <p class="compte-sub">${escapeHtml(c.summary(!!moi, proches.length))}${cpt.cree ? ` · ${escapeHtml(c.since(reveJour(cpt.cree)))}` : ""}</p>
      <button class="btn btn-ghost btn-mini" id="compte-rename">${c.rename}</button>
    </div>
    ${compteMsg ? `<p class="compte-msg is-${compteMsg.type}">${escapeHtml(compteMsg.texte)}</p>` : ""}

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${c.meTitle}</span></div>
      ${moi ? `
        <h3>${escapeHtml(moi.name)}</h3>
        <p class="compte-ligne">${escapeHtml(compteResume(moi))}</p>
        <div class="compte-acts">
          <button class="btn btn-accent" data-compte-voir="${escapeHtml(profileKey(moi))}">${c.meSee}</button>
          <button class="btn btn-ghost" id="compte-refaire">${c.meRedo}</button>
        </div>`
      : `
        <h3>${c.meTitle}</h3>
        <p>${c.meNone}</p>
        <button class="btn btn-accent" id="compte-creer-moi">${c.meCreate}</button>`}
    </section>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${c.tagCarnet}</span></div>
      <h3>${c.prochesTitle}</h3>
      <p>${proches.length ? c.prochesLead : c.prochesNone}</p>
      ${proches.length ? `<ul class="compte-list">${proches.map(p => compteRow(c, p)).join("")}</ul>` : ""}
      <button class="btn btn-accent-outline" id="compte-ajouter">${c.prochesAdd}</button>
    </section>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${c.tagTodo}</span></div>
      <h3>${c.todoTitle}</h3>
      ${compteTodo(c, moi, proches)}
    </section>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${c.tagData}</span></div>
      <h3>${c.backupTitle}</h3>
      <p>${c.backupLead}</p>
      <div class="compte-acts">
        <button class="btn btn-accent-outline" id="compte-export">${c.exportBtn}</button>
        <label class="btn btn-ghost compte-file">${c.importBtn}
          <input type="file" id="compte-import" accept="application/json,.json" hidden /></label>
      </div>
      ${compteConfirmImport(c)}
      <div class="compte-danger">
        ${compteWipe ? `
          <p class="compte-warn">${c.wipeWarn}</p>
          <div class="compte-acts">
            <button class="btn btn-ghost compte-del" id="compte-wipe-ok">${c.wipeConfirm}</button>
            <button class="btn btn-ghost" id="compte-wipe-no">${c.wipeCancel}</button>
          </div>`
        : `<button class="btn btn-ghost compte-del" id="compte-wipe">${c.wipeBtn}</button>`}
      </div>
    </section>

    <section class="synth compte-server">
      <div class="card-tag"><span class="dot"></span><span>${c.serverTitle}</span></div>
      <p>${c.serverText}</p>
      <p class="hist-privacy">${c.privacy}</p>
    </section>`;
}

/* Une ligne de résumé : signe, chemin de vie, MBTI, heure de naissance ou non. */
function compteResume(p){
  const t = U(), Lp = L();
  const [y, m, d] = p.date.split("-").map(Number);
  const signe = Lp.signs[sunSign(m, d)].name;
  const vie = numLabel(lifePath(p.date));
  return [signe, `${t.bLife} ${vie}`, p.mbti || t.mbtiNone,
          p.birth ? U().compte.withBirth : U().compte.noBirth].join(" · ");
}

function compteRow(c, p){
  const k = profileKey(p);
  return `
    <li class="compte-item">
      <div class="compte-qui">
        <span class="compte-nom">${escapeHtml(p.name)}</span>
        <span class="compte-ligne">${escapeHtml(compteResume(p))}</span>
      </div>
      <select class="compte-lien" data-lien="${escapeHtml(k)}" aria-label="${c.lienLabel}">
        <option value="">${c.lienNone}</option>
        ${Object.entries(c.liens).map(([kk, v]) =>
          `<option value="${kk}"${compteLien(p) === kk ? " selected" : ""}>${escapeHtml(v)}</option>`).join("")}
      </select>
      <span class="compte-acts">
        <button data-compte-voir="${escapeHtml(k)}">${c.actSee}</button>
        <button data-compte-cmp="${escapeHtml(k)}">${c.actCompare}</button>
        <button data-compte-del="${escapeHtml(k)}" class="compte-del">${c.actDel}</button>
      </span>
    </li>`;
}

/* Ce qui manque, personne par personne — c'est ce qui fait « alimenter ». */
function compteTodo(c, moi, proches){
  const lignes = [];
  if(!moi){
    lignes.push({ qui: c.todoMe, quoi: [c.todo.profil] });
  } else {
    const quoi = [];
    if(!moi.birth) quoi.push(c.todo.birth);
    const k = profileKey(moi);
    if(!journalEntrees("prisme-histoire", k)) quoi.push(c.todo.histoire);
    if(!journalEntrees("prisme-reves", k))    quoi.push(c.todo.reves);
    if(quoi.length) lignes.push({ qui: firstName(moi.name), quoi });
  }
  proches.forEach(p => {
    const quoi = [];
    if(!compteLien(p)) quoi.push(c.todo.lien);
    if(!p.birth) quoi.push(c.todo.birth);
    if(quoi.length) lignes.push({ qui: firstName(p.name), quoi });
  });
  if(!lignes.length) return `<p>${c.todoDone}</p>`;
  return `
    <p>${c.todoLead}</p>
    <ul class="compte-todo">
      ${lignes.map(l => `<li><strong>${escapeHtml(l.qui)}</strong> — ${escapeHtml(l.quoi.join(", "))}</li>`).join("")}
    </ul>`;
}
/* Combien d'entrées ce profil a-t-il dans un journal ? Lecture directe : on
   interroge les journaux d'un autre profil que celui affiché. */
function journalEntrees(cle, k){
  try {
    const v = JSON.parse(localStorage.getItem(cle) || "{}");
    return Array.isArray(v[k]) ? v[k].length : 0;
  } catch(_){ return 0; }
}

/* ---------------- export / import ---------------- */
const COMPTE_FORMAT = "prisme-sauvegarde-1";
function compteExport(){
  const lire = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(_){ return null; } };
  const data = {
    format: COMPTE_FORMAT,
    date: new Date().toISOString(),
    compte: compteLoad(),
    profils: loadSaved(),
    histoire: lire("prisme-histoire"),
    reves: lire("prisme-reves"),
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:"application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `prisme-${(compteLoad() || {}).nom || "sauvegarde"}-${reveAujourdhui()}.json`.toLowerCase();
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function compteAppliquer(d){
  const ecrire = (k, v) => { try { v ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k); } catch(_){} };
  ecrire("prisme-profiles", d.profils || []);
  ecrire("prisme-histoire", d.histoire);
  ecrire("prisme-reves", d.reves);
  compteSave(d.compte || null);
  lastProfile = null;
  renderSavedPicker();
}
function compteEffacer(){
  ["prisme-profiles", "prisme-histoire", "prisme-reves"].forEach(k => {
    try { localStorage.removeItem(k); } catch(_){}
  });
  compteSave(null);
  lastProfile = null;
  renderSavedPicker();
}

/* ---------------- écouteurs ---------------- */
function bindCompte(){
  const c = U().compte;
  const form = document.getElementById("compte-form");
  if(form) form.addEventListener("submit", e => {
    e.preventDefault();
    const err = document.getElementById("compte-error"); err.hidden = true;
    const nom = document.getElementById("compte-nom").value.trim();
    if(nom.length < 2) return showErr(err, c.errNom);
    const ancien = compteLoad();
    compteSave({ nom, cree: (ancien && ancien.cree) || reveAujourdhui(), moi: ancien ? ancien.moi : null });
    compteRenommer = false;
    compteMsg = null;
    renderCompte();
  });

  const rename = document.getElementById("compte-rename");
  if(rename) rename.addEventListener("click", () => { compteRenommer = true; renderCompte(); });

  const creer = document.getElementById("compte-creer-moi");
  if(creer) creer.addEventListener("click", () => viserCreate("moi"));
  const refaire = document.getElementById("compte-refaire");
  if(refaire) refaire.addEventListener("click", () => viserCreate("moi"));
  const ajouter = document.getElementById("compte-ajouter");
  if(ajouter) ajouter.addEventListener("click", () => viserCreate("proche"));

  document.querySelectorAll("[data-compte-voir]").forEach(b => b.addEventListener("click", () => {
    const p = loadSaved().find(x => profileKey(x) === b.dataset.compteVoir);
    if(!p) return;
    renderProfile(computeProfile(p.name, p.date, p.mbti, p.birth));
    go("profile");
  }));
  document.querySelectorAll("[data-compte-cmp]").forEach(b => b.addEventListener("click", () => {
    const p = loadSaved().find(x => profileKey(x) === b.dataset.compteCmp);
    const moi = compteMoi();
    if(!p) return;
    if(moi){
      document.getElementById("ra-name").value = moi.name;
      document.getElementById("ra-date").value = moi.date;
      document.getElementById("ra-mbti").value = moi.mbti;
    }
    document.getElementById("rb-name").value = p.name;
    document.getElementById("rb-date").value = p.date;
    document.getElementById("rb-mbti").value = p.mbti;
    go("relation");
  }));
  document.querySelectorAll("[data-compte-del]").forEach(b => b.addEventListener("click", () => {
    storeSaved(loadSaved().filter(x => profileKey(x) !== b.dataset.compteDel));
    renderSavedPicker();
    renderCompte();
  }));
  document.querySelectorAll("[data-lien]").forEach(sel => sel.addEventListener("change", () => {
    const list = loadSaved();
    const i = list.findIndex(x => profileKey(x) === sel.dataset.lien);
    if(i < 0) return;
    if(sel.value) list[i].lien = sel.value; else delete list[i].lien;
    storeSaved(list);
    renderCompte();
  }));

  const exp = document.getElementById("compte-export");
  if(exp) exp.addEventListener("click", compteExport);
  const imp = document.getElementById("compte-import");
  if(imp) imp.addEventListener("change", async () => {
    const f = imp.files && imp.files[0];
    if(!f) return;
    let d = null;
    try { d = JSON.parse(await f.text()); } catch(_){}
    if(!d || d.format !== COMPTE_FORMAT || !Array.isArray(d.profils)){
      compteImport = null;
      compteMsg = { texte: c.importBad, type:"err" };
      return renderCompte();
    }
    const moiK = d.compte && d.compte.moi;
    compteImport = { data: d, moi: !!moiK, proches: d.profils.filter(p => profileKey(p) !== moiK).length };
    compteMsg = null;
    renderCompte();
  });
  const impOk = document.getElementById("compte-import-ok");
  if(impOk) impOk.addEventListener("click", () => {
    compteAppliquer(compteImport.data);
    compteImport = null;
    compteMsg = { texte: c.importDone, type:"ok" };
    renderCompte();
  });
  const impNo = document.getElementById("compte-import-no");
  if(impNo) impNo.addEventListener("click", () => { compteImport = null; renderCompte(); });

  const wipe = document.getElementById("compte-wipe");
  if(wipe) wipe.addEventListener("click", () => { compteWipe = true; renderCompte(); });
  const wipeNo = document.getElementById("compte-wipe-no");
  if(wipeNo) wipeNo.addEventListener("click", () => { compteWipe = false; renderCompte(); });
  const wipeOk = document.getElementById("compte-wipe-ok");
  if(wipeOk) wipeOk.addEventListener("click", () => {
    compteEffacer();
    compteWipe = false;
    compteMsg = { texte: c.wipeDone, type:"ok" };
    renderCompte();
  });
}

renderAccountBtn();
renderCreateCible();
renderCompte();
renderReves();
