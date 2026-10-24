/* ================= 倖存者頁：港灣市大地圖（據點＋分部），後備名單喺右邊，全部人可以拖放 ================= */
const MAPPOS={store:[22,26],mall:[46,18],tenement:[14,52],market:[66,24],estate:[58,62],hardware:[34,74],clinic:[80,52],police:[10,14],metro:[42,44],school:[86,16],barracks:[88,84],lab:[10,86],train:[26,42],bunker:[66,88],prison:[92,38],hospital:[76,72],fortress:[50,86],museum:[30,8],dungeon:[56,46]};
function crewTok(u){
  const c=CH[u.id];
  const ring=u.inf?'var(--bile)':u.crit||u.inj?'var(--blood)':u.mut?'#b07ad8':'transparent';
  return `<button class="ctok" data-ctok="${u.id}" title="${esc(c.n)} · ${esc(c.job)}${u.act?' · '+JOBS[u.job].n:''}">${typeof isCap==='function'&&isCap(u)?'<i class="crown" title="隊長">♛</i>':''}<span class="chead r-${c.g}" style="--ring:${ring}">${fig(u,null,true)}</span><small class="rn ${c.g}">${esc(c.n.split(' ')[0])}</small></button>`;
}
function rCrew(){
  G.outposts=G.outposts||{};netInit(G);
  const A=act(G),Rs=reserveFree(G),D=Object.keys(G.gone),ops=Object.keys(G.outposts),cand=opCands(G);
  const used={};G.units.forEach(u=>{if(u.eq)for(const sl in u.eq){const k=u.eq[sl];if(k&&!isBound(k))(used[k]=used[k]||[]).push(nm(u))}});
  const keys=Object.keys(ITEMS).filter(k=>!ITEMS[k].bind&&(G.inv[k]||used[k]));
  const shown=new Set([G.base,...ops,...cand]);
  const dots=Object.keys(MAPPOS).filter(k=>!shown.has(k)&&(LOCS.find(l=>l.id===k)||{ch:99}).ch<=G.ch).map(k=>{const l=LOCS.find(x=>x.id===k);const [x,y]=MAPPOS[k];return `<div class="mdot" style="left:${x}%;top:${y}%"><i></i><span>${esc(l.n)}${BASES[k]?` · 清場 ${Math.round(G.clear[k]||0)}%`:''}</span></div>`}).join('');
  G.mapPos=G.mapPos||{};const pos=k=>G.mapPos[k]||MAPPOS[k]||[50,50];if(!G.mapFix){G.mapFix={};Object.keys(G.mapPos).forEach(k=>G.mapFix[k]=1)}const fx=k=>G.mapFix[k]?'1':'';
  const main=(()=>{const [x,y]=pos(G.base);return ` <div class="mnode main" data-dz="base" data-key="base" data-loc="${G.base}" data-fixed="${fx(G.base)}" style="left:${x}%;top:${y}%">
      <div class="mn-h grip"><span class="gr">⠿</span><b>${esc(BS(G).n)}</b><span class="chip good">主據點</span><span class="muted type">${beds(G)}/${bedCap(G)} 床</span>${capBtn('base')}${linkBtn('base')}</div>${nodeChips('base')}${linksRow('base')}
      <div class="mn-t">${A.map(crewTok).join('')||'<span class="muted">冇人</span>'}</div></div>`})();
  const opn=ops.map(id=>{const o=G.outposts[id],b=BASES[id],M=opMembers(G,id),[x,y]=pos(id);return `<div class="mnode op" data-dz="op:${id}" data-key="${id}" data-loc="${id}" data-fixed="${fx(id)}" style="left:${x}%;top:${y}%">
      <div class="mn-h grip"><span class="gr">⠿</span><b>${esc(b.n)}</b><span class="chip">分部</span><span class="muted type">${M.filter(u=>!isAnimal(u)).length}/${b.beds}</span>${linkBtn(id)}<button class="mn-x" data-opclose="${id}" title="撤銷分部">✕</button></div>
      <div class="row" style="gap:4px;font-size:10px"><span class="muted">忠誠</span><span class="minibar" style="width:60px"><i style="width:${o.loy}%;background:${o.loy<35?'var(--blood)':o.loy<60?'var(--sodium)':'var(--calm)'}"></i></span><span class="type">${o.loy}</span>${capBtn(id)}${hops(G,id).base===undefined?'<span class="chip bad" title="冇補給線連返主據點：唔夠嘢冇人接濟，剩嘅物資只會存喺分部">未連主據點</span>':''}</div>${nodeChips(id)}${linksRow(id)}
      <div class="mn-t">${M.map(crewTok).join('')||'<span class="muted" style="font-size:11px">拖人入嚟駐守</span>'}</div>
      ${o.last?`<div class="mn-l" title="${esc(o.last)}">昨日：${esc(o.last)}</div>`:''}</div>`}).join('');
  const cn=cand.map(id=>{const b=BASES[id],[x,y]=pos(id);return `<div class="mnode cand" data-dz="new:${id}" data-loc="${id}" data-fixed="${fx(id)}" style="left:${x}%;top:${y}%"><b class="grip"><span class="gr">⠿</span>＋ ${esc(b.n)}</b><span class="muted" style="font-size:10px">拖人入嚟設立分部 · ${b.beds} 床 · 要 ${opNeed(id)} 人先守得住</span>${(G.idle||{})[id]?`<span class="idlew">無人駐守 ${G.idle[id]}/${IDLE_LOST} 日，夠鐘會被重新佔據</span>`:''}</div>`}).join('');
  $('#main').innerHTML=`
  <div class="crewgrid">
    <section class="panel citywrap">
      <div class="row" style="justify-content:space-between"><h2>港灣市</h2><span class="muted" style="font-size:12px">拖人去據點、分部、游擊隊或者後備；拖落主據點某人身上係換位；拖 ⛓ 去另一個據點拉補給線（撳線中間 ✕ 拆走）；撳 ♛ 揀隊長；拖 ⠿ 搬方塊</span><span class="row" style="gap:6px"><button class="btn sm pri" id="bulkjoin">一鍵分配／加入…</button><button class="btn sm" id="allres">全部放去後備</button><button class="btn sm" id="maplayout" title="主據點放中間，分部、游擊隊同候選地點排喺四邊">調整位置</button></span></div>
      <div class="city"><svg class="netsvg" aria-hidden="true"></svg><div class="netx"></div>${dots}${cn}${opn}${sqNode()}${main}</div>
    </section>
    <aside class="panel reservep" data-dz="reserve">
      <div class="row" style="justify-content:space-between"><h3>後備名單</h3><span class="muted type">${Rs.length} 人</span></div>
      <p class="muted" style="margin:0;font-size:11px">唔使食糧。拖去地圖上嘅據點或者分部。</p>
      <div class="mn-t">${Rs.map(crewTok).join('')||'<span class="muted" style="font-size:12px">冇人</span>'}</div>
    </aside>
  </div>
  <details class="panel" style="margin-top:12px"><summary><b>裝備背包</b> <span class="muted">${keys.length} 款</span></summary>
    <div class="row" style="margin:8px 0"><button class="btn sm" id="aeq">按工作自動配裝</button></div>
    <div class="inv">${keys.map(k=>{const it=ITEMS[k];return `<div class="invi"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="row" style="gap:6px;flex-wrap:nowrap"><span class="eqico" style="--rc:${RCOL[it.r]}">${itemIcon(it.k,RCOL[it.r])}</span><b>${rk(it.r)} ${esc(it.n)}</b></span><span class="chip">${SLOTS[it.slot]}</span></div><div style="font-size:12px">${esc(itemFx(null,it)||'')}</div><div class="muted" style="font-size:11px">背包 ${G.inv[k]||0}${used[k]?` · 用緊：${esc(used[k].join('、'))}`:''}${it.gun?' · 需要槍械精通':''}</div></div>`}).join('')||'<span class="muted">背包空空。</span>'}</div>
  </details>
  ${D.length?`<details class="panel" style="margin-top:8px"><summary><b>離開咗嘅人</b> <span class="muted">${D.length}</span></summary><div class="cards" style="margin-top:8px">${D.map(id=>tag(id,true)).join('')}</div></details>`:''}`;
  fitNodes();drawNet();bindNet();
  document.querySelectorAll('.grip').forEach(g=>g.onpointerdown=e=>nodeDrag(e,g.closest('.mnode')));
  const ml=$('#maplayout');if(ml)ml.onclick=()=>{arrangeMap();save();render();toast('已經調整好位置：主據點喺中間，其他據點排喺四邊')};
  document.querySelectorAll('[data-ctok]').forEach(b=>{
    b.onclick=e=>{e.stopPropagation();if(DRAGGED){DRAGGED=false;return}openUnit(b.dataset.ctok)};
    b.onpointerdown=e=>crewDrag(e,b);
  });
  $('#aeq').onclick=()=>{const n=autoEquip();save();render();toast(n?`已重新配裝：${n} 人有變動`:'而家已經係最好配搭')};
  document.querySelectorAll('[data-opclose]').forEach(b=>{let armed=false;b.onclick=e=>{e.stopPropagation();if(!armed){armed=true;b.textContent='確認？';b.classList.add('armed');return}opMembers(G,b.dataset.opclose).forEach(u=>u.op=null);delete G.outposts[b.dataset.opclose];save();render();toast('分部已撤銷，人員返回後備名單')}});
}
function crewMove(u,dz,onTok){
  const name=nm(u);
  if(dz==='base'){
    const t=onTok&&uOf(onTok);
    if(t&&t!==u&&t.act&&!isAnimal(t)&&!isAnimal(u)&&!u.act){
      if(t.inf||t.iso){toast(`${nm(t)} 感染緊，唔可以送走`);return}
      const op=u.op||null,jj=t.job;t.act=false;unequipAll(t);t.op=op;t.job='rest';u.act=true;u.op=null;u.job=canWork(u,jj)?jj:bestJob(u);
      toast(`${name} 同 ${nm(t)} 換咗位`);return;
    }
    if(u.act)return;
    if(!isAnimal(u)&&beds(G)>=bedCap(G)){toast('主據點床位滿咗。拖落入面某人身上就可以換位');return}
    u.act=true;u.op=null;u.job=bestJob(u);toast(`${name} 加入主據點`);return;
  }
  if(u.act&&(u.inf||u.iso)){toast('感染者唔可以離開主據點');return}
  if(dz==='squad'){if(u.op==='squad'&&!u.act)return;if(opMembers(G,'squad').length>=SQMAX){toast(`游擊隊最多 ${SQMAX} 人`);return}u.act=false;unequipAll(u);u.op='squad';u.job='rest';toast(`${name} 加入咗游擊隊`);return}
  if(dz==='reserve'){if(!u.act&&!u.op)return;u.act=false;unequipAll(u);u.op=null;u.job='rest';toast(`${name} 去咗後備名單`);return}
  let id=dz.slice(dz.indexOf(':')+1);
  if(dz.startsWith('new:')){G.outposts[id]={loy:70,last:''};addLine('base',id);addLog(`喺${BASES[id].n}設立分部。`)}
  if(u.op===id&&!u.act)return;
  if(!isAnimal(u)&&opMembers(G,id).filter(x=>!isAnimal(x)).length>=BASES[id].beds){toast(`${BASES[id].n}分部住滿咗`);return}
  u.act=false;unequipAll(u);u.op=id;u.job='rest';toast(`${name} 派咗去${BASES[id].n}分部`);
}
function crewDrag(e,b){
  if(e.button>0)return;
  const id=b.dataset.ctok,u=uOf(id);if(!u)return;
  const sx=e.clientX,sy=e.clientY;let ghost=null,over=null,overTok=null;
  const move=ev=>{
    const x=ev.clientX,y=ev.clientY;
    if(!ghost){if(Math.hypot(x-sx,y-sy)<6)return;ghost=b.cloneNode(true);ghost.classList.add('ghost');document.body.appendChild(ghost);b.classList.add('dragging');document.querySelectorAll('[data-dz]').forEach(z=>z.classList.add('drop'))}
    ev.preventDefault();ghost.style.left=x+'px';ghost.style.top=y+'px';
    const el=document.elementFromPoint(x,y);const z=el&&el.closest('[data-dz]');const t=el&&el.closest('[data-ctok]');
    overTok=t&&t!==b&&z&&z.dataset.dz==='base'?t.dataset.ctok:null;
    document.querySelectorAll('.ctok.swaptarget').forEach(x=>x.classList.remove('swaptarget'));if(overTok)t.classList.add('swaptarget');
    if(z!==over){if(over)over.classList.remove('hover');over=z;if(over)over.classList.add('hover')}
  };
  const up=()=>{
    removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);
    if(!ghost)return;ghost.remove();DRAGGED=true;setTimeout(()=>DRAGGED=false,50);
    if(over)crewMove(u,over.dataset.dz,overTok);
    save();render();
  };
  addEventListener('pointermove',move,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up);
}

