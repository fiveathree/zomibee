/* ================= 存檔 ================= */
function fresh(){
  G={v:1,day:1,ch:1,res:{food:24,water:24,med:6,parts:14,ammo:12,bat:1000,core:0,serum:0},fort:55,fac:{wall:1,beds:0,kitchen:0,clinic:0,rain:1,garden:0,radio:0},base:'store',clear:{},chDay:{1:1},dun:{},gpity:0,inv:{bat:1,cleaver:1,armguard:1},stash:{pill:0,manual:0},proj:'fort',prog:{},loc:'market',dep:{},units:[],dex:{},gone:{},log:[],flags:{},pulls:0,pity:0,queue:[],warn:1,research:0,kills:0,obj:{},over:null};
  ['c_chan','c_keung','c_cheung'].forEach(id=>addUnit(G,id));
  G.units.forEach(u=>u.job=bestJob(u));
  G.queue.push({id:'s_intro'});
  addLog('第一章「爆發」開始。');
  return G;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(G))}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.units&&s.res)return s}catch(e){}return null}

/* ================= 介面 ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let VIEW='base',SEL=null;
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function av(id,extra=''){const c=CH[id];return `<div class="av r-${c.g} ${extra}">${esc(c.av)}<span>${c.g}</span></div>`}
function stars(n){return n?`<span class="stars">${'★'.repeat(n)}</span>`:''}
function bar(lbl,v,max,col){const p=cl(v/max*100,0,100);return `<div class="bar"><span>${lbl} ${Math.round(v)}</span><s><i style="width:${p}%;background:${col}"></i></s></div>`}
function statusChips(u){
  const c=[];
  if(u.crit)c.push('<span class="chip bad">重傷</span>');else if(u.inj)c.push('<span class="chip bad">受傷</span>');
  if(u.mut)c.push(`<span class="chip mut">變種·${MUT[u.mut.t].n}</span>`);
  if(u.inf)c.push(`<span class="chip inf">感染·${u.inf}日</span>`);
  if(u.iso)c.push('<span class="chip inf">隔離中</span>');
  if(u.sick)c.push('<span class="chip warn">發燒</span>');
  if(u.hungry)c.push('<span class="chip warn">肚餓</span>');
  if(u.sta<30&&!fxOf(u).noTired)c.push('<span class="chip warn">疲勞</span>');
  if(u.san<25)c.push('<span class="chip bad">恐慌</span>');else if(u.san>=85)c.push('<span class="chip good">振奮</span>');
  return c.join('');
}
function renderHead(){
  const c=curChap(G);
  $('#daystamp').innerHTML=`第 <b>${G.day}</b> 日 · ${CNUM[G.ch-1]}章 ${c.t} · ${BS(G).n}`;
  const fc=forecast(G);
  const low={food:G.res.food<fc.food*2,water:G.res.water<fc.water*2,med:G.res.med<2,ammo:G.res.ammo<2};
  $('#supply').innerHTML=Object.keys(RES).map(k=>`<div class="sp ${low[k]?'low':''}" title="${RES[k].n}"><i style="background:${RES[k].c}">${RES[k].s}</i>${RES[k].n}<b>${G.res[k]}</b></div>`).join('');
  document.querySelectorAll('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===VIEW));
}
function render(){renderHead();({base:rBase,crew:rCrew,radio:rRadio,log:rLog,menu:rMenu})[VIEW]();}

/* ---------- 據點 ---------- */
function rBase(){
  const c=CHAPS[G.ch-1],fc=forecast(G),A=act(G),res=G.units.filter(u=>!u.act);
  const avail=allLocs(G);if(!avail.some(l=>l.id===G.loc))G.loc=avail[0].id;
  const danger=fc.def<fc.lo?'bad':fc.def>=fc.hi?'ok':'';
  const done=!!G.obj[c.n];
  $('#main').innerHTML=`
  <section class="chap">
    <div class="chl"><span class="no">CH${c.n}</span><h2>${esc(c.t)}</h2><span class="src">${esc(c.src)}</span>
      <div class="goal ${done?'done':''}"><span class="chk">${done?'✓':''}</span><span>${esc(c.goal)}${c.n===7?`（研究 ${G.research.toFixed(0)}%）`:''}</span></div>
      <span class="nxt">${c.n<CHAPS.length?(done?`✓ 第 ${Math.max(G.day,(G.chDay[c.n]||1)+MINCH)} 日開始第${CNUM[c.n]}章`:`完成目標解鎖第${CNUM[c.n]}章 · 最遲第 ${(G.chDay[c.n]||1)+MAXCH} 日`):''}</span>
      <details class="chd"><summary>劇情（已解鎖 ${c.n}/${CHAPS.length} 章）</summary>${CHAPS.slice(0,c.n).reverse().map(x=>`<p><b>第${CNUM[x.n-1]}章 ${esc(x.t)}</b>${x.n<c.n?(G.obj[x.n]?' ✓':' ✗'):''}<br>${esc(x.p)}</p>`).join('')}</details>
    </div>
    ${G.over?`<div class="row" style="margin-top:8px"><b style="color:var(--sodium)">${G.over==='dead'?'全滅。':'你已經完成咗呢一局。'}</b><button class="btn pri sm" id="newgame">開新一局</button></div>`:''}
  </section>
  ${planHTML()}
  <div class="grid2" style="margin-top:16px">
    <section class="stack">
      <div class="row" style="justify-content:space-between">
        <h2>今日分工 <span class="muted type" style="font-size:13px">${beds(G)}/${bedCap(G)} 床</span></h2>
        <div class="row"><button class="btn sm" id="aeq2">自動配裝</button><button class="btn sm" id="auto">自動分配</button><button class="btn pri" id="end" ${G.over?'disabled':''}>結束第 ${G.day} 日</button></div>
      </div>
      ${A.length?A.map(uRow).join(''):'<div class="panel muted">據點冇人。去「廣播」招募倖存者。</div>'}
      ${res.length?`<div class="panel row" style="justify-content:space-between"><span class="muted">後備名單有 ${res.length} 人等緊床位</span><button class="btn sm" data-go="crew">去調動</button></div>`:''}
    </section>
    <aside class="stack">
      <div class="panel stack">
        <h3>今晚預報</h3>
        <div class="fc">
          <div class="${danger}"><b>${fc.lo}–${fc.hi}</b><span>預計屍潮${raidTonight(G)?'＋'+raidTonight(G).n:''}${G.warn>1?' ⚠':''}</span></div>
          <div class="${danger}"><b>${fc.def}</b><span>預計防禦</span></div>
          <div class="${G.res.food<fc.food?'bad':''}"><b>${fc.food}/${fc.water}</b><span>今晚食物/水</span></div>
        </div>
        <p class="muted" style="margin:0;font-size:12px">防禦 = 圍牆 ×0.4 + 保安 + 全員自衛。保安每人用 1 發彈藥火力 ×1.5。巡邏可以減少屍潮。</p>
      </div>
      <div class="panel stack">
        <div class="field"><label class="lbl" for="loc">搜括地點</label>
          <select class="sel" id="loc">${avail.map(l=>`<option value="${l.id}" ${l.id===G.loc?'selected':''}>${l.dun?'【副本】':''}${l.n} · 危險 ${'▮'.repeat(Math.ceil(l.dg*10))} · 存貨 ${Math.round((G.dep[l.id]??1)*100)}%${BASES[l.id]||l.dun||l.id==='dungeon'?` · ${(G.clear[l.id]||0)>=100?'已完成':(l.dun?'進度 ':'清場 ')+Math.round(G.clear[l.id]||0)+'%'}`:''}</option>`).join('')}</select>
          <span class="muted" style="font-size:12px">${(()=>{const l=avail.find(x=>x.id===G.loc);return l?'主要：'+Object.keys(l.loot).sort((a,b)=>l.loot[b]-l.loot[a]).map(k=>RES[k].n).join('、')+(BASES[l.id]?`。清場後可以搬去做據點（${BASES[l.id].beds} 床）`:'')+(l.dun?`。${l.bonus.map(f=>FA[f]).join('、')}陣營有加成；普通人去會受傷風險 ×${l.mortal.risk}、意志 -${l.mortal.san}`:''):''})()}</span>
        </div>
        <div class="field"><label class="lbl" for="proj">維修項目</label>
          <select class="sel" id="proj"><option value="fort">修補圍牆（${G.fort}/${fortMax(G)}）</option>${FK.filter(k=>G.fac[k]<FAC[k].max).map(k=>`<option value="${k}" ${G.proj===k?'selected':''}>升級${FAC[k].n} → ${G.fac[k]+1} 級（${Math.round(G.prog[k]||0)}/${FAC[k].work(G.fac[k])} 工，${FAC[k].cost(G.fac[k])} 零件）</option>`).join('')}</select>
          <span class="muted" style="font-size:12px">${G.proj==='fort'?'用零件修補圍牆':esc(FAC[G.proj].d)}</span>
        </div>
      </div>
      <div class="panel">
        <h3>陣營加成</h3>
        <div class="syn">${synList().map(x=>`<div><b>${FA[x.f]}</b> <span class="muted">${x.n} 人 · 全工作 +${x.b}%</span><div class="syn-m">${x.m.map(u=>`<span class="rn ${CH[u.id].g}">${esc(nm(u))}</span>`).join('、')}</div></div>`).join('')||'<span class="muted" style="font-size:12px">同陣營嘅人有兩個或以上喺據點就有加成；做同一份工再加。</span>'}</div>
        <p class="muted" style="margin:6px 0 0;font-size:11px">同陣營同做一份工：每個拍檔該工作再 +8%。</p>
      </div>
      <div class="panel">
        <h3>據點</h3>
        <div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted">圍牆耐久</span><span class="type">${G.fort}/${fortMax(G)}</span></div>
        <div class="wall"><i style="width:${G.fort/fortMax(G)*100}%"></i></div>
        <div class="fac" style="margin-top:10px">${FK.map(k=>`<div title="${esc(FAC[k].d)}"><span>${FAC[k].n}</span><b>Lv${G.fac[k]}</b></div>`).join('')}</div>
        <p class="muted" style="margin:10px 0 0;font-size:12px">擊退 ${G.kills} 隻 · ${Object.values(G.gone).filter(x=>x.dead).length} 人犧牲</p>
      </div>
    </aside>
  </div>`;
  $('#end').onclick=doEnd;
  $('#auto').onclick=()=>{autoAssign();save();render();toast('已按各人數值自動分配')};
  $('#aeq2').onclick=()=>{const n=autoEquip();save();render();toast(n?`已重新配裝：${n} 人有變動（專屬裝備優先俾主人，休息嘅人除裝）`:'而家已經係最好配搭')};
  $('#loc').onchange=e=>{G.loc=e.target.value;save();render()};
  $('#proj').onchange=e=>{G.proj=e.target.value;save();render()};
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('.jb').forEach(b=>b.onclick=()=>{const u=uOf(b.dataset.u);u.job=b.dataset.j;save();render()});
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openUnit(b.dataset.open));
  bindPlan();
  const ng=$('#newgame');if(ng)ng.onclick=()=>{fresh();save();go('base');showQueue()};
}
function uRow(u){
  const c=CH[u.id];
  return `<div class="urow ${u.iso?'off':''}">
    <button data-open="${u.id}" aria-label="睇${esc(c.n)}資料">${av(u.id)}</button>
    <div style="min-width:0">
      <div class="who"><b class="rn ${c.g}">${esc(c.n)}</b>${stars(u.star)}<span class="muted" style="font-size:12px">${esc(c.o)} · ${esc(c.job)}</span><div class="chips">${statusChips(u)}</div></div>
      <div class="bars">${bar('HP',u.hp,maxHp(u),u.hp<maxHp(u)*.35?'var(--blood)':'var(--calm)')}${bar('體力',u.sta,100,'var(--sodium)')}${bar('意志',u.san,100,'var(--steel)')}</div>
    </div>
    <div class="jobs">${JK.map(j=>{const a=apt(u,j),ok=canWork(u,j);const g=j==='rest'?'':grade(a*(fxOf(u).job[j]||1));return `<button class="jb" data-u="${u.id}" data-j="${j}" aria-pressed="${u.job===j}" ${ok?'':'disabled'} title="${esc(JOBS[j].d)}${g==='S'?' · S 級能力【'+SPERK[j].n+'】'+SPERK[j].d:''}">${JOBS[j].n}<em class="g${g}">${j==='rest'?'—':g==='S'?'S★':g}</em></button>`}).join('')}</div>
  </div>`;
}
function go(v){VIEW=v;render();window.scrollTo(0,0)}

