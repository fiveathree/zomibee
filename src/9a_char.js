/* ================= 角色面板（Diablo 式）、個人背包、綁定裝備、槍械精通 ================= */
/* ---------- 槍械精通 ---------- */
const GUNNERS=['u_shen','s_hawk','r_dale','c_david','c_frank'];
['pistol','rifle','assault','shotgun'].forEach(k=>ITEMS[k].gun=1);
const canGun=u=>GUNNERS.includes(u.id);
/* ---------- 綁定裝備：跟住角色，唔會離身 ---------- */
const BOUND={
 r_lee:{weapon:{n:'消防斧',k:'axe',r:'SR',w:11,job:{guard:.25,scav:.1,repair:.05}},armor:{n:'消防衣',k:'suit',r:'SR',w:12,risk:.7,bite:.6}},
 u_han:{weapon:{n:'破門鐵鉤',k:'bar',r:'SR',w:9,job:{guard:.2,scav:.15}},armor:{n:'隊長消防衣',k:'suit',r:'SSR',w:12,risk:.65,bite:.55}},
 c_keung:{armor:{n:'地盤安全帽',k:'arm',r:'C',w:3,risk:.85},tool:{n:'工具帶',k:'box',r:'R',w:4,job:{repair:.2}}},
 s_hawk:{weapon:{n:'「鷹眼」狙擊步槍',k:'rifle',r:'SSR',w:12,gun:1,job:{guard:.35,patrol:.1},def:8}},
 r_dale:{weapon:{n:'警用左輪',k:'gun',r:'SR',w:4,gun:1,job:{guard:.2},def:4},tool:{n:'副警長警章',k:'arm',r:'R',w:0,job:{patrol:.1}}},
 c_david:{weapon:{n:'伸縮警棍',k:'club',r:'R',w:3,job:{guard:.15}}},
 s_park:{tool:{n:'護士急救包',k:'med',r:'SR',w:3,job:{medic:.3}}},
 s_lin:{tool:{n:'總舖師大鑊',k:'wok',r:'SR',w:7,job:{cook:.35}}},
 c_cheung:{tool:{n:'外賣單車',k:'pack',r:'R',w:0,job:{scav:.15},loot:.2}},
 s_sofia:{tool:{n:'改裝電單車',k:'pack',r:'SR',w:0,job:{scav:.2},loot:.3,risk:.8}},
 s_mao:{weapon:{n:'茅山桃木劍',k:'sword',r:'SR',w:3,job:{guard:.25}},tool:{n:'鎮屍符',k:'book',r:'SR',w:0,job:{patrol:.15}}},
 r_maria:{tool:{n:'十字架',k:'arm',r:'R',w:0,job:{medic:.1}}},
 u_shen:{weapon:{n:'軍刀',k:'knife',r:'SR',w:4,job:{guard:.2,scav:.1}},armor:{n:'戰術背心',k:'suit',r:'SR',w:7,bite:.6,risk:.7}},
 r_rin:{weapon:{n:'木刀',k:'club',r:'R',w:3,job:{guard:.15}}},
 c_igor:{weapon:{n:'屠刀',k:'knife',r:'R',w:5,job:{guard:.1,cook:.15}}},
 u_grace:{armor:{n:'CDC 防護衣',k:'suit',r:'SR',w:5,bite:.4}}
};
Object.keys(BOUND).forEach(id=>{for(const sl in BOUND[id]){const k=`b_${id}_${sl}`;ITEMS[k]={...BOUND[id][sl],slot:sl,bind:id,aff:[id],d:`${CH[id].n}專屬，唔會離身`}}});
const isBound=k=>!!(k&&ITEMS[k]&&ITEMS[k].bind);
/* ---------- 個人背包 ---------- */
const BITEMS={
 can:{n:'罐頭',src:'food',per:1,d:'據點冇食物時自動食'},
 bottle:{n:'水樽',src:'water',per:1,d:'冇水時自動飲'},
 bandage:{n:'繃帶',src:'med',per:1,d:'受傷時即場包紮（清除受傷）'},
 mag:{n:'彈匣',src:'ammo',per:3,d:'守夜時用自己彈藥，唔使用倉庫'},
 serumv:{n:'血清',src:'serum',per:1,d:'被咬時自動注射'},
 core:{n:'晶核',src:'core',per:1,d:'隨身攜帶'},
 pill:{n:'仙丹',src:'stash',per:1,d:'HP 低過七成或者意志低過一半時自動服：HP +25、意志 +15'},
 manual:{n:'功法秘笈',src:'stash',per:1,d:'修仙者修煉：修為 +1 層（全能力 +1，最多 3 層）'}
};
const MANUALS={u_chenmo:'《吞天魔功》殘卷',u_liu:'《冰心訣》',r_su:'《御劍術》',r_linfan:'《苟道長生訣》'};
const isCult=u=>CH[u.id].fa.includes('仙');
function bagCap(u){
  if(isAnimal(u))return 0;if(isCult(u))return Infinity;
  let c=3+Math.floor(statB(u,'str')/5);const t=u.eq&&u.eq.tool&&ITEMS[u.eq.tool];
  if(t&&(t.k==='pack'||t.k==='cloud'))c+=4;return c;
}
const bagN=u=>Object.values(u.bag||{}).reduce((a,b)=>a+b,0);
function stashOf(k){const b=BITEMS[k];return b.src==='stash'?(G.stash[k]||0):Math.floor((G.res[b.src]||0)/b.per)}
function bagTake(u,k){
  const b=BITEMS[k];u.bag=u.bag||{};if(bagN(u)>=bagCap(u)||stashOf(k)<1)return false;
  if(b.src==='stash')G.stash[k]--;else G.res[b.src]-=b.per;
  u.bag[k]=(u.bag[k]||0)+1;return true;
}
function bagPut(u,k){
  if(!u.bag||!u.bag[k])return;const b=BITEMS[k];u.bag[k]--;if(!u.bag[k])delete u.bag[k];
  if(b.src==='stash')G.stash[k]=(G.stash[k]||0)+1;else G.res[b.src]+=b.per;
}
function bagEmpty(u){Object.keys(u.bag||{}).forEach(k=>{while(u.bag&&u.bag[k])bagPut(u,k)})}
function autoPack(u){
  if(isAnimal(u))return;
  ['can','bottle','bandage','mag','serumv'].forEach(k=>{while(u.bag&&u.bag[k])bagPut(u,k)});
  const plan={scav:['can','bottle','bandage','bandage'],patrol:['can','bottle','bandage'],guard:['mag','mag','bandage','can'],repair:['can','bottle'],cook:['can'],medic:['bandage','can'],rest:[]}[u.job]||[];
  plan.forEach(k=>bagTake(u,k));
  if((u.job==='scav'||u.job==='patrol')&&G.res.serum>=2)bagTake(u,'serumv');
}
function bagDaily(g,A,L){
  A.forEach(u=>{
    if(!u.bag)return;
    if(u.bag.pill>0&&(u.hp<maxHp(u)*.7||u.san<50)){u.bag.pill--;if(!u.bag.pill)delete u.bag.pill;u.hp=Math.min(maxHp(u),u.hp+25);sanD(u,15);L(`${nm(u)} 服咗一粒仙丹（HP +25、意志 +15）`,'g')}
  });
  A.filter(u=>isCult(u)&&stat(u,'med')>=12).forEach(u=>{if(g.day%4===0){u.bag=u.bag||{};u.bag.pill=(u.bag.pill||0)+1;L(`${nm(u)} 煉成一粒仙丹`,'g')}});
}
/* 招募時派綁定裝備同修仙者行裝 */
function giveKit(g,id){
  const u=g.units.find(x=>x.id===id);if(!u)return;u.eq=u.eq||{};u.bag=u.bag||{};
  if(BOUND[id])for(const sl in BOUND[id]){const k=`b_${id}_${sl}`;if(u.eq[sl]===k)continue;if(u.eq[sl])addItem(u.eq[sl]);u.eq[sl]=k}
  if(isCult(u)&&!u.kit){u.kit=1;u.bag.pill=(u.bag.pill||0)+3;u.bag.manual=(u.bag.manual||0)+1}
  if(!isCult(u)&&!u.kit){u.kit=1}
}
{const _or=onRecruit;onRecruit=function(g,id){_or(g,id);giveKit(g,id)}}
/* ---------- 覆寫裝備規則 ---------- */
function equip(u,slot,id){
  u.eq=u.eq||{};
  if(isBound(u.eq[slot]))return false;
  if(id&&ITEMS[id]&&ITEMS[id].gun&&!canGun(u))return false;
  if(id&&isBound(id))return false;
  if(u.eq[slot]){addItem(u.eq[slot]);u.eq[slot]=null}
  if(id&&G.inv[id]>0){G.inv[id]--;if(!G.inv[id])delete G.inv[id];u.eq[slot]=id}
  return true;
}
function unequipAll(u){if(!u.eq)return;for(const sl in u.eq)if(u.eq[sl]&&!isBound(u.eq[sl])){addItem(u.eq[sl]);u.eq[sl]=null}}
{const _es=eqScore;eqScore=function(u,it,j){if(it.gun&&!canGun(u))return -99;if(it.bind)return -99;return _es(u,it,j)}}
{const _kill=killUnit;killUnit=function(u,why){bagEmpty(u);return _kill(u,why)}}
{const _leave=leaveUnit;leaveUnit=function(u,why){bagEmpty(u);return _leave(u,why)}}