function fitNodes(){
  const city=document.querySelector('.city');if(!city||innerWidth<=760)return;
  const W=city.clientWidth,H=city.clientHeight,pad=6;
  const nodes=[...city.querySelectorAll('.mnode')];
  nodes.forEach(n=>{
    const w=n.offsetWidth,h=n.offsetHeight;
    let x=parseFloat(n.style.left)/100*W,y=parseFloat(n.style.top)/100*H;
    x=Math.min(Math.max(x,w/2+pad),W-w/2-pad);y=Math.min(Math.max(y,h/2+pad),H-h/2-pad);
    n.style.left=x+'px';n.style.top=y+'px';
  });
  // 主據點優先，其他方塊避開重疊（簡單推開）
  for(let it=0;it<60;it++){let moved=false;
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];
      const ax=parseFloat(a.style.left),ay=parseFloat(a.style.top),bx=parseFloat(b.style.left),by=parseFloat(b.style.top);
      const ox=(a.offsetWidth+b.offsetWidth)/2+6-Math.abs(ax-bx),oy=(a.offsetHeight+b.offsetHeight)/2+6-Math.abs(ay-by);
      if(ox>0&&oy>0){moved=true;const fixedB=b.classList.contains('main')||b.dataset.fixed,fixedA=a.classList.contains('main')||a.dataset.fixed;if(fixedA&&fixedB)continue;const mv=fixedB?a:b,st=mv===a?-1:1;
        const cx=v=>Math.min(Math.max(v,mv.offsetWidth/2+pad),W-mv.offsetWidth/2-pad),cy=v=>Math.min(Math.max(v,mv.offsetHeight/2+pad),H-mv.offsetHeight/2-pad);
        const x0=parseFloat(mv.style.left),y0=parseFloat(mv.style.top);
        const tries=[[cx(x0+(bx>=ax?ox:-ox)*st),y0],[x0,cy(y0+(by>=ay?oy:-oy)*st)],[cx(x0-(bx>=ax?ox:-ox)*st-(bx>=ax?1:-1)*st*(a.offsetWidth+b.offsetWidth)/2),y0],[x0,cy(y0-(by>=ay?oy:-oy)*st-(by>=ay?1:-1)*st*(a.offsetHeight+b.offsetHeight)/2)]];
        const other=mv===a?b:a,ok=([x,y])=>Math.abs(x-parseFloat(other.style.left))>=(a.offsetWidth+b.offsetWidth)/2+6||Math.abs(y-parseFloat(other.style.top))>=(a.offsetHeight+b.offsetHeight)/2+6;
        const dist=([x,y])=>Math.abs(x-x0)+Math.abs(y-y0);
        const good=tries.filter(ok).sort((p,q)=>dist(p)-dist(q));const t=good[0]||(ox<oy?tries[0]:tries[1]);
        mv.style.left=t[0]+'px';mv.style.top=t[1]+'px'}
    }
    if(!moved)break;}
  // 仲有重疊：幫佢喺地圖搵最近嘅空位
  const box=n=>({x:parseFloat(n.style.left),y:parseFloat(n.style.top),w:n.offsetWidth,h:n.offsetHeight});
  const hit=(n,x,y)=>nodes.some(o=>{if(o===n)return false;const b=box(o);return Math.abs(x-b.x)<(n.offsetWidth+b.w)/2+6&&Math.abs(y-b.y)<(n.offsetHeight+b.h)/2+6});
  nodes.forEach(n=>{if(n.classList.contains('main')||n.dataset.fixed)return;const c=box(n);if(!hit(n,c.x,c.y))return;
    let best=null,bd=1e9;for(let y=c.h/2+pad;y<=H-c.h/2-pad;y+=12)for(let x=c.w/2+pad;x<=W-c.w/2-pad;x+=12){if(hit(n,x,y))continue;const d=Math.hypot(x-c.x,y-c.y);if(d<bd){bd=d;best=[x,y]}}
    if(best){n.style.left=best[0]+'px';n.style.top=best[1]+'px'}});
}
addEventListener('resize',()=>{if(VIEW==='crew')render()});

