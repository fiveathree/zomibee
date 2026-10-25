/* ================= 引擎 ================= */
const R=Math.random, ri=(a,b)=>a+Math.floor(R()*(b-a+1)), rf=(a,b)=>a+R()*(b-a), cl=(v,a,b)=>Math.max(a,Math.min(b,v)), pick=a=>a[Math.floor(R()*a.length)];
let G=null;
const MULK=['sanDecay','risk','eat','staRec','tough','bite','partsSave','medSave','horde','lootAll','feed','research'];
const FXC={};
function fxOf(u){
  if(FXC[u.id])return FXC[u.id];
  const c=CH[u.id],f={job:{},loot:{}};
  const add=x=>{for(const k in x){
    if(k==='job'||k==='loot'){for(const j in x[k])f[k][j]=(f[k][j]||1)*x[k][j];}
    else if(MULK.includes(k))f[k]=(f[k]??1)*x[k];
    else f[k]=(f[k]||0)+x[k];
  }};
  c.tr.forEach(t=>add(TR[t].fx));add(c.fx);
  MULK.forEach(k=>{if(f[k]===undefined)f[k]=1});
  return FXC[u.id]=f;
}
const nm=u=>CH[u.id].n;
const statB=(u,k)=>{const b=CH[u.id].s[ST.indexOf(k)];if(!b)return 0;return cl(b+u.star*(fxOf(u).starPlus?2:1)+(u.mut&&u.mut.s[k]||0)+(u.cult||0),1,25)};
const CAPB={};
const stat=(u,k)=>{const b=statB(u,k);return b?Math.min(30,b+gearSt(u,k)+((CAPB[u.id]||{})[k]||0)):0};
const maxHp=u=>60+stat(u,'str')*2+u.star*4+(fxOf(u).frailHp||0);
const BS=g=>BASES[g.base]||BASES.store;
const bedCap=g=>BS(g).beds+g.fac.beds*2;
const beds=g=>act(g).filter(u=>!isAnimal(u)).length;
const act=g=>g.units.filter(u=>u.act);
const uOf=id=>G.units.find(u=>u.id===id);
const fortMax=g=>BS(g).wall+g.fac.wall*30;
const isS=(u,j)=>j!=='rest'&&canWork({...u,crit:0,iso:0},j)&&grade(apt(u,j)*(fxOf(u).job[j]||1))==='S';
const isAnimal=u=>!!fxOf(u).animal;
const talker=u=>!isAnimal(u);
const NOANIMAL=['repair','cook','medic'];

function apt(u,j){
  if(j==='rest')return 0;
  if(fxOf(u).animal&&NOANIMAL.includes(j))return 0;
  let a=0;for(const k in JOBS[j].w)a+=JOBS[j].w[k]*stat(u,k);return a;
}
function grade(a){return a>=16?'S':a>=13?'A':a>=10?'B':a>=7?'C':'D'}
function canWork(u,j){if(j==='rest')return true;if(u.crit||u.iso)return false;if(fxOf(u).animal&&NOANIMAL.includes(j))return false;return true}
function condMult(u){
  const f=fxOf(u);let m=1;
  if(u.inj)m*=.6; if(u.sick)m*=.7; if(u.hungry)m*=.85;
  if(u.sta<30&&!f.noTired)m*=.7;
  if(u.san<25)m*=.6;else if(u.san>=85)m*=1.15;
  return m;
}
function eff(u,j){
  if(!canWork(u,j)||j==='rest')return 0;
  const f=fxOf(u);let e=apt(u,j)*condMult(u)*(f.job[j]||1)*(1+(eqS(u).job[j]||0))*(1+synergy(u,j)+teamAdd('teamEff'))*(u.mut&&MUT[u.mut.t].job[j]||1);
  if(f.berserk&&j==='guard'&&u.hp<maxHp(u)/2)e*=1.5;
  return e;
}
function groups(g){
  const by={};JK.forEach(j=>by[j]=[]);
  act(g).forEach(u=>{const j=canWork(u,u.job)?u.job:'rest';by[j].push(u)});
  return by;
}
function teamFx(g,k,mode){ // mode: 'sum' | 'mul' | 'max' | 'any'
  const A=act(g);
  if(mode==='sum')return A.reduce((s,u)=>s+(fxOf(u)[k]||0),0);
  if(mode==='mul')return A.reduce((s,u)=>s*(fxOf(u)[k]??1),1);
  if(mode==='max')return A.reduce((s,u)=>Math.max(s,fxOf(u)[k]??1),1);
  return A.some(u=>fxOf(u)[k]);
}
function hordeBase(g){
  const d=g.day;
  return (5+d*1.3+Math.max(0,d-25)*.55-Math.max(0,d-45)*.95)*CHAPS.filter(c=>c.day<=d).pop().hm*(BS(g).horde||1)*teamMul('horde')*g.warn*(g.hmul||1);  // hmul：開局揀嘅難度
}
function raidTonight(g){
  const f=g.flags;
  if(f.raidDay&&g.day===f.raidDay&&!f.allied&&!f.paid)return{n:'獵人幫',add:38+(f.angry?10:0),win:'raidWon',spoil:{ammo:15,med:4,food:10},txt:'獵人幫趁住屍潮夜襲，車頭燈照住成個據點！'};
  if(f.prisonDay&&g.day===f.prisonDay&&!f.prisonWon)return{n:'監獄幫',add:60+(f.prisonAngry?15:0),win:'prisonWon',spoil:{ammo:30,food:20,parts:15},txt:'監獄幫開住改裝囚車撞埋嚟，車頭焊住鐵板！',again:6};
  if(f.finalDay&&g.day===f.finalDay&&!f.finalWon)return{n:'屍潮之夜',add:Math.round(hordeBase(g)*1.2),win:'finalWon',spoil:{core:5,bat:500},txt:'地平線上全部都係喪屍。屍潮之夜嚟咗！',again:5,final:1};
  return null;
}
function forecast(g){
  const by=groups(g);
  const P=by.patrol.reduce((s,u)=>s+eff(u,'patrol'),0);
  const sP=by.patrol.filter(u=>isS(u,'patrol')).length;
  const red=Math.min(.4+(sP?.15:0),P*.012+sP*.1);
  let horde=hordeBase(g)*(1-red)*(by.patrol.length?1:1.1);
  {const rd=raidTonight(g);if(rd)horde+=rd.add}
  let ammo=g.res.ammo,gp=0;
  by.guard.forEach(u=>{let e=eff(u,'guard');if(fxOf(u).noAmmo||setFx(u,'noAmmo'))e*=1.5;else if((u.bag&&u.bag.mag>0)||ammo>0){if(!(u.bag&&u.bag.mag>0))ammo--;e*=1.5}gp+=e+(isS(u,'guard')?8:0)+eqS(u).def});
  const def=(g.fort*.4+gp+(BS(g).def||0)+teamFx(g,'def','sum')+act(g).filter(u=>!u.crit).reduce((s,u)=>s+stat(u,'str')*.15,0))*(1+teamAdd('defPct')+(typeof capFx==='function'?capFx('base','def'):0));
  const A=act(g);
  const eat=A.reduce((s,u)=>s+fxOf(u).eat*(u.mut?1.5:1),0);
  const K=by.cook.reduce((s,u)=>s+eff(u,'cook'),0)*(1+.25*g.fac.kitchen)*by.cook.reduce((s,u)=>Math.max(s,fxOf(u).feed),1);
  const ratio=A.length?cl(K/(A.length*3),0,1):0;
  const sC=by.cook.some(u=>isS(u,'cook'));
  const food=Math.ceil(eat*(1-.35*ratio-(sC?.15:0)));
  return {sC,horde:Math.round(horde),lo:Math.round(horde*.85),hi:Math.round(horde*1.2),def:Math.round(def),food,water:A.length,red,P,ratio,by};
}

