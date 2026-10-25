/* ================= 據點頁新版面：平面圖做主角、資料放右邊、可拖放 ================= */
let DRAGGED=false;
function rBase(){
  const c=CHAPS[G.ch-1],fc=forecast(G),A=act(G),res=G.units.filter(u=>!u.act&&!u.op),opn=G.units.filter(u=>!u.act&&u.op).length;
  const avail=allLocs(G);if(!avail.some(l=>l.id===G.loc))G.loc=avail[0].id;
  const danger=fc.def<fc.lo?'bad':fc.def>=fc.hi?'ok':'';
  const done=!!G.obj[c.n];
  const L=avail.find(x=>x.id===G.loc);
  const locHint=L?'主要：'+Object.keys(L.loot).sort((a,b)=>L.loot[b]-L.loot[a]).map(k=>RES[k].n).join('、')+(BASES[L.id]?`；清場後可做據點（${BASES[L.id].beds} 床）`:'')+(L.dun?`；${L.bonus.map(f=>FA[f]).join('、')}有加成，普通人風險 ×${L.mortal.risk}、意志 -${L.mortal.san}`:''):'';
  const syn=synList();
  $('#main').innerHTML=`
  <div class="toprow">
    <section class="chap">
      <div class="chl"><span class="no">CH${c.n}</span><h2>${esc(c.t)}</h2><span class="src">${esc(c.src)}</span>
        <div class="goal ${done?'done':''}"><span class="chk">${done?'✓':''}</span><span>${esc(c.goal)}${c.n===7?`（研究 ${G.research.toFixed(0)}%）`:''}</span></div>
        <span class="nxt">${c.n<CHAPS.length?(done?`✓ 第 ${Math.max(G.day,(G.chDay[c.n]||1)+MINCH)} 日開始第${CNUM[c.n]}章`:`完成目標解鎖第${CNUM[c.n]}章 · 最遲第 ${(G.chDay[c.n]||1)+MAXCH} 日`):''}</span>
        <details class="chd"><summary>劇情（已解鎖 ${c.n}/${CHAPS.length} 章）</summary>${CHAPS.slice(0,c.n).reverse().map(x=>`<p><b>第${CNUM[x.n-1]}章 ${esc(x.t)}</b>${x.n<c.n?(G.obj[x.n]?' ✓':' ✗'):''}<br>${esc(x.p)}</p>`).join('')}</details>
      </div>
      ${G.over?`<div class="row" style="margin-top:8px"><b style="color:var(--sodium)">${G.over==='dead'?'全滅。':'你已經完成咗呢一局。'}</b><button class="btn pri sm" id="newgame">開新一局</button></div>`:''}
    </section>
    <div class="opsbar">
    <div class="op"><label class="lbl" for="loc">搜括地點</label>
      <select class="sel" id="loc" title="${esc(locHint)}">${avail.map(l=>`<option value="${l.id}" ${l.id===G.loc?'selected':''}>${l.script?'【劇本】':l.dun?'【副本】':''}${l.n.replace(/^(劇本|.+本) · /,'')} · 危險 ${'▮'.repeat(Math.ceil(l.dg*10))} · 存貨 ${Math.round((G.dep[l.id]??1)*100)}%${BASES[l.id]||l.dun||l.id==='dungeon'?` · ${(G.clear[l.id]||0)>=100?'已完成':(l.dun?'進度 ':'清場 ')+Math.round(G.clear[l.id]||0)+'%'}`:''}</option>`).join('')}</select></div>
    <div class="op"><label class="lbl" for="proj">維修項目</label>
      <select class="sel" id="proj"><option value="fort">修補圍牆（${G.fort}/${fortMax(G)}）</option>${FK.filter(k=>G.fac[k]<FAC[k].max).map(k=>`<option value="${k}" ${G.proj===k?'selected':''}>升級${FAC[k].n} → ${G.fac[k]+1} 級（${Math.round(G.prog[k]||0)}/${FAC[k].work(G.fac[k])} 工，${FAC[k].cost(G.fac[k])} 零件）</option>`).join('')}</select></div>
    </div>
    <section class="fcmini" title="防禦 = 圍牆 ×0.4 + 保安 + 全員自衛。保安每人用 1 發彈藥火力 ×1.5。巡邏減少屍潮，冇人巡邏屍潮 +10%。">
      <span class="lbl fcl">今晚</span>
      <div class="${danger}"><b>${fc.lo}–${fc.hi}</b><span>屍潮${raidTonight(G)?'＋'+raidTonight(G).n:''}${G.warn>1?' ⚠':''}</span></div>
      <div class="${danger}"><b>${fc.def}</b><span>防禦</span></div>
      <div class="${G.res.food<fc.food||G.res.water<fc.water?'bad':''}"><b>${fc.food}/${fc.water}</b><span>食物/水</span></div>
    </section>
  </div>
  <div class="planrow">${planHTML(A,res)}<aside class="panel sidep"><div class="sidein" id="sidep"></div></aside></div>
  <div class="synbar"><b>陣營加成</b>${syn.length?syn.map(x=>`<span><em>${FA[x.f]}</em> ${x.n}人 +${x.b}%（${x.m.map(u=>`<span class="rn ${CH[u.id].g}">${esc(nm(u))}</span>`).join('、')}）</span>`).join(''):'<span>同陣營兩個或以上喺據點就有加成</span>'}<span class="muted">同陣營同做一份工，每個拍檔再 +8%</span></div>`;
  $('#end').onclick=doEnd;
  $('#auto').onclick=()=>{autoAssign();save();render();toast('已按各人數值自動分配')};
  $('#aeq2').onclick=()=>{const n=autoEquip();save();render();toast(n?`已重新配裝：${n} 人有變動（專屬裝備優先俾主人，休息嘅人除裝）`:'而家已經係最好配搭')};
  $('#loc').onchange=e=>{G.loc=e.target.value;save();render()};
  $('#proj').onchange=e=>{G.proj=e.target.value;save();render()};
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  bindPlan();
  const ng=$('#newgame');if(ng)ng.onclick=()=>{fresh();save();go('base');showQueue()};
}
function planHTML(A,res){
  const b=BS(G),loc=allLocs(G).find(l=>l.id===G.loc);
  const sel=SEL&&uOf(SEL),fr=G.fort/fortMax(G),mv=canMove(G);
  const zones=JK.map(k=>{
    const z=b.z[k];const us=A.filter(u=>(canWork(u,u.job)?u.job:'rest')===k);
    const cls=sel?(canWork(sel,k)?'drop':'no'):'';
    return `<div class="zone z-${k} ${cls}" style="grid-area:${k}" data-z="${k}" role="button" tabindex="0" aria-label="${esc(z[0])}（${z[1]}）">
      <div class="zh"><b>${esc(z[0])}</b><span>${z[1]}${k==='scav'&&loc?' → '+esc(loc.n):''}</span>${k==='scav'&&loc?`<span class="zhint">${esc('主要：'+Object.keys(loc.loot).sort((a,b)=>loc.loot[b]-loc.loot[a]).map(r=>RES[r].n).join('、')+(BASES[loc.id]?`；清場後可做據點（${BASES[loc.id].beds} 床）`:'')+(loc.dun?`；${loc.bonus.map(f=>FA[f]).join('、')}有加成，普通人風險 ×${loc.mortal.risk}`:''))}</span>`:''}<em class="zc">${us.length||''}</em></div>
      ${z[2]?`<div class="zp">${esc(z[2])}</div>`:''}
      <div class="toks">${us.map(tok).join('')||(k==='scav'||k==='patrol'?'':'<span class="zp">（冇人）</span>')}</div>
    </div>`}).join('');
  return `<section class="panel planwrap">
    <div class="planhead">
      <div style="min-width:0"><h2>${esc(b.n)}</h2><div class="muted" style="font-size:11px">${esc(b.pd)}</div></div>
      <div class="row acts">
        <button class="btn sm" id="aeq2">自動配裝</button>
        <button class="btn sm" id="auto">自動分配</button>
        <button class="btn sm" id="move">${mv.length?`搬據點（${mv.length}）`:'搬據點'}</button>
        <button class="btn pri" id="end" ${G.over?'disabled':''}>結束第 ${G.day} 日</button>
      </div>
    </div>
    <div class="basestats">
      <span class="bs"><span class="muted">床位</span> <b>${beds(G)}/${bedCap(G)}</b></span>
      <span class="bs wallbs"><span class="muted">圍牆</span> <b>${G.fort}/${fortMax(G)}</b><span class="minibar"><i style="width:${fr*100}%;background:${fr<.3?'var(--blood)':fr<.6?'var(--sodium)':'#a08a6a'}"></i></span></span>
      ${FK.map(k=>`<span class="bs" title="${esc(FAC[k].d)}"><span class="muted">${FAC[k].n}</span> <b>${G.fac[k]}</b></span>`).join('')}
      <span class="bs"><span class="muted">擊退</span> <b>${G.kills}</b></span>
      <span class="bs"><span class="muted">犧牲</span> <b>${Object.values(G.gone).filter(x=>x.dead).length}</b></span>
      ${res.length?`<span class="bs"><span class="muted">後備</span> <b>${res.length}</b> <button class="linkbtn" data-go="crew">調動</button></span>`:''}
      ${Object.keys(G.outposts||{}).length?`<span class="bs"><span class="muted">分部</span> <b>${Object.keys(G.outposts).length}</b><span class="muted">· ${G.units.filter(u=>!u.act&&u.op).length} 人</span> <button class="linkbtn" data-go="crew">管理</button></span>`:''}
      <span class="hint">${sel?`揀咗 <b class="rn ${CH[sel.id].g}">${esc(nm(sel))}</b>：撳或者拖去區域派佢去`:'拖人去唔同區域調工；撳一下睇狀態同裝備'}</span>
    </div>
    <div class="plan" style="grid-template-areas:${b.areas.map(r=>`'${r}'`).join(' ')};border-color:${fr<.3?'var(--blood)':fr<.6?'#8a6a3c':'#5b4c3c'}">${zones}</div>
  </section>`;
}
function assignTo(u,k){
  if(!u)return false;
  if(!canWork(u,k)){toast(u.crit?`${nm(u)} 重傷，只可以休息`:u.iso?`${nm(u)} 隔離緊`:`${nm(u)} 做唔到${JOBS[k].n}`);return false}
  u.job=k;save();return true;
}
function bindPlan(){
  document.querySelectorAll('[data-tok]').forEach(b=>{
    b.onclick=e=>{e.stopPropagation();if(DRAGGED){DRAGGED=false;return}SEL=SEL===b.dataset.tok?null:b.dataset.tok;INFO=b.dataset.tok;render()};
    b.onpointerdown=e=>startDrag(e,b);
  });
  document.querySelectorAll('.zone').forEach(z=>{
    const go=()=>{if(!SEL)return;const u=uOf(SEL);if(!u){SEL=null;return render()}if(assignTo(u,z.dataset.z)){SEL=null;render()}};
    z.onclick=go;z.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};
  });
  $('#move').onclick=openMove;
}
function startDrag(e,b){
  if(e.button>0)return;
  const id=b.dataset.tok,u=uOf(id);if(!u)return;
  const sx=e.clientX,sy=e.clientY;let ghost=null,over=null;
  const zones=[...document.querySelectorAll('.zone')];
  const move=ev=>{
    const x=ev.clientX,y=ev.clientY;
    if(!ghost){
      if(Math.hypot(x-sx,y-sy)<6)return;
      ghost=b.cloneNode(true);ghost.classList.add('ghost');ghost.classList.remove('sel');document.body.appendChild(ghost);
      b.classList.add('dragging');$('#pop').hidden=true;
      zones.forEach(z=>z.classList.add(canWork(u,z.dataset.z)?'drop':'no'));
    }
    ev.preventDefault();
    ghost.style.left=x+'px';ghost.style.top=y+'px';
    const el=document.elementFromPoint(x,y);const z=el&&el.closest('.zone');
    if(z!==over){if(over)over.classList.remove('hover');over=z;if(over&&over.classList.contains('drop'))over.classList.add('hover')}
  };
  const up=()=>{
    removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);
    if(!ghost)return;
    ghost.remove();DRAGGED=true;setTimeout(()=>DRAGGED=false,50);
    const k=over&&over.dataset.z;
    if(k&&k!==u.job){if(assignTo(u,k))toast(`${nm(u)} → ${BS(G).z[k][0]}（${JOBS[k].n}）`)}
    SEL=null;render();
  };
  addEventListener('pointermove',move,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up);
}