function nodeDrag(e,n){
  if(e.button>0||e.target.closest('button,[data-ctok]'))return;
  e.preventDefault();
  const city=document.querySelector('.city'),cr=city.getBoundingClientRect();
  const sx=e.clientX,sy=e.clientY,x0=parseFloat(n.style.left),y0=parseFloat(n.style.top);let moved=false;
  n.classList.add('moving');
  const move=ev=>{ev.preventDefault();const dx=ev.clientX-sx,dy=ev.clientY-sy;if(!moved&&Math.hypot(dx,dy)<4)return;moved=true;
    const w=n.offsetWidth,h=n.offsetHeight;
    n.style.left=Math.min(Math.max(x0+dx,w/2+4),cr.width-w/2-4)+'px';n.style.top=Math.min(Math.max(y0+dy,h/2+4),cr.height-h/2-4)+'px';drawNet()};
  const up=()=>{removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);n.classList.remove('moving');
    if(!moved)return;G.mapPos=G.mapPos||{};G.mapPos[n.dataset.loc]=[parseFloat(n.style.left)/cr.width*100,parseFloat(n.style.top)/cr.height*100];G.mapFix=G.mapFix||{};G.mapFix[n.dataset.loc]=1;n.dataset.fixed='1';save();drawNet()};
  addEventListener('pointermove',move,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up);
}