/* ---------- 單位操作 ---------- */
function newUnit(id){const u={id,star:0,hp:0,sta:90,san:75,inj:0,crit:0,inf:0,sick:0,iso:0,hungry:0,job:'rest',act:true,joined:G?G.day:1};u.hp=maxHp(u);return u}
function addUnit(g,id){
  // returns {type:'new'|'star'|'max'|'dead', u}
  g.dex[id]=1;
  if(g.gone[id]&&g.gone[id].dead)return{type:'dead'};
  const ex=g.units.find(u=>u.id===id);
  if(ex){if(ex.star>=5)return{type:'max',u:ex};ex.star++;ex.hp=Math.min(maxHp(ex),ex.hp+8);return{type:'star',u:ex}}
  delete g.gone[id];
  const u=newUnit(id);u.joined=g.day;u.act=isAnimal(u)||beds(g)<bedCap(g);g.units.push(u);
  u.job=bestJob(u);
  onRecruit(g,id);
  return{type:'new',u};
}
function bestJob(u){let b='rest',v=0;JK.forEach(j=>{if(j==='rest')return;const a=apt(u,j)*(fxOf(u).job[j]||1);if(a>v){v=a;b=j}});return b}
function hurt(u,d){if(setFx(u,'noHurt'))return 0;d=Math.round(d*fxOf(u).tough);u.hp-=d;u.inj=1;if(u.hp<maxHp(u)*.25&&u.hp>0)u.crit=1;if(u.bag&&u.bag.bandage>0&&!u.crit){u.bag.bandage--;u.inj=0}return d}
function infect(u,src){
  if(u.mut)return `${nm(u)} 被咬咗……佢已經係變種人，病毒對佢冇用。`;
  if(u.bag&&u.bag.serumv>0&&!u.inf){u.bag.serumv--;return `${nm(u)} 被咬！佢即刻打咗背包入面嘅血清，冇事。`}
  if(fxOf(u).immune)return `${nm(u)} 被咬咗一啖……但傷口好快就埋口，佢對病毒免疫。`;
  if(u.inf>0)return '';
  u.inf=3;G.queue.push({id:'bitten',c:{u:u.id,src}});
  return `${nm(u)} 被咬咗！`;
}
function killUnit(u,why){
  unequipAll(u);
  G.units=G.units.filter(x=>x!==u);
  G.gone[u.id]={d:G.day,why,dead:true};
  act(G).forEach(x=>sanD(x,-8));
  addLog(`${nm(u)} 死咗。${why}`);
}
function leaveUnit(u,why){unequipAll(u);G.units=G.units.filter(x=>x!==u);G.gone[u.id]={d:G.day,why,dead:false};addLog(`${nm(u)} 離開咗據點。${why}`)}
function sanD(u,n){if(n<0)n*=fxOf(u).sanDecay;u.san=cl(u.san+n,0,100)}
function allSan(n){act(G).forEach(u=>sanD(u,n))}
function addRes(o){const out=[];for(const k in o){if(!o[k])continue;G.res[k]=Math.max(0,(G.res[k]||0)+o[k]);if(k==='core'&&o[k]>0)G.flags.coreTotal=(G.flags.coreTotal||0)+o[k];out.push(`${RES[k].n} ${o[k]>0?'+':''}${o[k]}`)}return out.join('、')}
function bestBy(fn,filter){const A=act(G).filter(u=>!u.crit&&!u.iso&&(!filter||filter(u)));if(!A.length)return null;return A.reduce((a,b)=>fn(b)>fn(a)?b:a)}
function addLog(t){G.log.push({d:G.day,t});if(G.log.length>400)G.log.splice(0,G.log.length-400)}