/* ---------- 結算 ---------- */
function doEnd(){
  const A=act(G);if(!A.length){toast('據點冇人');return}
  const r=endDay();if(!r)return;
  const n=r.night;
  const secs=[];r.rep.forEach(x=>{if(x.h)secs.push({h:x.h,ps:[]});else if(secs.length)secs[secs.length-1].ps.push(x)});
  const icon={白天:'☀',分部:'⛺',晚飯:'🍲',夜晚:'☾',狀態:'✚'};
  modal(`<div class="modal report">
    <div class="rephead">
      <div><div class="eyebrow">DAY ${G.day-1} 報告</div><h2>${n.ok?'守住咗':'防線被衝破'}</h2></div>
      <div class="night"><div><b style="color:var(--blood)">${n.horde}</b><span class="muted">屍潮${n.raid?'＋'+n.raid.n:''}</span></div><div class="vs">VS</div><div><b style="color:${n.ok?'var(--calm)':'var(--blood)'}">${n.def}</b><span class="muted">防禦</span></div></div>
      <button class="btn pri" id="cont">${G.queue.length?'繼續（有事發生）':'迎接第 '+G.day+' 日'}</button>
    </div>
    <div class="repgrid">${secs.map(sc=>`<section class="repsec"><h4>${sc.h}</h4>${sc.ps.map(x=>`<p class="${x.c}">${esc(x.t)}</p>`).join('')}</section>`).join('')}</div>
  </div>`,()=>{$('#cont').onclick=()=>{closeOv();showQueue()}});
  render();
}
function modal(html,bind){$('#ovroot').innerHTML=`<div class="ov" role="dialog" aria-modal="true">${html}</div>`;const ov=$('#ovroot .ov');ov.onclick=e=>{if(e.target===ov&&ov.querySelector('.modal.dismiss'))closeOv()};bind&&bind();const f=$('#ovroot button');f&&f.focus({preventScroll:true})}
function closeOv(){$('#ovroot').innerHTML='';render()}
function showQueue(){
  while(G.queue.length){
    const q=G.queue[0],e=EV[q.id];let c=q.c||{};
    if(!e){G.queue.shift();continue}
    if(['u','a','b'].some(k=>c[k]&&!uOf(c[k]))){G.queue.shift();continue}
    if(e.pre&&!e.w){c=e.pre(c);if(!c){G.queue.shift();continue}}
    showEvent(q.id,c);return;
  }
  save();render();
  if(G.over&&!G.flags.overShown){G.flags.overShown=1;save();if(G.over==='dead')modal(`<div class="modal paper"><div class="eyebrow">GAME OVER</div><h2>全滅</h2><div class="story">捲閘外面嘅聲音，終於冇再停過。\n\n你哋撐咗 ${G.day-1} 日，擊退咗 ${G.kills} 隻喪屍。</div><button class="btn pri" id="ng">開新一局</button></div>`,()=>{$('#ng').onclick=openNewGame})}
}
function showEvent(id,c){
  const e=EV[id];
  const lbl=o=>typeof o.l==='function'?o.l(c):o.l;
  modal(`<div class="modal paper">
    <div class="eyebrow">${e.story?'劇情':'事件'} · 第 ${G.day} 日</div>
    <h2>${esc(e.t)}</h2>
    <div class="story">${esc(e.txt(c))}</div>
    <div class="opts">${e.opts.map((o,i)=>{const ok=!o.req||o.req(c);return `<button class="opt" data-i="${i}" ${ok?'':'disabled'}>${esc(lbl(o))}${o.d?`<small>${esc(o.d)}</small>`:''}</button>`}).join('')}</div>
  </div>`,()=>{
    document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
      const o=e.opts[+b.dataset.i];const out=o.fx(c)||'';
      G.queue.shift();addLog(`【${e.t}】${lbl(o)}`);checkObj();save();renderHead();
      modal(`<div class="modal paper"><div class="eyebrow">${esc(e.t)}</div><div class="result">${esc(out||'……')}</div><button class="btn pri" id="nx">繼續</button></div>`,()=>{$('#nx').onclick=()=>{closeOv();showQueue()}});
    });
  });
}