/* ---------- 圖示 ---------- */
const RCOL={UR:'#ffb8f5',SSR:'#f2c552',SR:'#b993ff',R:'#7eaaf0',C:'#a59e93'};
function itemIcon(k,c){
  c=c||'#d9d2c4';const S=(x)=>`<svg viewBox="0 0 32 32" aria-hidden="true">${x}</svg>`;
  switch(k){
    case 'blade':case 'sword':return S(`<line x1="7" y1="25" x2="25" y2="5" stroke="#e8eef2" stroke-width="2.4" stroke-linecap="round"/><line x1="7" y1="18" x2="14" y2="25" stroke="${c}" stroke-width="2.4"/><line x1="4" y1="28" x2="8" y2="24" stroke="#6a4a2a" stroke-width="3"/>`);
    case 'club':case 'bar':case 'staff':return S(`<line x1="6" y1="26" x2="26" y2="6" stroke="${k==='staff'?'#c9302a':'#a87444'}" stroke-width="4" stroke-linecap="round"/>`);
    case 'axe':return S(`<line x1="7" y1="27" x2="22" y2="6" stroke="#7a5532" stroke-width="2.6"/><path d="M19 4 L28 7 L25 15 L20 11Z" fill="#c6352b"/>`);
    case 'knife':return S(`<path d="M8 24 L22 6 L25 8 L12 26Z" fill="#e8eef2"/><line x1="6" y1="28" x2="10" y2="24" stroke="#3a2a1a" stroke-width="3"/>`);
    case 'spear':case 'halberd':return S(`<line x1="5" y1="28" x2="25" y2="6" stroke="#9a7a4a" stroke-width="2"/><path d="M23 3 L29 3 L28 9Z" fill="#e8eef2"/>${k==='halberd'?'<path d="M20 9 Q14 6 16 14Z" fill="#e8eef2"/>':''}`);
    case 'gun':return S(`<rect x="5" y="11" width="20" height="6" rx="1" fill="#2a2a2a"/><rect x="8" y="16" width="5" height="10" rx="1" fill="#2a2a2a"/>`);
    case 'rifle':return S(`<rect x="2" y="13" width="28" height="4" fill="#222"/><rect x="4" y="16" width="7" height="6" fill="#4a3a2a"/><rect x="14" y="10" width="7" height="3" fill="#222"/>`);
    case 'hammer':return S(`<line x1="16" y1="30" x2="16" y2="12" stroke="#6a4a2a" stroke-width="3"/><rect x="6" y="4" width="20" height="10" rx="1.5" fill="#8b939c"/>`);
    case 'xbow':return S(`<line x1="4" y1="16" x2="28" y2="16" stroke="#6a4a2a" stroke-width="3"/><path d="M22 4 Q14 16 22 28" stroke="#3a2a1a" stroke-width="2" fill="none"/>`);
    case 'wand':return S(`<line x1="8" y1="28" x2="22" y2="8" stroke="#6a4a2a" stroke-width="2.4"/><circle cx="23" cy="7" r="4.5" fill="#8ad0f0"/>`);
    case 'shield':return S(`<path d="M16 3 L27 7 L26 18 Q24 26 16 29 Q8 26 6 18 L5 7Z" fill="#5d6f85" stroke="#2c3644"/><rect x="9" y="14" width="14" height="3" fill="#e8e8e8"/>`);
    case 'suit':case 'jacket':case 'arm':case 'wings':return S(`<path d="M10 4 L13 6 L19 6 L22 4 L28 9 L25 14 L23 12 L23 28 L9 28 L9 12 L7 14 L4 9Z" fill="${k==='suit'?'#c9a227':k==='jacket'?'#2a2523':'#7a8aa0'}"/>${k==='suit'?'<rect x="9" y="18" width="14" height="2.5" fill="#dfe6d0"/>':''}`);
    case 'pack':case 'cloud':return S(`<rect x="7" y="8" width="18" height="20" rx="5" fill="#6b5232"/><rect x="11" y="4" width="10" height="6" rx="2" fill="none" stroke="#4a3620" stroke-width="2"/><rect x="10" y="15" width="12" height="6" rx="1.5" fill="#8a6a3e"/>`);
    case 'box':return S(`<rect x="4" y="11" width="24" height="15" rx="2" fill="#b33a2a"/><rect x="12" y="7" width="8" height="5" fill="none" stroke="#7a2a1a" stroke-width="2"/>`);
    case 'wok':return S(`<path d="M3 13 L29 13 Q27 25 16 25 Q5 25 3 13Z" fill="#2a2a2a"/><line x1="26" y1="13" x2="31" y2="9" stroke="#6a4a2a" stroke-width="2.4"/>`);
    case 'med':return S(`<rect x="4" y="8" width="24" height="18" rx="2" fill="#f4f4f4"/><path d="M16 11 V23 M10 17 H22" stroke="#d33" stroke-width="3.2"/>`);
    case 'bino':return S(`<circle cx="10" cy="18" r="6" fill="#222"/><circle cx="22" cy="18" r="6" fill="#222"/><circle cx="10" cy="18" r="3" fill="#5a8ab0"/><circle cx="22" cy="18" r="3" fill="#5a8ab0"/>`);
    case 'walkie':return S(`<rect x="10" y="8" width="12" height="20" rx="2" fill="#2a2a2a"/><line x1="19" y1="8" x2="19" y2="2" stroke="#2a2a2a" stroke-width="2"/><rect x="12" y="11" width="8" height="5" fill="#86afcf"/>`);
    case 'torch':case 'lamp':return S(`<path d="M20 6 L29 2 L29 14 Z" fill="#ffe08a" opacity=".7"/><rect x="5" y="7" width="16" height="6" rx="2" fill="#333" transform="rotate(20 13 10)"/>`);
    case 'shoe':return S(`<path d="M4 20 L4 12 L12 12 L16 18 L28 20 L28 25 L4 25Z" fill="#e8e8e8"/><path d="M4 25 L28 25" stroke="#c33" stroke-width="2"/>`);
    case 'book':return S(`<rect x="7" y="4" width="18" height="24" rx="1.5" fill="#b8962a"/><rect x="10" y="8" width="12" height="2" fill="#5a3a06"/><rect x="10" y="12" width="12" height="2" fill="#5a3a06"/>`);
    case 'fan':return S(`<path d="M16 28 L4 8 Q16 0 28 8Z" fill="#f4f2ea" stroke="#bbb"/>`);
    case 'apron':return S(`<path d="M9 6 L23 6 L25 28 L7 28Z" fill="#f2efe6"/>`);
    /* 背包消耗品 */
    case 'can':return S(`<rect x="8" y="6" width="16" height="22" rx="3" fill="#a8adb4"/><rect x="8" y="12" width="16" height="10" fill="#c6352b"/>`);
    case 'bottle':return S(`<rect x="12" y="3" width="8" height="5" fill="#2a6ab0"/><rect x="9" y="8" width="14" height="21" rx="4" fill="#86afcf" opacity=".85"/>`);
    case 'bandage':return S(`<rect x="5" y="11" width="22" height="10" rx="5" fill="#f2ead8" transform="rotate(-30 16 16)"/><circle cx="16" cy="16" r="2" fill="#d33"/>`);
    case 'mag':return S(`<rect x="11" y="4" width="10" height="24" rx="2" fill="#3a3a3a"/><rect x="13" y="6" width="6" height="3" fill="#c9b458"/>`);
    case 'serumv':return S(`<rect x="8" y="13" width="16" height="6" rx="1" fill="#a6c94e"/><line x1="24" y1="16" x2="30" y2="16" stroke="#ccc" stroke-width="1.5"/><rect x="3" y="12" width="5" height="8" fill="#888"/>`);
    case 'core':return S(`<path d="M16 3 L26 13 L16 29 L6 13Z" fill="#b993ff"/><path d="M16 3 L20 13 L16 29 L12 13Z" fill="#d8c4ff"/>`);
    case 'pill':return S(`<circle cx="16" cy="16" r="9" fill="#e8b23a"/><circle cx="13" cy="13" r="3" fill="#fff3c4"/>`);
    case 'manual':return S(`<rect x="7" y="4" width="18" height="24" rx="1.5" fill="#2a3a6a"/><rect x="13" y="7" width="6" height="18" fill="#f2ead8"/>`);
  }
  return S(`<rect x="8" y="8" width="16" height="16" rx="3" fill="${c}"/>`);
}

