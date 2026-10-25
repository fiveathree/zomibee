/* ================= 倖存者頁：三國志式大地圖（只顯示地點標記）；撳地點喺右邊睇詳情同人；後備名單喺地圖下面 ================= */
const MAPPOS={store:[22,26],mall:[46,18],tenement:[14,52],market:[66,24],estate:[58,62],hardware:[34,74],clinic:[80,52],police:[10,14],metro:[42,44],school:[86,16],barracks:[88,84],lab:[10,86],train:[26,42],bunker:[66,88],prison:[92,38],hospital:[76,72],fortress:[50,86],museum:[30,8],dungeon:[56,46]};
function tokRing(u){return u.inf?'var(--bile)':u.crit||u.inj?'var(--blood)':u.mut?'#b07ad8':'transparent'}
function crewTok(u){
  const c=CH[u.id];
  const ring=tokRing(u);
  return `<button class="ctok" data-ctok="${u.id}" title="${esc(c.n)} · ${esc(c.job)}${u.act?' · '+JOBS[u.job].n:''}">${typeof isCap==='function'&&isCap(u)?'<i class="crown" title="隊長">♛</i>':''}<span class="chead r-${c.g}" style="--ring:${ring}">${fig(u,null,true)}</span><small class="rn ${c.g}">${esc(c.n.split(' ')[0])}</small></button>`;
}
let SELLOC='base';
// 地點分類：main 主據點、op 分部、sq 游擊隊、cand 已清場可設分部、uncl 未清空、site 搜括點、fog 未探索
function locKind(k){
  if(k==='squad')return 'sq';if(k==='base'||k===G.base)return 'main';if(G.outposts[k])return 'op';
  if(opCands(G).includes(k))return 'cand';
  const l=LOCS.find(x=>x.id===k);if(!l||!reached(G,l.ch))return 'fog';
  return BASES[k]?'uncl':'site';
}
const loyCol=v=>v<35?'var(--blood)':v<60?'var(--sodium)':'var(--calm)';
function mkHTML(k,x,y,fx){
  const K=locKind(k),key=K==='main'?'base':k,id=K==='main'?G.base:k,l=LOCS.find(z=>z.id===id);
  const name=K==='sq'?'游擊隊':K==='main'?BS(G).n:BASES[id]?BASES[id].n:l?l.n:id;
  let ic='◆',badge=0,warn=false,dz='',sty='',tip=name;
  if(K==='main'){ic='★';badge=act(G).length;dz='base';tip+=' · 主據點'}
  else if(K==='op'){const o=G.outposts[k],M=opMembers(G,k);ic='⚑';badge=M.length;dz='op:'+k;sty=`--lc:${loyCol(o.loy)}`;warn=M.filter(u=>!isAnimal(u)).length<opNeed(k)||M.some(u=>u.inf||u.crit);tip+=` · 分部 · 忠誠 ${o.loy}`}
  else if(K==='sq'){ic='⚔';badge=opMembers(G,'squad').length;dz='squad'}
  else if(K==='cand'){ic='＋';dz='new:'+k;warn=!!(G.idle||{})[k];tip+=' · 已清場，拖人入嚟設立分部'}
  else if(K==='uncl'){ic=Math.round(G.clear[k]||0);tip+=` · 未清空（${ic}%）`}
  else if(K==='fog'){ic='？';tip=l?`未探索 · ${G.order?'之後嘅章節':`第${CNUM[l.ch-1]}章`}解鎖`:'未探索'}
  return `<div class="mnode mk ${K} ${SELLOC===key?'on':''}" ${dz?`data-dz="${dz}"`:''} ${K==='main'||K==='op'||K==='sq'?`data-key="${key}"`:''} data-sel="${key}" data-loc="${id}" data-fixed="${fx}" style="left:${x}%;top:${y}%;${sty}" title="${esc(tip)}"><span class="mk-i">${ic}${badge?`<em class="mk-b">${badge}</em>`:''}${warn?'<em class="mk-w">!</em>':''}</span><span class="mk-n">${esc(name)}</span></div>`;
}
// 右邊：揀咗嘅地點嘅詳情同駐守嘅人（成個框都可以放人）
function locSide(k){
  const K=locKind(k),id=K==='main'?G.base:k,l=LOCS.find(z=>z.id===id),b=BASES[id];
  const dz=K==='main'?'base':K==='op'?'op:'+k:K==='sq'?'squad':K==='cand'?'new:'+k:'';
  const toks=M=>`<div class="mn-t">${M.map(crewTok).join('')||'<span class="muted" style="font-size:11px">由下面後備名單拖人入嚟</span>'}</div>`;
  const head=(n,chip,extra='')=>`<div class="ls-h"><h3>${esc(n)}</h3>${chip}${extra}</div>`;
  let h='';
  if(K==='main'){
    h=head(BS(G).n,'<span class="chip good">主據點</span>',`<span class="muted type">${beds(G)}/${bedCap(G)} 床</span>`)+`<div class="muted" style="font-size:11px">${esc(BS(G).pd)}</div>
      <div class="row" style="gap:4px">${capBtn('base')}${linkBtn('base')}</div>${nodeChips('base')}${linksRow('base')}${toks(act(G))}
      <p class="muted" style="margin:0;font-size:11px">拖後備落某人身上係換位</p><button class="btn sm" data-go="base">去據點頁調工</button>`;
  }else if(K==='op'){
    const o=G.outposts[k],M=opMembers(G,k);
    h=head(b.n,'<span class="chip">分部</span>',`<span class="muted type">${M.filter(u=>!isAnimal(u)).length}/${b.beds} 床</span>`)+`
      <div class="row" style="gap:4px;font-size:11px"><span class="muted">忠誠</span><span class="minibar" style="width:70px"><i style="width:${o.loy}%;background:${loyCol(o.loy)}"></i></span><span class="type">${o.loy}</span>${hops(G,k).base===undefined?'<span class="chip bad" title="冇補給線連返主據點：唔夠嘢冇人接濟，剩嘅物資只會存喺分部">未連主據點</span>':''}</div>
      <div class="row" style="gap:4px">${capBtn(k)}${linkBtn(k)}</div>${nodeChips(k)}${linksRow(k)}${toks(M)}
      ${o.last?`<div class="mn-l" title="${esc(o.last)}">昨日：${esc(o.last)}</div>`:''}<button class="btn sm" data-opclose="${k}">撤銷分部</button>`;
  }else if(K==='sq'){
    const M=opMembers(G,'squad'),ops=Object.keys(G.outposts);
    h=head('游擊隊','<span class="chip bad">機動</span>',`<span class="muted type">${M.length}/${SQMAX}</span>`)+`
      <select class="sqsel" id="sqsel" title="游擊隊今晚去邊度協防"><option value="auto" ${G.sqT==='auto'?'selected':''}>自動：去最危險嘅據點</option><option value="base" ${G.sqT==='base'?'selected':''}>守 ${esc(BS(G).n)}</option>${ops.map(id=>`<option value="${id}" ${G.sqT===id?'selected':''}>守 ${esc(BASES[id].n)}</option>`).join('')}</select>
      <div class="row" style="gap:4px">${capBtn('squad')}</div>${toks(M)}
      ${G.sqLast&&M.length?`<div class="mn-l" title="${esc(G.sqLast)}">昨晚：${esc(G.sqLast)}</div>`:''}<p class="muted" style="margin:0;font-size:11px">每晚出去協防，食主據點嘅糧。最多 ${SQMAX} 人。</p>`;
  }else if(K==='cand'){
    const s=suitFa(id),idle=(G.idle||{})[k];
    h=head(b.n,'<span class="chip good">已清場</span>',`<span class="muted type">${b.beds} 床</span>`)+`<div class="muted" style="font-size:11px">${esc(b.pd)}</div>
      ${s.length?`<div><span class="chip" title="呢類陣形嘅人喺度工作效率 +15%、意志每日 +1">宜：${s.map(f=>FA[f]).join('、')}</span></div>`:''}
      ${idle?`<span class="idlew">無人駐守 ${idle}/${IDLE_LOST} 日，夠鐘會被重新佔據</span>`:''}
      <div class="ls-drop">＋ 拖人入嚟設立分部<small>要 ${opNeed(k)} 人先守得住</small></div>`;
  }else if(K==='uncl'||K==='site'){
    const loot=Object.keys(l.loot).sort((a,c)=>l.loot[c]-l.loot[a]).map(r=>RES[r].n).join('、'),can=allLocs(G).some(z=>z.id===k);
    h=head(l.n,K==='uncl'?`<span class="chip warn">未清空 ${Math.round(G.clear[k]||0)}%</span>`:'<span class="chip">搜括點</span>')+`
      <div class="muted" style="font-size:12px">危險 ${'▮'.repeat(Math.ceil(l.dg*10))} · 存貨 ${Math.round((G.dep[k]??1)*100)}%</div>
      <div style="font-size:12px">主要物資：${loot}</div>${b?`<div class="muted" style="font-size:11px">清場到 100% 就可以設分部或者搬過去（${b.beds} 床）</div>`:''}
      ${can?`<button class="btn sm pri" id="scavhere">派搜括隊去呢度</button>`:''}`;
  }else h=head('未探索','<span class="chip">？</span>')+`<p class="muted" style="margin:0;font-size:12px">${l?`${G.order?'之後嘅章節':`第${CNUM[l.ch-1]}章`}解鎖`:'仲未有人去過'}</p>`;
  return `<div class="sidein ls" ${dz?`data-dz="${dz}"`:''}>${h}</div>`;
}
function rCrew(){
  G.outposts=G.outposts||{};netInit(G);
  // 舊存檔嘅方塊位置係為大方塊排嘅，改用地圖標記後還原一次
  if(!G.mapV2){G.mapPos={};G.mapFix={};G.mapV2=1}
  if(SELLOC===G.base)SELLOC='base';
  const Rs=reserveFree(G),D=Object.keys(G.gone),nInv=Object.keys(ITEMS).filter(k=>!ITEMS[k].bind&&(G.inv[k]||G.units.some(u=>u.eq&&Object.values(u.eq).includes(k)))).length;
  G.mapPos=G.mapPos||{};G.mapFix=G.mapFix||{};const pos=k=>G.mapPos[k]||MAPPOS[k]||[50,50];
  const keys=[...new Set([...Object.keys(MAPPOS).filter(k=>k!=='squad'&&(LOCS.some(l=>l.id===k)||BASES[k])),G.base])];
  const marks=keys.map(k=>{const [x,y]=pos(k);return mkHTML(k,x,y,G.mapFix[k]?'1':'')}).join('')+(()=>{const [x,y]=pos('squad');return mkHTML('squad',x,y,G.mapFix.squad?'1':'')})();
  $('#main').innerHTML=`
  <div class="crewgrid" style="--sidew:${SIDEW}px">
    <section class="panel citywrap">
      <div class="row cw-h"><h2>港灣市</h2><span class="muted cw-tip">撳地點睇詳情；拖人去地圖標記或者右邊；拖 ⛓ 去另一個據點拉補給線（撳線中間 ✕ 拆走）；拖標記搬位</span>
        <span class="row" style="gap:6px"><button class="btn sm pri" id="bulkjoin">一鍵分配／加入…</button><button class="btn sm" id="allres">全部放去後備</button><button class="btn sm" id="maplayout" title="將地點放返地圖原本位置">還原位置</button><button class="btn sm" id="invbtn">裝備背包 ${nInv}</button>${D.length?`<button class="btn sm" id="gonebtn">離開咗嘅人 ${D.length}</button>`:''}</span></div>
      <div class="city"><svg class="netsvg" aria-hidden="true"></svg><div class="netx"></div>${marks}</div>
      <div class="mklegend"><span><i class="lg main">★</i>主據點</span><span><i class="lg op">⚑</i>分部</span><span><i class="lg sq">⚔</i>游擊隊</span><span><i class="lg cand">＋</i>已清場</span><span><i class="lg uncl">%</i>未清空</span><span><i class="lg site">◆</i>搜括點</span><span><i class="lg fog">？</i>未探索</span></div>
    </section>
    <div class="reszr" title="左右拖嚟調整地圖同右邊詳情闊度；雙擊還原"></div>
    <aside class="panel crewside">${locSide(SELLOC)}</aside>
    <section class="panel reservep" data-dz="reserve">
      <div class="row" style="gap:8px"><h3>後備名單</h3><span class="muted type">${Rs.length} 人</span><span class="muted" style="font-size:11px">唔使食糧。拖去地圖標記或者右邊嘅地點。</span></div>
      <div class="mn-t">${Rs.map(crewTok).join('')||'<span class="muted" style="font-size:12px">冇人</span>'}</div>
    </section>
  </div>`;
  fitCrew();fitNodes();fitNodes();drawNet();bindNet();  // 第二次排位：第一次推開之後可能撞到第三個標記
  document.querySelectorAll('.mk').forEach(n=>n.onpointerdown=e=>nodeDrag(e,n));
  const rz=$('.reszr');if(rz){rz.onpointerdown=resDrag;rz.ondblclick=()=>{SIDEW=300;try{localStorage.removeItem('zomibee_sidew')}catch(e){}render()}}
  const ml=$('#maplayout');if(ml)ml.onclick=()=>{arrangeMap();save();render();toast('已經將地點放返地圖原本位置')};
  $('#invbtn').onclick=openInv;const gb=$('#gonebtn');if(gb)gb.onclick=openGone;
  const sh=$('#scavhere');if(sh)sh.onclick=()=>{G.loc=SELLOC;save();go('base');toast(`搜括隊目標改咗去${LOCS.find(l=>l.id===G.loc).n}`)};
  document.querySelectorAll('.crewside [data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll('[data-ctok]').forEach(b=>{
    b.onclick=e=>{e.stopPropagation();if(DRAGGED){DRAGGED=false;return}openUnit(b.dataset.ctok)};
    b.onpointerdown=e=>crewDrag(e,b);
  });
  document.querySelectorAll('[data-opclose]').forEach(b=>{let armed=false;b.onclick=e=>{e.stopPropagation();if(!armed){armed=true;b.textContent='再撳一次確認撤銷';b.classList.add('danger');return}opMembers(G,b.dataset.opclose).forEach(u=>u.op=null);delete G.outposts[b.dataset.opclose];save();render();toast('分部已撤銷，人員返回後備名單')}});
}
// 桌面版：成頁一版睇晒，地圖同後備名單嘅高度跟視窗
function fitCrew(){
  const g=document.querySelector('.crewgrid');if(!g)return;
  if(innerWidth<=760){g.style.height='';return}
  g.style.height=Math.max(480,innerHeight-g.getBoundingClientRect().top-scrollY-10)+'px';
}
function openInv(){
  const used={};G.units.forEach(u=>{if(u.eq)for(const sl in u.eq){const k=u.eq[sl];if(k&&!isBound(k))(used[k]=used[k]||[]).push(nm(u))}});
  const keys=Object.keys(ITEMS).filter(k=>!ITEMS[k].bind&&(G.inv[k]||used[k]));
  modal(`<div class="modal dismiss" style="width:min(760px,100%)"><div class="row" style="justify-content:space-between"><div class="eyebrow">裝備背包 · ${keys.length} 款</div><span class="row" style="gap:6px"><button class="btn sm" id="aeq">按工作自動配裝</button><button class="btn pri sm" id="cx">關閉</button></span></div>
    <div class="inv" style="max-height:66vh;overflow:auto">${keys.map(k=>{const it=ITEMS[k];return `<div class="invi"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="row" style="gap:6px;flex-wrap:nowrap"><span class="eqico" style="--rc:${RCOL[it.r]}">${itemIcon(it.k,RCOL[it.r])}</span><b>${rk(it.r)} ${esc(it.n)}</b></span><span class="chip">${SLOTS[it.slot]}</span></div><div style="font-size:12px">${esc(itemFx(null,it)||'')}</div><div class="muted" style="font-size:11px">背包 ${G.inv[k]||0}${used[k]?` · 用緊：${esc(used[k].join('、'))}`:''}${it.gun?' · 需要槍械精通':''}</div></div>`}).join('')||'<span class="muted">背包空空。</span>'}</div></div>`,()=>{
    $('#cx').onclick=closeOv;
    $('#aeq').onclick=()=>{const n=autoEquip();save();toast(n?`已重新配裝：${n} 人有變動`:'而家已經係最好配搭');closeOv()};
  });
}
function openGone(){
  const D=Object.keys(G.gone);
  modal(`<div class="modal dismiss" style="width:min(760px,100%)"><div class="row" style="justify-content:space-between"><div class="eyebrow">離開咗嘅人 · ${D.length}</div><button class="btn pri sm" id="cx">關閉</button></div>
    <div class="cards" style="max-height:66vh;overflow:auto">${D.map(id=>tag(id,true)).join('')}</div></div>`,()=>{$('#cx').onclick=closeOv});
}
// 右邊詳情闊度：拖中間條分隔線調整，記喺呢部機（唔入存檔）
let SIDEW=(()=>{try{return +localStorage.getItem('zomibee_sidew')||300}catch(e){return 300}})();
function resDrag(e){
  if(e.button>0)return;e.preventDefault();
  const g=document.querySelector('.crewgrid'),x0=e.clientX,w0=SIDEW;g.classList.add('resizing');
  const move=ev=>{SIDEW=Math.round(Math.min(Math.max(w0-(ev.clientX-x0),220),560));g.style.setProperty('--sidew',SIDEW+'px')};
  const up=()=>{removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);g.classList.remove('resizing');if(SIDEW===w0)return;try{localStorage.setItem('zomibee_sidew',SIDEW)}catch(e){}render()};
  addEventListener('pointermove',move);addEventListener('pointerup',up);addEventListener('pointercancel',up);
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
  const city=document.querySelector('.city');if(!city)return;
  const W=city.clientWidth,H=city.clientHeight,pad=6;
  const nodes=[...city.querySelectorAll('.mnode')];
  nodes.forEach(n=>{
    const w=n.offsetWidth,h=n.offsetHeight;
    const px=(v,S)=>v.endsWith('%')?parseFloat(v)/100*S:parseFloat(v);  // 第二次排位時已經係 px
    let x=px(n.style.left,W),y=px(n.style.top,H);
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
    if(!moved){if(!LINKFROM){SELLOC=n.dataset.sel;render()}return}G.mapPos=G.mapPos||{};G.mapPos[n.dataset.loc]=[parseFloat(n.style.left)/cr.width*100,parseFloat(n.style.top)/cr.height*100];G.mapFix=G.mapFix||{};G.mapFix[n.dataset.loc]=1;n.dataset.fixed='1';save();drawNet()};
  addEventListener('pointermove',move,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up);
}
