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
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.dataset.view === name));
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.toggle("is-current", a.dataset.nav === name));
  window.scrollTo({ top:0, behavior:"smooth" });
}
document.querySelectorAll("[data-nav]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); go(el.dataset.nav); }));

/* ---------------- Calculs : Astrologie (soleil) ---------------- */
function sunSign(month, day){
  const t=[["capricorne",20],["verseau",19],["poissons",21],["belier",20],["taureau",21],["gemeaux",21],
    ["cancer",23],["lion",23],["vierge",23],["balance",23],["scorpion",22],["sagittaire",22],["capricorne",32]];
  return day < t[month-1][1] ? t[month-1][0] : t[month][0];
}

/* ---------------- Calculs : Numérologie ---------------- */
function reduceNum(n){ while(n>9 && n!==11 && n!==22 && n!==33){ n = String(n).split("").reduce((s,d)=>s+(+d),0);} return n; }
function lifePath(dateStr){ const [y,m,d]=dateStr.split("-").map(Number); return reduceNum(reduceNum(y)+reduceNum(m)+reduceNum(d)); }
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
function lifeScore(a,b){ if(a===b) return 75; return Math.abs(a-b)<=2 ? 80 : 66; }
function mbtiShared(a,b){ let s=0; for(let i=0;i<4;i++) if(a[i]===b[i]) s++; return s; }
function mbtiScore(a,b){ const sh=mbtiShared(a,b), comp=a[1]===b[1];
  if(sh>=3) return 80; if(sh===2&&comp) return 84; if(sh===2) return 74; if(sh===1) return 66; return 58; }

/* ---------------- Rendu de l'interface (i18n) ---------------- */
function fillSelectMbti(sel){
  sel.innerHTML="";
  const o0=document.createElement("option"); o0.value=""; o0.textContent=U().mbtiPick; sel.appendChild(o0);
  Object.keys(L().mbti).forEach(k=>{ const o=document.createElement("option"); o.value=k; o.textContent=`${k} — ${L().mbti[k].nom}`; sel.appendChild(o); });
}
function fillCities(){
  const sel=document.getElementById("f-city"); const cur=sel.value;
  sel.innerHTML="";
  const o0=document.createElement("option"); o0.value=""; o0.textContent=U().fCityPh; sel.appendChild(o0);
  CITIES.forEach((c,i)=>{ const o=document.createElement("option"); o.value=i; o.textContent=c.n; sel.appendChild(o); });
  sel.value=cur;
}
function fillContext(){
  const sel=document.getElementById("r-context"); const cur=sel.value;
  sel.innerHTML="";
  Object.keys(U().ctx).forEach(k=>{ const o=document.createElement("option"); o.value=k; o.textContent=U().ctx[k]; sel.appendChild(o); });
  if(cur) sel.value=cur;
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
  // lentilles
  document.getElementById("lenses").innerHTML = U().lenses.map(x=>
    `<article class="lens"><span class="lens-idx">${x.i}</span><h3>${x.h}</h3><p>${x.p}</p></article>`).join("");
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
  // selects
  fillSelectMbti(document.getElementById("f-mbti"));
  fillSelectMbti(document.getElementById("ra-mbti"));
  fillSelectMbti(document.getElementById("rb-mbti"));
  fillCities(); fillContext(); buildQuiz();
  renderHeritage();
  renderSavedPicker();
}

document.getElementById("lang-toggle").addEventListener("click", ()=>{
  LANG = LANG==="fr" ? "en" : "fr";
  localStorage.setItem("prisme-lang", LANG);
  applyI18n();
  // re-rendu des résultats affichés
  if(lastProfile) renderProfile(lastProfile);
  if(lastRelation) renderRelation(lastRelation.a, lastRelation.b, lastRelation.ctx);
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
      <p class="cel-explain">${Lp.build.celestial(p, Lp)}</p>
    </div>` : "";

  const saved = isSaved(p);
  document.getElementById("profile-out").innerHTML=`
    <div class="result-head">
      <p class="eyebrow">${t.resultEyebrow}</p>
      <h1 class="result-name">${escapeHtml(p.name)}</h1>
      <div class="result-badges">
        <span class="badge">${sign.symbol} <b>${sign.name}</b> · ${Lp.elements[p.el].name}</span>
        ${ascBadge}${moonBadge}
        <span class="badge">${t.bLife} <b>${p.life}</b> · ${lp.titre}</span>
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
        <h3>${p.life} · ${lp.titre}</h3>
        <p class="sub">${t.bLife}${lp.maitre?` · ${t.masterNum}`:""}</p>
        <div class="chips">${lp.mots.map(m=>`<span class="chip">${m}</span>`).join("")}</div>
        <p>${lp.desc}</p>
        <div class="mini"><strong>${t.otherNumbers}</strong>
          <dl class="kv">
            <dt>${Lp.numFrames.expression.label} · ${p.expr}</dt><dd>${expr.titre} — ${Lp.numFrames.expression.role}</dd>
            <dt>${Lp.numFrames.intime.label} · ${p.intime}</dt><dd>${intime.titre} — ${Lp.numFrames.intime.role}</dd>
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
    </div>

    <section class="synth">
      <div class="card-tag"><span class="dot"></span><span>${t.synthTag}</span></div>
      <h3>${t.synthTitle}</h3>
      <p class="lead">${synth.lead}</p>
      ${synth.paras.map(x=>`<p>${x}</p>`).join("")}
      <p>${synth.converge}</p>
    </section>

    <div class="result-actions no-print">
      <button class="btn btn-primary" id="act-compare">${t.actCompare}</button>
      <button class="btn btn-ghost" id="act-save">${saved?t.actSaved:t.actSave}</button>
      <button class="btn btn-ghost" id="act-print">${t.actPrint}</button>
      <button class="btn btn-ghost" id="act-redo">${t.actRedo}</button>
    </div>
  `;

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
    const cityIdx=document.getElementById("f-city").value;
    const latM=parseFloat(document.getElementById("f-lat").value);
    const lonM=parseFloat(document.getElementById("f-lon").value);
    const tzM =parseFloat(document.getElementById("f-tz").value);
    if(!Number.isNaN(latM)&&!Number.isNaN(lonM)&&!Number.isNaN(tzM)){
      birth={ time, lat:latM, lon:lonM, tz:tzM, place:"—" };
    } else if(cityIdx!==""){
      const c=CITIES[+cityIdx]; birth={ time, lat:c.lat, lon:c.lon, tz:c.tz, place:c.n };
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
        <div class="card-tag"><span class="dot"></span><span>${t.bLife} · ${pa.life} & ${pb.life}</span></div>
        <h3>${t.bLife} ${pa.life} &amp; ${pb.life}</h3>
        <p>${Lp.build.relLife(pa.life,pb.life,liS)}</p>
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

    <div class="result-actions no-print">
      <button class="btn btn-ghost" id="rel-print">${t.actPrint}</button>
    </div>
  `;
  document.getElementById("rel-print").addEventListener("click", ()=>window.print());
  document.getElementById("relation-out").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>{ const f=document.querySelector("#relation-out .meter-fill"); if(f) f.style.width=global+"%"; },120);
}

document.getElementById("relation-form").addEventListener("submit", e=>{
  e.preventDefault();
  const err=document.getElementById("relation-error"); err.hidden=true;
  const na=document.getElementById("ra-name").value.trim(), da=document.getElementById("ra-date").value, ma=document.getElementById("ra-mbti").value;
  const nb=document.getElementById("rb-name").value.trim(), db=document.getElementById("rb-date").value, mb=document.getElementById("rb-mbti").value;
  const ctx=document.getElementById("r-context").value;
  if(!na||!da||!ma||!nb||!db||!mb) return showErr(err,U().errRelation);
  renderRelation(computeProfile(na,da,ma,null), computeProfile(nb,db,mb,null), ctx);
});

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

/* ---------------- Init ---------------- */
applyI18n();
initMilkyWay();
