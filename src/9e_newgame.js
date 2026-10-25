/* ================= 多周目：永久獎章、通關記錄、特別開局、章節同劇本亂數、過場畫面 ================= */
/* 天崩開局專屬角色（致敬經典末日電影，原創名字）：唔入抽卡池，亦唔計圖鑑 */
const LONE='q_lone',LONEDOG='q_dog';
CH[LONE]={id:LONE,n:'韋恩中校',g:'UR',o:'紐約',job:'軍方病毒學家 · 孤城最後一人',s:[18,15,16,14,22,9,22],tr:['legend','loner'],
  sk:{n:'孤城研究',d:'醫療 ×1.6、保安 +30%，解藥研究 ×2，幾乎唔會被咬'},fx:{job:{medic:1.6,guard:1.3},research:2,bite:.2},
  bio:'全城感染之後，佢係唯一一個免疫嘅人。每日中午佢喺碼頭用收音機廣播：「我仲喺度，如果有人聽到……」三年嚟，回應佢嘅只有佢隻狗。',av:'韋',fa:['西','軍','醫']};
CH[LONEDOG]={id:LONEDOG,n:'阿灰',g:'SR',o:'紐約',job:'德國牧羊犬',s:[14,16,18,0,0,0,14],tr:['animal'],
  sk:{n:'忠犬',d:'巡邏 +50%，夜間防禦 +6'},fx:{job:{patrol:1.5},def:6},
  bio:'韋恩中校嘅狗，陪佢喺空城行咗三年。佢比任何人都早知道黑暗入面有咩。',av:'灰',fa:['寵']};
LOOK[LONE]='crop,#3a2a1a,#4a5a3a,T,vest';
PETC[LONEDOG]=['#5a4030','#c89a5a',1];
EV.s_lone={story:1,t:'第一章 · 孤城',txt:()=>`港灣市淪陷第三年。\n\n全城得返你一個人，同埋阿灰。佢上個禮拜為咗保護你，同一隻夜行屍咬咗一場，條腳到而家仲跛。\n\n今朝收音機第一次有人回應：「我哋喺南邊……仲有人……」\n\n天黑之前，你要決定繼續一個人守，定係開門。`,
  opts:[{l:'開門，搵其他人',fx:()=>`你將捲閘拉起一半。\n${addRes({bat:300})}`},{l:'鎖好門，自己守',fx:()=>{G.fort+=15;return '你加多兩條鐵鏈，圍牆 +15'}}]};

/* ---------- 永久記錄（同存檔分開，開新一局都唔會清） ---------- */
const MKEY='zomibee_meta';
function meta(){try{return JSON.parse(localStorage.getItem(MKEY))||{}}catch(e){return {}}}
function syncMeta(){
  if(!G)return;const m=meta();m.ach=m.ach||{};let ch=false;
  for(const k in G.ach||{})if(!m.ach[k]){m.ach[k]=1;ch=true}
  if(G.flags&&G.flags.finalWon&&!G.flags.winRec){G.flags.winRec=1;m.wins=(m.wins||0)+1;ch=true}
  if(ch)try{localStorage.setItem(MKEY,JSON.stringify(m))}catch(e){}
}
{const _sv=save;save=function(){syncMeta();_sv()}}
/* 補返舊局獎章：用家第 86 日存檔（更新嗰陣未同步就開咗新局） */
const RESTORE86=['k100','k1000','d8','d30','safe15','p10','p20','move','fac','faction4','sjob','food200','hunters','cure','dun1','ur1','dex40','gear20','d60','wall5','ur4'];
function restoreAch(ids){const m=meta();m.ach=m.ach||{};let n=0;ids.forEach(k=>{if(ACHBY[k]&&!m.ach[k]){m.ach[k]=1;n++}});try{localStorage.setItem(MKEY,JSON.stringify(m))}catch(e){}return n}
/* 兌換碼解鎖全部開局玩法（唔計通關次數） */
function unlockModes(){const m=meta();if(m.unlock)return false;m.unlock=1;try{localStorage.setItem(MKEY,JSON.stringify(m))}catch(e){}return true}
/* 獎章解鎖邊個致敬劇本：亂數局用 G.scrMap */
const achUnl=a=>a.unlock&&((G.scrMap&&G.scrMap[a.id])||a.unlock);

