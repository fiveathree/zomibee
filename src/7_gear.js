/* ================= 裝備 ================= */
/* w = 重量（力量要夠先發揮全效），aff = 專精角色（效果 ×1.5） */
const ITEMS={
 bat:{n:'棒球棍',slot:'weapon',w:6,k:'club',job:{guard:.15,scav:.05},d:'順手又耐用'},
 axe:{n:'消防斧',slot:'weapon',w:11,k:'axe',job:{guard:.25,scav:.1,repair:.05},aff:['r_lee','u_han'],d:'劈門劈頭都得'},
 katana:{n:'武士刀',slot:'weapon',w:8,k:'blade',job:{guard:.3,scav:.15},aff:['u_mio','r_rin'],d:'博物館展品，仲好利'},
 cleaver:{n:'斬骨刀',slot:'weapon',w:4,k:'knife',job:{guard:.08,cook:.15},aff:['s_lin','c_igor','c_chan'],d:'廚房同戰場兩用'},
 spear:{n:'自製長矛',slot:'weapon',w:7,k:'spear',job:{guard:.18,patrol:.1},d:'晾衫竹綁住菜刀，隔住閘都刺到'},
 pistol:{n:'手槍',slot:'weapon',w:5,k:'gun',job:{guard:.2},def:4,aff:['r_dale','c_david'],d:'警署搵返嚟嘅配槍'},
 rifle:{n:'狙擊步槍',slot:'weapon',w:12,k:'rifle',job:{guard:.35,patrol:.1},def:8,aff:['s_hawk','u_shen'],d:'好重，但喺天台一槍一隻'},
 crowbar:{n:'撬棍',slot:'weapon',w:8,k:'bar',job:{scav:.15,repair:.1,guard:.08},aff:['r_lee','c_keung'],d:'撬門、撬窗、撬喪屍'},
 shield:{n:'防暴盾',slot:'armor',w:14,k:'shield',job:{guard:.2},bite:.6,aff:['r_dale','u_han','r_hung'],d:'防暴隊留低，重到要用兩隻手'},
 leather:{n:'電單車皮褸',slot:'armor',w:5,k:'jacket',bite:.75,risk:.9,aff:['s_sofia','c_cheung'],d:'厚皮咬唔入'},
 armguard:{n:'雜誌護臂',slot:'armor',w:2,k:'arm',bite:.6,d:'用膠紙將雜誌綁喺手臂'},
 firesuit:{n:'消防衣',slot:'armor',w:12,k:'suit',risk:.7,bite:.6,aff:['r_lee','u_han'],d:'防火防咬，但好焗'},
 pack:{n:'登山背包',slot:'tool',w:6,k:'pack',loot:.25,aff:['s_sofia','c_cheung','s_fei'],d:'搜括時帶得多啲嘢返嚟'},
 toolbox:{n:'工具箱',slot:'tool',w:9,k:'box',job:{repair:.3},aff:['s_olga','c_keung','r_lee'],d:'扳手、螺絲批、電鑽'},
 medkit:{n:'急救包',slot:'tool',w:3,k:'med',job:{medic:.25},aff:['s_park','u_grace','r_mei','r_zhou'],d:'繃帶、縫針、止痛藥'},
 binoc:{n:'望遠鏡',slot:'tool',w:1,k:'bino',job:{patrol:.25,guard:.05},aff:['s_hawk','c_minho'],d:'遠遠就睇到屍群'},
 walkie:{n:'對講機',slot:'tool',w:1,k:'walkie',job:{patrol:.1},risk:.85,aff:['r_kenji'],d:'出事即刻叫救兵'},
 shoes:{n:'跑鞋',slot:'tool',w:1,k:'shoe',job:{scav:.1},risk:.8,aff:['s_fei','c_cheung'],d:'跑得快就係最好嘅防具'},
 wok:{n:'大鐵鑊',slot:'tool',w:7,k:'wok',job:{cook:.3},aff:['s_lin','c_chan','c_ana'],d:'一鑊炒晒全據點嘅飯'}
};
const SLOTS={weapon:'武器',armor:'防具',tool:'道具'};
const LOCITEM={store:['bat','shoes','pack'],market:['cleaver','wok','spear'],estate:['bat','armguard','wok','cleaver'],hardware:['crowbar','toolbox','axe','spear'],clinic:['medkit','armguard'],police:['pistol','shield','walkie','leather'],metro:['walkie','firesuit','crowbar','axe'],school:['bat','binoc','medkit','pack'],museum:['katana'],barracks:['rifle','shield','binoc','pistol'],lab:['medkit','firesuit']};
const canEquip=u=>!isAnimal(u);
function eqF(u,it){
  const st=stat(u,'str');let f=st>=it.w?1:Math.max(.35,1-(it.w-st)*.08);
  if(u.sta<30&&it.w>=8)f*=.75;
  if((it.aff||[]).includes(u.id))f*=1.5;
  return f;
}
function eqNote(u,it){
  const st=stat(u,'str'),n=[];
  if((it.aff||[]).includes(u.id))n.push('專精 ×1.5');
  if(st<it.w)n.push(`力量唔夠（${st}/${it.w}）`);
  if(u.sta<30&&it.w>=8)n.push('體力低 ×0.75');
  return n.join('、');
}
function eqS(u){
  const r={job:{},def:0,risk:1,bite:1,loot:0,w:0,over:0};
  if(!u.eq)return r;
  for(const sl in u.eq){const id=u.eq[sl];if(!id||!ITEMS[id])continue;const it=ITEMS[id],f=eqF(u,it);r.w+=it.w;
    if(it.job)for(const j in it.job)r.job[j]=(r.job[j]||0)+it.job[j]*f;
    if(it.def)r.def+=it.def*f;
    if(it.risk)r.risk*=Math.max(.2,1-(1-it.risk)*f);
    if(it.bite)r.bite*=Math.max(.2,1-(1-it.bite)*f);
    if(it.loot)r.loot+=it.loot*f;}
  r.over=Math.max(0,r.w-stat(u,'str'));
  return r;
}
function itemFx(u,it){
  const f=u?eqF(u,it):1,p=x=>Math.round(x*f*100),out=[];
  if(it.job)for(const j in it.job)out.push(`${JOBS[j].n} +${p(it.job[j])}%`);
  if(it.def)out.push(`夜間防禦 +${Math.round(it.def*f)}`);
  if(it.loot)out.push(`搜括收穫 +${p(it.loot)}%`);
  if(it.risk)out.push(`受傷風險 -${Math.round((1-Math.max(.2,1-(1-it.risk)*f))*100)}%`);
  if(it.bite)out.push(`被咬機會 -${Math.round((1-Math.max(.2,1-(1-it.bite)*f))*100)}%`);
  return out.join('、');
}
function addItem(id,n=1){G.inv[id]=(G.inv[id]||0)+n}
function equip(u,slot,id){
  u.eq=u.eq||{};
  if(u.eq[slot]){addItem(u.eq[slot]);u.eq[slot]=null}
  if(id&&G.inv[id]>0){G.inv[id]--;if(!G.inv[id])delete G.inv[id];u.eq[slot]=id}
}
function unequipAll(u){if(!u.eq)return;for(const sl in u.eq)if(u.eq[sl]){addItem(u.eq[sl]);u.eq[sl]=null}}
function eqScore(u,it,j){
  const f=eqF(u,it);let s=((it.job&&it.job[j])||0)*f*10;
  if(j==='guard')s+=(it.def||0)*f*.6+(1-(it.bite||1))*4;
  if(j==='scav')s+=(it.loot||0)*f*10+(1-(it.risk||1))*8+(1-(it.bite||1))*6;
  if(j==='patrol')s+=(1-(it.risk||1))*3+(1-(it.bite||1))*2;
  const st=stat(u,'str');if(it.w>st)s-=(it.w-st)*.4;
  return s;
}
function autoEquip(){
  const A=act(G).filter(canEquip);A.forEach(unequipAll);
  const pri={guard:0,scav:1,patrol:2,repair:3,medic:4,cook:5,rest:9};
  [...A].sort((a,b)=>pri[a.job]-pri[b.job]).forEach(u=>{
    Object.keys(SLOTS).forEach(sl=>{
      let best=null,bv=.8;
      const cw=eqS(u).w;Object.keys(G.inv).forEach(id=>{const it=ITEMS[id];if(!it||it.slot!==sl||!(G.inv[id]>0)||cw+it.w>stat(u,'str')+3)return;const v=eqScore(u,it,u.job);if(v>bv){bv=v;best=id}});
      if(best)equip(u,sl,best);
    });
  });
}
function eqSummary(u){
  if(!canEquip(u))return '<span class="muted">動物唔用裝備</span>';
  const e=u.eq||{},s=eqS(u);
  return Object.keys(SLOTS).map(sl=>`<span class="eqs ${e[sl]?'':'none'}">${SLOTS[sl]}：${e[sl]?esc(ITEMS[e[sl]].n):'—'}</span>`).join('')+`<span class="eqs ${s.over?'heavy':''}">負重 ${s.w}/${stat(u,'str')}</span>`;
}