/* ---------- 倖存者 ---------- */
function tag(u,gone){
  const c=CH[u.id||u];
  if(gone){const g=G.gone[c.id];return `<div class="tag gone"><div class="tt">${av(c.id,'dead')}<div><b class="rn ${c.g}">${esc(c.n)}</b><small>${g.dead?'第 '+g.d+' 日犧牲':'第 '+g.d+' 日離開'}</small></div></div><small>${esc(g.why)}</small></div>`}
  return `<button class="tag ${u.act?'':'res'}" data-open="${c.id}"><div class="tt">${av(c.id)}<div><b class="rn ${c.g}">${esc(c.n)}</b>${stars(u.star)}<small>${esc(c.o)} · ${esc(c.job)}</small></div></div><div class="chips">${statusChips(u)||`<span class="chip">${u.act?JOBS[u.job].n:'後備'}</span>`}</div></button>`;
}
function rCrew(){
  const A=act(G),Rs=G.units.filter(u=>!u.act),D=Object.keys(G.gone);
  $('#main').innerHTML=`
   <div class="secth"><h2>據點內</h2><span class="muted type">${beds(G)}/${bedCap(G)}</span></div>
   <div class="cards">${A.map(u=>tag(u)).join('')||'<span class="muted">冇人</span>'}</div>
   <div class="secth"><h2>後備名單</h2><span class="muted">無線電聯絡中，有床位先可以加入；唔使食糧</span></div>
   <div class="cards">${Rs.map(u=>tag(u)).join('')||'<span class="muted">冇人。升級床位可以收留更多人。</span>'}</div>
   ${D.length?`<div class="secth"><h2>離開咗嘅人</h2></div><div class="cards">${D.map(id=>tag(id,true)).join('')}</div>`:''}`;
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openUnit(b.dataset.open));
}
function openUnit(id){
  const u=uOf(id);if(!u)return;const c=CH[id];
  const coreCost=2+u.star;let armed=false;
  modal(`<div class="modal">
    <div class="row" style="align-items:flex-start;gap:14px">${av(id)}<div style="min-width:0;flex:1"><div class="row" style="gap:6px"><span class="rk ${c.g}">${c.g}</span><h2 class="rn ${c.g}">${esc(c.n)}</h2>${stars(u.star)}</div><div class="muted">${esc(c.o)} · ${esc(c.job)}</div><div class="chips" style="margin-top:4px">${statusChips(u)}</div></div></div>
    <p style="margin:0">${esc(c.bio)}</p>
    <div class="bars">${bar('HP',u.hp,maxHp(u),'var(--calm)')}${bar('體力',u.sta,100,'var(--sodium)')}${bar('意志',u.san,100,'var(--steel)')}</div>
    <div class="statgrid">${ST.map(k=>`<span class="muted">${STN[k]}</span><s><i style="width:${stat(u,k)/25*100}%"></i></s><span class="type">${stat(u,k)}</span>`).join('')}</div>
    <div class="aptg">${JK.filter(j=>j!=='rest').map(j=>{const g=canWork({...u,crit:0,iso:0},j)?grade(apt(u,j)*(fxOf(u).job[j]||1)):'—';return `<div>${JOBS[j].n}<b class="g${g}">${g}</b></div>`}).join('')}</div>
    <div class="panel" style="background:var(--slab2)"><b style="color:var(--sodium2)">專長 · ${esc(c.sk.n)}</b><div style="font-size:13px">${esc(c.sk.d)}</div>
      ${c.tr.map(t=>`<div style="font-size:13px;margin-top:4px"><span class="chip">${TR[t].n}</span> <span class="muted">${esc(TR[t].d)}</span></div>`).join('')}
      ${JK.filter(j=>isS(u,j)).map(j=>`<div style="font-size:13px;margin-top:6px"><span class="rk UR">S</span> <b>${JOBS[j].n}【${SPERK[j].n}】</b> <span class="muted">${esc(SPERK[j].d)}</span></div>`).join('')}</div>
    <div class="row">
      ${u.act?`<button class="btn sm" id="mv">移去後備</button>`:`<button class="btn sm" id="mv" ${act(G).length>=bedCap(G)?'disabled':''}>加入據點${act(G).length>=bedCap(G)?'（冇床位）':''}</button>`}
      <button class="btn sm" id="up" ${u.star>=5||G.res.core<coreCost?'disabled':''}>用 ${coreCost} 晶核強化${u.star>=5?'（滿星）':''}</button>
      <button class="btn sm" id="bye">遣散</button>
      <button class="btn pri sm" id="cx" style="margin-left:auto">關閉</button>
    </div>
  </div>`,()=>{
    $('#cx').onclick=closeOv;
    $('#mv').onclick=()=>{if(u.act&&(u.inf||u.iso)){toast('感染者唔可以送走後備');return}u.act=!u.act;if(u.act)u.job=bestJob(u);save();closeOv();openUnit(id)};
    $('#up').onclick=()=>{G.res.core-=coreCost;u.star++;u.hp=Math.min(maxHp(u),u.hp+10);save();toast(`${c.n} 強化到 ${u.star} 星，全能力 +1`);closeOv();openUnit(id)};
    $('#bye').onclick=e=>{if(!armed){armed=true;e.target.textContent='再撳一次確認遣散';e.target.classList.add('danger');return}leaveUnit(u,'被遣散。');addRes({bat:20});save();closeOv()};
  });
}