/* 右邊狀態欄（桌面版）：撳人睇狀態，取代浮窗；冇揀人就列出據點成員。手機版照用浮窗 */
let INFO=null;
function sideBase(){
  const s=$('#sidep');if(!s)return;
  const u=INFO&&uOf(INFO);
  if(u&&u.act){
    const c=CH[u.id];
    s.innerHTML=`<div class="pop sidepop">${popHTML(u)}</div>
      <div class="skillbox"><b>專長 · ${esc(c.sk.n)}</b> ${esc(c.sk.d)}<div class="chips" style="margin-top:4px">${c.tr.map(t=>`<span class="chip" title="${esc(TR[t].d)}">${TR[t].n}</span>`).join('')}</div></div>
      <button class="btn sm" id="sideback">← 返回成員名單</button>`;
    $('#popx').onclick=$('#sideback').onclick=e=>{e.stopPropagation();INFO=null;SEL=null;render()};
    $('#popmore').onclick=e=>{e.stopPropagation();SEL=null;render();openUnit(u.id)};
    return;
  }
  INFO=null;const A=act(G);
  s.innerHTML=`<div class="row" style="justify-content:space-between"><h3>據點成員</h3><span class="muted type">${A.length} 人</span></div>
    <p class="muted" style="margin:0;font-size:11px">撳人睇狀態同裝備；拖平面圖上面嘅人去其他區域調工</p>
    <div class="roster">${A.map(u=>{const c=CH[u.id],j=canWork(u,u.job)?u.job:'rest';return `<button class="rost" data-info="${u.id}"><span class="chead r-${c.g}" style="--ring:${tokRing(u)}">${fig(u,null,true)}</span><span class="rost-t"><b class="rn ${c.g}">${esc(nm(u))}</b><small class="muted">${JOBS[j].n}</small></span><span class="rost-b"><s><i style="width:${Math.round(u.hp/maxHp(u)*100)}%"></i></s>${statusChips(u)}</span></button>`}).join('')}</div>`;
  s.querySelectorAll('[data-info]').forEach(b=>b.onclick=e=>{e.stopPropagation();INFO=SEL=b.dataset.info;render()});
}
// 覆寫 7_gear.js 嘅 showPop：桌面版據點頁改為填右邊狀態欄
function showPop(){
  const p=$('#pop');if(!p)return;
  if(VIEW==='base'&&innerWidth>900){p.hidden=true;if(SEL)INFO=SEL;sideBase();return}
  const u=SEL&&uOf(SEL),a=u&&document.querySelector(`[data-tok="${SEL}"]`);
  if(!u||!a||VIEW!=='base'){p.hidden=true;return}
  p.innerHTML=popHTML(u);p.hidden=false;placePop();
  $('#popx').onclick=e=>{e.stopPropagation();SEL=null;render()};
  $('#popmore').onclick=e=>{e.stopPropagation();const id=SEL;SEL=null;render();openUnit(id)};
}
function fitPlan(){
  const p=document.querySelector('.planwrap .plan');if(!p||VIEW!=='base')return;
  p.style.height='';p.style.minHeight='';p.classList.remove('fit');
  if(innerWidth<=900)return;
  p.classList.add('fit');p.style.height='120px';
  const last=$('#main').lastElementChild,free=innerHeight-(last.getBoundingClientRect().bottom+scrollY)-10;
  p.style.height=Math.max(160,120+free)+'px';
}
{const _r=render;render=function(){_r();fitPlan()}}
addEventListener('resize',()=>{if(VIEW==='base')fitPlan()});