/* ---------- 開新一局 ---------- */
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const gacha=id=>BY_G[CH[id].g]&&BY_G[CH[id].g].includes(id);
const facPool=f=>Object.keys(CH).filter(id=>(CH[id].fa||[]).includes(f)&&!CH[id].tr.includes('animal')&&gacha(id));
{const _f=fresh;fresh=function(o){
  o=o||{};syncMeta();_f();const g=G;  // 開新局前先記低舊局嘅獎章
  if(o.shuffle){
    g.order=[1,...shuf([2,3,4,5,6,7,8,9,10,11]),12,13];
    const ul=ACH.filter(a=>a.unlock),ids=shuf(ul.map(a=>a.unlock));g.scrMap={};ul.forEach((a,i)=>g.scrMap[a.id]=ids[i]);
  }
  const ids=o.start==='ur'?['c_chan','c_keung','c_cheung',o.ur]:o.start==='trio'||o.start==='rand'?o.ids:o.start==='lone'?[LONE,LONEDOG]:o.start==='pets'?['c_chan',...PETS]:null;
  if(ids){
    g.units=[];g.dex={};ids.forEach(id=>addUnit(g,id));g.units.forEach(u=>u.job=bestJob(u));g.mode=o.start;
    if(o.start==='lone'){const d=g.units.find(u=>u.id===LONEDOG);d.inj=1;d.hp=Math.round(maxHp(d)*.45);d.job='rest';
      g.queue=g.queue.map(q=>q.id==='s_intro'?{id:'s_lone'}:q)}
  }
  if(o.diff&&o.diff!=='normal'){g.hmul=DIFF[o.diff].m;g.diff=o.diff}
  if(o.rich){for(const k in g.res)g.res[k]=Math.round(g.res[k]*(k==='bat'?1:k==='food'||k==='water'?3:2));g.res.bat+=3000;g.rich=1}
  g.queue.unshift({id:'ch_card',c:{pos:1}});
  return g;
}}
const PETS=Object.keys(CH).filter(id=>CH[id].tr.includes('animal')&&gacha(id));
const DIFF={easy:{n:'輕鬆',d:'屍潮 ×0.7',m:.7},normal:{n:'普通',d:'',m:1},hell:{n:'地獄',d:'屍潮 ×1.4',m:1.4}};
function openNewGame(){
  const m=meta(),won=(m.wins||0)>0||!!m.unlock,nAch=Object.keys(m.ach||{}).length;
  const ANY=Object.keys(CH).filter(id=>!CH[id].tr.includes('animal')&&gacha(id));
  const URS=BY_G.UR.filter(id=>!CH[id].tr.includes('animal'));
  const FAS=Object.keys(FA).filter(f=>facPool(f).length>=3);
  const BASE3=['c_chan','c_keung','c_cheung'];
  const MODES=[['normal','普通開局','三個街坊'],['ur','傳奇助陣','街坊 + 揀一個 UR'],['trio','同陣形開局','同一陣形揀三個人'],['rand','隨機三人','全部角色隨機抽'],['pets','毛孩樂園','陳太同全部貓狗 · 難'],['lone','天崩開局','韋恩中校同阿灰 · 極難']];
  let st='normal',shuffle=won,ur=pick(URS),fa=FAS[0],trio=shuf(facPool(fa)).slice(0,3),rnd=shuf([...ANY]).slice(0,3),diff='normal',rich=false;
  const crew=()=>st==='normal'?BASE3:st==='ur'?[...BASE3,ur]:st==='trio'?trio:st==='rand'?rnd:st==='pets'?['c_chan',...PETS]:[LONE,LONEDOG];
  const info=id=>{const c=CH[id];return `<b class="rn ${c.g}">${esc(c.n)}</b> <span class="rk ${c.g}">${c.g}</span> ${esc(c.job)}　<span class="muted">專長【${esc(c.sk.n)}】${esc(c.sk.d)}</span>`};
  const avB=(id,on,attr='')=>{const c=CH[id];return `<button class="ngav ${on?'on':''}" data-info="${id}" ${attr}><span class="chead r-${c.g}">${fig({id},null,true)}</span><b class="rn ${c.g}">${esc(c.n.split(' ')[0])}</b><small>${c.g}</small></button>`};
  const draw=()=>{
    const lock=st!=='normal'&&!won,C=crew(),ok=!lock&&(st!=='trio'||trio.length===3);
    let pickH='';
    if(st==='ur')pickH=`<div class="nghd">揀一個 UR 傳奇<button class="btn sm" data-rr="ur">隨機</button></div><div class="ngpool">${URS.map(id=>avB(id,id===ur,`data-ur="${id}"`)).join('')}</div>`;
    else if(st==='trio')pickH=`<div class="nghd">揀陣形</div><div class="ngfas">${FAS.map(f=>`<button class="chip ${f===fa?'pk':''}" data-fa="${f}">${FA[f]} <small>${facPool(f).length}</small></button>`).join('')}</div>
      <div class="nghd">喺「${FA[fa]}」揀三個人（已揀 ${trio.length}/3）<button class="btn sm" data-rr="trio">隨機</button></div><div class="ngpool">${facPool(fa).map(id=>avB(id,trio.includes(id),`data-tr="${id}"`)).join('')}</div>`;
    else if(st==='rand')pickH=`<div class="nghd">隨機抽到嘅三個人<button class="btn sm" data-rr="rand">再抽</button></div>`;
    modal(`<div class="modal dismiss ngmodal" style="width:min(780px,100%)"><div class="eyebrow">開新一局</div>
      <p class="muted" style="margin:0;font-size:12px">${m.wins?`已經通關 ${m.wins} 次。`:won?'已用兌換碼解鎖全部開局玩法。':'撐過第十三章「末日堡壘」嘅屍潮之夜就算贏一局，會解鎖特別開局同亂數劇本。'}獎章永久保留（已攞過 ${nAch}/${ACH.length} 個），新一局達成都會再攞獎勵。${G&&!G.over&&G.day>1?'<br><b style="color:var(--blood)">會清走而家第 '+G.day+' 日嘅進度。</b>':''}</p>
      <div class="ngmodes" role="radiogroup" aria-label="開局方式">${MODES.map(([k,t,d])=>`<button class="ngmode ${st===k?'on':''}" role="radio" aria-checked="${st===k}" data-st="${k}"><b>${t}</b><small>${d}${k!=='normal'&&!won?' · 未解鎖':''}</small></button>`).join('')}</div>
      <div class="ngcrew"><div class="nghd">開局成員（${C.length} 個）${st==='lone'?'<small>阿灰開局受咗傷</small>':''}</div><div class="ngpool">${C.map(id=>avB(id,false)).join('')}</div>${pickH}
        <div class="nginfo" id="nginfo">${info(C[C.length-1])}</div></div>
      <div class="ngmods ${won?'':'off'}"><span class="lbl">難度</span>${Object.keys(DIFF).map(k=>`<button class="chip ${diff===k?'pk':''}" data-diff="${k}" ${won||k==='normal'?'':'disabled'}>${DIFF[k].n}${DIFF[k].d?` <small>${DIFF[k].d}</small>`:''}</button>`).join('')}
        <span class="lbl" style="margin-left:10px">開局物資</span><button class="chip ${rich?'':'pk'}" data-rich="0">正常</button><button class="chip ${rich?'pk':''}" data-rich="1" ${won?'':'disabled'}>富足 <small>物資 ×2–3、電池 +3000</small></button></div>
      <label class="ngshuf ${won?'':'off'}"><input type="checkbox" id="ngshuf" ${shuffle?'checked':''} ${won?'':'disabled'}><span>章節同致敬劇本亂數<small>第一章同最後兩章固定，中間十章同六個致敬劇本嘅解鎖次序打亂${won?'':'（贏一局解鎖）'}</small></span></label>
      <div class="row"><button class="btn sm" id="cx">取消</button>${lock?'<span class="muted" style="font-size:12px;margin-left:auto">贏一局或者用兌換碼解鎖呢個開局</span>':''}<button class="btn pri" id="ngo" style="margin-left:${lock?'8px':'auto'}" ${ok?'':'disabled'}>開始新一局</button></div></div>`,()=>{
      $('#cx').onclick=closeOv;
      const ni=$('#nginfo');
      document.querySelectorAll('[data-info]').forEach(b=>{b.onmouseenter=()=>ni.innerHTML=info(b.dataset.info);b.onfocus=b.onmouseenter});
      document.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{st=b.dataset.st;draw()});
      document.querySelectorAll('[data-ur]').forEach(b=>b.onclick=()=>{ur=b.dataset.ur;draw()});
      document.querySelectorAll('[data-fa]').forEach(b=>b.onclick=()=>{fa=b.dataset.fa;trio=shuf(facPool(fa)).slice(0,3);draw()});
      document.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>{const id=b.dataset.tr;trio=trio.includes(id)?trio.filter(x=>x!==id):trio.length<3?[...trio,id]:[...trio.slice(1),id];draw()});
      document.querySelectorAll('[data-rr]').forEach(b=>b.onclick=()=>{const k=b.dataset.rr;if(k==='ur')ur=pick(URS.filter(x=>x!==ur));else if(k==='rand')rnd=shuf([...ANY]).slice(0,3);else trio=shuf(facPool(fa)).slice(0,3);draw()});
      document.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{diff=b.dataset.diff;draw()});
      document.querySelectorAll('[data-rich]').forEach(b=>b.onclick=()=>{rich=b.dataset.rich==='1';draw()});
      const sh=$('#ngshuf');if(sh)sh.onchange=()=>shuffle=sh.checked;
      $('#ngo').onclick=()=>{fresh({start:st,ur,ids:st==='rand'?rnd:trio,shuffle:won&&shuffle,diff:won?diff:'normal',rich:won&&rich});save();$('#ovroot').innerHTML='';go('base');showQueue()};
    });
  };
  draw();
}

