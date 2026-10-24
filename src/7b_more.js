/* ================= 擴展：裝備稀有度、專屬套裝、裝備抽獎 ================= */
const IRAR={bat:'C',cleaver:'C',armguard:'C',spear:'C',shoes:'C',walkie:'R',pack:'R',medkit:'R',binoc:'R',wok:'R',crowbar:'R',leather:'R',toolbox:'SR',axe:'SR',pistol:'SR',firesuit:'SR',shield:'SR',katana:'SSR',rifle:'SSR'};
Object.keys(IRAR).forEach(k=>ITEMS[k].r=IRAR[k]);
Object.assign(ITEMS,{
 umbrella:{n:'長柄遮',slot:'weapon',w:2,k:'club',r:'C',job:{guard:.06,patrol:.04},d:'港灣市人人都有一把'},
 helmet:{n:'電單車頭盔',slot:'armor',w:3,k:'arm',r:'C',bite:.85,risk:.9,d:'起碼個頭唔會被咬'},
 apron:{n:'廚師圍裙',slot:'tool',w:1,k:'apron',r:'C',job:{cook:.12},d:'有圍裙先似樣'},
 torch:{n:'強光電筒',slot:'tool',w:1,k:'torch',r:'C',job:{patrol:.12},d:'照得遠先見到嘢'},
 chainsaw:{n:'電鋸',slot:'weapon',w:13,k:'axe',r:'SR',job:{guard:.3,scav:.1,repair:.15},d:'好嘈，但好有效'},
 vest:{n:'軍用防彈衣',slot:'armor',w:10,k:'suit',r:'SSR',job:{guard:.1},bite:.5,risk:.6,aff:['u_shen','s_hawk','c_frank'],d:'防彈都防咬'},
 assault:{n:'突擊步槍',slot:'weapon',w:9,k:'rifle',r:'SSR',job:{guard:.45},def:10,aff:['u_shen','s_hawk','r_dale','c_frank'],d:'軍營搵返嚟，連發'},
 nvg:{n:'夜視鏡',slot:'tool',w:1,k:'bino',r:'SSR',job:{guard:.2,patrol:.35},d:'夜晚都睇得一清二楚'},
 surgkit:{n:'戰地手術包',slot:'tool',w:4,k:'med',r:'SSR',job:{medic:.5},aff:['s_huatuo','u_grace','s_park'],d:'可以喺任何地方開刀'},
 bike:{n:'越野電單車',slot:'tool',w:0,k:'pack',r:'SSR',job:{scav:.25},loot:.5,risk:.7,aff:['s_sofia','s_fei'],d:'一日搜三條街'},
 /* UR 專屬 */
 halberd:{n:'方天畫戟',slot:'weapon',w:16,k:'halberd',r:'UR',set:'lubu',aff:['u_lubu'],job:{guard:.6},def:12,d:'呂布專屬，重四十斤'},
 lubu_armor:{n:'獸面吞頭連環鎧',slot:'armor',w:15,k:'suit',r:'UR',set:'lubu',aff:['u_lubu'],job:{guard:.15},bite:.4,risk:.6,d:'呂布專屬'},
 redhare:{n:'赤兔馬',slot:'tool',w:0,k:'pack',r:'UR',set:'lubu',aff:['u_lubu'],job:{scav:.4,patrol:.3},loot:.4,risk:.6,d:'人中呂布，馬中赤兔'},
 goldstaff:{n:'如意金箍棒',slot:'weapon',w:2,k:'staff',r:'UR',set:'wukong',aff:['u_wukong'],job:{guard:.5,patrol:.3},def:10,d:'孫悟空專屬，可大可小'},
 goldarmor:{n:'鎖子黃金甲',slot:'armor',w:5,k:'suit',r:'UR',set:'wukong',aff:['u_wukong'],bite:.3,risk:.5,d:'孫悟空專屬'},
 cloud:{n:'筋斗雲',slot:'tool',w:0,k:'cloud',r:'UR',set:'wukong',aff:['u_wukong'],job:{scav:.5},loot:.5,risk:.5,d:'一個筋斗十萬八千里'},
 mjolnir:{n:'雷神之鎚',slot:'weapon',w:22,k:'hammer',r:'UR',set:'thor',aff:['u_thor'],job:{guard:.7},def:15,d:'索爾專屬，凡人拎唔起'},
 megingjord:{n:'力量腰帶',slot:'armor',w:2,k:'arm',r:'UR',set:'thor',aff:['u_thor'],bite:.7,st:{str:6},d:'索爾專屬，力量 +6'},
 jarngreipr:{n:'鐵手套',slot:'tool',w:4,k:'box',r:'UR',set:'thor',aff:['u_thor'],job:{guard:.2,repair:.2},d:'索爾專屬'},
 dv_xbow:{n:'連發連弩',slot:'weapon',w:6,k:'xbow',r:'UR',set:'davinci',aff:['u_davinci'],job:{guard:.3},def:8,d:'達文西手稿上嘅設計'},
 dv_wings:{n:'機械翼',slot:'armor',w:6,k:'wings',r:'UR',set:'davinci',aff:['u_davinci'],job:{scav:.2},risk:.5,d:'達文西專屬'},
 dv_codex:{n:'達文西手稿',slot:'tool',w:1,k:'book',r:'UR',set:'davinci',aff:['u_davinci'],job:{repair:.5,medic:.2},d:'萬能天才嘅筆記'},
 bride_scissors:{n:'鴛鴦剪',slot:'weapon',w:2,k:'knife',r:'UR',set:'bride',aff:['u_bride'],job:{guard:.3,scav:.2},d:'鬼新娘專屬'},
 bride_veil:{n:'紅蓋頭',slot:'armor',w:1,k:'arm',r:'UR',set:'bride',aff:['u_bride'],bite:.2,d:'鬼新娘專屬'},
 bride_lamp:{n:'引魂燈',slot:'tool',w:2,k:'lamp',r:'UR',set:'bride',aff:['u_bride'],job:{patrol:.5},d:'鬼新娘專屬'},
 soulsword:{n:'噬魂劍',slot:'weapon',w:8,k:'sword',r:'UR',set:'chenmo',aff:['u_chenmo'],job:{guard:.5},def:8,d:'陳墨專屬'},
 blackrobe:{n:'玄黑道袍',slot:'armor',w:3,k:'arm',r:'UR',set:'chenmo',aff:['u_chenmo'],bite:.5,risk:.6,d:'陳墨專屬'},
 cauldron:{n:'吞天鼎',slot:'tool',w:10,k:'box',r:'UR',set:'chenmo',aff:['u_chenmo'],job:{medic:.2,repair:.2},d:'陳墨專屬，煉化晶核'},
 frostsword:{n:'寒霜仙劍',slot:'weapon',w:5,k:'sword',r:'UR',set:'liu',aff:['u_liu'],job:{guard:.4,scav:.2},d:'柳如烟專屬'},
 silkrobe:{n:'冰蠶羽衣',slot:'armor',w:1,k:'arm',r:'UR',set:'liu',aff:['u_liu'],bite:.5,risk:.5,d:'柳如烟專屬'},
 jadevase:{n:'玉淨瓶',slot:'tool',w:2,k:'med',r:'UR',set:'liu',aff:['u_liu'],job:{medic:.6},d:'柳如烟專屬'},
 merlinstaff:{n:'梅林法杖',slot:'weapon',w:4,k:'wand',r:'UR',set:'merlin',aff:['u_merlin'],job:{guard:.3,patrol:.3},d:'梅林專屬'},
 starrobe:{n:'星辰長袍',slot:'armor',w:2,k:'arm',r:'UR',set:'merlin',aff:['u_merlin'],bite:.6,risk:.7,d:'梅林專屬'},
 crystal:{n:'水晶球',slot:'tool',w:3,k:'bino',r:'UR',set:'merlin',aff:['u_merlin'],job:{patrol:.4},d:'梅林專屬'},
 /* SSR 專屬 */
 featherfan:{n:'羽扇',slot:'tool',w:1,k:'fan',r:'SSR',set:'zhuge',aff:['s_zhuge'],job:{patrol:.25,guard:.1},d:'諸葛亮專屬'},
 guanjin:{n:'綸巾',slot:'armor',w:1,k:'arm',r:'SSR',set:'zhuge',aff:['s_zhuge'],risk:.8,d:'諸葛亮專屬'},
 masamune:{n:'名刀正宗',slot:'weapon',w:8,k:'blade',r:'SSR',set:'mio',aff:['u_mio'],job:{guard:.45,scav:.2},d:'宮本澪專屬'},
 kendoarmor:{n:'劍道護具',slot:'armor',w:6,k:'arm',r:'SSR',set:'mio',aff:['u_mio','r_rin'],bite:.6,risk:.8,d:'宮本澪專屬'}
});
const SETS={
 lubu:{n:'人中呂布',owner:'u_lubu',d:'保安效率再 +100%，夜間防禦 +30，佢唔會受傷',fx:{job:{guard:1},def:30,noHurt:1}},
 wukong:{n:'齊天大聖',owner:'u_wukong',d:'每晚屍潮 -25%，巡邏同搜括再 +50%',fx:{job:{patrol:.5,scav:.5},horde:.75}},
 thor:{n:'諸神黃昏',owner:'u_thor',d:'守夜時引雷機會再 +45%，保安再 +50%',fx:{thunder:.45,job:{guard:.5}}},
 davinci:{n:'文藝復興',owner:'u_davinci',d:'設施升級所需工作量減半，維修再 +80%',fx:{workHalf:1,job:{repair:.8}}},
 bride:{n:'冥婚',owner:'u_bride',d:'每晚 50% 機會令屍群自相殘殺（屍潮 -35%）',fx:{ghostwed:.5}},
 chenmo:{n:'吞天魔功',owner:'u_chenmo',d:'每晚守住必得晶核 +1，全能力 +2',fx:{coreNight:1,st:{str:2,agi:2,per:2,tec:2,med:2,cok:2,wil:2}}},
 liu:{n:'冰心訣·極',owner:'u_liu',d:'每日必定化解一個感染者嘅屍毒，全隊 HP 每日再 +8',fx:{cureDaily:1,teamHeal:8}},
 merlin:{n:'星辰預言',owner:'u_merlin',d:'全隊效率再 +10%，夜間防禦再 +15%',fx:{teamEff:.1,defPct:.15}},
 zhuge:{n:'空城計·真',owner:'s_zhuge',d:'防線被破時必定冇人受傷',fx:{breachSafe:1}},
 mio:{n:'一刀流',owner:'u_mio',d:'保安再 +60%，唔使彈藥',fx:{job:{guard:.6},noAmmo:1}}
};
Object.keys(SETS).forEach(k=>SETS[k].items=Object.keys(ITEMS).filter(i=>ITEMS[i].set===k));
Object.assign(LOCITEM,{train:['crowbar','chainsaw','walkie','torch'],bunker:['torch','toolbox','medkit','helmet'],prison:['pistol','shield','vest','umbrella'],hospital:['medkit','surgkit','armguard'],dungeon:['assault','vest','nvg','surgkit','chainsaw'],fortress:['toolbox','chainsaw','bike','helmet'],store:['bat','shoes','pack','umbrella','torch','apron'],market:['cleaver','wok','spear','apron'],barracks:['rifle','shield','binoc','pistol','assault','vest','nvg']});
const ITEM_BY_R={};RANK.forEach(r=>ITEM_BY_R[r]=Object.keys(ITEMS).filter(k=>ITEMS[k].r===r));
const IRATES=[['UR',2],['SSR',7],['SR',18],['R',33],['C',40]];
function rollItem(r){return pick(ITEM_BY_R[r]||ITEM_BY_R.R)}
function setOf(u){
  if(!u.eq)return null;const es=Object.values(u.eq).filter(Boolean);
  for(const k in SETS){const S=SETS[k];if(S.owner===u.id&&S.items.every(i=>es.includes(i)))return S}
  return null;
}
function setFx(u,k){const S=setOf(u);return S?S.fx[k]||0:0}
function gearSt(u,k){
  let b=0;if(u.eq)for(const sl in u.eq){const it=u.eq[sl]&&ITEMS[u.eq[sl]];if(it&&it.st&&it.st[k])b+=it.st[k]}
  const S=setOf(u);if(S&&S.fx.st&&S.fx.st[k])b+=S.fx.st[k];return b;
}
function teamAdd(k){return G?G.units.filter(u=>u.act).reduce((s,u)=>s+(typeof fxOf(u)[k]==='number'&&!MULK.includes(k)?fxOf(u)[k]:0)+(setFx(u,k)||0),0):0}
function teamMul(k){return G?G.units.filter(u=>u.act).reduce((s,u)=>s*(fxOf(u)[k]??1)*(setFx(u,k)||1),1):1}
function teamMaxFx(k){return G?G.units.filter(u=>u.act).reduce((s,u)=>Math.max(s,(fxOf(u)[k]||0),(setFx(u,k)||0)),0):0}
/* 覆寫：裝備效果用基本力量計（避免力量腰帶循環），加套裝 */
const iw=(u,it)=>(it.set||it.bind)&&(it.aff||[]).includes(u.id)?Math.ceil(it.w/2):it.w;
function eqF(u,it){
  const w=iw(u,it),st=statB(u,'str')+(it.st&&it.st.str?0:gearSt(u,'str'));let f=st>=w?1:Math.max(.35,1-(w-st)*.08);
  if(u.sta<30&&w>=8)f*=.75;
  if((it.aff||[]).includes(u.id))f*=1.5;
  return f;
}
function eqNote(u,it){
  const st=statB(u,'str')+gearSt(u,'str'),n=[];
  if((it.aff||[]).includes(u.id))n.push(it.set?'專屬 ×1.5':'專精 ×1.5');
  if(st<iw(u,it))n.push(`力量唔夠（${st}/${iw(u,it)}）`);
  if(iw(u,it)<it.w)n.push('主人用重量減半');
  if(u.sta<30&&it.w>=8)n.push('體力低 ×0.75');
  return n.join('、');
}
function eqS(u){
  const r={job:{},def:0,risk:1,bite:1,loot:0,w:0,over:0,set:null};
  if(!u.eq)return r;
  for(const sl in u.eq){const id=u.eq[sl];if(!id||!ITEMS[id])continue;const it=ITEMS[id],f=eqF(u,it);r.w+=iw(u,it);
    if(it.job)for(const j in it.job)r.job[j]=(r.job[j]||0)+it.job[j]*f;
    if(it.def)r.def+=it.def*f;
    if(it.risk)r.risk*=Math.max(.2,1-(1-it.risk)*f);
    if(it.bite)r.bite*=Math.max(.2,1-(1-it.bite)*f);
    if(it.loot)r.loot+=it.loot*f;}
  const S=setOf(u);
  if(S){r.set=S;if(S.fx.job)for(const j in S.fx.job)r.job[j]=(r.job[j]||0)+S.fx.job[j];if(S.fx.def)r.def+=S.fx.def}
  r.over=Math.max(0,r.w-statB(u,'str')-gearSt(u,'str'));
  return r;
}
function itemFx(u,it){
  const f=u?eqF(u,it):1,p=x=>Math.round(x*f*100),out=[];
  if(it.job)for(const j in it.job)out.push(`${JOBS[j].n} +${p(it.job[j])}%`);
  if(it.def)out.push(`夜間防禦 +${Math.round(it.def*f)}`);
  if(it.loot)out.push(`搜括收穫 +${p(it.loot)}%`);
  if(it.risk)out.push(`受傷風險 -${Math.round((1-Math.max(.2,1-(1-it.risk)*f))*100)}%`);
  if(it.bite)out.push(`被咬機會 -${Math.round((1-Math.max(.2,1-(1-it.bite)*f))*100)}%`);
  if(it.st)for(const k in it.st)out.push(`${STN[k]} +${it.st[k]}`);
  return out.join('、');
}
const rk=r=>`<span class="rk ${r}">${r}</span>`;