/* ---------- 結束一日 ---------- */
function endDay(){
  const g=G;if(g.over)return null;
  const A=act(g);const rep=[];const H=t=>rep.push({h:t});const L=(t,c='')=>{rep.push({t,c})};
  const by=groups(g);
  const fc=forecast(g);
  A.forEach(u=>u.worked=canWork(u,u.job)?u.job:'rest');
  H('白天');
  // 搜括
  if(by.scav.length){
    const AL=allLocs(g);const loc=AL.find(l=>l.id===g.loc)||AL[0];
    const sc=by.scav;
    let pw=sc.reduce((s,u)=>s+eff(u,'scav')*fxOf(u).lootAll*(1+eqS(u).loot)*dunMod(u,loc).p,0)*(1+(typeof capFx==='function'?capFx('base','loot'):0));
    if(sc.length===1&&fxOf(sc[0]).loner)pw*=1.4;
    const sS=sc.some(u=>isS(u,'scav'));if(sS)pw*=1.3;
    const dep=g.dep[loc.id]??1;const got={};
    for(const r in loc.loot){
      if(r==='serum'){if(R()<loc.loot.serum*pw/10)got.serum=1;continue}
      let m=1;sc.forEach(u=>{const lm=fxOf(u).loot[r];if(lm)m=Math.max(m,lm)});
      const n=Math.round(pw/10*loc.loot[r]*LSCALE[r]*dep*rf(.7,1.3)*m);
      if(n>0)got[r]=n;
    }
    if(sS&&!got.serum&&R()<.05)got.serum=1;
    const txt=addRes(got);
    const li=loc.items||LOCITEM[loc.id]||[];let found=null;if(li.length&&R()<(sS?.45:.32)+(loc.dun?.15:0)){found=pick(li);addItem(found)}
    L(`${sc.map(nm).join('、')} 去咗${loc.n}搜括：${txt||'乜都搵唔到'}${dep<.6?'（呢度已經畀人搜得七七八八）':''}`,txt?'g':'');
    g.dep[loc.id]=Math.max(.35,dep*.85);
    if(found)L(`仲搵到裝備：${ITEMS[found].n}（${SLOTS[ITEMS[found].slot]}）`,'g');
    const tf=Math.max(.7,1-.07*(sc.length-1));
    sc.forEach(u=>{
      const base=loc.dg*cl(1.45-eff(u,'scav')/20,.4,1.4)*fxOf(u).risk*tf*(isS(u,'scav')?.5:1)*eqS(u).risk*dunMod(u,loc).r;
      const dm=dunMod(u,loc);if(dm.san){sanD(u,-dm.san);if(R()<.4)L(`${nm(u)} 喺${loc.n}入面心神不寧（意志 -${dm.san}）`,'y')}
      if(R()<base){const d=hurt(u,ri(12,28));L(`${nm(u)} 喺${loc.n}受傷（-${d} HP）${u.crit?'，傷勢嚴重！':''}`,'b')}
      if(R()<base*.3*fxOf(u).bite*eqS(u).bite){const t=infect(u,loc.n);if(t)L(t,fxOf(u).immune?'':'y')}
    });
    const pc=g.clear[loc.id]||0;g.clear[loc.id]=Math.min(100,pc+pw*(loc.dun?.45:loc.id==='dungeon'?.35:.8));
    if(loc.dun){[34,67,100].forEach((t,i)=>{if(pc<t&&g.clear[loc.id]>=t)g.queue.push({id:'dun_stage',c:{d:loc.id,s:i}})});if(g.clear[loc.id]<100)L(`${loc.n}探索進度 ${Math.round(g.clear[loc.id])}%`)}
    if(loc.id==='dungeon'&&pc<100&&g.clear.dungeon>=100)g.queue.push({id:'s_kingdead'});
    if(pc<100&&g.clear[loc.id]>=100){addLog(`${loc.n}已經清場。`);if(BASES[loc.id])g.queue.push({id:'cleared',c:{loc:loc.id}})}
    else if((BASES[loc.id]||loc.id==='dungeon')&&g.clear[loc.id]<100)L(`${loc.n}清場進度 ${Math.round(g.clear[loc.id])}%`);
    if(loc.id==='museum'&&!g.flags.codex&&!g.flags.codexQ){g.flags.codexQ=1;g.queue.push({id:'codex'})}
    if(loc.id==='lab'&&!g.flags.labSeen){g.flags.labSeen=1;g.queue.push({id:'labfind'})}
  }
  // 巡邏
  if(by.patrol.length){
    const P=fc.P;
    const got={food:Math.round(P*.1*rf(.3,1.5)),parts:Math.round(P*.07*rf(.3,1.5)),bat:Math.round(P*.6*rf(.6,1.4))};
    L(`${by.patrol.map(nm).join('、')} 巡咗附近幾條街，清走一批遊蕩者（今晚屍潮 -${Math.round(fc.red*100)}%），順手執到 ${addRes(got)||'少少嘢'}`,'g');
    by.patrol.forEach(u=>{if(isS(u,'patrol')&&R()<.25){L(`${nm(u)}【掃蕩】喺一個空單位搵到倖存者留低嘅嘢：${addRes({bat:40})}`,'g')}});
    by.patrol.forEach(u=>{if(R()<.05*fxOf(u).risk){const d=hurt(u,ri(8,18));L(`${nm(u)} 巡邏時被突襲（-${d} HP）`,'b')}});
  }
  // 維修
  if(by.repair.length){
    const W=by.repair.reduce((s,u)=>s+eff(u,'repair')*(isS(u,'repair')?1.3:1),0);
    const ps=by.repair.reduce((s,u)=>Math.min(s,fxOf(u).partsSave),1)*(by.repair.some(u=>isS(u,'repair'))?.7:1);
    let pj=g.proj;if(pj!=='fort'&&g.fac[pj]>=FAC[pj].max)pj=g.proj='fort';
    if(pj==='fort'){
      const room=fortMax(g)-g.fort;
      if(room<=0)L(`${by.repair.map(nm).join('、')} 檢查咗一輪，圍牆完好，冇嘢要修。`);
      else{
        let add=Math.min(room,Math.round(W*2.2));let cost=Math.ceil(add/18*ps);
        if(cost>g.res.parts){add=Math.round(add*g.res.parts/Math.max(1,cost));cost=g.res.parts}
        g.fort+=add;g.res.parts-=cost;
        L(`${by.repair.map(nm).join('、')} 修補圍牆 +${add}（用咗 ${cost} 零件）${add===0?'——冇零件，乜都做唔到':''}`,add?'g':'b');
      }
    }else{
      const lv=g.fac[pj],need=Math.round(FAC[pj].work(lv)*(teamAdd('workHalf')?.5:1));
      g.prog[pj]=Math.min(need,(g.prog[pj]||0)+W);
      if(g.prog[pj]>=need){
        const cost=Math.round(FAC[pj].cost(lv)*ps);
        if(g.res.parts>=cost){g.res.parts-=cost;g.fac[pj]++;g.prog[pj]=0;L(`${FAC[pj].n}升到 ${g.fac[pj]} 級！（用咗 ${cost} 零件）`,'g');addLog(`${FAC[pj].n}升到 ${g.fac[pj]} 級。`);if(pj==='wall')g.fort+=30;if(g.fac[pj]>=FAC[pj].max)g.proj='fort'}
        else L(`${FAC[pj].n}嘅工程做好晒，但仲差零件（要 ${cost}，得 ${g.res.parts}）`,'b');
      }else L(`${by.repair.map(nm).join('、')} 起緊${FAC[pj].n}（${Math.round(g.prog[pj])}/${need}）`);
    }
  }
  // 醫療
  if(by.medic.length){
    let M=by.medic.reduce((s,u)=>s+eff(u,'medic'),0)*(1+.25*g.fac.clinic)*(BS(g).medic||1);
    const sM=by.medic.some(u=>isS(u,'medic'));
    const ms=by.medic.reduce((s,u)=>Math.min(s,fxOf(u).medSave),1);
    const herbal=by.medic.some(u=>fxOf(u).herbal);
    const useMed=()=>{if(g.res.med<=0)return sM||(herbal&&R()<.5);if(ms>=1||R()<ms)g.res.med--;return true};
    const pts=[...A].sort((a,b)=>(b.crit-a.crit)||(b.inj-a.inj)||(a.hp/maxHp(a)-b.hp/maxHp(b)));
    const done=[];
    for(const u of pts){
      if(u.crit&&M>=6){if(useMed()){u.crit=0;M-=6;done.push(`${nm(u)} 脫離危險`)}}
      if(u.inj&&!u.crit&&M>=4){if(useMed()){u.inj=0;M-=4;done.push(`${nm(u)} 傷口處理好`)}}
      if(u.sick&&M>=2){u.sick=0;M-=2;done.push(`${nm(u)} 退咗燒`)}
    }
    // 治感染
    by.medic.forEach(md=>{const c=(fxOf(md).cure||0)+(isS(md,'medic')?.15:0);if(!c)return;A.filter(u=>u.inf>0).forEach(u=>{if(R()<c){u.inf=0;u.iso=0;done.push(`${nm(md)} 救返 ${nm(u)}，感染清除咗！`)}})});
    let heal=Math.round(M*2);const hl=[...A].sort((a,b)=>a.hp/maxHp(a)-b.hp/maxHp(b));
    for(const u of hl){if(heal<=0)break;const n=Math.min(heal,maxHp(u)-u.hp);u.hp+=n;heal-=n}
    L(`${by.medic.map(nm).join('、')} 照顧傷者：${done.length?done.join('；'):'冇乜大傷，幫大家換藥補血'}${g.res.med<=0?'（藥品用晒！）':''}`,g.res.med<=0?'b':'g');
    if(reached(g,7)){
      const rm=teamFx(g,'research','max')*(BS(g).research||1);
      const medOk=g.res.med>0;if(medOk)g.res.med--;
      const add=by.medic.reduce((s,u)=>s+eff(u,'medic'),0)*.7*(g.flags.codex?1:.5)*rm*(medOk?1:.5)*(g.flags.labData?1.25:1);
      g.research=Math.min(100,g.research+add);
      L(`解藥研究 +${add.toFixed(1)}%（而家 ${g.research.toFixed(0)}%）${g.flags.codex?'':'——冇《疫屍錄》，進度減半'}`,'g');
    }
  }
  // 被動
  const pas={water:g.fac.rain*5,food:g.fac.garden*3+teamFx(g,'food','sum'),bat:g.fac.radio*10+teamFx(g,'bat','sum')};
  const bp=BS(g).perk||{};for(const k in bp)pas[k]=(pas[k]||0)+bp[k];
  const pt=addRes(pas);if(pt)L(`${BS(g).n}、設施同專長每日產出：${pt}`);
  A.forEach(u=>{if(u.mut&&MUT[u.mut.t].regen)u.hp=Math.min(maxHp(u),u.hp+MUT[u.mut.t].regen)});
  const th=teamFx(g,'heal','sum')+teamAdd('teamHeal');if(th)A.forEach(u=>u.hp=Math.min(maxHp(u),u.hp+th));
  // 食飯
  H('晚飯');
  const need=fc.food,wneed=fc.water;
  if(!by.repair.length&&g.fort>0){g.fort=Math.max(0,g.fort-4);L('冇人維修，圍牆自然損耗 -4','b')}
  if(!by.cook.length){L('冇人煮飯，大家乾啃罐頭，意志 -5','b');allSan(-5)}
  else{L(`${by.cook.map(nm).join('、')} 煮咗晚飯（慳咗 ${Math.round(35*fc.ratio)}% 食物）${fc.ratio>=.6?'，大家食得開心，意志 +3':''}`,'g');if(fc.ratio>=.6)allSan(3);if(fc.sC){allSan(3);L('【盛宴】今晚嘅飯餸好似太平年代咁，意志再 +3','g')}}
  A.forEach(u=>u.hungry=0);
  if(g.res.food>=need)g.res.food-=need;
  else{const short=need-g.res.food;g.res.food=0;const n=Math.min(A.length,Math.ceil(short));const v=[...A].sort(()=>R()-.5).slice(0,n);const bv=v.filter(u=>u.bag&&u.bag.can>0);bv.forEach(u=>u.bag.can--);const hv=v.filter(u=>!bv.includes(u));hv.forEach(u=>{u.hungry=1;u.hp-=8;sanD(u,-8)});if(bv.length)L(`${bv.map(nm).join('、')} 食咗背包入面嘅罐頭`);if(hv.length)L(`食物唔夠！${hv.map(nm).join('、')} 餓肚（-8 HP，意志 -8）`,'b')}
  if(g.res.water>=wneed)g.res.water-=wneed;
  else{const short=wneed-g.res.water;g.res.water=0;const v=[...A].sort(()=>R()-.5).slice(0,short);v.forEach(u=>{if(u.bag&&u.bag.bottle>0){u.bag.bottle--;return}u.hp-=10;u.sta=Math.max(0,u.sta-15);sanD(u,-5);if(!fxOf(u).noSick&&R()<.3)u.sick=1});L(`食水唔夠！${v.map(nm).join('、')} 口渴（有水樽嘅人飲咗自己嗰支）`,'b')}
  if(!teamFx(g,'noRats','any')&&R()<.1&&g.res.food>5){const n=ri(2,4);g.res.food-=n;L(`老鼠偷咗 ${n} 份食物`,'b')}
  const opDef=simOutposts(g,H,L);
  // 夜晚
  H('夜晚');
  const raid=raidTonight(g);
  let horde=Math.round(hordeBase(g)*(1-fc.red)*rf(.85,1.2)*(by.patrol.length?1:1.1));
  if(!by.patrol.length)L('冇人巡邏，屍群越聚越多（+10%）','b');
  if(raid)horde+=raid.add;
  {const thc=by.guard.reduce((s,u)=>Math.max(s,(fxOf(u).thunder||0)+(setFx(u,'thunder')||0)),0);if(thc&&R()<thc){horde=Math.round(horde*.65);L('⚡ 雷霆劈落屍群，燒焦咗一大片！（屍潮 -35%）','g')}}
  {const gw=teamAdd('ghostwed');if(gw&&R()<gw){horde=Math.round(horde*.65);L('紅蓋頭下傳出笑聲，屍群開始自相殘殺（屍潮 -35%）','g')}}
  let ammo=g.res.ammo,gp=0;
  by.guard.forEach(u=>{let e=eff(u,'guard');if(fxOf(u).noAmmo||setFx(u,'noAmmo'))e*=1.5;else if(u.bag&&u.bag.mag>0){u.bag.mag--;e*=1.5}else if(ammo>0){ammo--;e*=1.5}gp+=e+(isS(u,'guard')?8:0)+eqS(u).def});
  const used=g.res.ammo-ammo;g.res.ammo=ammo;
  const def=Math.round((g.fort*.4+gp+(BS(g).def||0)+teamFx(g,'def','sum')+A.filter(u=>!u.crit).reduce((s,u)=>s+stat(u,'str')*.15,0))*(1+teamAdd('defPct')+(typeof capFx==='function'?capFx('base','def'):0))+opDef);
  const night={horde,def,raid,used};
  if(reached(g,5))L(pick(['屍群入面有幾隻跑屍，速度快到似人。','一隻兩米高嘅巨屍撞住捲閘。','有隻喪屍不停尖叫，引埋成條街嘅同類過嚟。','啲變異體識得爬牆。']),'y');
  if(raid)L(raid.txt,'b');
  if(!by.guard.length)L('今晚冇人守夜……','b');
  if(def>=horde){
    const dmg=Math.round(horde*rf(.05,.15));g.fort=Math.max(0,g.fort-dmg);g.kills+=horde;
    const bat=10+Math.floor(g.day*.8);const extra={bat};
    if(reached(g,5)){const c=(R()<horde/90?1:0)+(horde>=60&&R()<.5?1:0)+(teamAdd('coreNight')?1:0);if(c)extra.core=c}
    L(`守住咗！擊退 ${horde} 隻（${used?`用咗 ${used} 發彈藥，`:''}圍牆 -${dmg}）。天光後喺屍堆搵到 ${addRes(extra)}`,'g');
    night.ok=true;allSan(1);
    if(raid){g.flags[raid.win]=1;L(`擊退${raid.n}！戰利品：${addRes(raid.spoil)}`,'g');addLog(`擊退咗${raid.n}。`)}
    by.guard.forEach(u=>{if(R()<.08*horde/Math.max(1,def)){const d=hurt(u,ri(5,12));L(`${nm(u)} 守夜時輕傷（-${d} HP）`,'b')}});
  }else{
    const diff=horde-def;night.ok=false;
    const dmg=Math.round(diff*.8+horde*.08);g.fort=Math.max(0,g.fort-dmg);g.kills+=def;
    L(`防線被衝破！屍潮 ${horde} 對防禦 ${def}，圍牆 -${dmg}`,'b');
    const sG=by.guard.filter(u=>isS(u,'guard'));
    let n=Math.max(0,Math.min(A.length,Math.ceil(diff/15)+(g.fort===0?1:0)-sG.length));
    {const bs=teamMaxFx('breachSafe');if(bs&&R()<bs){n=0;L('【空城計】城門大開，屍群竟然猶豫咗，冇人受傷','g')}}
    if(sG.length)L(`${sG.map(nm).join('、')}【一夫當關】頂住咗缺口`,'g');
    const pool=[...A];const vs=[];
    for(let i=0;i<n&&pool.length;i++){const w=pool.map(u=>u.job==='guard'?2:1);let r=R()*w.reduce((a,b)=>a+b,0),k=0;while(r>w[k]){r-=w[k];k++}vs.push(pool.splice(k,1)[0])}
    vs.forEach(u=>{const d=hurt(u,Math.min(45,ri(10,20)+diff*.5));L(`${nm(u)} 喺混戰中受傷（-${d} HP）`,'b');if(!isS(u,'guard')&&R()<(.15+diff/250)*fxOf(u).bite*eqS(u).bite){const t=infect(u,'夜襲');if(t)L(t,'y')}});
    const lost={food:-ri(0,Math.ceil(diff*.2))};if(raid&&!raid.final){lost.ammo=-Math.round(g.res.ammo*.3);lost.med=-Math.round(g.res.med*.3);lost.food-=Math.round(g.res.food*.25)}
    const lt=addRes(lost);if(lt)L(`損失：${lt}`,'b');
    allSan(-6);
    if(raid){if(raid.again){const k=raid.final?'finalDay':'prisonDay';g.flags[k]=g.day+raid.again;addLog(`${raid.n}得手……佢哋 ${raid.again} 日後會再嚟。`)}else{g.flags.raidLost=1;addLog(`${raid.n}夜襲得手，搶走咗大批物資。`)}}
  }
  // 狀態
  H('狀態');
  const calm=teamFx(g,'calm','any');
  if(teamFx(g,'yin','any')&&!teamFx(g,'antiYin','any')&&!A.some(u=>CH[u.id].fa.includes('宗'))){allSan(-2);L('陰氣好重，大家夜晚都瞓得唔安樂（意志 -2）','y')}
  {const lg=A.filter(u=>fxOf(u).legend);if(lg.length>=3){lg.forEach(u=>sanD(u,-4));L(`一山不能藏${CNUM[lg.length-1]}虎：${lg.map(nm).join('、')} 互相唔服（意志 -4）`,'y')}}
  if(BS(g).dark){allSan(-2);L('地底唔見天日（意志 -2）','y')}
  const teamSan=teamFx(g,'teamSan','sum');
  [...A].forEach(u=>{
    const f=fxOf(u),j=u.worked;
    if(j==='rest'){u.sta=cl(u.sta+40*f.staRec,0,100);sanD(u,f.restless&&!teamFx(g,'tame','any')?-5:10);u.hp=Math.min(maxHp(u),u.hp+6);if(u.inj&&R()<.2)u.inj=0}
    else{u.sta=cl(u.sta-JOBS[j].sta-eqS(u).over*1.2,0,100);sanD(u,-JOBS[j].san)}
    if(j!=='guard'){u.sta=cl(u.sta+15*f.staRec,0,100);u.hp=Math.min(maxHp(u),u.hp+2)}
    sanD(u,-(2+g.ch*.3));sanD(u,teamSan);
    if(u.sta<=0)u.hp-=5;
    if(u.inj)u.hp-=2; if(u.crit)u.hp-=8;
    if(u.sick){u.hp-=3;u.sta=Math.max(0,u.sta-10);if(R()<.25)u.sick=0}
    if(u.inf)sanD(u,-4);
    if(calm)u.san=Math.max(u.san,1);
  });
  bagDaily(g,A,L);
  // 感染倒數
  [...A].forEach(u=>{
    if(!u.inf)return;u.inf--;
    if(u.inf===0&&R()<mutChance(u)){const m=mutate(u);L(`${nm(u)} 熬過咗屍變……但佢變成咗變種人（${m.n}）！`,'y');addLog(`${nm(u)} 冇屍變，變成咗變種人（${m.n}）。`);g.queue.push({id:'mutant',c:{u:u.id}});return}
    if(u.inf===0){
      if(u.iso){killUnit(u,'喺隔離室入面屍變，大家隔住道門聽住佢抓咗成晚。');L(`${nm(u)} 喺隔離室屍變咗……`,'b')}
      else{
        killUnit(u,'喺據點入面屍變。');L(`${nm(u)} 喺大家瞓緊嘅時候屍變咗！`,'b');
        const others=act(g).sort(()=>R()-.5).slice(0,ri(1,2));
        others.forEach(o=>{const d=hurt(o,ri(10,25));L(`${nm(o)} 被屍變嘅同伴襲擊（-${d} HP）`,'b');if(R()<.3){const t=infect(o,'同伴');if(t)L(t,'y')}});
      }
    }
  });
  // 死亡
  [...act(g)].forEach(u=>{if(u.hp<=0&&!u.inf){const vk=teamMaxFx('valkyrie');const sv=act(g).find(x=>x!==u&&fxOf(x).valkyrie);if(sv&&R()<vk){u.hp=1;u.crit=1;L(`${nm(sv)}【英靈殿】將 ${nm(u)} 由死亡邊緣拉返嚟`,'g')}}});
  [...act(g)].forEach(u=>{if(u.hp<=0){killUnit(u,u.inf?'傷重不治，佢喺屍變之前斷咗氣。':'傷重不治。');L(`${nm(u)} 傷重不治……`,'b')}});
  // 崩潰
  act(g).forEach(u=>{if(u.san<=0&&!u.bd){u.bd=1;g.queue.push({id:'breakdown',c:{u:u.id}})}});
  if(rep[rep.length-1].h)L('大家都撐住。','g');
  // 新一日
  g.day++;g.warn=1;
  LOCS.concat(DUNS).forEach(l=>{if(g.dep[l.id]!==undefined)g.dep[l.id]=Math.min(1,g.dep[l.id]+.04)});
  if(!act(g).length){const res=g.units.filter(u=>!u.act&&!u.op).slice(0,bedCap(g));res.forEach(u=>u.act=true);if(res.length)addLog(`據點冇人，後備名單上嘅 ${res.map(nm).join('、')} 收到訊號趕嚟。`)}
  if(!g.units.length){g.over='dead';addLog('最後一個人都倒下咗。');save();return{rep,night}}
  checkObj();
  let sd=false;
  act(g).forEach(u=>{if(fxOf(u).autoStar&&g.day%10===0&&u.star<5){u.star++;addLog(`${nm(u)} 吸收晶核，突破到 ${u.star} 星。`)}});
  if(act(g).some(u=>fxOf(u).forge)&&g.day%5===0){const it=rollItem(pick(['R','SR','SR','SSR']));addItem(it);addLog(`布洛克打造咗一件${ITEMS[it].n}（${ITEMS[it].r}）。`)}
  if(g.flags.cured&&g.day%3===0)addRes({serum:1});
  {const tr=act(g).find(u=>fxOf(u).traitor&&u.san<40&&!teamFx(g,'tameLubu','any'));if(tr&&R()<.12)g.queue.push({id:'betray',c:{u:tr.id}})}
  {const cd=teamAdd('cureDaily');if(cd){const inf=act(g).find(u=>u.inf>0);if(inf){inf.inf=0;inf.iso=0;addLog(`冰心訣化解咗 ${nm(inf)} 嘅屍毒。`)}}}
  const since=g.day-(g.chDay[g.ch]||1);
  if(g.ch<CHAPS.length&&((g.obj[stN(g,g.ch)]&&since>=MINCH)||since>=MAXCH||(stN(g,g.ch)===3&&g.flags.schoolGone&&since>=MINCH))){
    if(!g.obj[stN(g,g.ch)])addLog(`時間唔等人，「${curChap(g).goal}」未完成，劇情繼續推進。`);
    g.ch++;g.chDay[g.ch]=g.day;addLog(`第${CNUM[g.ch-1]}章「${curChap(g).t}」開始。`);
    g.queue.push({id:'ch_card',c:{pos:g.ch}});g.queue.push({id:CHEV[stN(g,g.ch)]});sd=true;
  }
  BEATS.forEach(b=>{if(stN(g,g.ch)===b.ch&&g.day-(g.chDay[b.ch]||1)===b.off){g.queue.push({id:b.id});sd=true}});
  {const rd=raidTonight(g);if(rd){g.queue.push({id:'s_raidwarn',c:{n:rd.n}});sd=true}}
  if(g.research>=100&&!g.flags.cured){g.flags.cured=1;g.queue.push({id:'s_cured'})}
  if(g.obj[CHAPS.length]&&!g.flags.ended){g.flags.ended=1;g.queue.push({id:'end_fortress'})}
  else if(R()<(sd?.3:.6))randomEvent();
  addLog(`第 ${g.day-1} 晚：屍潮 ${horde}，防禦 ${def}，${night.ok?'守住':'失守'}。`);
  // 自動清走唔可以再做嘅工作
  act(g).forEach(u=>{if(!canWork(u,u.job))u.job='rest'});
  save();
  return{rep,night};
}
const MINCH=4,MAXCH=12;
/* 章節次序：贏過一局可以亂數（g.order）。g.ch 係第幾章（日數同難度跟佢），stN 係嗰一章講緊邊個故事（CHAPS 編號） */
function stN(g,pos){return g.order?g.order[pos-1]:pos}
function curChap(g){return CHAPS[stN(g,g.ch)-1]}
function posOf(g,n){return g.order?g.order.indexOf(n)+1:n}
function reached(g,n){if(!g.order||!n||n<=1)return (n||0)<=g.ch;const i=g.order.indexOf(n);return i<0?n<=g.ch:i<g.ch}
function checkObj(){
  CHAPS.forEach(c=>{if(reached(G,c.n)&&!G.obj[c.n]&&c.ok(G)){G.obj[c.n]=1;let t=addRes({...c.r,bat:(c.r.bat||0)+900});if(c.gear){const it=rollItem(c.gear);addItem(it);t+=`、${c.gear} 裝備「${ITEMS[it].n}」`}addLog(`完成第${CNUM[posOf(G,c.n)-1]}章目標「${c.goal}」：${t}（包括十連抽禮物 900 電池）`);toast(`第${CNUM[posOf(G,c.n)-1]}章完成！送你十連抽電池 900　${t}`)}});
  checkAch();
}