/* ---------- 浮窗 ---------- */
function popHTML(u){
  const c=CH[u.id],j=canWork(u,u.job)?u.job:'rest',es=eqS(u);
  return `<div class="pop-h">${av(u.id)}<div style="min-width:0;flex:1"><b class="rn ${c.g}">${esc(c.n)}</b>${stars(u.star)}<div class="muted" style="font-size:11px">${esc(c.job)} · 而家：${JOBS[j].n}${isS(u,j)?`【${SPERK[j].n}】`:''}</div><div class="chips" style="margin-top:2px">${c.fa.map(f=>`<span class="chip">${FA[f]}</span>`).join('')}${synergy(u,j)?`<span class="chip good">陣營 +${Math.round(synergy(u,j)*100)}%</span>`:''}</div></div><button class="pop-x" id="popx" aria-label="關閉">×</button></div>
    <div class="chips">${statusChips(u)||'<span class="chip good">狀態正常</span>'}</div>
    <div class="bars">${bar('HP',u.hp,maxHp(u),u.hp<maxHp(u)*.35?'var(--blood)':'var(--calm)')}${bar('體力',u.sta,100,'var(--sodium)')}${bar('意志',u.san,100,'var(--steel)')}</div>
    <div class="pkst">${ST.map(k=>`<div><span>${STN[k]}</span><b>${stat(u,k)}</b></div>`).join('')}<div><span>效率</span><b>${j==='rest'?'—':Math.round(eff(u,j))}</b></div></div>
    <div class="pkst g6">${JK.filter(x=>x!=='rest').map(x=>{const g=canWork({...u,crit:0,iso:0},x)?grade(apt(u,x)*(fxOf(u).job[x]||1)):'—';const b=es.job[x]?`<em>+${Math.round(es.job[x]*100)}%</em>`:'';return `<div><span>${JOBS[x].n}</span><b class="g${g}">${g}</b>${b}</div>`}).join('')}</div>
    <div class="eqline">${eqSummary(u)}</div>${es.set?`<div class="setline">套裝【${esc(es.set.n)}】${esc(es.set.d)}</div>`:''}
    <div class="row" style="justify-content:space-between"><span class="muted" style="font-size:11px">撳區域派佢去做嘢</span><button class="btn sm" id="popmore">詳細／換裝備</button></div>`;
}
function showPop(){
  const p=$('#pop');if(!p)return;
  const u=SEL&&uOf(SEL),a=u&&document.querySelector(`[data-tok="${SEL}"]`);
  if(!u||!a||VIEW!=='base'){p.hidden=true;return}
  p.innerHTML=popHTML(u);p.hidden=false;placePop();
  $('#popx').onclick=e=>{e.stopPropagation();SEL=null;render()};
  $('#popmore').onclick=e=>{e.stopPropagation();const id=SEL;SEL=null;render();openUnit(id)};
}
function placePop(){
  const p=$('#pop'),a=SEL&&document.querySelector(`[data-tok="${SEL}"]`);if(!a||p.hidden)return;
  const r=a.getBoundingClientRect(),W=innerWidth,H=innerHeight,pw=p.offsetWidth,ph=p.offsetHeight,m=8;
  let x=r.right+m,y=r.top-10;
  if(x+pw>W-m){x=r.left-pw-m}
  if(x<m){x=cl(r.left+r.width/2-pw/2,m,W-pw-m);y=r.bottom+6;if(y+ph>H-m)y=r.top-ph-6}
  y=cl(y,m,Math.max(m,H-ph-m));
  p.style.left=x+'px';p.style.top=y+'px';
}
function render(){renderHead();({base:rBase,crew:rCrew,radio:rRadio,log:rLog,menu:rMenu})[VIEW]();showPop()}
addEventListener('scroll',()=>{if(SEL)placePop()},{passive:true});
addEventListener('resize',()=>{if(SEL)placePop()});
document.addEventListener('click',e=>{if(!SEL)return;if(e.target.closest('#pop,[data-tok],.zone,.ov'))return;SEL=null;render()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&SEL){SEL=null;render()}});