/* ---------- 裝備抽獎 ---------- */
let RTAB='char';
function rollR(rates){let x=R()*100;for(const [g,p] of rates){if((x-=p)<=0)return g}return 'C'}
function pullGear(n){
  const cost=n===10?720:80;
  if(G.res.bat<cost){toast('電池唔夠。搜括、守夜、完成章節都會有');return}
  G.res.bat-=cost;G.gpity=G.gpity||0;const out=[];
  if(!G.gdex){G.gdex={};Object.keys(G.inv||{}).forEach(k=>{if(G.inv[k]>0)G.gdex[k]=1});G.units.forEach(u=>Object.values(u.eq||{}).forEach(k=>{if(k)G.gdex[k]=1}))}
  const fresh=[];
  for(let i=0;i<n;i++){
    let r=rollR(IRATES);G.gpity++;
    if(G.gpity>=50&&r!=='UR')r='SSR';
    if(n===10&&i===9&&!out.some(o=>['UR','SSR','SR'].includes(ITEMS[o].r))&&!['UR','SSR','SR'].includes(r))r='SR';
    if(r==='UR'||r==='SSR')G.gpity=0;
    const id=rollItem(r),nw=!G.gdex[id];addItem(id);out.push(id);
    if(nw){G.gdex[id]=1;fresh.push({kind:'gear',id})}
  }
  save();renderHead();
  const grid=()=>modal(`<div class="modal dismiss" style="width:min(900px,100%)">
    <div class="eyebrow">空投箱落地 · ${n} 件</div>
    <div class="pullgrid ${n===1?'one':''}">${out.map((id,k)=>{const it=ITEMS[id],S=it.set&&SETS[it.set];return `<div class="pc g-${it.r}"><div class="in"><div class="back">· · ·</div><div class="front"><div class="gcard r-${it.r}"><div class="row" style="justify-content:space-between">${rk(it.r)}<span class="chip">${SLOTS[it.slot]}</span></div><b>${esc(it.n)}</b><small>${esc(itemFx(null,it))}</small>${S?`<small class="setn">專屬：${esc(CH[S.owner].n)} · 套裝「${esc(S.n)}」</small>`:''}</div></div></div></div>`}).join('')}</div>
    <div class="row" style="justify-content:center"><button class="btn" id="again">再開 ${n} 個（${cost} 電池）</button><button class="btn pri" id="ok">收到</button></div>
  </div>`,()=>{
    const cards=[...document.querySelectorAll('.pc')];const t=cards.map((c,i)=>setTimeout(()=>c.classList.add('open'),250+i*180));
    $('#ok').onclick=()=>{t.forEach(clearTimeout);closeOv()};
    $('#again').onclick=()=>{t.forEach(clearTimeout);closeOv();pullGear(n)};
  });
  typeof reveal==='function'&&fresh.length?reveal(fresh,grid):grid();
}
function rRadio(){
  const total=CH_RAW.length,got=Object.keys(G.dex).length;
  const head=`<div class="subtabs"><button data-rt="char" aria-pressed="${RTAB==='char'}">倖存者廣播</button><button data-rt="gear" aria-pressed="${RTAB==='gear'}">物資空投（裝備）</button></div>`;
  if(RTAB==='char'){
    $('#main').innerHTML=head+`
    <div class="radio">
      <div class="dial"><div class="scale"><div class="nums"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108</span></div><div class="needle" id="needle"></div></div><div class="grill"></div></div>
      <div class="stack">
        <h2>緊急廣播</h2>
        <p class="muted" style="margin:0;max-width:52ch">用電池向全城廣播。回應嘅可能係普通街坊，亦可能係傳說入面嘅人物——呂布、孫悟空、雷神索爾、達文西、鬼新娘、陳墨、柳如烟……抽到某個陣營嘅角色會解鎖對應副本。</p>
        <div class="row"><button class="btn" id="p1">廣播 1 次 · 100 電池</button><button class="btn pri" id="p10">廣播 10 次 · 900 電池</button></div>
        <p class="muted" style="margin:0;font-size:12px">10 連保證 SR 以上 · 50 次保底 SSR（${G.pity}/50）· 重複角色突破 +1★。傳奇好強，但都要有人煮飯、巡邏、維修。</p>
        <div class="rates">${RATES.map(([g,p])=>`<div class="rate"><b>${rk(g)}</b><span>${p}%</span></div>`).join('')}</div>
      </div>
    </div>
    <div class="secth"><h2>倖存者圖鑑</h2><span class="muted type">${got}/${total}</span></div>
    ${RANK.map(g=>{const ids=CH_RAW.filter(r=>r[2]===g).map(r=>r[0]);if(!ids.length)return '';return `<div class="dexh">${rk(g)}<span class="muted type">${ids.filter(i=>G.dex[i]).length}/${ids.length}</span></div>
    <div class="cards">${ids.map(id=>{const c=CH[id],k=G.dex[id];return k?`<div class="tag" style="cursor:default"><div class="tt">${av(id,G.gone[id]&&G.gone[id].dead?'dead':'')}<div><b class="rn ${c.g}">${esc(c.n)}</b><small>${esc(c.o)} · ${esc(c.job)}</small></div></div><div class="chips">${c.fa.map(f=>`<span class="chip">${FA[f]}</span>`).join('')}</div><small>${esc(c.sk.n)}：${esc(c.sk.d)}</small></div>`:`<div class="tag res" style="cursor:default"><div class="tt"><div class="av r-${c.g}" style="font-size:20px">？<span>${c.g}</span></div><div><b>？？？</b><small>未遇見</small></div></div></div>`}).join('')}</div>`}).join('')}`;
    $('#p1').onclick=()=>{spin();setTimeout(()=>pull(1),500)};
    $('#p10').onclick=()=>{spin();setTimeout(()=>pull(10),500)};
  }else{
    const keys=Object.keys(ITEMS).filter(k=>!ITEMS[k].bind).sort((a,b)=>RANK.indexOf(ITEMS[a].r)-RANK.indexOf(ITEMS[b].r));
    const own=k=>(G.inv[k]||0)+G.units.filter(u=>u.eq&&Object.values(u.eq).includes(k)).length;
    $('#main').innerHTML=head+`
    <div class="radio">
      <div class="dial airdrop"><div class="crate"><span>AIRDROP</span></div></div>
      <div class="stack">
        <h2>物資空投</h2>
        <p class="muted" style="margin:0;max-width:52ch">用電池換軍方空投坐標。空投係裝備最主要嘅來源，傳奇角色嘅專屬裝備（UR）只可以喺度或者副本搵到。集齊一套專屬裝備，佢會覺醒套裝技能。</p>
        <div class="row"><button class="btn" id="g1">開 1 箱 · 80 電池</button><button class="btn pri" id="g10">開 10 箱 · 720 電池</button></div>
        <p class="muted" style="margin:0;font-size:12px">10 連保證 SR 以上 · 50 次保底 SSR（${G.gpity||0}/50）</p>
        <div class="rates">${IRATES.map(([g,p])=>`<div class="rate"><b>${rk(g)}</b><span>${p}%</span></div>`).join('')}</div>
      </div>
    </div>
    <div class="secth"><h2>專屬套裝</h2></div>
    <div class="inv">${Object.keys(SETS).map(k=>{const S=SETS[k];return `<div class="invi"><div class="row" style="justify-content:space-between"><b>${esc(S.n)}</b><span class="muted" style="font-size:12px">${esc(CH[S.owner].n)}</span></div><div style="font-size:12px">${esc(S.d)}</div><div class="chips">${S.items.map(i=>`<span class="chip ${own(i)?'good':''}">${esc(ITEMS[i].n)}</span>`).join('')}</div></div>`}).join('')}</div>
    <div class="secth"><h2>裝備圖鑑</h2><span class="muted type">${keys.filter(own).length}/${keys.length}</span></div>
    <div class="inv">${keys.map(k=>{const it=ITEMS[k],o=own(k);return `<div class="invi ${o?'':'off'}"><div class="row" style="justify-content:space-between"><b>${rk(it.r)} ${o?esc(it.n):'？？？'}</b><span class="chip">${SLOTS[it.slot]} · 重 ${it.w}</span></div>${o?`<div style="font-size:12px">${esc(itemFx(null,it))}</div>`:''}</div>`}).join('')}</div>`;
    $('#g1').onclick=()=>pullGear(1);$('#g10').onclick=()=>pullGear(10);
  }
  document.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>{RTAB=b.dataset.rt;render()});
}
function go(v){VIEW=v;SEL=null;render();window.scrollTo(0,0)}

