/* ================= 分部：後備人員駐守其他據點，電腦自動模擬 ================= */
const OPJOB=['scav','patrol','guard','cook','medic','repair'];
function opMembers(g,id){return g.units.filter(u=>!u.act&&u.op===id)}
function reserveFree(g){return g.units.filter(u=>!u.act&&!u.op)}
function opCands(g){
  return Object.keys(BASES).filter(k=>k!==g.base&&!(g.outposts||{})[k]&&((g.clear[k]||0)>=100||(g.oldBases||[]).includes(k)));
}
function opRoles(M){
  // 電腦按能力分工：每人揀自己最叻嘅；冇人守夜就派最大力嗰個
  const r=M.map(u=>{let b='scav',v=-1;OPJOB.forEach(j=>{if(!canWork({...u,crit:0,iso:0},j))return;const a=apt(u,j)*(fxOf(u).job[j]||1);if(a>v){v=a;b=j}});return{u,j:b}});
  if(r.length>=2&&!r.some(x=>x.j==='guard')){const g=r.reduce((a,b)=>apt(b.u,'guard')>apt(a.u,'guard')?b:a);g.j='guard'}
  // 全部人都揀咗守夜時，留最識守夜嗰個，其餘人入面揀一個煮飯（之前喺度 reduce 空陣列令結束一日出錯）
  if(r.length>=3&&!r.some(x=>x.j==='cook')){
    const best=r.reduce((a,b)=>apt(b.u,'guard')>apt(a.u,'guard')?b:a),pool=r.some(x=>x.j!=='guard')?r.filter(x=>x.j!=='guard'):r.filter(x=>x!==best);
    pool.reduce((a,b)=>apt(b.u,'cook')>apt(a.u,'cook')?b:a).j='cook';
  }
  return r;
}
function simOutposts(g,H,L){
  g.outposts=g.outposts||{};const ids=Object.keys(g.outposts);let jdef=0;
  if(!ids.length)return 0;
  H('分部');
  ids.forEach(id=>{
    const o=g.outposts[id],b=BASES[id],loc=LOCS.find(l=>l.id===id);
    // 感染倒數
    opMembers(g,id).forEach(u=>{if(!u.inf)return;u.inf--;if(u.inf===0){if(R()<mutChance(u)){const m=mutate(u);L(`${b.n}：${nm(u)} 冇屍變，變成咗變種人（${m.n}）`,'y')}else{killUnit(u,`喺${b.n}分部屍變。`);L(`${b.n}：${nm(u)} 屍變咗`,'b');o.loy=Math.max(0,o.loy-8)}}});
    const M=opMembers(g,id);
    if(!M.length){o.last='冇人駐守';L(`${b.n}：冇人駐守`);return}
    const roles=opRoles(M),by={};roles.forEach(x=>(by[x.j]=by[x.j]||[]).push(x.u));
    const pw=(by.scav||[]).reduce((s,u)=>s+apt(u,'scav')*condMult(u),0)+(by.patrol||[]).reduce((s,u)=>s+apt(u,'patrol')*.5,0);
    const gd=(by.guard||[]).reduce((s,u)=>s+apt(u,'guard')*condMult(u),0)+M.reduce((s,u)=>s+stat(u,'str')*.15,0);
    const ck=(by.cook||[]).reduce((s,u)=>s+apt(u,'cook'),0),md=(by.medic||[]).reduce((s,u)=>s+apt(u,'medic'),0);
    const got={},ll=loc?loc.loot:{food:1,water:1};
    for(const r in ll){if(r==='serum')continue;const n=Math.round(pw/10*ll[r]*(LSCALE[r]||1)*.5*rf(.6,1.3));if(n>0)got[r]=n}
    for(const r in (b.perk||{}))got[r]=(got[r]||0)+b.perk[r];
    const eat=Math.ceil(M.reduce((s,u)=>s+fxOf(u).eat,0)*(ck>=10?.75:1));
    let fNet=(got.food||0)-eat,wNet=(got.water||0)-M.length;
    const notes=[],sup={};
    if(fNet<0){const t=Math.min(-fNet,g.res.food);g.res.food-=t;fNet+=t;if(t)sup.food=t}
    if(wNet<0){const t=Math.min(-wNet,g.res.water);g.res.water-=t;wNet+=t;if(t)sup.water=t}
    if(sup.food||sup.water)notes.push(`由主據點補給 ${Object.keys(sup).map(k=>RES[k].n+' '+sup[k]).join('、')}`);
    const short=fNet<0||wNet<0;
    got.food=Math.max(0,fNet);got.water=Math.max(0,wNet);
    // 分部夜晚
    const hz=hordeBase(g)*.28*(b.horde||1)*rf(.7,1.3),odef=b.wall*.4+gd+(b.def||0);
    if(hz>odef){const v=pick(M);const d=hurt(v,ri(10,25));notes.push(`夜晚被屍群衝擊，${nm(v)} 受傷（-${d}）`);o.loy=Math.max(0,o.loy-4);if(R()<.12){const t=infect(v,b.n);if(t)notes.push(t)}}
    M.forEach(u=>{u.hp=Math.min(maxHp(u),u.hp+3+md*.4);u.sta=cl(u.sta+8,0,100);if(u.inj&&R()<.15+md*.01)u.inj=0;if(u.crit&&md>=10)u.crit=0;sanD(u,short?-6:1)});
    if(short){o.loy=Math.max(0,o.loy-6);notes.push('主據點都冇得補給，分部捱餓，開始有怨言')}else o.loy=Math.min(100,o.loy+1);
    if(o.loy<30)notes.push('忠誠度好低');
    const st=addRes(got);
    const who=roles.map(x=>`${nm(x.u)}${JOBS[x.j].n}`).join('、');
    o.last=`${who}。${st?'運返 '+st:'冇剩'}${notes.length?'；'+notes.join('；'):''}`;
    L(`${b.n}（${M.length}人，忠誠 ${o.loy}）：${o.last}`,short||notes.some(t=>!t.startsWith('由主據點'))?'b':'g');
    M.forEach(u=>{if(u.hp<=0){killUnit(u,`喺${b.n}分部傷重不治。`);L(`${b.n}：${nm(u)} 傷重不治`,'b')}});
    // 突發事項
    const r=R();
    if(r<.07&&gd>8){const add=Math.round(gd*.6);jdef+=add;L(`${b.n}派人過嚟聯合守夜（今晚防禦 +${add}）`,'g')}
    else if(r<.13)g.queue.push({id:'op_trade',c:{op:id}});
    else if(r<.18)g.queue.push({id:'op_help',c:{op:id}});
    else if(r<.22)g.queue.push({id:'op_raid',c:{op:id}});
    else if(r<.26){const it=rollItem(pick(['C','R','R','SR']));addItem(it);L(`${b.n}執到一件${ITEMS[it].n}（${ITEMS[it].r}）送返嚟`,'g')}
    if(o.loy<35&&R()<.35&&opMembers(g,id).length)g.queue.push({id:'op_rebel',c:{op:id}});
  });
  return jdef;
}
const opLeader=id=>opMembers(G,id).filter(talker).reduce((a,b)=>!a||stat(b,'wil')>stat(a,'wil')?b:a,null)||opMembers(G,id)[0];
const opOk=c=>G.outposts&&G.outposts[c.op]&&opMembers(G,c.op).length?c:null;
Object.assign(EV,{
 op_trade:{t:'分部交易',pre:opOk,txt:c=>{const b=BASES[c.op],l=opLeader(c.op);return `${b.n}分部嘅 ${nm(l)} 用無線電聯絡：「我哋呢邊有啲嘢多咗，想同你換。」`},opts:[
  {l:'10 彈藥 → 18 食物',req:()=>G.res.ammo>=10,fx:c=>{G.outposts[c.op].loy+=3;return addRes({ammo:-10,food:18})}},
  {l:'15 食物 → 8 零件 + 4 藥品',req:()=>G.res.food>=15,fx:c=>{G.outposts[c.op].loy+=3;return addRes({food:-15,parts:8,med:4})}},
  {l:'免費送 10 食物過去',d:'忠誠 +15',req:()=>G.res.food>=10,fx:c=>{addRes({food:-10});const o=G.outposts[c.op];o.loy=Math.min(100,o.loy+15);return `${BASES[c.op].n}分部好感激。忠誠 ${o.loy}`}},
  {l:'唔換',fx:()=>'對方話「下次啦」。'}]},
 op_help:{t:'分部求援',pre:opOk,txt:c=>`${BASES[c.op].n}分部被屍群圍住，${nm(opLeader(c.op))} 喺無線電入面大叫：「頂唔順喇！有冇彈藥？有冇藥？」`,opts:[
  {l:'派 8 發彈藥過去',req:()=>G.res.ammo>=8,fx:c=>{addRes({ammo:-8});const o=G.outposts[c.op];o.loy=Math.min(100,o.loy+15);return `佢哋頂住咗。忠誠 ${o.loy}`}},
  {l:'派 3 份藥品過去',req:()=>G.res.med>=3,fx:c=>{addRes({med:-3});opMembers(G,c.op).forEach(u=>{u.inj=0;u.hp=Math.min(maxHp(u),u.hp+20)});const o=G.outposts[c.op];o.loy=Math.min(100,o.loy+10);return `傷者得救。忠誠 ${o.loy}`}},
  {l:'自己諗辦法',fx:c=>{const o=G.outposts[c.op];o.loy=Math.max(0,o.loy-15);const v=pick(opMembers(G,c.op));const d=hurt(v,ri(15,35));let t=`${nm(v)} 受重傷（-${d}）。`;if(v.hp<=0){killUnit(v,`喺${BASES[c.op].n}分部求援無果，戰死。`);t=`${nm(v)} 戰死。`}return `${t}\n分部對你好失望。忠誠 ${o.loy}`}}]},
 op_raid:{t:'聯合突襲',pre:opOk,txt:c=>`${BASES[c.op].n}分部發現附近有個無人看守嘅物資倉，但門口有一大群喪屍。佢哋問主據點要唔要一齊行動。`,opts:[
  {l:'派主據點最勁嘅人一齊去',d:'收穫大，有受傷風險',req:()=>able().length>0,fx:c=>{const u=bestBy(x=>eff(x,'guard'));const p=eff(u,'guard')+opMembers(G,c.op).reduce((s,x)=>s+apt(x,'guard')*.5,0);let t=`${nm(u)} 同分部嘅人一齊殺入去。\n`;if(p*rf(.7,1.3)>=22){const it=rollItem(pick(['SR','SSR']));addItem(it);t+=`大豐收：${addRes({food:15,ammo:12,parts:10})}，仲有一件${ITEMS[it].n}（${ITEMS[it].r}）`;G.outposts[c.op].loy+=8}else{const d=hurt(u,ri(12,28));t+=`喪屍太多，撤退。${nm(u)} 受傷（-${d}）。帶返 ${addRes({food:5})}`}return t}},
  {l:'由分部自己去',fx:c=>{const v=pick(opMembers(G,c.op));if(R()<.55){return `${nm(v)} 帶隊成功：${addRes({food:8,ammo:6})}`}const d=hurt(v,ri(10,25));return `${nm(v)} 受傷撤退（-${d}）。`}},
  {l:'太危險，唔去',fx:c=>{G.outposts[c.op].loy-=3;return '分部有啲失望。'}}]},
 op_rebel:{t:'分部叛變',pre:opOk,txt:c=>{const l=opLeader(c.op),b=BASES[c.op];return `${b.n}分部嘅無線電傳嚟 ${nm(l)} 把聲：

「我哋喺度捱餓捱凍，你哋喺主據點食好住好。由今日起，${b.n}自己話事。」

分部 ${opMembers(G,c.op).length} 個人都站喺佢嗰邊。`},opts:[
  {l:'送物資安撫',d:'食物 -15、彈藥 -10，忠誠回升',req:()=>G.res.food>=15&&G.res.ammo>=10,fx:c=>{addRes({food:-15,ammo:-10});G.outposts[c.op].loy=60;return '物資送到，對方收貨。\n分部忠誠回升到 60。'}},
  {l:'親自去談判',d:'派主據點意志最強嘅人',req:()=>able().some(talker),fx:c=>{const b=bestTalker(x=>stat(x,'wil')+(fxOf(x).deal?4:0)),l=opLeader(c.op);if(stat(b,'wil')+(fxOf(b).deal?4:0)+rf(0,10)>=stat(l,'wil')+8){G.outposts[c.op].loy=65;return `${nm(b)} 同 ${nm(l)} 傾咗成晚。\n大家都係為咗生存。分部忠誠回升到 65。`}return `${nm(b)} 講唔掂。\n${nm(l)} 收咗線。（分部仲未正式脫離，但忠誠好低）`}},
  {l:'由佢哋獨立',fx:c=>{const M=opMembers(G,c.op);M.forEach(u=>leaveUnit(u,`隨${BASES[c.op].n}分部獨立。`));delete G.outposts[c.op];return `${BASES[c.op].n}分部宣佈獨立，${M.length} 個人離開咗。`}},
  {l:'武力鎮壓',d:'用主據點保安實力對抗分部',req:()=>able().length>0,fx:c=>{const M=opMembers(G,c.op);const mine=act(G).reduce((s,u)=>s+eff(u,'guard'),0)*.5,theirs=M.reduce((s,u)=>s+apt(u,'guard'),0);const l=opLeader(c.op);if(mine*rf(.8,1.2)>theirs){killUnit(l,'帶頭叛變，被鎮壓。');G.outposts[c.op].loy=55;allSan(-5);return `叛亂平息。${nm(l)} 死咗。\n其他人低頭。全隊意志 -5`}const v=bestBy(x=>eff(x,'guard'));if(v){const d=hurt(v,ri(15,30))}M.forEach(u=>leaveUnit(u,'叛變後離開。'));delete G.outposts[c.op];return '鎮壓失敗，分部全部人走晒，仲有人受傷。'}}]}
});
/* 搬據點：舊據點可以做分部；搬入分部會解散 */
{const _rel=relocate;relocate=function(id){const prev=G.base;G.oldBases=G.oldBases||[];if(!G.oldBases.includes(prev))G.oldBases.push(prev);
  if(G.outposts&&G.outposts[id]){opMembers(G,id).forEach(u=>{u.op=null});delete G.outposts[id]}
  return _rel(id)}}