/* ---------- 人物頁（加裝備） ---------- */
function openUnit(id){
  const u=uOf(id);if(!u)return;const c=CH[id];
  const coreCost=Math.ceil((2+u.star)*(fxOf(u).coreHalf?.5:1));let armed=false;const es=eqS(u);
  modal(`<div class="modal dismiss">
    <div class="row" style="align-items:flex-start;gap:14px;flex-wrap:nowrap"><div class="bigfig">${fig(u,canWork(u,u.job)?u.job:'rest')}</div><div style="min-width:0;flex:1"><div class="row" style="gap:6px"><span class="rk ${c.g}">${c.g}</span><h2 class="rn ${c.g}">${esc(c.n)}</h2>${stars(u.star)}</div><div class="muted">${esc(c.o)} · ${esc(c.job)}</div><div class="chips" style="margin-top:4px">${c.fa.map(f=>`<span class="chip">${FA[f]}</span>`).join('')}${statusChips(u)}</div><p style="margin:6px 0 0;font-size:13px">${esc(c.bio)}</p>${u.mut?`<div class="mutline">變種人【${MUT[u.mut.t].n}】${esc(MUT[u.mut.t].d)}；對病毒免疫，食量 ×1.5</div>`:''}</div></div>
    ${!u.act&&!isAnimal(u)?(()=>{const H=act(G).filter(x=>!isAnimal(x)&&!x.inf&&!x.iso);return H.length?`<div class="panel" style="background:var(--slab2)"><b style="color:var(--sodium2)">同據點入面嘅人換位</b><div class="muted" style="font-size:12px">揀一個人，佢會${u.op?`去${esc(BASES[u.op].n)}分部`:'去後備'}，${esc(c.n)} 接手佢嘅床位同工作</div><div class="chips" style="margin-top:6px">${H.map(x=>`<button class="chip swapc" data-swap="${x.id}"><span class="rn ${CH[x.id].g}">${esc(nm(x))}</span> · ${JOBS[x.job].n}</button>`).join('')}</div></div>`:''})():''}
    <div class="bars">${bar('HP',u.hp,maxHp(u),'var(--calm)')}${bar('體力',u.sta,100,'var(--sodium)')}${bar('意志',u.san,100,'var(--steel)')}</div>
    <div class="statgrid">${ST.map(k=>`<span class="muted">${STN[k]}</span><s><i style="width:${stat(u,k)/25*100}%"></i></s><span class="type">${stat(u,k)}</span>`).join('')}</div>
    <div class="aptg">${JK.filter(j=>j!=='rest').map(j=>{const g=canWork({...u,crit:0,iso:0},j)?grade(apt(u,j)*(fxOf(u).job[j]||1)):'—';return `<div>${JOBS[j].n}<b class="g${g}">${g}</b>${es.job[j]?`<em class="eqp">裝備 +${Math.round(es.job[j]*100)}%</em>`:''}</div>`}).join('')}</div>
    <div class="panel" style="background:var(--slab2)">
      ${(()=>{const S=Object.values(SETS).find(x=>x.owner===id);if(!S)return '';const has=S.items.filter(i=>u.eq&&Object.values(u.eq).includes(i)).length;return `<div class="setline" style="margin-bottom:6px">${has===S.items.length?'✓ ':''}專屬套裝【${esc(S.n)}】${has}/${S.items.length}：${S.items.map(i=>esc(ITEMS[i].n)).join('、')}<br><span class="muted">${esc(S.d)}</span></div>`})()}
      <div class="row" style="justify-content:space-between"><b style="color:var(--sodium2)">裝備</b>${canEquip(u)?`<span class="muted type" style="font-size:12px;${es.over?'color:var(--blood)':''}">負重 ${es.w} / 力量 ${stat(u,'str')}${es.over?` · 每日多耗 ${Math.round(es.over*1.2)} 體力`:''}</span>`:''}</div>
      ${canEquip(u)?Object.keys(SLOTS).map(sl=>{const it=u.eq&&u.eq[sl]&&ITEMS[u.eq[sl]];return `<div class="eqrow"><span class="lbl">${SLOTS[sl]}</span><div style="min-width:0;flex:1">${it?`${rk(it.r)} <b>${esc(it.n)}</b> <span class="muted" style="font-size:12px">重 ${it.w}</span><div style="font-size:12px">${esc(itemFx(u,it))}</div>${eqNote(u,it)?`<div style="font-size:11px;color:var(--sodium2)">${esc(eqNote(u,it))}</div>`:''}`:'<span class="muted">未裝備</span>'}</div><button class="btn sm" data-eq="${sl}">換</button></div>`}).join(''):'<p class="muted" style="margin:6px 0 0">動物唔用裝備。</p>'}
    </div>
    <div class="panel" style="background:var(--slab2)"><b style="color:var(--sodium2)">專長 · ${esc(c.sk.n)}</b><div style="font-size:13px">${esc(c.sk.d)}</div>
      ${c.tr.map(t=>`<div style="font-size:13px;margin-top:4px"><span class="chip">${TR[t].n}</span> <span class="muted">${esc(TR[t].d)}</span></div>`).join('')}
      ${JK.filter(j=>isS(u,j)).map(j=>`<div style="font-size:13px;margin-top:6px"><span class="rk UR">S</span> <b>${JOBS[j].n}【${SPERK[j].n}】</b> <span class="muted">${esc(SPERK[j].d)}</span></div>`).join('')}</div>
    <div class="row">
      ${u.act?`<button class="btn sm" id="mv">移去後備</button>`:`<button class="btn sm" id="mv" ${!isAnimal(u)&&beds(G)>=bedCap(G)?'disabled':''}>加入據點${isAnimal(u)?'（寵物唔佔床位）':beds(G)>=bedCap(G)?'（冇床位）':''}</button>${u.op?`<span class="chip">駐守${esc(BASES[u.op].n)}分部</span>`:''}`}
      <button class="btn sm" id="up" ${u.star>=5||G.res.core<coreCost?'disabled':''}>用 ${coreCost} 晶核強化${u.star>=5?'（滿星）':''}</button>
      <button class="btn sm" id="bye">遣散</button>
      <button class="btn pri sm" id="cx" style="margin-left:auto">關閉</button>
    </div>
  </div>`,()=>{
    $('#cx').onclick=closeOv;
    $('#mv').onclick=()=>{if(u.act&&(u.inf||u.iso)){toast('感染者唔可以送走後備');return}u.act=!u.act;u.op=null;if(u.act)u.job=bestJob(u);else unequipAll(u);save();closeOv();openUnit(id)};
    $('#up').onclick=()=>{G.res.core-=coreCost;u.star++;u.hp=Math.min(maxHp(u),u.hp+10);save();toast(`${c.n} 強化到 ${u.star} 星，全能力 +1`);closeOv();openUnit(id)};
    $('#bye').onclick=e=>{if(!armed){armed=true;e.target.textContent='再撳一次確認遣散';e.target.classList.add('danger');return}leaveUnit(u,'被遣散。');addRes({bat:20});save();closeOv()};
    document.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>openEquip(id,b.dataset.eq));
    document.querySelectorAll('[data-swap]').forEach(b=>b.onclick=()=>{const o=uOf(b.dataset.swap);const op=u.op||null;const j=o.job;o.act=false;unequipAll(o);o.op=op;o.job='rest';u.act=true;u.op=null;u.job=canWork(u,j)?j:bestJob(u);save();toast(`${nm(u)} 同 ${nm(o)} 換咗位`);closeOv();openUnit(id)});
  });
}
function openEquip(id,sl){
  const u=uOf(id),cur=u.eq&&u.eq[sl];
  const opts=Object.keys(G.inv).filter(k=>ITEMS[k]&&ITEMS[k].slot===sl&&G.inv[k]>0).map(k=>({k,from:null}));
  G.units.forEach(o=>{if(o!==u&&o.eq&&o.eq[sl])opts.push({k:o.eq[sl],from:o.id})});
  opts.sort((a,b)=>RANK.indexOf(ITEMS[a.k].r)-RANK.indexOf(ITEMS[b.k].r)||(a.from?1:0)-(b.from?1:0));
  modal(`<div class="modal dismiss">
    <div class="eyebrow">${esc(nm(u))} · ${SLOTS[sl]}${cur?` · 而家用緊：${esc(ITEMS[cur].n)}`:''}</div>
    <p class="muted" style="margin:0">力量 ${stat(u,'str')}。裝備重過力量會打折兼多耗體力；專精角色用效果 ×1.5。其他人用緊嘅裝備都可以調過嚟，對方會即刻除低。</p>
    <div class="stack" style="gap:6px">
      ${opts.map((o,i)=>{const it=ITEMS[o.k],note=eqNote(u,it),ow=o.from&&uOf(o.from);return `<button class="eqpick ${ow?'worn':''}" data-i="${i}"><div class="row" style="justify-content:space-between"><b>${rk(it.r)} ${esc(it.n)}</b><span class="muted type" style="font-size:12px">重 ${iw(u,it)}${o.from?'':` · 背包 ${G.inv[o.k]}`}</span></div>${ow?`<div class="wornby"><span class="rn ${CH[ow.id].g}">${esc(nm(ow))}</span>${ow.act?'':'（後備）'}用緊 · 撳一下調俾${esc(nm(u))}</div>`:''}<div style="font-size:12px">${esc(itemFx(u,it))}</div>${note?`<div style="font-size:11px;color:var(--sodium2)">${esc(note)}</div>`:''}<div class="muted" style="font-size:11px">${esc(it.d)}</div></button>`}).join('')||`<p class="muted">冇${SLOTS[sl]}。去搜括或者物資空投會搵到。</p>`}
    </div>
    <div class="row">${cur?'<button class="btn sm" id="off">卸下</button>':''}<button class="btn pri sm" id="back" style="margin-left:auto">返回</button></div>
  </div>`,()=>{
    $('#back').onclick=()=>openUnit(id);
    const off=$('#off');if(off)off.onclick=()=>{equip(u,sl,null);save();openUnit(id)};
    document.querySelectorAll('.eqpick').forEach(b=>b.onclick=()=>{
      const o=opts[+b.dataset.i];
      if(o.from){const ow=uOf(o.from);if(ow&&ow.eq&&ow.eq[sl]===o.k){equip(ow,sl,null);toast(`${ITEMS[o.k].n} 由 ${nm(ow)} 身上調咗俾 ${nm(u)}`)}}
      equip(u,sl,o.k);save();openUnit(id)});
  });
}