/* ---------- 廣播（抽卡） ---------- */
function roll(){let r=R()*100;for(const [g,p] of RATES){if((r-=p)<=0)return g}return 'C'}
function pull(n){
  const cost=n===10?900:100;
  if(G.res.bat<cost){toast('電池唔夠。搜括屋邨、地鐵站，或者撐過夜晚都會有');return}
  G.res.bat-=cost;
  const out=[];
  for(let i=0;i<n;i++){
    let g=roll();G.pity++;
    if(G.pity>=50&&g!=='UR')g='SSR';
    if(n===10&&i===9&&!out.some(o=>['UR','SSR','SR'].includes(CH[o.id].g))&&!['UR','SSR','SR'].includes(g))g='SR';
    if(g==='UR'||g==='SSR')G.pity=0;
    const id=pick(BY_G[g]);const r=addUnit(G,id);
    if(r.type==='dead')addRes({bat:30});if(r.type==='max')addRes({bat:50});
    out.push({id,type:r.type,act:r.u&&r.u.act});
  }
  G.pulls+=n;save();renderHead();
  const lab={new:'NEW',star:'突破 +1★',dead:'已犧牲 · 電池 +30',max:'滿星 · 電池 +50'};
  const grid=()=>modal(`<div class="modal dismiss" style="width:min(900px,100%)">
    <div class="eyebrow">廣播收到 ${n} 個回應</div>
    <div class="pullgrid ${n===1?'one':''}">${out.map((o,k)=>{const c=CH[o.id];return `<div class="pc g-${c.g}" data-k="${k}"><div class="in"><div class="back">· · ·</div><div class="front"><div class="tag" style="cursor:default;height:100%"><div class="tt">${av(o.id)}<div style="min-width:0"><b class="rn ${c.g}">${esc(c.n)}</b><small>${esc(c.job)}</small></div></div><span class="badge ${o.type==='new'?'':'dup'}">${lab[o.type]}</span>${o.type==='new'&&!o.act?'<small>床位滿，入咗後備</small>':''}</div></div></div></div>`}).join('')}</div>
    <div class="row" style="justify-content:center"><button class="btn" id="again">再廣播 ${n} 次（${n===10?900:100} 電池）</button><button class="btn pri" id="ok">收到</button></div>
  </div>`,()=>{
    const cards=[...document.querySelectorAll('.pc')];const t=cards.map((c,i)=>setTimeout(()=>c.classList.add('open'),250+i*180));
    $('#ok').onclick=()=>{t.forEach(clearTimeout);closeOv()};
    $('#again').onclick=()=>{t.forEach(clearTimeout);closeOv();pull(n)};
  });
  const fresh=out.filter(o=>o.type==='new').map(o=>({kind:'char',id:o.id,act:o.act}));
  typeof reveal==='function'&&fresh.length?reveal(fresh,grid):grid();
}
function rRadio(){
  const total=CH_RAW.length,got=Object.keys(G.dex).length;
  $('#main').innerHTML=`
  <div class="radio">
    <div class="dial"><div class="scale"><div class="nums"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108</span></div><div class="needle" id="needle"></div></div><div class="grill"></div></div>
    <div class="stack">
      <h2>緊急廣播</h2>
      <p class="muted" style="margin:0;max-width:52ch">用電池向全城廣播你嘅位置。每個回應嘅人都有自己嘅專長——醫生、廚師、工程師、軍人，甚至一隻狗。床位唔夠嘅會入後備名單，唔使食糧。</p>
      <div class="row"><button class="btn" id="p1">廣播 1 次 · 100 電池</button><button class="btn pri" id="p10">廣播 10 次 · 900 電池</button></div>
      <p class="muted" style="margin:0;font-size:12px">10 連保證至少一個 SR 或以上 · 連續 50 次冇 SSR 必出 SSR（而家 ${G.pity}/50）· 重複角色會突破 +1★（全能力 +1）</p>
      <div class="rates">${RATES.map(([g,p])=>`<div class="rate"><b><span class="rk ${g}">${g}</span></b><span>${p}%</span></div>`).join('')}</div>
    </div>
  </div>
  <div class="secth"><h2>倖存者圖鑑</h2><span class="muted type">${got}/${total}</span></div>
  <div class="cards">${CH_RAW.map(r=>{const id=r[0],c=CH[id],k=G.dex[id];return k?`<div class="tag" style="cursor:default"><div class="tt">${av(id,G.gone[id]&&G.gone[id].dead?'dead':'')}<div><b class="rn ${c.g}">${esc(c.n)}</b><small>${esc(c.o)} · ${esc(c.job)}</small></div></div><small>${esc(c.sk.n)}：${esc(c.sk.d)}</small></div>`:`<div class="tag res" style="cursor:default"><div class="tt"><div class="av r-${c.g}">？<span>${c.g}</span></div><div><b>？？？</b><small>未遇見</small></div></div></div>`}).join('')}</div>`;
  $('#p1').onclick=()=>{spin();setTimeout(()=>pull(1),500)};
  $('#p10').onclick=()=>{spin();setTimeout(()=>pull(10),500)};
}
function spin(){const n=$('#needle');if(n)n.style.left=ri(8,90)+'%'}