/* ---------- 介面 ---------- */
function opCard(id){
  const o=G.outposts[id],b=BASES[id],M=opMembers(G,id);
  return `<div class="opcard"><div class="row" style="justify-content:space-between"><b>${esc(b.n)}</b><span class="muted type" style="font-size:12px">${M.filter(x=>!isAnimal(x)).length}/${b.beds} 人</span></div>
    <div class="row" style="gap:6px;font-size:11px"><span class="muted">忠誠</span><span class="minibar" style="width:90px"><i style="width:${o.loy}%;background:${o.loy<35?'var(--blood)':o.loy<60?'var(--sodium)':'var(--calm)'}"></i></span><span class="type">${o.loy}</span></div>
    <div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr))">${M.map(u=>tag(u)).join('')||'<span class="muted" style="font-size:12px">冇人駐守</span>'}</div>
    <div style="font-size:12px" class="muted">昨日：${esc(o.last||'未有紀錄')}</div>
    <div class="row"><button class="btn sm" data-opadd="${id}" ${M.filter(x=>!isAnimal(x)).length>=b.beds||!reserveFree(G).length?'disabled':''}>派後備過去</button><button class="btn sm" data-opclose="${id}">撤銷分部</button></div></div>`;
}
function rCrew(){
  G.outposts=G.outposts||{};
  const A=act(G),Rs=reserveFree(G),D=Object.keys(G.gone),ops=Object.keys(G.outposts),cand=opCands(G);
  const used={};G.units.forEach(u=>{if(u.eq)for(const sl in u.eq){const k=u.eq[sl];if(k)(used[k]=used[k]||[]).push(nm(u))}});
  const keys=Object.keys(ITEMS).filter(k=>G.inv[k]||used[k]);
  $('#main').innerHTML=`
   <div class="secth"><h2>據點內</h2><span class="muted type">${beds(G)}/${bedCap(G)}</span></div>
   <div class="cards">${A.map(u=>tag(u)).join('')||'<span class="muted">冇人</span>'}</div>
   <div class="secth"><h2>後備名單</h2><span class="muted">${Rs.length} 人 · 唔使食糧；可以派去分部</span></div>
   <div class="cards">${Rs.map(u=>tag(u)).join('')||'<span class="muted">冇人。升級床位可以收留更多人。</span>'}</div>
   <div class="secth"><h2>分部</h2><span class="muted">後備人員駐守其他據點，電腦每日自動分工、搜括、送物資返嚟</span>${cand.length?`<button class="btn sm" id="opnew">設立分部（${cand.length} 個地點）</button>`:''}</div>
   ${ops.length?`<div class="opgrid">${ops.map(opCard).join('')}</div>`:`<p class="muted" style="margin:0">${cand.length?'撳「設立分部」揀地點。':'清場一個可以做據點嘅地點（例如街市、屋邨、五金舖），或者搬過據點之後，舊據點就可以設立分部。'}</p>`}
   <div class="secth"><h2>裝備背包</h2><button class="btn sm" id="aeq">按工作自動配裝</button></div>
   <div class="inv">${keys.map(k=>{const it=ITEMS[k];return `<div class="invi"><div class="row" style="justify-content:space-between"><b>${rk(it.r)} ${esc(it.n)}</b><span class="chip">${SLOTS[it.slot]} · 重 ${it.w}</span></div><div style="font-size:12px">${esc(itemFx(null,it)||'')}</div><div class="muted" style="font-size:11px">背包 ${G.inv[k]||0}${used[k]?` · 用緊：${esc(used[k].join('、'))}`:''}${it.aff?` · 專精：${it.aff.map(a=>esc(CH[a].n)).join('、')}`:''}</div></div>`}).join('')||'<span class="muted">背包空空。</span>'}</div>
   ${D.length?`<div class="secth"><h2>離開咗嘅人</h2></div><div class="cards">${D.map(id=>tag(id,true)).join('')}</div>`:''}`;
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openUnit(b.dataset.open));
  $('#aeq').onclick=()=>{const n=autoEquip();save();render();toast(n?`已重新配裝：${n} 人有變動`:'而家已經係最好配搭')};
  const on=$('#opnew');if(on)on.onclick=openOpNew;
  document.querySelectorAll('[data-opadd]').forEach(b=>b.onclick=()=>openOpAdd(b.dataset.opadd));
  document.querySelectorAll('[data-opclose]').forEach(b=>{let armed=false;b.onclick=()=>{if(!armed){armed=true;b.textContent='再撳一次確認';b.classList.add('danger');return}opMembers(G,b.dataset.opclose).forEach(u=>u.op=null);delete G.outposts[b.dataset.opclose];save();render();toast('分部已撤銷，人員返回後備名單')}});
}
function openOpNew(){
  const cand=opCands(G);
  modal(`<div class="modal dismiss"><div class="eyebrow">設立分部</div><p class="muted" style="margin:0">揀一個地點。分部會自己分工搜括、守夜，每日將剩餘物資運返主據點。食唔飽或者冇人理，忠誠會跌，太低有機會叛變。</p>
    <div class="stack" style="gap:6px">${cand.map(k=>{const b=BASES[k];return `<button class="eqpick" data-k="${k}"><div class="row" style="justify-content:space-between"><b>${esc(b.n)}</b><span class="muted type" style="font-size:12px">${b.beds} 人 · 圍牆 ${b.wall}</span></div><div style="font-size:12px">${esc(b.pd)}</div></button>`}).join('')}</div>
    <div class="row"><button class="btn pri sm" id="cx" style="margin-left:auto">取消</button></div></div>`,()=>{
    $('#cx').onclick=closeOv;
    document.querySelectorAll('.eqpick').forEach(b=>b.onclick=()=>{G.outposts=G.outposts||{};G.outposts[b.dataset.k]={loy:70,last:''};if(typeof addLine==='function')addLine('base',b.dataset.k);save();closeOv();openOpAdd(b.dataset.k)});
  });
}
function openOpAdd(id){
  const b=BASES[id];
  const draw=()=>{const M=opMembers(G,id),Rs=reserveFree(G);
    modal(`<div class="modal dismiss"><div class="eyebrow">${esc(b.n)}分部 · ${M.filter(x=>!isAnimal(x)).length}/${b.beds} 人</div><p class="muted" style="margin:0">撳後備人員派佢過去；撳分部入面嘅人召返後備。</p>
      <div class="lbl">分部入面</div><div class="chips">${M.map(u=>`<button class="chip opm" data-back="${u.id}"><span class="rn ${CH[u.id].g}">${esc(nm(u))}</span> ✕</button>`).join('')||'<span class="muted">冇人</span>'}</div>
      <div class="lbl">後備名單</div><div class="stack" style="gap:4px">${Rs.map(u=>{const best=OPJOB.reduce((a,j)=>apt(u,j)>apt(u,a)?j:a,'scav');return `<button class="eqpick" data-send="${u.id}" ${M.filter(x=>!isAnimal(x)).length>=b.beds?'disabled':''}><div class="row" style="justify-content:space-between"><b class="rn ${CH[u.id].g}">${esc(nm(u))}</b><span class="muted" style="font-size:12px">${esc(CH[u.id].job)} · 擅長${JOBS[best].n}</span></div></button>`}).join('')||'<span class="muted">冇後備人員</span>'}</div>
      <div class="row"><button class="btn pri sm" id="cx" style="margin-left:auto">完成</button></div></div>`,()=>{
      $('#cx').onclick=closeOv;
      document.querySelectorAll('[data-send]').forEach(x=>x.onclick=()=>{const u=uOf(x.dataset.send);u.op=id;u.job='rest';save();draw()});
      document.querySelectorAll('[data-back]').forEach(x=>x.onclick=()=>{const u=uOf(x.dataset.back);u.op=null;save();draw()});
    })};
  draw();
}