function autoAssign(){
  const A=act(G).filter(u=>!u.crit&&!u.iso);act(G).forEach(u=>u.job='rest');
  const free=new Set(A.filter(u=>u.sta>=25||u.inf));
  const take=j=>{let b=null,v=-1;free.forEach(u=>{const e=eff(u,j);if(e>v&&canWork(u,j)){v=e;b=u}});if(b&&v>0){b.job=j;free.delete(b)}return b};
  const hurtN=act(G).filter(u=>u.inj||u.crit||u.sick||u.hp<maxHp(u)*.7).length;
  const fortLow=G.fort<fortMax(G)*.5;
  if(A.length>=3)take('cook');
  if(hurtN||reached(G,7))take('medic');
  if(reached(G,7)&&A.length>=6)take('medic');
  take('guard');
  if(fortLow)take('repair');
  take('scav');
  let f=forecast(G);
  while(free.size&&f.def<f.hi){if(!take('guard'))break;f=forecast(G)}
  if(free.size>=2)take('scav');
  if(!fortLow&&(G.fort<fortMax(G)*.8||G.proj!=='fort'))take('repair');
  if(free.size)take('patrol');
  [...free].forEach(u=>{u.job=bestJob(u);if(!canWork(u,u.job))u.job='rest'});
  act(G).forEach(u=>{if(u.sta<25&&!u.inf)u.job='rest'});
}

