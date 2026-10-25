/* ================= 據點網絡：補給線、互相支援、游擊隊、隊長 ================= */
MAPPOS.squad=[74,42];
const SQMAX=6;
/* ---------- 隊長技能 ---------- */
const CAPSK={
 u_lubu:{b:{str:2},n:'飛將',d:'據點防禦 +25%；做游擊隊隊長時游擊隊戰力 +40%',def:.25,squad:.4},
 u_wukong:{b:{agi:2,str:1},n:'齊天號令',d:'游擊隊戰力 +50%；據點防禦 +15%',squad:.5,def:.15},
 u_thor:{b:{str:2,wil:1},n:'雷霆號令',d:'據點防禦 +30%',def:.3},
 u_davinci:{b:{tec:3},n:'工坊總監',d:'搜括收穫 +20%；佢據點嘅補給線唔會被截',loot:.2,line:1},
 u_bride:{b:{per:2},n:'冥婚陣',d:'據點防禦 +25%，但大家見到佢會心寒（意志每日 -1）',def:.25,san:-1},
 u_chenmo:{b:{str:1,agi:1,per:1,tec:1,med:1,cok:1,wil:1},n:'宗門之主',d:'分部忠誠每日 +3；防禦 +10%；每日回復 HP +2',loy:3,def:.1,heal:2},
 u_liu:{b:{wil:2,med:1},n:'冰心訣',d:'意志每日 +3；每日回復 HP +2',san:3,heal:2},
 u_merlin:{b:{per:1,tec:1,wil:1},n:'圓桌顧問',d:'經補給線派出嘅援兵 +50%；補給線唔會被截',reinf:.5,line:1},
 u_shen:{b:{str:1,wil:2},n:'鐵血紀律',d:'防禦 +20%；分部忠誠每日 +2',def:.2,loy:2},
 u_mio:{b:{agi:2},n:'道場規矩',d:'防禦 +15%；游擊隊戰力 +25%',def:.15,squad:.25},
 u_grace:{b:{med:2},n:'防疫指揮',d:'每日回復 HP +3；意志每日 +1',heal:3,san:1},
 u_han:{b:{str:1,tec:1},n:'火場指揮',d:'防禦 +15%；每日回復 HP +2',def:.15,heal:2},
 s_ho:{b:{per:2},n:'江湖規矩',d:'分部忠誠每日 +4；補給線唔會被截',loy:4,line:1},
 s_lin:{b:{cok:3},n:'辦桌',d:'食物消耗 -20%；意志每日 +2',eat:.2,san:2},
 s_olga:{b:{tec:2},n:'電網',d:'防禦 +15%；搜括收穫 +10%',def:.15,loot:.1},
 s_hawk:{b:{per:2},n:'狙擊掩護',d:'經補給線派出嘅援兵 +40%；游擊隊戰力 +20%',reinf:.4,squad:.2},
 s_park:{b:{med:2},n:'傷員分流',d:'每日回復 HP +4',heal:4},
 s_fei:{b:{agi:2},n:'飛線',d:'補給線唔會被截；搜括收穫 +10%',line:1,loot:.1},
 s_mao:{b:{wil:2},n:'符陣',d:'防禦 +20%；意志每日 +1',def:.2,san:1},
 s_sofia:{b:{agi:1,per:1},n:'速遞網絡',d:'補給線唔會被截；搜括收穫 +10%',line:1,loot:.1},
 s_zhuge:{b:{per:1,tec:1,wil:1},n:'八陣圖',d:'防禦 +20%；經補給線派出嘅援兵 +50%',def:.2,reinf:.5},
 s_diaochan:{b:{wil:2},n:'連環計',d:'分部忠誠每日 +5；意志每日 +2',loy:5,san:2},
 s_huatuo:{b:{med:3},n:'麻沸散',d:'每日回復 HP +5',heal:5},
 s_brynhild:{b:{str:1,wil:1},n:'英靈殿',d:'游擊隊戰力 +40%；意志每日 +1',squad:.4,san:1},
 s_loki:{b:{per:2},n:'詭計',d:'搜括收穫 +25%；防禦 +5%',loot:.25,def:.05},
 x_zhaoyun:{b:{agi:2,str:1},n:'常山之龍',d:'搜括收穫 +20%；游擊隊戰力 +30%',loot:.2,squad:.3},
 x_guanyu:{b:{str:2,wil:1},n:'義薄雲天',d:'防禦 +25%；分部忠誠每日 +3',def:.25,loy:3},
 x_caocao:{b:{per:1,tec:1,wil:1},n:'唯才是舉',d:'搜括收穫 +15%；經補給線派出嘅援兵 +30%',loot:.15,reinf:.3},
 x_heimdall:{b:{per:3},n:'彩虹橋哨',d:'防禦 +15%；補給線唔會被截',def:.15,line:1},
 x_nezha:{b:{agi:2},n:'三頭六臂',d:'游擊隊戰力 +45%',squad:.45},
 x_xiebian:{b:{per:2},n:'勾魂令',d:'防禦 +15%；意志每日 +1',def:.15,san:1},
 x_xuanji:{b:{wil:2,med:1},n:'護山大陣',d:'防禦 +25%；每日回復 HP +2',def:.25,heal:2},
 x_morgana:{b:{med:2,per:1},n:'湖中秘藥',d:'每日回復 HP +4；意志每日 +1',heal:4,san:1},
 x_michel:{b:{tec:2,str:1},n:'穹頂',d:'防禦 +20%；搜括收穫 +10%',def:.2,loot:.1},
 s_zhongkui:{b:{wil:2,str:1},n:'鎮宅',d:'防禦 +20%；意志每日 +2',def:.2,san:2}
};
function capSkOf(u){return CAPSK[u.id]||null}
const buffTxt=b=>b?Object.keys(b).length>=7?`全隊員全能力 +${b.str}`:'隊員 '+Object.entries(b).map(([k,v])=>STN[k]+' +'+v).join('、'):'';
Object.values(CAPSK).forEach(s=>{s.d+='；'+buffTxt(s.b)});
function capCache(){for(const k in CAPB)delete CAPB[k];if(!G||!G.cap)return;
  Object.keys(G.cap).forEach(k=>{const u=capU(G,k);const b=u&&capSkOf(u)&&capSkOf(u).b;if(!b)return;members(G,k).forEach(m=>{const t=CAPB[m.id]=CAPB[m.id]||{};for(const s in b)t[s]=(t[s]||0)+b[s]})})}
{const _s=save;save=function(){capCache();return _s.apply(this,arguments)}}
{const _r=render;render=function(){capCache();return _r.apply(this,arguments)}}
function capGen(u){const w=stat(u,'wil');return {def:+(w*.005).toFixed(3),loy:w>=12?1:0}}
function capDesc(u){const s=capSkOf(u),g=capGen(u);return `統率：防禦 +${Math.round(g.def*100)}%${g.loy?'、分部忠誠每日 +1':''}${s?`；【${s.n}】${s.d}`:''}`}
/* ---------- 網絡 ---------- */
function netInit(g){
  g.outposts=g.outposts||{};
  if(!g.fl_ob){g.fl_ob=1;[...(g.oldBases||[]),...Object.keys(g.outposts)].forEach(k=>{g.clear[k]=Math.max(g.clear[k]||0,100)})}
  if(!g.lines)g.lines=Object.keys(g.outposts).map(id=>'base|'+id);
  g.cap=g.cap||{};if(!g.sqT)g.sqT='auto';
  const ok=k=>k==='base'||!!g.outposts[k];
  g.lines=g.lines.filter(l=>{const [a,b]=l.split('|');return ok(a)&&ok(b)&&a!==b});
  if(g.sqT!=='auto'&&!ok(g.sqT))g.sqT='auto';
}
const lineKey=(a,b)=>[a,b].sort((x,y)=>x==='base'?-1:y==='base'?1:x<y?-1:1).join('|');
function hasLine(a,b){return (G.lines||[]).includes(lineKey(a,b))}
function addLine(a,b){netInit(G);if(a===b)return false;const k=lineKey(a,b);if(G.lines.includes(k))return false;G.lines.push(k);return true}
function delLine(a,b){const k=lineKey(a,b);G.lines=(G.lines||[]).filter(x=>x!==k)}
function nbrs(g,k){return (g.lines||[]).map(l=>l.split('|')).filter(p=>p.includes(k)).map(p=>p[0]===k?p[1]:p[0])}
function hops(g,from){const d={[from]:0},q=[from];while(q.length){const k=q.shift();nbrs(g,k).forEach(n=>{if(d[n]===undefined){d[n]=d[k]+1;q.push(n)}})}return d}
function nodeName(k){return k==='base'?BS(G).n:k==='squad'?'游擊隊':BASES[k]?BASES[k].n:k}
function members(g,k){return k==='base'?act(g):opMembers(g,k)}
function capU(g,k){const id=(g.cap||{})[k];if(!id)return null;const u=g.units.find(x=>x.id===id);if(!u||isAnimal(u)||!members(g,k).includes(u)){delete g.cap[k];return null}return u}
function capFx(k,key){
  if(!G||!G.cap)return 0;const u=capU(G,k);if(!u)return 0;
  const s=capSkOf(u)||{},gn=capGen(u);return (s[key]||0)+(gn[key]||0);
}
function isCap(u){if(!G||!G.cap)return false;return Object.entries(G.cap).some(([k,id])=>id===u.id&&members(G,k).includes(u))}
/* ---------- 每日模擬（覆寫分部模擬） ---------- */
function simOutposts(g,H,L){
  netInit(g);
  const ids=Object.keys(g.outposts),SQ=opMembers(g,'squad');
  H(ids.length||SQ.length?'據點網絡':'人心');
  // 主據點隊長：意志、回血、慳糧
  {const A=act(g),s=capFx('base','san'),h=capFx('base','heal'),e=capFx('base','eat');
   if(s)allSan(s);if(h)A.forEach(u=>u.hp=Math.min(maxHp(u),u.hp+h));
   if(e>0){const back=Math.round(A.reduce((t,u)=>t+fxOf(u).eat,0)*e);if(back){addRes({food:back});L(`${nm(capU(g,'base'))}（隊長）慳返 ${back} 份食物`,'g')}}}
  const st={};
  ids.forEach(id=>{
    const o=g.outposts[id],b=BASES[id],loc=LOCS.find(l=>l.id===id);o.stock=o.stock||{};
    opMembers(g,id).forEach(u=>{if(!u.inf)return;u.inf--;if(u.inf===0){if(R()<mutChance(u)){const m=mutate(u);L(`${b.n}：${nm(u)} 冇屍變，變成咗變種人（${m.n}）`,'y')}else{killUnit(u,`喺${b.n}分部屍變。`);L(`${b.n}：${nm(u)} 屍變咗`,'b');o.loy=Math.max(0,o.loy-8)}}});
    const M=opMembers(g,id);
    if(!M.length){o.last='冇人駐守';st[id]={empty:1};return}
    const roles=opRoles(M),by={};roles.forEach(x=>(by[x.j]=by[x.j]||[]).push(x.u));
    const pw=((by.scav||[]).reduce((s,u)=>s+apt(u,'scav')*condMult(u)*suitM(u,id),0)+(by.patrol||[]).reduce((s,u)=>s+apt(u,'patrol')*.5*suitM(u,id),0))*(1+capFx(id,'loot'));
    const gd=(by.guard||[]).reduce((s,u)=>s+apt(u,'guard')*condMult(u)*suitM(u,id),0)+M.reduce((s,u)=>s+stat(u,'str')*.15,0);
    const md=(by.medic||[]).reduce((s,u)=>s+apt(u,'medic'),0),ck=(by.cook||[]).reduce((s,u)=>s+apt(u,'cook'),0);
    const got={},ll=loc?loc.loot:{food:1,water:1};
    for(const r in ll){if(r==='serum')continue;const n=Math.round(pw/10*ll[r]*(LSCALE[r]||1)*.5*rf(.6,1.3));if(n>0)got[r]=n}
    for(const r in (b.perk||{}))got[r]=(got[r]||0)+b.perk[r];
    const eat=Math.ceil(M.reduce((s,u)=>s+fxOf(u).eat,0)*(ck>=10?.75:1)*(1-capFx(id,'eat')));
    const net={food:(got.food||0)-eat,water:(got.water||0)-M.length};delete got.food;delete got.water;
    // 先用自己存貨
    ['food','water'].forEach(r=>{if(net[r]<0&&o.stock[r]>0){const t=Math.min(-net[r],o.stock[r]);o.stock[r]-=t;net[r]+=t}});
    const need=opNeed(id),have=M.filter(u=>!isAnimal(u)).length;
    const hz=hordeBase(g)*.28*(b.horde||1)*rf(.7,1.3)*(have<need?1+.3*(need-have):1);
    const def=(b.wall*.4+gd+(b.def||0))*(1+capFx(id,'def'));
    st[id]={o,b,M,roles,md,got,net,hz,def,help:0,notes:[],sup:{}};
  });
  const live=ids.filter(id=>st[id]&&!st[id].empty);
  // ---------- 補給：唔夠嘅經補給線向附近據點攞 ----------
  const lineSafe=(a,b)=>capFx(a,'line')>0||capFx(b,'line')>0;
  live.forEach(id=>{
    const s=st[id];
    ['food','water'].forEach(r=>{
      if(s.net[r]>=0)return;
      const d=hops(g,id),order=Object.keys(d).filter(k=>k!==id).sort((a,b)=>d[a]-d[b]);
      for(const k of order){
        if(s.net[r]>=0)break;
        let have=k==='base'?g.res[r]:(st[k]&&!st[k].empty?Math.max(0,st[k].net[r]):0);
        if(have<=0)continue;
        let t=Math.min(-s.net[r],have);
        if(k==='base')g.res[r]-=t;else st[k].net[r]-=t;
        // 截劫：每段路 4%，有補給線隊長就安全
        if(!lineSafe(id,k)&&R()<.04*d[k]){const lost=Math.ceil(t*.4);t-=lost;s.notes.push(`${nodeName(k)}送嚟嘅${RES[r].n}半路被截咗 ${lost}`)}
        s.net[r]+=t;s.sup[k]=(s.sup[k]||'')+`${RES[r].n} ${t} `;
      }
    });
    const sup=Object.entries(s.sup);
    if(sup.length)s.notes.push(sup.map(([k,v])=>`${nodeName(k)}經補給線送嚟 ${v.trim()}`).join('、'));
  });
  // ---------- 夜晚：防守唔夠嘅據點，鄰近據點派人協防 ----------
  const fc=forecast(g);
  const N={base:{def:fc.def,hz:fc.horde,help:0}};live.forEach(id=>N[id]={def:st[id].def,hz:st[id].hz,help:0});
  let mainOut=0;
  // 游擊隊
  const sqFit=SQ.filter(u=>!u.crit&&!u.iso);
  let sq=null;
  if(sqFit.length){
    const sp=sqFit.reduce((s,u)=>s+apt(u,'guard')*condMult(u)+stat(u,'str')*.3,0)*(1+capFx('squad','squad')+capFx('squad','def'));
    let tgt=g.sqT;
    if(tgt==='auto'||!N[tgt])tgt=Object.keys(N).reduce((a,k)=>(N[k].hz/Math.max(1,N[k].def+N[k].help))>(N[a].hz/Math.max(1,N[a].def+N[a].help))?k:a,'base');
    N[tgt].help+=Math.round(sp);sq={tgt,sp:Math.round(sp)};
  }
  // 鄰近援兵：由最危險嗰個開始
  const helpLog=[];
  Object.keys(N).sort((a,b)=>(N[b].hz-N[b].def)-(N[a].hz-N[a].def)).forEach(k=>{
    let need=N[k].hz*1.1-N[k].def-N[k].help;if(need<=0)return;
    nbrs(g,k).forEach(n=>{
      if(need<=0||!N[n])return;
      const spare=N[n].def-N[n].hz*1.15;if(spare<=0)return;
      const send=Math.round(Math.min(need,spare*.5*(1+capFx(n,'reinf')+capFx(k,'reinf'))));if(send<1)return;
      N[n].def-=send;N[k].help+=send;need-=send;if(n==='base')mainOut+=send;
      helpLog.push(`${nodeName(n)} 派人經補給線去 ${nodeName(k)} 協防（+${send}）`);
    });
  });
  // ---------- 結算各分部 ----------
  live.forEach(id=>{
    const s=st[id],{o,b,M,roles,md,got,net}=s;
    const short=net.food<0||net.water<0;
    const odef=N[id].def+N[id].help;
    if(s.hz>odef*1.5&&R()<.45){opFall(g,id,L);return}
    if(s.hz>odef){const v=pick(M);const d=hurt(v,ri(10,25));s.notes.push(`夜晚被屍群衝擊，${nm(v)} 受傷（-${d}）`);o.loy=Math.max(0,o.loy-4);if(R()<.12){const t=infect(v,b.n);if(t)s.notes.push(t)}}
    else if(N[id].help&&s.hz>N[id].def)s.notes.push('靠援兵守住咗');
    const heal=3+md*.4+capFx(id,'heal'),sn=capFx(id,'san');
    M.forEach(u=>{u.hp=Math.min(maxHp(u),u.hp+heal);u.sta=cl(u.sta+8,0,100);if(u.inj&&R()<.15+md*.01)u.inj=0;if(u.crit&&md>=10)u.crit=0;sanD(u,(short?-6:1)+sn)});
    if(short){o.loy=Math.max(0,o.loy-6);s.notes.push(nbrs(g,id).length?'補給線都運唔到夠嘢，分部捱餓':'冇補給線，冇人接濟，分部捱餓')}else o.loy=Math.min(100,o.loy+1);
    o.loy=cl(o.loy+capFx(id,'loy'),0,100);
    if(o.loy<30)s.notes.push('忠誠度好低');
    // 剩餘物資：連得返主據點就運返去，否則留喺分部
    const out={...got};if(net.food>0)out.food=net.food;if(net.water>0)out.water=net.water;
    const toBase=hops(g,id).base!==undefined;
    let stTxt='';
    if(toBase){for(const r in o.stock)if(o.stock[r]>0){out[r]=(out[r]||0)+o.stock[r];o.stock[r]=0}stTxt=addRes(out);stTxt=stTxt?'運返 '+stTxt:'冇剩'}
    else{for(const r in out)o.stock[r]=Math.min(60,(o.stock[r]||0)+out[r]);stTxt='未連到主據點，物資存喺分部'}
    const who=roles.map(x=>`${nm(x.u)}${JOBS[x.j].n}`).join('、');
    o.last=`${who}。${stTxt}${s.notes.length?'；'+s.notes.join('；'):''}`;
    L(`${b.n}（${M.length}人，忠誠 ${o.loy}${capU(g,id)?'，隊長 '+nm(capU(g,id)):''}）：${o.last}`,short||s.notes.some(t=>/受傷|捱餓|被截|屍變|忠誠/.test(t))?'b':'g');
    M.forEach(u=>{if(u.hp<=0){killUnit(u,`喺${b.n}分部傷重不治。`);L(`${b.n}：${nm(u)} 傷重不治`,'b')}});
    const r=R();
    if(r<.06)g.queue.push({id:'op_trade',c:{op:id}});
    else if(r<.11)g.queue.push({id:'op_help',c:{op:id}});
    else if(r<.15)g.queue.push({id:'op_raid',c:{op:id}});
    else if(r<.19){const it=rollItem(pick(['C','R','R','SR']));addItem(it);L(`${b.n}執到一件${ITEMS[it].n}（${ITEMS[it].r}）送返嚟`,'g')}
    if(o.loy<35&&R()<.35&&opMembers(g,id).length)g.queue.push({id:'op_rebel',c:{op:id}});
  });
  siteDecay(g,L);
  helpLog.forEach(t=>L(t,'g'));
  // ---------- 游擊隊 ----------
  if(SQ.length){
    let fed=true;const eat=SQ.length;
    if(g.res.food>=eat&&g.res.water>=eat){g.res.food-=eat;g.res.water-=eat}else{fed=false;g.res.food=Math.max(0,g.res.food-eat);g.res.water=Math.max(0,g.res.water-eat)}
    const sh=capFx('squad','heal'),sn=capFx('squad','san');
    SQ.forEach(u=>{u.hp=Math.min(maxHp(u),u.hp+4+sh);u.sta=cl(u.sta+6,0,100);sanD(u,(fed?0:-4)+sn)});
    if(sq){
      const n=N[sq.tgt],tight=n.hz>(n.def+n.help)*.8;let t=`游擊隊（${sqFit.length}人${capU(g,'squad')?'，隊長 '+nm(capU(g,'squad')):''}）去 ${nodeName(sq.tgt)} 協防（+${sq.sp}）`;
      if(tight){const v=pick(sqFit);if(R()<.35){const d=hurt(v,ri(8,20));t+=`，惡戰中 ${nm(v)} 受傷（-${d}）`;if(R()<.06){const x=infect(v,'游擊戰');if(x)t+='；'+x}}else t+='，打得好辛苦但冇人受傷'}
      if(!fed)t+='；補給唔夠，隊員餓住打';
      g.sqAt=sq.tgt;g.sqLast=t;L(t,tight?'y':'g');
    }else{g.sqAt=null;g.sqLast='全隊傷兵，今晚休息';L('游擊隊全隊傷兵，今晚休息','y')}
    SQ.forEach(u=>{if(u.hp<=0){killUnit(u,'喺游擊戰中陣亡。');L(`${nm(u)} 喺游擊戰中陣亡`,'b')}});
  }else g.sqAt=null;
  // 主據點收到嘅援兵（減去派出）
  return N.base.help-mainOut;
}
/* ---------- 同陣形友好、據點適合陣形 ---------- */
const BASE_FA={store:'港台',mall:'港韓日',tenement:'港鬼',market:'廚港',estate:'港寵',hardware:'藝西',clinic:'醫',police:'軍',metro:'鬼港',school:'韓日',barracks:'軍三',lab:'醫西',train:'韓華',bunker:'軍西魔',prison:'三西',hospital:'醫宗',fortress:'仙神遊'};
function faOf(u){return CH[u.id].fa||[]}
function sameFa(a,b){const fb=faOf(b);return faOf(a).some(f=>fb.includes(f))}
function friendsAt(g,u,k){return members(g,k).filter(x=>x!==u&&sameFa(u,x))}
function cohesion(g,k){const M=members(g,k).filter(x=>!isAnimal(x));if(M.length<2)return {pairs:0,c:0};let p=0,w=0;M.forEach((u,i)=>{let f=0;M.forEach((x,j)=>{if(i!==j&&sameFa(u,x)){f=1;if(j>i)p++}});w+=f});return {pairs:p,c:w/M.length}}
function baseKeyId(k){return k==='base'?G.base:k}
function suitFa(id){return [...(BASE_FA[id]||'')]}
function suits(u,k){const s=suitFa(baseKeyId(k));return faOf(u).some(f=>s.includes(f))}
function suitM(u,k){return suits(u,k)?1.15:1}
/* 主據點：適合嘅陣形工作效率 +15% */
{const _eff=eff;eff=function(u,j){const v=_eff(u,j);return u&&u.act&&G&&G.base&&suits(u,'base')?v*1.15:v}}
/* 爭執：同陣形嘅人好少嗌交 */
{const q=EV.quarrel,_p=q.pre;q.pre=c=>{for(let i=0;i<5;i++){const r=_p(c);if(!r)return null;if(!sameFa(uOf(r.a),uOf(r.b)))return r}return R()<.2?_p(c):null}}
/* 反骨：身邊有兩個或以上同陣形朋友，大多會打消念頭 */
{const b=EV.betray,_p=b.pre;b.pre=c=>{const r=_p(c);if(!r)return null;const u=uOf(r.u);if(u&&friendsAt(G,u,'base').length>=2&&R()<.65)return null;return r}}
/* 分部叛變：團結嘅分部好難反 */
{const b=EV.op_rebel,_p=b.pre;b.pre=c=>{const r=_p(c);if(!r)return null;const co=cohesion(G,r.op).c;return R()<co*.6?null:r}}
/* 每日：友好、適合據點 → 意志；分部團結 → 忠誠 */
function bondDaily(g,L){
  const keys=['base',...Object.keys(g.outposts||{}),'squad'];let n=0,s=0;
  keys.forEach(k=>{
    members(g,k).forEach(u=>{let d=0;if(friendsAt(g,u,k).length)d+=1;if(k!=='squad'&&suits(u,k))d+=1;if(d){sanD(u,d);if(friendsAt(g,u,k).length)n++;if(k!=='squad'&&suits(u,k))s++}});
    if(k!=='base'&&k!=='squad'){const o=g.outposts[k],co=cohesion(g,k).c;if(o&&co>=.5)o.loy=Math.min(100,o.loy+(co>=.8?2:1))}
  });
  if(n||s)L(`${n?`${n} 人身邊有同陣形朋友`:''}${n&&s?'，':''}${s?`${s} 人住喺適合自己陣形嘅據點`:''}，意志回升`,'g');
}
{const _so=simOutposts;simOutposts=function(g,H,L){const r=_so(g,H,L);bondDaily(g,L);return r}}
{const _e=endDay;endDay=function(){capCache();return _e.apply(this,arguments)}}
/* ================= 介面 ================= */
let LINKFROM=null;
function capBtn(k){const u=capU(G,k);const sk=u&&capSkOf(u);return `<button class="capb ${u?'':'none'}" data-cap="${k}" title="${u?esc(capDesc(u)):'揀一個隊長：高意志有統率加成，強角有隊長技能'}">♛ ${u?`<span class="rn ${CH[u.id].g}">${esc(nm(u).split(' ')[0])}</span>${sk?`<em>${esc(sk.n)}</em>`:''}`:'揀隊長'}</button>`}
function linkBtn(k){return `<button class="lnkb ${LINKFROM===k?'on':''}" data-link="${k}" title="拉補給線：拖去另一個據點，或者撳一下再撳另一個據點">⛓</button>`}
function linksRow(k){const n=nbrs(G,k);return `<div class="mn-links muted">補給線：${n.length?n.map(x=>esc(nodeName(x))).join('、'):'未有'}</div>`}
function nodeChips(k){
  const s=suitFa(baseKeyId(k)),M=members(G,k),fit=M.filter(u=>suits(u,k)).length,co=cohesion(G,k);
  const isOp=k!=='base'&&G.outposts[k],need=isOp?opNeed(k):0,have=isOp?M.filter(u=>!isAnimal(u)).length:0,idle=(G.idle||{})[k];
  return `<div class="mn-c">${isOp?`<span class="chip ${have<need?'bad':''}" title="${have<need?'人手唔夠：今晚屍群壓力大增，有機會淪陷':'人手足夠'}">人手 ${have}/${need}</span>`:''}${idle?`<span class="chip bad" title="冇人駐守，${IDLE_LOST} 日會被喪屍重新佔據">無人 ${idle}/${IDLE_LOST} 日</span>`:''}${s.length?`<span class="chip" title="呢類陣形嘅人喺度工作效率 +15%、意志每日 +1">宜：${s.map(f=>FA[f]).join('、')}${fit?` · ${fit}人`:''}</span>`:''}${co.pairs?`<span class="chip good" title="同陣形嘅人一齊：少啲嗌交、意志每日 +1；分部更忠誠、難叛變">友好 ${co.pairs} 對</span>`:''}</div>`;
}
function nodeCenter(city,k){const m=city.querySelector(`.mnode[data-key="${k}"]`);if(!m)return null;const n=m.querySelector('.mk-i')||m,r=n.getBoundingClientRect(),c=city.getBoundingClientRect();return [r.left+r.width/2-c.left,r.top+r.height/2-c.top]}
function drawNet(){
  const city=document.querySelector('.city');if(!city)return;const svg=city.querySelector('.netsvg'),xl=city.querySelector('.netx');if(!svg)return;
  const W=city.clientWidth,H=city.clientHeight;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  let h='',x='';
  (G.lines||[]).forEach(l=>{const [a,b]=l.split('|'),p=nodeCenter(city,a),q=nodeCenter(city,b);if(!p||!q)return;
    const safe=capFx(a,'line')>0||capFx(b,'line')>0;
    h+=`<line class="lnbg" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/><line class="ln ${safe?'safe':''}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
    x+=`<button class="lnx" data-del="${l}" style="left:${(p[0]+q[0])/2}px;top:${(p[1]+q[1])/2}px" title="拆走 ${esc(nodeName(a))} ↔ ${esc(nodeName(b))} 補給線${safe?'（有隊長護送，唔會被截）':''}">✕</button>`});
  if(G.sqAt&&opMembers(G,'squad').length){const p=nodeCenter(city,'squad'),q=nodeCenter(city,G.sqAt);if(p&&q)h+=`<line class="ln sql" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`}
  svg.innerHTML=h+'<line class="ln tmp" id="lntmp" x1="0" y1="0" x2="0" y2="0" style="display:none"/>';xl.innerHTML=x;
  xl.querySelectorAll('[data-del]').forEach(b=>b.onclick=e=>{e.stopPropagation();const [a,c]=b.dataset.del.split('|');delLine(a,c);save();render();toast(`拆咗 ${nodeName(a)} ↔ ${nodeName(c)} 補給線`)});
}
function toggleLine(a,b){
  if(a==='squad'||b==='squad'){toast('游擊隊唔使補給線，佢自己會去協防');return}
  if(hasLine(a,b)){delLine(a,b);toast(`拆咗 ${nodeName(a)} ↔ ${nodeName(b)} 補給線`)}else{addLine(a,b);toast(`拉咗補給線：${nodeName(a)} ↔ ${nodeName(b)}`)}
  save();render();
}
function bindNet(){
  const city=document.querySelector('.city');if(!city)return;
  if(LINKFROM){city.classList.add('linking');const n=city.querySelector(`.mnode[data-key="${LINKFROM}"]`);if(n)n.classList.add('linksrc')}
  city.addEventListener('click',e=>{
    if(!LINKFROM)return;const n=e.target.closest('.mnode[data-key]');
    e.stopPropagation();e.preventDefault();
    const from=LINKFROM;LINKFROM=null;
    if(n&&n.dataset.key!==from)toggleLine(from,n.dataset.key);else render();
  },true);
  document.querySelectorAll('[data-link]').forEach(b=>b.onpointerdown=e=>{
    if(e.button>0)return;e.stopPropagation();e.preventDefault();
    const from=b.dataset.link;if(LINKFROM){LINKFROM=null;render();return}
    const p=nodeCenter(city,from),cr=city.getBoundingClientRect(),tl=city.querySelector('#lntmp');let moved=false,hov=null;
    const sx=e.clientX,sy=e.clientY;
    const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<6)return;moved=true;ev.preventDefault();
      if(tl&&p){tl.style.display='';tl.setAttribute('x1',p[0]);tl.setAttribute('y1',p[1]);tl.setAttribute('x2',ev.clientX-cr.left);tl.setAttribute('y2',ev.clientY-cr.top)}
      const el=document.elementFromPoint(ev.clientX,ev.clientY),n=el&&el.closest('.mnode[data-key]');
      if(hov&&hov!==n)hov.classList.remove('hover');hov=n&&n.dataset.key!==from?n:null;if(hov)hov.classList.add('hover')};
    const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);
      if(hov)hov.classList.remove('hover');if(tl)tl.style.display='none';
      if(moved){if(hov)toggleLine(from,hov.dataset.key);return}
      LINKFROM=from;render();toast('撳另一個據點連接（或者拆走）補給線；再撳 ⛓ 取消')};
    addEventListener('pointermove',mv,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up);
  });
  document.querySelectorAll('[data-cap]').forEach(b=>{b.onpointerdown=e=>e.stopPropagation();b.onclick=e=>{e.stopPropagation();if(LINKFROM)return;openCap(b.dataset.cap)}});
  const ss=$('#sqsel');if(ss){ss.onpointerdown=e=>e.stopPropagation();ss.onchange=()=>{G.sqT=ss.value;save();toast(ss.value==='auto'?'游擊隊每晚自動去最危險嘅據點':`游擊隊今晚起駐守 ${nodeName(ss.value)}`)}}
  const ra=$('#allres');if(ra){let armed=false;ra.onclick=()=>{if(!armed){armed=true;ra.textContent='再撳一次確認';ra.classList.add('danger');return}releaseAll()}}
  const ja=$('#bulkjoin');if(ja)ja.onclick=()=>openBulk();
}
function openCap(k){
  const M=members(G,k).filter(u=>!isAnimal(u)),cur=capU(G,k);
  const sorted=[...M].sort((a,b)=>(!!capSkOf(b)-!!capSkOf(a))||RANK.indexOf(CH[a.id].g)-RANK.indexOf(CH[b.id].g)||stat(b,'wil')-stat(a,'wil'));
  modal(`<div class="modal dismiss"><div class="eyebrow">${esc(nodeName(k))} · 揀隊長</div>
    <p class="muted" style="margin:0;font-size:12px">隊長意志越高，統率加成越大。強角有專屬隊長技能，仲會幫成隊人加能力。${k==='squad'?'':'游擊隊、各據點可以各自有一個隊長。'}</p>
    <div class="stack" style="gap:6px;max-height:60vh;overflow:auto">${sorted.map(u=>{const c=CH[u.id],s=capSkOf(u);return `<button class="eqpick ${cur===u?'worn':''}" data-pick="${u.id}"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b class="rn ${c.g}">${cur===u?'♛ ':''}${esc(nm(u))}</b><span class="muted type" style="font-size:12px">意志 ${stat(u,'wil')}</span></div>
      <div style="font-size:12px">${s?`<b style="color:var(--sodium2)">【${esc(s.n)}】</b>${esc(s.d)}`:`<span class="muted">統率：防禦 +${Math.round(capGen(u).def*100)}%${capGen(u).loy?'、分部忠誠每日 +1':''}</span>`}</div></button>`}).join('')||'<p class="muted">呢度冇人可以做隊長。</p>'}</div>
    <div class="row">${cur?'<button class="btn sm" id="capx">取消隊長</button>':''}<button class="btn pri sm" id="cx" style="margin-left:auto">關閉</button></div></div>`,()=>{
    $('#cx').onclick=closeOv;const x=$('#capx');if(x)x.onclick=()=>{delete G.cap[k];save();closeOv()};
    document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{G.cap[k]=b.dataset.pick;save();closeOv();const u=uOf(b.dataset.pick),s=capSkOf(u);toast(`${nm(u)} 做咗${nodeName(k)}隊長${s?`【${s.n}】`:''}`)});
  });
}
/* ---------- 一鍵全部放後備 / 一鍵加入 ---------- */
function releaseAll(){
  let n=0,stay=0;
  G.units.forEach(u=>{if(u.act){if(u.inf||u.iso){stay++;return}u.act=false;unequipAll(u);u.job='rest';u.op=null;n++}else if(u.op){u.op=null;n++}});
  G.cap={};save();render();toast(`${n} 人返咗後備名單${stay?`（${stay} 個感染者要留喺主據點隔離）`:''}。記得加返人入主據點，否則過夜會自動補人`);
}
function bulkDests(){
  const d=[{k:'base',n:BS(G).n+'（主據點）',free:()=>bedCap(G)-beds(G)}];
  Object.keys(G.outposts).forEach(id=>d.push({k:id,n:BASES[id].n+'（分部）',free:()=>BASES[id].beds-opMembers(G,id).filter(x=>!isAnimal(x)).length}));
  d.push({k:'squad',n:'游擊隊',free:()=>SQMAX-opMembers(G,'squad').length});
  return d;
}
function openBulk(){
  let dest='base',fa=new Set(),skip=new Set();
  const draw=()=>{
    const Rs=reserveFree(G),D=bulkDests(),dd=D.find(x=>x.k===dest)||D[0];
    const facs={};Rs.forEach(u=>faOf(u).forEach(f=>facs[f]=(facs[f]||0)+1));
    const sf=dest==='squad'?[]:suitFa(baseKeyId(dest));
    const pool=Rs.filter(u=>!fa.size||faOf(u).some(f=>fa.has(f))).sort((a,b)=>(suits(b,dest)-suits(a,dest))*(dest==='squad'?0:1)||RANK.indexOf(CH[a.id].g)-RANK.indexOf(CH[b.id].g));
    let room=dd.free();const go=[];pool.forEach(u=>{if(skip.has(u.id))return;if(dest==='base'&&isAnimal(u)){go.push(u);return}if(room>0){go.push(u);room--}});
    modal(`<div class="modal dismiss" style="width:min(640px,100%)"><div class="eyebrow">一鍵分配全部人</div>
      <p class="muted" style="margin:0;font-size:12px">由頭分配晒所有人：主據點、分部、游擊隊，連工作、裝備、隊長同補給線都會自動搞掂。感染者會留喺主據點。</p>
      <div class="distg">${Object.keys(DIST).map(k=>`<button class="distb" data-dist="${k}"><b>${DIST[k].n}</b><span>${DIST[k].d}</span></button>`).join('')}</div>
      <div class="eyebrow" style="margin-top:6px">或者自己揀 · 一鍵加入</div>
      <div class="bulkbar"><div><span>去</span><b>${esc(nodeName(dest))}</b><em>空位 ${Math.max(0,dd.free())}</em></div><div><span>陣形</span><b>${fa.size?[...fa].map(f=>esc(FA[f])).join('、'):'全部'}</b>${fa.size&&[...fa].every(f=>sf.includes(f))?'<em class="ok">適合呢度</em>':''}</div><div><span>人數</span><b>${go.length}</b><em>人</em></div></div>
      <div class="lbl">去邊度</div><div class="chips">${D.map(x=>`<button class="chip ${x.k===dest?'pk':''}" data-dest="${x.k}">${esc(x.n)} · 空位 ${Math.max(0,x.free())}</button>`).join('')}</div>
      ${sf.length?`<p class="muted" style="margin:0;font-size:12px">呢度適合：${sf.map(f=>FA[f]).join('、')}（綠框陣形；效率 +15%、意志 +1）</p>`:''}
      <div class="lbl">揀陣形（可以揀多個）</div><div class="chips"><button class="chip ${fa.size?'':'pk'}" data-fa="all">全部 · ${Rs.length}</button>${Object.keys(facs).sort((a,b)=>facs[b]-facs[a]).map(f=>`<button class="chip ${fa.has(f)?'pk':''} ${sf.includes(f)?'fit':''}" data-fa="${f}">${FA[f]} · ${facs[f]}</button>`).join('')}</div>
      <div class="lbl">會加入（撳人可以剔走）</div>
      <div class="mn-t" style="max-height:38vh;overflow:auto">${pool.map(u=>`<button class="bpick ${go.includes(u)?'':'off'}" data-skip="${u.id}">${crewTok(u).replace('<button class="ctok"','<span class="ctok"').replace(/<\/button>$/,'</span>')}</button>`).join('')||'<span class="muted">後備名單冇呢個陣形嘅人</span>'}</div>
      <div class="row"><button class="btn sm" id="cx">取消</button><button class="btn pri" id="bgo" style="margin-left:auto" ${go.length?'':'disabled'}>${go.length} 人加入${esc(nodeName(dest))}</button></div></div>`,()=>{
      $('#cx').onclick=closeOv;
      document.querySelectorAll('[data-dist]').forEach(b=>b.onclick=()=>{const r=autoDistribute(b.dataset.dist);closeOv();toast(`${DIST[b.dataset.dist].n}完成：主據點 ${r.main} 人${r.ops.length?'、'+r.ops.join('、'):''}${r.sq?`、游擊隊 ${r.sq}`:''}${r.res?`，後備 ${r.res}`:''}`)});
      document.querySelectorAll('[data-dest]').forEach(b=>b.onclick=()=>{dest=b.dataset.dest;skip.clear();draw()});
      document.querySelectorAll('[data-fa]').forEach(b=>b.onclick=()=>{const f=b.dataset.fa;if(f==='all')fa.clear();else fa.has(f)?fa.delete(f):fa.add(f);skip.clear();draw()});
      document.querySelectorAll('[data-skip]').forEach(b=>b.onclick=()=>{const id=b.dataset.skip;skip.has(id)?skip.delete(id):skip.add(id);draw()});
      $('#bgo').onclick=()=>{go.forEach(u=>{if(dest==='base'){u.act=true;u.op=null;u.job=bestJob(u)}else{u.act=false;u.op=dest;u.job='rest'}});save();closeOv();toast(`${go.length} 人加入咗${nodeName(dest)}`)};
    });
  };
  draw();
}

/* ================= 人手、淪陷、無人駐守嘅場地會被重新佔據 ================= */
const IDLE_LOST=7,IDLE_WARN=4;
function opNeed(id){return Math.max(1,Math.ceil(BASES[id].beds/4))}
function opFall(g,id,L){
  const b=BASES[id],M=opMembers(g,id);let dead=[];
  M.forEach(u=>{u.op=null;u.job='rest';const d=hurt(u,ri(10,30));if(u.hp<=0||(!isAnimal(u)&&R()<.12)){dead.push(u)}});
  dead.forEach(u=>killUnit(u,`${b.n}分部淪陷時犧牲。`));
  delete g.outposts[id];if(g.cap)delete g.cap[id];g.clear[id]=50;g.idle&&delete g.idle[id];
  if(g.oldBases)g.oldBases=g.oldBases.filter(k=>k!==id);
  L(`💀 ${b.n}分部守唔住，淪陷咗！${M.length-dead.length} 人帶傷撤返後備${dead.length?`，${dead.map(nm).join('、')} 犧牲`:''}。（清場度跌返 50%）`,'b');
  addLog(`${b.n}分部淪陷。`);
}
function siteIdle(g,k){return k!==g.base&&(g.clear[k]||0)>=100&&!(g.outposts&&g.outposts[k]&&opMembers(g,k).some(u=>!isAnimal(u)))}
function siteDecay(g,L){
  g.idle=g.idle||{};
  Object.keys(BASES).forEach(k=>{
    if(!siteIdle(g,k)){delete g.idle[k];return}
    const d=g.idle[k]=(g.idle[k]||0)+1,n=BASES[k].n;
    if(d===IDLE_WARN)L(`${n}無人駐守 ${d} 日，開始有喪屍遊蕩返入去（再過 ${IDLE_LOST-d} 日會被重新佔據）`,'y');
    if(d>=IDLE_LOST){g.clear[k]=60;delete g.idle[k];if(g.outposts&&g.outposts[k]){opMembers(g,k).forEach(u=>u.op=null);delete g.outposts[k]}if(g.oldBases)g.oldBases=g.oldBases.filter(x=>x!==k);L(`${n}無人駐守太耐，已經被喪屍重新佔據（清場度跌返 60%）`,'b');addLog(`${n}被喪屍重新佔據。`)}
  });
}
/* 候選地點只計仍然清場嘅；舊據點搬走時當清場 100% */
function opCands(g){return Object.keys(BASES).filter(k=>k!==g.base&&!(g.outposts||{})[k]&&(g.clear[k]||0)>=100)}
{const _rel=relocate;relocate=function(id){const prev=G.base;const r=_rel(id);G.clear[prev]=Math.max(G.clear[prev]||0,100);return r}}

/* ================= 還原位置：全部地點放返地圖原本位置 ================= */
function arrangeMap(){
  netInit(G);G.mapPos={};G.mapFix={};
}
/* ================= 一鍵分配全部人 ================= */
const DIST={
  bal:{n:'均衡分配',d:'主據點按工種揀齊人，分部守到一半以上，游擊隊 3 人，剩低嘅人全部派去分部'},
  main:{n:'主據點優先',d:'最強嘅人全部留喺主據點，分部只派最低人手，冇游擊隊'},
  def:{n:'守衛型',d:'分部派到七成人手、揀最識打嘅人；游擊隊滿 6 人，邊度危險去邊度'},
  fa:{n:'按陣形分配',d:'每個據點優先派適合佢嘅陣形，同陣形嘅人盡量放埋一齊'}
};
function autoDistribute(mode){
  netInit(G);
  const inf=G.units.filter(u=>u.act&&(u.inf||u.iso));
  G.units.forEach(u=>{if(inf.includes(u))return;if(u.act){u.act=false;unequipAll(u)}u.op=null;u.job='rest'});
  G.cap={};
  let pool=G.units.filter(u=>!inf.includes(u)&&!isAnimal(u));
  const pets=G.units.filter(u=>isAnimal(u)&&!inf.includes(u));
  const power=u=>ST.reduce((s,k)=>s+stat(u,k),0)+(4-RANK.indexOf(CH[u.id].g))*8;
  const take=u=>{pool=pool.filter(x=>x!==u);return u};
  const ops=Object.keys(G.outposts);
  const opT=id=>{const b=BASES[id].beds;return mode==='main'?opNeed(id):mode==='def'?Math.max(opNeed(id),Math.ceil(b*.7)):Math.max(opNeed(id),Math.ceil(b*.5))};
  const sqN=mode==='def'?SQMAX:mode==='main'?0:3;
  const hold=ops.reduce((s,id)=>s+opT(id),0)+sqN;
  const room=bedCap(G)-beds(G);
  const mainN=Math.max(0,Math.max(Math.min(room,6),Math.min(room,pool.length-hold)));
  // 主據點：先揀齊工種
  const jobScore=(u,j)=>canWork({...u,crit:0,iso:0},j)?apt(u,j)*(fxOf(u).job[j]||1)*(mode==='fa'&&suits(u,'base')?1.3:1):-1;
  const main=[];
  for(const j of ['guard','cook','medic','repair','scav','patrol','guard','scav']){if(main.length>=mainN||!pool.length)break;const u=pool.reduce((a,b)=>jobScore(b,j)>jobScore(a,j)?b:a);main.push(take(u))}
  pool.sort((a,b)=>(mode==='fa'?(suits(b,'base')-suits(a,'base'))*50:0)+power(b)-power(a));
  while(main.length<mainN&&pool.length)main.push(take(pool[0]));
  main.forEach(u=>{u.act=true;u.op=null;u.job=bestJob(u)});
  pets.forEach(u=>{u.act=true;u.op=null;u.job=bestJob(u)});
  // 游擊隊：最識打
  const fight=u=>apt(u,'guard')+stat(u,'str');
  pool.sort((a,b)=>fight(b)-fight(a));
  for(let i=0;i<sqN&&pool.length;i++){const u=take(pool[0]);u.op='squad'}
  // 分部：輪流揀
  const cnt=id=>opMembers(G,id).length;
  const score=(u,id)=>(mode==='fa'||mode==='bal'?(suits(u,id)?40:0):0)+(mode==='fa'?opMembers(G,id).filter(x=>sameFa(x,u)).length*15:0)+(mode==='def'?fight(u)*2:power(u));
  const fill=lim=>{let moved=true;while(moved&&pool.length){moved=false;for(const id of ops){if(!pool.length)break;if(cnt(id)>=lim(id))continue;const u=pool.reduce((a,b)=>score(b,id)>score(a,id)?b:a);take(u).op=id;moved=true}}};
  fill(opT);
  if(mode==='bal'||mode==='fa')fill(id=>BASES[id].beds);
  // 隊長
  const capScore=u=>(capSkOf(u)?100:0)+stat(u,'wil');
  ['base',...ops,'squad'].forEach(k=>{const M=members(G,k).filter(u=>!isAnimal(u));if(M.length)G.cap[k]=M.reduce((a,b)=>capScore(b)>capScore(a)?b:a).id});
  ops.forEach(id=>{if(hops(G,id).base===undefined)addLine('base',id)});
  capCache();
  autoAssign();const eqn=autoEquip();
  save();
  return {main:act(G).length,ops:ops.map(id=>`${BASES[id].n} ${cnt(id)}`),sq:opMembers(G,'squad').length,res:reserveFree(G).length,eqn};
}

/* ================= 水資源 ================= */
Object.assign(MAPPOS,{reservoir:[6,34],bottling:[72,6],desal:[96,60]});
Object.assign(BASE_FA,{reservoir:'港華',bottling:'台日',desal:'西軍'});
Object.assign(LOCITEM,{reservoir:['spear','pack'],bottling:['toolbox','crowbar'],desal:['firesuit','walkie','toolbox']});
/* 分部天台水箱：每個有人駐守嘅分部每日 +2 水 */
{const _so=simOutposts;simOutposts=function(g,H,L){const n=Object.keys(g.outposts||{}).filter(id=>opMembers(g,id).length).length;if(n)g.res.water+=n*2;return _so(g,H,L)}}
/* 水車商人：水少、食物多嗰陣會出現 */
EV.water_trade={w:3,t:'水車商人',pre:()=>G.res.water<Math.max(10,act(G).length*2)&&G.res.food>=20?{}:null,
 txt:()=>`一架舊消防車停喺門口，車上嘅人揚一揚手：「我哋喺山上有水源，一車水換你啲食物，點話？」\n\n而家：食物 ${G.res.food}、水 ${G.res.water}`,
 opts:[
  {l:'20 食物 → 15 水',req:()=>G.res.food>=20,fx:()=>addRes({food:-20,water:15})},
  {l:'40 食物 → 32 水',req:()=>G.res.food>=40,fx:()=>addRes({food:-40,water:32})},
  {l:'10 零件 → 12 水',req:()=>G.res.parts>=10,fx:()=>addRes({parts:-10,water:12})},
  {l:'唔換',fx:()=>'水車開走咗，揚起一陣塵。'}]};