/* ---------- 日誌 ---------- */
function rLog(){
  const by={};G.log.forEach(l=>{(by[l.d]=by[l.d]||[]).push(l.t)});
  const days=Object.keys(by).map(Number).sort((a,b)=>b-a);
  $('#main').innerHTML=`<div class="secth"><h2>據點日誌</h2><span class="muted">最新喺最上</span></div><div class="log">${days.map(d=>`<h4>第 ${d} 日</h4>${by[d].map(t=>`<p>${esc(t)}</p>`).join('')}`).join('')||'<p>未有紀錄。</p>'}</div>`;
}

/* ---------- 設定 ---------- */
function rMenu(){
  let armed=false;
  $('#main').innerHTML=`<div class="stack" style="max-width:640px">
    <div class="panel stack"><h3>點玩</h3>
      <p style="margin:0">每日幫每個倖存者揀一份工作。卡上嘅字母代表佢做呢份工嘅適合程度（S 最好，D 最差），數值、狀態同專長都會影響。</p>
      <p style="margin:0" class="muted">搜括帶返物資但有機會受傷被咬；巡邏減少今晚屍潮；保安守夜；維修修圍牆同起設施；煮飯慳食物兼提升意志；醫療醫傷者。疲勞、受傷、恐慌都會令效率下降。被咬嘅人三日內會屍變。</p>
      <p style="margin:0" class="muted">跟住十三章劇情行：港產、韓式、日式、朝鮮古疫、國產網文、美式，到後期大陸末日文嘅列車、地洞、監獄、醫院、地宮同堡壘。撐過最後嘅屍潮之夜就係結局。傳奇角色好強，但據點都要有人煮飯、巡邏、維修，否則一樣會死。</p>
    </div>
    <div class="panel stack"><h3>兌換碼</h3><div class="row"><input class="sel" id="code" style="flex:1;min-width:0" placeholder="輸入兌換碼" autocomplete="off"><button class="btn" id="redeem">兌換</button></div><span class="muted" id="cmsg"></span></div>
    <div class="panel stack"><h3>重新開始</h3><p class="muted" style="margin:0">清走而家嘅進度，由第 1 日再嚟。贏過一局可以揀特別開局同亂數劇本；獎章永久保留。</p><div><button class="btn" id="reset">開新一局</button></div></div>
  </div>`;
  $('#redeem').onclick=()=>{const c=$('#code').value.trim().toUpperCase();let m='代碼無效';
    if(c==='BRAINS'&&!G.flags.c1){G.flags.c1=1;addRes({bat:1000});m='電池 +1000'}
    else if(c==='ZOMIBEE'&&!G.flags.c2){G.flags.c2=1;addRes({food:20,water:20,med:10,parts:20,ammo:20});m='物資大禮包已到'}
    else if(['BRAINS','ZOMIBEE'].includes(c))m='呢個代碼已經用過';
    save();renderHead();$('#cmsg').textContent=m};
  $('#reset').onclick=openNewGame;
}