/* ---------- 過場畫面：每一章、每個致敬劇本開始時播 ---------- */
function chapCard(c,next){
  let h;
  if(c.d){const d=DUNBYID[c.d];h={no:'致敬劇本',t:d.n.replace('劇本 · ',''),src:d.genre,p:d.st[0],goal:`完成可以攞「${ITEMS[d.prize].n}」`}}
  else{const x=CHAPS[stN(G,c.pos)-1];h={no:`第${CNUM[c.pos-1]}章${G.order?' · 亂數':''}`,t:x.t,src:x.src,p:x.p,goal:'目標：'+x.goal}}
  $('#ovroot').innerHTML=`<div class="chcard" role="dialog" aria-modal="true" tabindex="-1"><div class="cc-in"><div class="cc-no">${esc(h.no)}</div><h1 class="cc-t">${esc(h.t)}</h1><div class="cc-src">${esc(h.src)}</div><p class="cc-p">${esc(h.p)}</p><div class="cc-goal">${esc(h.goal)}</div><div class="cc-tap">撳任何地方繼續</div></div></div>`;
  const el=$('#ovroot .chcard'),done=()=>{$('#ovroot').innerHTML='';next()};
  el.onclick=done;el.onkeydown=e=>{if(['Enter',' ','Escape'].includes(e.key)){e.preventDefault();done()}};el.focus();
}
{const _q=showQueue;showQueue=function(){
  const q=G.queue[0];
  if(q&&q.id==='ch_card'){G.queue.shift();save();return chapCard(q.c,showQueue)}
  if(q&&q.id==='script_open'&&q.c&&!q.c.carded&&DUNBYID[q.c.d]){q.c.carded=1;save();return chapCard({d:q.c.d},showQueue)}
  _q();
  if(!G.queue.length&&G.flags.finalWon&&!G.flags.winShown&&!$('#ovroot').innerHTML){G.flags.winShown=1;save();
    modal(`<div class="modal paper"><div class="eyebrow">通關</div><h2>你贏咗呢一局</h2><div class="story">已經通關 ${meta().wins||1} 次。\n\n解鎖咗：特別開局（傳奇助陣、同陣形開局、天崩開局）同章節、致敬劇本亂數。獎章會永久保留。</div><div class="row"><button class="btn sm" id="cx">繼續睇吓</button><button class="btn pri" id="ngw" style="margin-left:auto">開新一局</button></div></div>`,()=>{$('#cx').onclick=closeOv;$('#ngw').onclick=openNewGame})}
}}
