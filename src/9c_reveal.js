/* ---------- 新角色 / 新裝備：3D 旋轉登場 ---------- */
const RV_RAF={id:0};
function rvLayers(svg,n){
  // 前面一塊、後面一塊（反轉，暗啲），中間幾塊做厚度
  let h=`<div class="rv-l rv-front">${svg}</div><div class="rv-l rv-back">${svg}</div>`;
  for(let i=1;i<n-1;i++){const z=-6+12*i/(n-1);h+=`<div class="rv-l rv-mid" style="transform:translateZ(${z.toFixed(2)}px)">${svg}</div>`}
  return h;
}
function rvCard(o,i,tot){
  if(o.kind==='gear'){
    const it=ITEMS[o.id],S=it.set&&SETS[it.set],rc=RCOL[it.r];
    return {g:it.r,html:`
      <div class="rv-eb">新裝備 ${tot>1?`· ${i+1} / ${tot}`:''}</div>
      <div class="rv-stage gear"><div class="rv-floor"></div><div class="rv-pop"><div class="rv-spin" id="rvSpin">${rvLayers(itemIcon(it.k,rc),9)}</div></div></div>
      <div class="rv-info">
        <div class="rv-name">${rk(it.r)} <b class="rn ${it.r}">${esc(it.n)}</b></div>
        <div class="rv-sub">${SLOTS[it.slot]} · 重 ${it.w||0}${it.gun?' · 需要槍械精通':''}</div>
        <p class="rv-txt">${esc(itemFx(null,it))}</p>
        ${S?`<p class="rv-set">專屬：<span class="rn ${CH[S.owner].g}">${esc(CH[S.owner].n)}</span> · 套裝「${esc(S.n)}」</p>`:''}
      </div>`};
  }
  const c=CH[o.id],u=G.units.find(x=>x.id===o.id)||{id:o.id},fa=(c.fa||[]).map(k=>FA[k]).filter(Boolean);
  return {g:c.g,html:`
    <div class="rv-eb">新倖存者 ${tot>1?`· ${i+1} / ${tot}`:''}</div>
    <div class="rv-stage"><div class="rv-floor"></div><div class="rv-pop"><div class="rv-spin" id="rvSpin">${rvLayers(fig(u,null),9)}</div></div></div>
    <div class="rv-info">
      <div class="rv-name">${rk(c.g)} <b class="rn ${c.g}">${esc(c.n)}</b></div>
      <div class="rv-sub">${esc(c.job)} · ${esc(c.o)}${fa.length?' · '+fa.map(esc).join(' / '):''}</div>
      <p class="rv-sk"><b>${esc(c.sk.n)}</b>　${esc(c.sk.d)}</p>
      <p class="rv-txt">${esc(c.bio||'')}</p>
      ${o.act===false?'<p class="rv-set">床位滿，入咗後備</p>':''}
    </div>`};
}
function reveal(list,done){
  if(!list.length){done&&done();return}
  let i=0;
  const stop=()=>{cancelAnimationFrame(RV_RAF.id);document.removeEventListener('keydown',key)};
  const finish=()=>{stop();$('#ovroot').innerHTML='';done?done():render()};
  const key=e=>{if(!document.querySelector('.rv')){document.removeEventListener('keydown',key);return}if(e.key==='Escape'){e.preventDefault();finish()}};
  document.addEventListener('keydown',key);
  const show=()=>{
    cancelAnimationFrame(RV_RAF.id);
    const o=list[i],card=rvCard(o,i,list.length),last=i===list.length-1;
    $('#ovroot').innerHTML=`<div class="ov rv g-${card.g}" role="dialog" aria-modal="true" style="--rc:${RCOL[card.g]}">
      <div class="rv-rays"></div><div class="rv-flash"></div>
      <div class="rv-box">${card.html}
        <div class="rv-hint">左右拖動可以轉</div>
        <div class="row" style="justify-content:center">${list.length>1&&!last?'<button class="btn" id="rvSkip">跳過全部</button>':''}<button class="btn pri" id="rvNext">${last?'收到':'下一個'}</button></div>
      </div>
      <div class="rv-dust">${Array.from({length:16},(_,k)=>`<i style="left:${(k*61%100)}%;animation-delay:${(k*.37%3).toFixed(2)}s;animation-duration:${(3+k%4*.7).toFixed(1)}s"></i>`).join('')}</div>
    </div>`;
    $('#rvNext').onclick=()=>{if(last)finish();else{i++;show()}};
    const sk=$('#rvSkip');if(sk)sk.onclick=finish;
    $('#rvNext').focus({preventScroll:true});
    rvTurn($("#rvSpin"),$(".rv-stage"));
  };
  show();
}
function rvTurn(el,stage){
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let a=-25,v=still?0:60,auto=still?0:60,drag=null,lastT=performance.now();
  const tick=t=>{
    if(!el.isConnected)return;
    const dt=Math.min(.05,(t-lastT)/1000);lastT=t;
    if(!drag){v+=(auto-v)*Math.min(1,dt*1.6);a+=v*dt}
    const bob=still?0:Math.sin(t/650)*4;
    el.style.transform=`translateY(${bob.toFixed(1)}px) rotateY(${a.toFixed(1)}deg)`;
    RV_RAF.id=requestAnimationFrame(tick);
  };
  RV_RAF.id=requestAnimationFrame(tick);
  stage.addEventListener('pointerdown',e=>{
    drag={x:e.clientX,a,t:performance.now(),vx:0};stage.setPointerCapture(e.pointerId);stage.classList.add('grab');
  });
  stage.addEventListener('pointermove',e=>{
    if(!drag)return;const now=performance.now(),na=drag.a+(e.clientX-drag.x)*.8;
    const d=now-drag.t;if(d>0)drag.vx=(na-a)/(d/1000);drag.t=now;a=na;
  });
  const up=()=>{if(!drag)return;v=Math.max(-900,Math.min(900,drag.vx||0));drag=null;stage.classList.remove('grab')};
  stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
}
/* 搜括、任務得到嘅裝備都記入圖鑑，下次抽到唔當新 */
const _addItemRV=addItem;
addItem=function(id,n){_addItemRV(id,n);if(G&&G.gdex)G.gdex[id]=1};