/* ---------- 平面圖 ---------- */
function planHTML(){
  const b=BS(G),A=act(G),loc=LOCS.find(l=>l.id===G.loc);
  const sel=SEL&&uOf(SEL);
  const fr=G.fort/fortMax(G);
  const mv=canMove(G);
  const zones=JK.map(k=>{
    const z=b.z[k];const us=A.filter(u=>(canWork(u,u.job)?u.job:'rest')===k);
    const cls=sel?(canWork(sel,k)?'drop':'no'):'';
    return `<div class="zone z-${k} ${cls}" style="grid-area:${k}" data-z="${k}" role="button" tabindex="0" aria-label="${esc(z[0])}（${z[1]}）">
      <div class="zh"><b>${esc(z[0])}</b><span>${z[1]}${k==='scav'&&loc?' → '+esc(loc.n):''}</span></div>
      ${z[2]?`<div class="zp">${esc(z[2])}</div>`:''}
      <div class="toks">${us.map(tok).join('')||(k==='scav'||k==='patrol'?'':'<span class="zp">（冇人）</span>')}</div>
    </div>`}).join('');
  return `<section class="panel planwrap" style="margin-top:16px">
    <div class="row" style="justify-content:space-between;align-items:flex-start">
      <div style="min-width:0"><h2>${esc(b.n)}</h2><div class="muted" style="font-size:12px">${esc(b.pd)}</div></div>
      <button class="btn sm" id="move">${mv.length?`搬據點（${mv.length} 個已清場）`:'搬據點'}</button>
    </div>
    <p class="muted" style="margin:6px 0 10px;font-size:12px">${sel?`揀咗 <b class="rn ${CH[sel.id].g}">${esc(nm(sel))}</b>，撳一個區域派佢去；撳其他地方取消。`:'撳一個人睇佢嘅狀態同裝備；再撳一個區域就可以派佢去做嗰份工。'}</p>
    <div class="plan" style="grid-template-areas:${b.areas.map(r=>`'${r}'`).join(' ')};border-color:${fr<.3?'var(--blood)':fr<.6?'#8a6a3c':'#5b4c3c'}">${zones}</div>
  </section>`;
}
function tok(u){
  const c=CH[u.id],j=canWork(u,u.job)?u.job:'rest';
  const ring=u.inf?'var(--bile)':u.crit||u.inj?'var(--blood)':u.sta<30?'var(--sodium)':'transparent';
  return `<button class="tok r-${c.g} ${SEL===u.id?'sel':''}" data-tok="${u.id}" title="${esc(c.n)} · ${esc(c.job)}"><span class="d" style="--ring:${ring}">${esc(c.av)}${isS(u,j)?'<i>S</i>':''}</span><small class="rn ${c.g}">${esc(c.n.split(' ')[0])}</small></button>`;
}
function bindPlan(){
  document.querySelectorAll('[data-tok]').forEach(b=>b.onclick=e=>{e.stopPropagation();SEL=SEL===b.dataset.tok?null:b.dataset.tok;render()});
  document.querySelectorAll('.zone').forEach(z=>{
    const go=()=>{if(!SEL)return;const u=uOf(SEL),k=z.dataset.z;if(!u){SEL=null;return render()}
      if(!canWork(u,k)){toast(u.crit?`${nm(u)} 重傷，只可以休息`:u.iso?`${nm(u)} 隔離緊`:`${nm(u)} 做唔到${JOBS[k].n}`);return}
      u.job=k;SEL=null;save();render()};
    z.onclick=go;z.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};
  });
  $('#move').onclick=openMove;
  
}
function openMove(){
  const mv=canMove(G);let armed=null;
  const all=Object.keys(BASES).filter(k=>!BASES[k].start&&k!==G.base);
  modal(`<div class="modal dismiss">
    <div class="eyebrow">搬據點</div><h2>而家：${esc(BS(G).n)}</h2>
    <p class="muted" style="margin:0">床位 ${bedCap(G)}、圍牆上限 ${fortMax(G)}。搬走會留低約四分一食物、水同零件，所有設施各跌 1 級。去搜括一個地點就會累積清場進度。</p>
    <div class="stack" style="gap:8px">${all.map(k=>{const b=BASES[k],l=LOCS.find(x=>x.id===k),ok=mv.includes(k),cp=Math.round(G.clear[k]||0),lock=!reached(G,l.ch);
      return `<div class="panel row" style="background:var(--slab2);justify-content:space-between">
        <div style="min-width:0;flex:1"><b>${lock?'？？？':esc(b.n)}</b> <span class="muted" style="font-size:12px">${lock?`第${CNUM[l.ch-1]}章解鎖`:`${b.beds} 床 · 圍牆 ${b.wall}`}</span>
        ${lock?'':`<div class="muted" style="font-size:12px">${esc(b.d)} ${esc(b.pd)}</div>`}</div>
        ${ok?`<button class="btn pri sm" data-mv="${k}">搬過去</button>`:lock?'':`<span class="type muted" style="font-size:12px">清場 ${cp}%</span>`}
      </div>`}).join('')}</div>
    <button class="btn" id="cx">關閉</button>
  </div>`,()=>{
    $('#cx').onclick=closeOv;
    document.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{
      if(armed!==b.dataset.mv){armed=b.dataset.mv;b.textContent='再撳一次確認';b.classList.add('danger');return}
      const out=relocate(b.dataset.mv);save();
      modal(`<div class="modal paper"><div class="eyebrow">搬遷</div><div class="result">${esc(out)}</div><button class="btn pri" id="nx">繼續</button></div>`,()=>{$('#nx').onclick=closeOv});
    });
  });
}