function canMove(g){return Object.keys(BASES).filter(k=>k!==g.base&&!BASES[k].start&&(g.clear[k]||0)>=100&&reached(g,LOCS.find(l=>l.id===k).ch))}
function relocate(id){
  const g=G,old=BS(g),b=BASES[id],prev=g.base;
  const lost={food:-Math.floor(g.res.food*.25),water:-Math.floor(g.res.water*.25),parts:-Math.floor(g.res.parts*.25)};
  const lt=addRes(lost);
  g.base=id;
  FK.forEach(k=>{g.fac[k]=Math.max(k==='wall'?1:0,g.fac[k]-1)});
  g.prog={};g.proj='fort';g.fort=Math.round(fortMax(g)*.6);
  if(g.loc===id)g.loc='store';
  if(LOCS.find(l=>l.id===prev))g.dep[prev]=.2;
  act(g).forEach(u=>{u.sta=Math.max(0,u.sta-20)});
  const room=bedCap(g)-beds(g);
  g.units.filter(u=>!u.act&&!u.op).slice(0,Math.max(0,room)).forEach(u=>{u.act=true;u.job=bestJob(u)});
  let over=beds(g)-bedCap(g);
  if(over>0)[...act(g)].reverse().forEach(u=>{if(over>0&&!u.inf&&!u.iso&&!isAnimal(u)){u.act=false;over--}});
  addLog(`由${old.n}搬到${b.n}。`);
  return `大家連夜搬去${b.n}。帶唔晒嘅嘢只好留低（${lt||'冇損失'}）。\n設施拆唔走，要喺新地方重新起，每樣跌 1 級。\n${b.pd}\n床位：${bedCap(g)}`;
}