/* ---------- 自動配裝（覆寫） ----------
   1. 專屬裝備優先俾主人（由背包或者其他人身上攞返）
   2. 休息／後備／重傷／隔離嘅人除低非專屬裝備，俾其他人用
   3. 其餘裝備按當日工作同能力值重新分配，有更好選擇就移裝 */
function autoEquip(){
  const before={};G.units.forEach(u=>before[u.id]=JSON.stringify(u.eq||{}));
  const mine=(u,k)=>{const it=ITEMS[k];return it&&it.set&&SETS[it.set].owner===u.id};
  const working=u=>u.act&&canEquip(u)&&canWork(u,u.job)&&u.job!=='rest';
  // 1. 專屬裝備俾主人
  G.units.filter(u=>canEquip(u)).forEach(u=>{
    Object.values(SETS).filter(S=>S.owner===u.id).forEach(S=>S.items.forEach(k=>{
      const sl=ITEMS[k].slot;if(u.eq&&u.eq[sl]===k)return;
      const holder=G.units.find(o=>o!==u&&o.eq&&o.eq[sl]===k);
      if(holder)equip(holder,sl,null);
      if(G.inv[k]>0)equip(u,sl,k);
    }));
  });
  // 2. 除低所有非專屬裝備，放返背包
  G.units.forEach(u=>{if(!u.eq)return;for(const sl in u.eq){const k=u.eq[sl];if(k&&!mine(u,k))equip(u,sl,null)}});
  // 3. 全局分配：每次揀「效果最好」嘅 人 × 格 × 裝備
  const W=G.units.filter(working);
  const jw={guard:1.25,scav:1.15,patrol:1,medic:1,repair:.95,cook:.9};
  for(let guard=0;guard<200;guard++){
    let best=null,bv=.8;
    W.forEach(u=>{
      const cw=eqS(u).w,cap=statB(u,'str')+gearSt(u,'str')+3,base=1+eff(u,u.job)/40;
      Object.keys(SLOTS).forEach(sl=>{
        if(u.eq&&u.eq[sl])return;
        Object.keys(G.inv).forEach(k=>{
          const it=ITEMS[k];if(!it||it.slot!==sl||!(G.inv[k]>0))return;
          if(cw+iw(u,it)>cap)return;
          if(it.set&&SETS[it.set].owner!==u.id&&G.units.some(o=>o.id===SETS[it.set].owner))return;
          const v=eqScore(u,it,u.job)*(jw[u.job]||1)*base;
          if(v>bv){bv=v;best={u,sl,k}}
        });
      });
    });
    if(!best)break;
    equip(best.u,best.sl,best.k);
  }
  return G.units.filter(u=>JSON.stringify(u.eq||{})!==before[u.id]).length;
}
