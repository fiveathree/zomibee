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
/* 獎章解鎖邊個致敬劇本：亂數局用 G.scrMap */
const achUnl=a=>a.unlock&&((G.scrMap&&G.scrMap[a.id])||a.unlock);

/* ---------- 開新一局 ---------- */
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const gacha=id=>BY_G[CH[id].g]&&BY_G[CH[id].g].includes(id);
const facPool=f=>Object.keys(CH).filter(id=>(CH[id].fa||[]).includes(f)&&!CH[id].tr.includes('animal')&&gacha(id));
{const _f=fresh;fresh=function(o){
  o=o||{};syncMeta();_f();  // 開新局前先記低舊局嘅獎章
const g=G;
  if(o.shuffle){
    g.order=[1,...shuf([2,3,4,5,6,7,8,9,10,11]),12,13];
    const ul=ACH.filter(a=>a.unlock),ids=shuf(ul.map(a=>a.unlock));g.scrMap={};ul.forEach((a,i)=>g.scrMap[a.id]=ids[i]);
  }
  const ids=o.start==='ur'?['c_chan','c_keung','c_cheung',o.ur]:o.start==='trio'?o.ids:o.start==='lone'?[LONE,LONEDOG]:null;
  if(ids){
    g.units=[];g.dex={};ids.forEach(id=>addUnit(g,id));g.units.forEach(u=>u.job=bestJob(u));g.mode=o.start;
    if(o.start==='lone'){const d=g.units.find(u=>u.id===LONEDOG);d.inj=1;d.hp=Math.round(maxHp(d)*.45);d.job='rest';
      g.queue=g.queue.map(q=>q.id==='s_intro'?{id:'s_lone'}:q)}
  }
  g.queue.unshift({id:'ch_card',c:{pos:1}});
  return g;
}}
function openNewGame(){
  const m=meta(),won=(m.wins||0)>0,nAch=Object.keys(m.ach||{}).length;
  const URS=BY_G.UR.filter(id=>!CH[id].tr.includes('animal'));
  const FAS=Object.keys(FA).filter(f=>facPool(f).length>=3);
  let st='normal',shuffle=won,ur=pick(URS),fa=FAS[0],trio=shuf(facPool(fa)).slice(0,3);
  const nmL=ids=>ids.map(id=>`<span class="rn ${CH[id].g}">${esc(CH[id].n)}</span>`).join('、');
  const draw=()=>{
    const opt=(k,t,d,extra='',lock=k!=='normal'&&!won)=>`<button class="distb ngopt ${st===k?'on':''}" data-st="${k}" ${lock?'disabled':''}><b>${t}</b><span>${d}</span>${lock?'<em class="nglock">贏一局解鎖</em>':extra}</button>`;
    modal(`<div class="modal dismiss" style="width:min(680px,100%)"><div class="eyebrow">開新一局</div>
      <p class="muted" style="margin:0;font-size:12px">${won?`已經通關 ${m.wins} 次。`:'撐過第十三章「末日堡壘」嘅屍潮之夜就算贏一局，會解鎖特別開局同亂數劇本。'}獎章永久保留（已攞過 ${nAch}/${ACH.length} 個），新一局達成都會再攞獎勵。${G&&!G.over&&G.day>1?'<br><b style="color:var(--blood)">會清走而家第 '+G.day+' 日嘅進度。</b>':''}</p>
      <div class="distg">
        ${opt('normal','普通開局','陳太、強哥、阿祥三個街坊，喺街口便利店落腳')}
        ${opt('ur','傳奇助陣','三個街坊之外，一開波送一個 UR 傳奇',`<em class="ngpick">${nmL([ur])} <a class="linkbtn" data-re="ur">換一個</a></em>`)}
        ${opt('trio','同陣形開局','揀一個陣形，由同一陣形嘅三個人開局',`<em class="ngpick"><select class="sel" id="ngfa">${FAS.map(f=>`<option value="${f}" ${f===fa?'selected':''}>${FA[f]}</option>`).join('')}</select>${nmL(trio)} <a class="linkbtn" data-re="trio">換過</a></em>`)}
        ${opt('lone','天崩開局','全城只剩你一個：韋恩中校（UR）同一隻受咗傷嘅德國牧羊犬阿灰','<em class="ngpick">極難 · 致敬經典末日電影</em>')}
      </div>
      <label class="ngshuf ${won?'':'off'}"><input type="checkbox" id="ngshuf" ${shuffle?'checked':''} ${won?'':'disabled'}> 章節同致敬劇本亂數<small>第一章同最後兩章固定，中間十章同六個致敬劇本嘅解鎖次序打亂${won?'':'（贏一局解鎖）'}</small></label>
      <div class="row"><button class="btn sm" id="cx">取消</button><button class="btn pri" id="ngo" style="margin-left:auto">開始新一局</button></div></div>`,()=>{
      $('#cx').onclick=closeOv;
      document.querySelectorAll('[data-st]').forEach(b=>b.onclick=e=>{if(e.target.closest('select,a'))return;st=b.dataset.st;draw()});
      document.querySelectorAll('[data-re]').forEach(a=>a.onclick=e=>{e.stopPropagation();if(a.dataset.re==='ur')ur=pick(URS.filter(x=>x!==ur));else trio=shuf(facPool(fa)).slice(0,3);st=a.dataset.re;draw()});
      const sf=$('#ngfa');if(sf){sf.onclick=e=>e.stopPropagation();sf.onchange=()=>{fa=sf.value;trio=shuf(facPool(fa)).slice(0,3);st='trio';draw()}}
      const sh=$('#ngshuf');if(sh)sh.onchange=()=>shuffle=sh.checked;
      $('#ngo').onclick=()=>{fresh({start:st,ur,ids:trio,shuffle:won&&shuffle});save();$('#ovroot').innerHTML='';go('base');showQueue()};
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