/* ---------- 倖存者頁（加裝備背包） ---------- */
function rCrew(){
  const A=act(G),Rs=G.units.filter(u=>!u.act),D=Object.keys(G.gone);
  const used={};G.units.forEach(u=>{if(u.eq)for(const sl in u.eq){const k=u.eq[sl];if(k)(used[k]=used[k]||[]).push(nm(u))}});
  const keys=Object.keys(ITEMS).filter(k=>G.inv[k]||used[k]);
  $('#main').innerHTML=`
   <div class="secth"><h2>據點內</h2><span class="muted type">${beds(G)}/${bedCap(G)}</span></div>
   <div class="cards">${A.map(u=>tag(u)).join('')||'<span class="muted">冇人</span>'}</div>
   <div class="secth"><h2>裝備背包</h2><button class="btn sm" id="aeq">按工作自動配裝</button></div>
   <div class="inv">${keys.map(k=>{const it=ITEMS[k];return `<div class="invi"><div class="row" style="justify-content:space-between"><b>${rk(it.r)} ${esc(it.n)}</b><span class="chip">${SLOTS[it.slot]} · 重 ${it.w}</span></div><div style="font-size:12px">${esc(itemFx(null,it)||'')}</div><div class="muted" style="font-size:11px">背包 ${G.inv[k]||0}${used[k]?` · 用緊：${esc(used[k].join('、'))}`:''}${it.aff?` · 專精：${it.aff.map(a=>esc(CH[a].n)).join('、')}`:''}</div></div>`}).join('')||'<span class="muted">背包空空。搜括時有機會搵到武器、防具同道具。</span>'}</div>
   <div class="secth"><h2>後備名單</h2><span class="muted">無線電聯絡中，有床位先可以加入；唔使食糧</span></div>
   <div class="cards">${Rs.map(u=>tag(u)).join('')||'<span class="muted">冇人。升級床位可以收留更多人。</span>'}</div>
   ${D.length?`<div class="secth"><h2>離開咗嘅人</h2></div><div class="cards">${D.map(id=>tag(id,true)).join('')}</div>`:''}`;
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openUnit(b.dataset.open));
  $('#aeq').onclick=()=>{const n=autoEquip();save();render();toast(n?`已重新配裝：${n} 人有變動`:'而家已經係最好配搭')};
}