function peek(u){
  const c=CH[u.id],j=canWork(u,u.job)?u.job:'rest';
  return `<div class="peek">
    <div class="row" style="gap:10px;align-items:flex-start;flex-wrap:nowrap">
      ${av(u.id)}
      <div style="min-width:0;flex:1">
        <div class="who row" style="gap:6px"><b class="rn ${c.g}">${esc(c.n)}</b>${stars(u.star)}<span class="muted" style="font-size:12px">${esc(c.job)} · 而家：${JOBS[j].n}${isS(u,j)?`【${SPERK[j].n}】`:''}</span></div>
        <div class="chips" style="margin:3px 0">${statusChips(u)||'<span class="chip good">狀態正常</span>'}</div>
        <div class="bars">${bar('HP',u.hp,maxHp(u),u.hp<maxHp(u)*.35?'var(--blood)':'var(--calm)')}${bar('體力',u.sta,100,'var(--sodium)')}${bar('意志',u.san,100,'var(--steel)')}</div>
      </div>
      <button class="btn sm" id="pkmore">詳細</button>
    </div>
    <div class="pkst">${ST.map(k=>`<div><span>${STN[k]}</span><b>${stat(u,k)}</b></div>`).join('')}</div>
    <div class="pkst">${JK.filter(x=>x!=='rest').map(x=>{const g=canWork({...u,crit:0,iso:0},x)?grade(apt(u,x)*(fxOf(u).job[x]||1)):'—';return `<div><span>${JOBS[x].n}</span><b class="g${g}">${g}</b></div>`}).join('')}</div>
    <div class="muted" style="font-size:12px">專長【${esc(c.sk.n)}】${esc(c.sk.d)} · 撳區域派佢去，或者再撳頭像取消。</div>
  </div>`;
}