/* ---------- 角色面板 ---------- */
let SHTAB='doll';
function slotHTML(u,sl){
  const k=u.eq&&u.eq[sl],it=k&&ITEMS[k];
  const pos={weapon:'sl-w',armor:'sl-a',tool:'sl-t'}[sl];
  if(!canEquip(u))return `<div class="slot ${pos} empty"><span class="slbl">${SLOTS[sl]}</span><span class="muted" style="font-size:10px">—</span></div>`;
  return `<button class="slot ${pos} ${it?'':'empty'} ${isBound(k)?'bound':''}" data-eq="${sl}" style="${it?`--rc:${RCOL[it.r]}`:''}" title="${it?esc(it.n+'：'+itemFx(u,it)):'撳一下揀'+SLOTS[sl]}">
    <span class="slbl">${SLOTS[sl]}</span>${it?itemIcon(it.k,RCOL[it.r]):'<span class="plus">＋</span>'}
    ${it?`<span class="slname">${esc(it.n)}</span>`:''}${isBound(k)?'<span class="lock">綁定</span>':''}</button>`;
}
function openUnit(id){
  const u=uOf(id);if(!u)return;const c=CH[id];u.bag=u.bag||{};
  const coreCost=Math.ceil((2+u.star)*(fxOf(u).coreHalf?.5:1));let armed=false;const es=eqS(u),j=canWork(u,u.job)?u.job:'rest';
  const cap=bagCap(u),n=bagN(u),inf=cap===Infinity;
  const S=Object.values(SETS).find(x=>x.owner===id);
  const H=!u.act&&!isAnimal(u)?act(G).filter(x=>!isAnimal(x)&&!x.inf&&!x.iso):[];
  const cells=[];Object.keys(BITEMS).forEach(k=>{if(u.bag[k])cells.push(k)});
  const nCells=inf?Math.max(8,cells.length+4):Math.max(cap,0);
  modal(`<div class="modal dismiss sheet">
    <div class="sh-head">
      <div style="min-width:0;flex:1"><div class="row" style="gap:6px"><span class="rk ${c.g}">${c.g}</span><h2 class="rn ${c.g}">${esc(c.n)}</h2>${stars(u.star)}${u.cult?`<span class="chip good">修為第${u.cult}層</span>`:''}</div>
      <div class="muted" style="font-size:12px">${esc(c.o)} · ${esc(c.job)} · 而家：${u.act?JOBS[j].n:u.op==='squad'?'游擊隊':u.op?`駐守${esc(BASES[u.op].n)}分部`:'後備'}</div>
      <div class="chips" style="margin-top:3px">${c.fa.map(f=>`<span class="chip">${FA[f]}</span>`).join('')}${canGun(u)?'<span class="chip warn">槍械精通</span>':''}${statusChips(u)}</div></div>
      <button class="pop-x" id="cx" aria-label="關閉">×</button>
    </div>
    <div class="sh-tabs" role="tablist">${[['doll','裝備'],['stat','能力'],['bag','背包']].map(([k,l])=>`<button data-sht="${k}" aria-selected="${SHTAB===k}">${l}</button>`).join('')}</div>
    <div class="sh-body" data-tab="${SHTAB}">
      <section class="sh-doll">
        <div class="doll">
          <div class="dollfig">${fig(u,j)}</div>
          ${['weapon','armor','tool'].map(sl=>slotHTML(u,sl)).join('')}
        </div>
        ${canEquip(u)?`<div class="wbar ${es.over?'heavy':''}"><span>負重 ${es.w} / 力量 ${stat(u,'str')}</span>${es.over?`<b>每日多耗 ${Math.round(es.over*1.2)} 體力</b>`:''}</div>`:'<div class="muted" style="font-size:12px;text-align:center">動物唔用裝備</div>'}
        ${S?`<div class="setline">${es.set?'✓ ':''}【${esc(S.n)}】${S.items.filter(i=>u.eq&&Object.values(u.eq).includes(i)).length}/${S.items.length}　${esc(S.d)}</div>`:''}
        ${u.mut?`<div class="mutline">變種人【${MUT[u.mut.t].n}】${esc(MUT[u.mut.t].d)}</div>`:''}
      </section>
      <section class="sh-stat">
        <div class="bars">${bar('HP',u.hp,maxHp(u),'var(--calm)')}${bar('體力',u.sta,100,'var(--sodium)')}${bar('意志',u.san,100,'var(--steel)')}</div>
        <div class="st2">${ST.map(k=>`<div><span>${STN[k]}</span><s><i style="width:${stat(u,k)/25*100}%"></i></s><b>${stat(u,k)}</b></div>`).join('')}<div><span>效率</span><s></s><b>${j==='rest'?'—':Math.round(eff(u,j))}</b></div></div>
        <div class="aptg">${JK.filter(x=>x!=='rest').map(x=>{const g=canWork({...u,crit:0,iso:0},x)?grade(apt(u,x)*(fxOf(u).job[x]||1)):'—';return `<div>${JOBS[x].n}<b class="g${g}">${g}</b>${es.job[x]?`<em class="eqp">+${Math.round(es.job[x]*100)}%</em>`:''}</div>`}).join('')}</div>
        <div class="skillbox"><b>專長 · ${esc(c.sk.n)}</b> ${esc(c.sk.d)}
          <div class="chips" style="margin-top:4px">${c.tr.map(t=>`<span class="chip" title="${esc(TR[t].d)}">${TR[t].n}</span>`).join('')}</div>
          ${JK.filter(x=>isS(u,x)).map(x=>`<div style="margin-top:3px"><span class="rk UR">S</span> ${JOBS[x].n}【${SPERK[x].n}】<span class="muted">${esc(SPERK[x].d)}</span></div>`).join('')}${typeof CAPSK!=='undefined'&&CAPSK[u.id]?`<div style="margin-top:3px"><span class="rk SSR">♛</span> 隊長技能【${esc(CAPSK[u.id].n)}】<span class="muted">${esc(CAPSK[u.id].d)}</span></div>`:''}</div>
        <p class="bio">${esc(c.bio)}</p>
      </section>
      <section class="sh-bag">
        <div class="row" style="justify-content:space-between"><b class="bagt">${inf?'乾坤袋':'背包'}</b><span class="muted type" style="font-size:12px">${isAnimal(u)?'動物冇背包':inf?`${n} / ∞`:`${n} / ${cap}`}</span></div>
        ${isAnimal(u)?'':`<div class="baggrid">${Array.from({length:nCells},(_,i)=>{const k=cells[i];return k?`<button class="cell" data-put="${k}" title="${esc(BITEMS[k].n+'：'+BITEMS[k].d+'（撳一下放返倉庫）')}">${itemIcon(k)}<span class="cnt">${u.bag[k]}</span><span class="cn">${k==='manual'&&MANUALS[id]?esc(MANUALS[id]):BITEMS[k].n}</span></button>`:'<div class="cell empty"></div>'}).join('')}</div>
        <div class="lbl" style="margin-top:6px">由倉庫攞（撳一下 +1）</div>
        <div class="takes">${Object.keys(BITEMS).filter(k=>BITEMS[k].src!=='stash'||stashOf(k)>0).map(k=>`<button class="take" data-take="${k}" ${stashOf(k)<1||n>=cap?'disabled':''} title="${esc(BITEMS[k].d)}">${itemIcon(k)}<span>${BITEMS[k].n}</span><em>${stashOf(k)}</em></button>`).join('')}</div>
        <div class="row" style="gap:6px;margin-top:6px"><button class="btn sm" id="pack">按工作收拾行裝</button>${isCult(u)&&u.bag.manual>0&&(u.cult||0)<3?`<button class="btn sm pri" id="cultv">修煉功法</button>`:''}</div>`}
      </section>
    </div>
    <div class="sh-foot">
      ${H.length?`<div class="swaprow"><span class="lbl">同據點入面嘅人換位</span>${H.map(x=>`<button class="chip swapc" data-swap="${x.id}"><span class="rn ${CH[x.id].g}">${esc(nm(x))}</span> · ${JOBS[x.job].n}</button>`).join('')}</div>`:''}
      <div class="row">
        ${u.act?`<button class="btn sm" id="mv">移去後備</button>`:`<button class="btn sm" id="mv" ${!isAnimal(u)&&beds(G)>=bedCap(G)?'disabled':''}>加入據點${isAnimal(u)?'（寵物唔佔床位）':beds(G)>=bedCap(G)?'（冇床位）':''}</button>`}
        <button class="btn sm" id="up" ${u.star>=5||G.res.core<coreCost?'disabled':''}>用 ${coreCost} 晶核強化${u.star>=5?'（滿星）':''}</button>
        <button class="btn sm" id="bye">遣散</button>
      </div>
    </div>
  </div>`,()=>{
    const re=()=>{save();renderHead();openUnit(id)};
    $('#cx').onclick=closeOv;
    document.querySelectorAll('[data-sht]').forEach(b=>b.onclick=()=>{SHTAB=b.dataset.sht;openUnit(id)});
    $('#mv').onclick=()=>{if(u.act&&(u.inf||u.iso)){toast('感染者唔可以送走後備');return}u.act=!u.act;u.op=null;if(u.act)u.job=bestJob(u);else unequipAll(u);save();closeOv();openUnit(id)};
    $('#up').onclick=()=>{G.res.core-=coreCost;u.star++;u.hp=Math.min(maxHp(u),u.hp+10);toast(`${c.n} 強化到 ${u.star} 星，全能力 +1`);re()};
    $('#bye').onclick=e=>{if(!armed){armed=true;e.target.textContent='再撳一次確認遣散';e.target.classList.add('danger');return}leaveUnit(u,'被遣散。');addRes({bat:20});save();closeOv()};
    document.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{if(isBound(u.eq&&u.eq[b.dataset.eq])){toast(`${ITEMS[u.eq[b.dataset.eq]].n} 係 ${c.n} 嘅專屬裝備，唔會離身`);return}openEquip(id,b.dataset.eq)});
    document.querySelectorAll('[data-take]').forEach(b=>b.onclick=()=>{if(!bagTake(u,b.dataset.take))toast('背包滿咗或者倉庫冇貨');re()});
    document.querySelectorAll('[data-put]').forEach(b=>b.onclick=()=>{bagPut(u,b.dataset.put);re()});
    const pk=$('#pack');if(pk)pk.onclick=()=>{autoPack(u);toast('已按工作收拾行裝');re()};
    const cv=$('#cultv');if(cv)cv.onclick=()=>{u.bag.manual--;if(!u.bag.manual)delete u.bag.manual;u.cult=(u.cult||0)+1;u.hp=Math.min(maxHp(u),u.hp+10);addLog(`${c.n} 修煉${MANUALS[id]||'功法'}，修為突破到第 ${u.cult} 層。`);toast(`${c.n} 修為突破到第 ${u.cult} 層，全能力 +1`);re()};
    document.querySelectorAll('[data-swap]').forEach(b=>b.onclick=()=>{const o=uOf(b.dataset.swap);const op=u.op||null;const jj=o.job;o.act=false;unequipAll(o);o.op=op;o.job='rest';u.act=true;u.op=null;u.job=canWork(u,jj)?jj:bestJob(u);save();toast(`${nm(u)} 同 ${nm(o)} 換咗位`);closeOv();openUnit(id)});
  });
}
/* 揀裝備：鎖定槍械／綁定 */
function openEquip(id,sl){
  const u=uOf(id),cur=u.eq&&u.eq[sl];
  const opts=Object.keys(G.inv).filter(k=>ITEMS[k]&&ITEMS[k].slot===sl&&G.inv[k]>0).map(k=>({k,from:null}));
  G.units.forEach(o=>{if(o!==u&&o.eq&&o.eq[sl]&&!isBound(o.eq[sl]))opts.push({k:o.eq[sl],from:o.id})});
  opts.sort((a,b)=>RANK.indexOf(ITEMS[a.k].r)-RANK.indexOf(ITEMS[b.k].r)||(a.from?1:0)-(b.from?1:0));
  modal(`<div class="modal dismiss">
    <div class="eyebrow">${esc(nm(u))} · ${SLOTS[sl]}${cur?` · 而家用緊：${esc(ITEMS[cur].n)}`:''}</div>
    <p class="muted" style="margin:0">力量 ${stat(u,'str')}。裝備重過力量會打折兼多耗體力；專精角色效果 ×1.5。槍械只限有「槍械精通」嘅人（${GUNNERS.map(x=>CH[x].n).join('、')}）。</p>
    <div class="stack" style="gap:6px;max-height:60vh;overflow:auto">
      ${opts.map((o,i)=>{const it=ITEMS[o.k],note=eqNote(u,it),ow=o.from&&uOf(o.from),lock=it.gun&&!canGun(u);return `<button class="eqpick ${ow?'worn':''}" data-i="${i}" ${lock?'disabled':''}><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="row" style="gap:8px;flex-wrap:nowrap"><span class="eqico" style="--rc:${RCOL[it.r]}">${itemIcon(it.k,RCOL[it.r])}</span><b>${rk(it.r)} ${esc(it.n)}</b></span><span class="muted type" style="font-size:12px">重 ${iw(u,it)}${o.from?'':` · 背包 ${G.inv[o.k]}`}</span></div>${lock?'<div style="font-size:11px;color:var(--blood)">需要槍械精通</div>':''}${ow?`<div class="wornby"><span class="rn ${CH[ow.id].g}">${esc(nm(ow))}</span>${ow.act?'':'（後備）'}用緊 · 撳一下調俾${esc(nm(u))}</div>`:''}<div style="font-size:12px">${esc(itemFx(u,it))}</div>${note?`<div style="font-size:11px;color:var(--sodium2)">${esc(note)}</div>`:''}</button>`}).join('')||`<p class="muted">冇${SLOTS[sl]}。去搜括或者物資空投會搵到。</p>`}
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
