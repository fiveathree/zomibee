/* ================= 成就獎章、致敬劇本 ================= */
/* 劇本專屬裝備 */
Object.assign(ITEMS,{
 peachsword:{n:'桃木劍',slot:'weapon',w:3,k:'sword',r:'SSR',job:{guard:.35},def:6,aff:['s_mao','s_zhongkui','r_tang'],d:'義莊劇本：斬殭屍專用'},
 inkline:{n:'墨斗線',slot:'tool',w:1,k:'walkie',r:'SSR',job:{guard:.15,patrol:.25},d:'義莊劇本：彈一條線，屍都過唔到'},
 shotgun:{n:'泵動式散彈槍',slot:'weapon',w:8,k:'rifle',r:'SSR',job:{guard:.5},def:8,aff:['r_dale','c_frank','c_david'],d:'洋館劇本：近距離一槍清場'},
 herbmix:{n:'混合草藥',slot:'tool',w:1,k:'med',r:'SSR',job:{medic:.45},d:'洋館劇本：紅綠草藥撈埋，即刻見效'},
 hellrune:{n:'地獄火符文甲',slot:'armor',w:9,k:'suit',r:'UR',job:{guard:.3},def:10,bite:.4,risk:.5,d:'地獄魔窟：暗金級戰利品'},
 soulgem:{n:'靈魂寶石',slot:'tool',w:1,k:'bino',r:'UR',job:{guard:.15,scav:.25,patrol:.25},loot:.3,d:'地獄魔窟：封住惡魔嘅寶石'},
 staticradio:{n:'雜訊收音機',slot:'tool',w:2,k:'walkie',r:'SSR',job:{patrol:.4},risk:.75,d:'霧鎮劇本：怪物行近就會沙沙聲'},
 gasmask:{n:'防毒面具',slot:'armor',w:3,k:'arm',r:'SSR',bite:.5,risk:.75,d:'孢子城劇本：唔好吸入孢子'},
 warrig:{n:'改裝戰車',slot:'tool',w:0,k:'pack',r:'SSR',job:{scav:.3},loot:.6,risk:.8,d:'末日公路：V8 引擎，車頭焊住尖刺'}
});
['peachsword','inkline','shotgun','herbmix','hellrune','soulgem','staticradio','gasmask','warrig'].forEach(k=>ITEM_BY_R[ITEMS[k].r].push(k));
/* 致敬劇本（原創故事，風格參考經典遊戲同電影） */
const SCRIPTS=[
 {id:'x_yizhuang',n:'劇本 · 義莊驚魂',genre:'港產殭屍片風',bonus:['宗','鬼'],dg:.45,loot:{bat:1.4,med:.8,food:.6},mortal:{risk:1.4,san:7},items:['inkline','peachsword','armguard'],prize:'peachsword',
  st:['城郊義莊入面排滿棺材，每副都貼住黃符。今晚有幾張符，被風吹甩咗。','啲殭屍伸直雙手跳出嚟，閉氣就睇唔到你。糯米、墨斗、黑狗血——師傅教落嘅嘢全部用得著。','天光雞啼，最後一隻殭屍倒返入棺材。你喺神枱下面搵到師傅留低嘅法器。']},
 {id:'x_mansion',n:'劇本 · 洋館驚魂',genre:'生化恐怖風',bonus:['軍','醫'],dg:.55,loot:{ammo:1.6,med:1.4,bat:1},mortal:{risk:1.2,san:5},items:['herbmix','shotgun','pistol'],prize:'shotgun',
  st:['山上有座洋館，屬於「天穹製藥」嘅前主席。大堂地板上有一串血腳印，通往二樓。','書房嘅暗格打開，入面係一個地下實驗室。玻璃缸入面浸住嘅嘢，仲識得郁。','實驗室自毀倒數開始。你哋喺最後一刻衝出洋館，帶走咗研究資料同武器。']},
 {id:'x_hell',n:'劇本 · 地獄魔窟',genre:'暗黑刷寶風',bonus:['宗','神','魔'],dg:.62,loot:{core:1,bat:2},mortal:{risk:1.5,san:8},items:['hellrune','soulgem','assault','vest','chainsaw','katana'],prize:'soulgem',
  st:['教堂地下有條石級，一路向下，牆上嘅火把自己燒起。第一層，屍群入面混住長角嘅嘢。','第五層。每殺一隻精英怪，地上就跌出一堆發光嘅裝備。你哋開始明白點解有人會一直落去。','最底層，魔王倒低嗰刻，成個魔窟震動。地上嘅暗金光芒，係你哋見過最靚嘅戰利品。']},
 {id:'x_fog',n:'劇本 · 霧鎮',genre:'心理恐怖風',bonus:['宗','鬼','仙'],dg:.5,loot:{bat:1.6,med:1},mortal:{risk:1.3,san:10},items:['staticradio','torch','medkit'],prize:'staticradio',
  st:['公路盡頭有個被濃霧包住嘅小鎮。路牌寫住「歡迎回來」，但你哋從來冇嚟過。','警報聲一響，四周嘅牆壁剝落，露出鏽鐵同血跡。收音機嘅雜訊越嚟越大聲。','霧散咗。原來每個人喺霧入面見到嘅，都係自己最驚嘅嘢。行出嚟嘅人，好似輕鬆咗。']},
 {id:'x_spore',n:'劇本 · 孢子城',genre:'末日求生風',bonus:['醫','軍'],dg:.55,loot:{food:1.2,water:1.2,parts:1,med:1},mortal:{risk:1.2,san:5},items:['gasmask','medkit','bat'],prize:'gasmask',
  st:['舊城區嘅地底長滿真菌，空氣入面飄住孢子。呢度嘅感染者頭殼裂開，靠聲音搵人。','你哋屏住呼吸，一步一步行過「咔嗒怪」身邊。一個細路由櫃入面望住你哋。','喺廢棄醫院頂樓，你哋搵到一份研究：有人對孢子免疫。佢叫你哋帶住呢個秘密走。']},
 {id:'x_road',n:'劇本 · 末日公路',genre:'公路廢土風',bonus:['西','軍'],dg:.5,loot:{parts:1.8,ammo:1.2,water:.8},mortal:{risk:1.2,san:4},items:['warrig','crowbar','shotgun','leather'],prize:'warrig',
  st:['城外嘅高速公路變成沙漠。改裝車隊喺路上追逐，搶水同汽油。','車隊首領戴住骷髏面具，佢嘅戰車後面拖住一整隊喪屍做「誘餌」。','你哋搶到首領嘅戰車，喺沙塵暴入面衝返城。車頭嘅尖刺仲掛住佢面具。']}
];
SCRIPTS.forEach(d=>{d.ch=0;d.dun=1;d.script=1;DUNS.push(d);DUNBYID[d.id]=d});
/* 副本階段獎勵：劇本用自己嘅裝備 */
{const ds=EV.dun_stage,fx0=ds.opts[0].fx;ds.opts[0].fx=c=>{const d=DUNBYID[c.d];if(!d.script)return fx0(c);
  if(c.s===0)return `入口搵到：${addRes({bat:100})}`;
  if(c.s===1){const it=pick(d.items);addItem(it);return `搵到：${ITEMS[it].r} 裝備「${ITEMS[it].n}」`}
  addItem(d.prize);addLog(`完成劇本「${d.n}」。`);checkAch();return `劇本完成！\n${ITEMS[d.prize].r} 裝備「${ITEMS[d.prize].n}」\n${addRes({bat:400,core:3})}`};
 const t0=ds.txt;ds.txt=c=>{const d=DUNBYID[c.d];return d.script?`【${d.n}】（${d.genre}）${['第一幕','第二幕','終幕'][c.s]}\n\n${d.st[c.s]}`:t0(c)};}
EV.script_open={story:1,t:'新劇本',pre:c=>DUNBYID[c.d]?c:null,txt:c=>{const d=DUNBYID[c.d];return `解鎖獎章「${ACHBY[c.a].n}」，收到一段奇怪嘅無線電：

「${d.n.replace('劇本 · ','')}」——${d.genre}。

已經可以喺搜括地點揀。${d.bonus.map(f=>FA[f]).join('、')}陣營去有加成；普通人去受傷風險 ×${d.mortal.risk}、每次意志 -${d.mortal.san}。完成可以攞「${ITEMS[d.prize].n}」。`},opts:[{l:'記低',fx:c=>`「${DUNBYID[c.d].n}」已解鎖。`}]};

/* 成就獎章 */
const ownCount=k=>(G.inv[k]||0)+G.units.filter(u=>u.eq&&Object.values(u.eq).includes(k)).length;
const ACH=[
 {id:'k100',n:'第一滴血',d:'累計擊退 100 隻喪屍',ok:g=>g.kills>=100,r:{bat:200}},
 {id:'k1000',n:'千屍斬',d:'累計擊退 1,000 隻喪屍',ok:g=>g.kills>=1000,r:{bat:500},gear:'SR',unlock:'x_yizhuang'},
 {id:'k5000',n:'屍山血海',d:'累計擊退 5,000 隻喪屍',ok:g=>g.kills>=5000,r:{bat:800,core:3},gear:'SSR'},
 {id:'k15000',n:'萬屍之王',d:'累計擊退 15,000 隻喪屍',ok:g=>g.kills>=15000,r:{bat:1000,core:5},gear:'UR'},
 {id:'d8',n:'第一個禮拜',d:'撐到第 8 日',ok:g=>g.day>=8,r:{bat:200,food:10}},
 {id:'d30',n:'一個月',d:'撐到第 30 日',ok:g=>g.day>=30,r:{bat:500},unlock:'x_spore'},
 {id:'d60',n:'六十日',d:'撐到第 60 日',ok:g=>g.day>=60,r:{bat:800},gear:'SSR'},
 {id:'d100',n:'百日求生',d:'撐到第 100 日',ok:g=>g.day>=100,r:{bat:1500},gear:'UR'},
 {id:'safe15',n:'一個都唔可以少',d:'第 15 日之前冇人死',ok:g=>g.day>=15&&!Object.values(g.gone).some(x=>x.dead&&x.d<15),r:{bat:400,med:5}},
 {id:'p10',n:'人多好辦事',d:'據點同時有 10 人',ok:g=>act(g).length>=10,r:{bat:300}},
 {id:'p20',n:'大家庭',d:'據點同時有 20 人',ok:g=>act(g).length>=20,r:{bat:600},gear:'SSR'},
 {id:'ur1',n:'傳奇降臨',d:'招募第一個 UR 傳奇',ok:g=>Object.keys(g.dex).some(id=>CH[id]&&CH[id].g==='UR'),r:{bat:300}},
 {id:'ur4',n:'傳奇集結',d:'招募 4 個 UR 傳奇',ok:g=>Object.keys(g.dex).filter(id=>CH[id]&&CH[id].g==='UR').length>=4,r:{bat:600},gear:'SSR'},
 {id:'dex40',n:'倖存者名冊',d:'圖鑑收集 40 個角色',ok:g=>Object.keys(g.dex).length>=40,r:{bat:900}},
 {id:'dexall',n:'全員集合',d:'圖鑑收集全部角色',ok:g=>CH_RAW.every(r=>g.dex[r[0]]),r:{bat:2000},gear:'UR'},
 {id:'set1',n:'套裝覺醒',d:'集齊第一套專屬套裝',ok:g=>g.units.some(u=>setOf(u)),r:{bat:500},unlock:'x_hell'},
 {id:'gear20',n:'裝備控',d:'擁有 20 款唔同裝備',ok:g=>Object.keys(ITEMS).filter(ownCount).length>=20,r:{bat:400},gear:'SSR'},
 {id:'dun1',n:'副本初探',d:'完成任何一個副本或者劇本',ok:g=>DUNS.some(d=>(g.clear[d.id]||0)>=100),r:{bat:400},unlock:'x_road'},
 {id:'dun5',n:'劇本收藏家',d:'完成 5 個副本或者劇本',ok:g=>DUNS.filter(d=>(g.clear[d.id]||0)>=100).length>=5,r:{bat:1000},gear:'UR'},
 {id:'move',n:'喬遷之喜',d:'第一次搬據點',ok:g=>g.base!=='store'&&g.base!=='mall'&&g.base!=='tenement',r:{bat:300,parts:15}},
 {id:'wall5',n:'銅牆鐵壁',d:'圍牆升到 5 級',ok:g=>g.fac.wall>=5,r:{bat:400,parts:20}},
 {id:'fac',n:'設施齊全',d:'每種設施都至少 1 級',ok:g=>FK.every(k=>g.fac[k]>=1),r:{bat:400}},
 {id:'mut',n:'非人類',d:'出現第一個變種人',ok:g=>g.units.some(u=>u.mut),r:{bat:300},unlock:'x_fog'},
 {id:'faction4',n:'陣營之力',d:'同一陣營有 4 人喺據點',ok:g=>synList().some(x=>x.n>=4),r:{bat:400}},
 {id:'sjob',n:'專業人士',d:'有人做緊 S 級工作',ok:g=>act(g).some(u=>isS(u,u.job)),r:{bat:150}},
 {id:'food200',n:'豐衣足食',d:'同時囤積 200 食物',ok:g=>g.res.food>=200,r:{bat:300}},
 {id:'cure',n:'奇蹟',d:'完成解藥研究',ok:g=>!!g.flags.cured,r:{serum:3},gear:'SSR',unlock:'x_mansion'},
 {id:'hunters',n:'人禍終結',d:'擊退獵人幫或者同佢哋講掂數',ok:g=>!!g.flags.raidWon,r:{bat:300,ammo:15}},
 {id:'king',n:'弒王者',d:'攻破屍王地宮',ok:g=>(g.clear.dungeon||0)>=100,r:{bat:1000,core:5},gear:'UR'},
 {id:'end',n:'末日堡壘',d:'撐過屍潮之夜，完成故事',ok:g=>!!g.flags.finalWon,r:{bat:2000}}
];
const ACHBY={};ACH.forEach(a=>ACHBY[a.id]=a);
function checkAch(){
  if(!G)return;G.ach=G.ach||{};const got=[];
  ACH.forEach(a=>{
    if(G.ach[a.id]||!a.ok(G))return;
    G.ach[a.id]=G.day;let t=addRes(a.r);
    if(a.gear){const it=rollItem(a.gear);addItem(it);t+=(t?'、':'')+`${a.gear} 裝備「${ITEMS[it].n}」`}
    if(a.unlock&&!G.dun[a.unlock]){G.dun[a.unlock]=1;G.queue.push({id:'script_open',c:{d:a.unlock,a:a.id}});t+=`、解鎖「${DUNBYID[a.unlock].n}」`}
    addLog(`獲得獎章「${a.n}」：${t}`);got.push(a.n);
  });
  if(got.length)toast(`獲得獎章：${got.join('、')}`);
}
function rAch(){
  G.ach=G.ach||{};const n=ACH.filter(a=>G.ach[a.id]).length;
  $('#main').innerHTML=`<div class="secth"><h2>成就獎章</h2><span class="muted type">${n}/${ACH.length}</span></div>
  <p class="muted" style="margin:0 0 12px;max-width:62ch">達成條件就會自動頒發獎章同獎勵。部分獎章會解鎖致敬經典遊戲同電影風格嘅原創劇本。完成每一章都會額外送 900 電池（一次十連）。</p>
  <div class="achs">${ACH.map(a=>{const d=G.ach[a.id];const rw=[Object.keys(a.r).map(k=>`${RES[k].n} ${a.r[k]}`).join('、'),a.gear?`${a.gear} 裝備`:'',a.unlock?`劇本「${DUNBYID[a.unlock].n.replace('劇本 · ','')}」`:''].filter(Boolean).join('、');
    return `<div class="ach ${d?'got':''}"><div class="medal">${d?'★':'☆'}</div><div style="min-width:0"><b>${esc(a.n)}</b><div class="muted" style="font-size:12px">${esc(a.d)}</div><div style="font-size:11px;color:var(--sodium2)">${d?`第 ${d} 日獲得 · `:''}獎勵：${esc(rw)}</div></div></div>`}).join('')}</div>
  <div class="secth"><h2>致敬劇本</h2></div>
  <div class="inv">${SCRIPTS.map(d=>{const on=G.dun[d.id];const a=ACH.find(x=>x.unlock===d.id);return `<div class="invi ${on?'':'off'}"><div class="row" style="justify-content:space-between"><b>${esc(d.n)}</b><span class="chip">${esc(d.genre)}</span></div><div style="font-size:12px">${on?`${(G.clear[d.id]||0)>=100?'✓ 已完成':'進度 '+Math.round(G.clear[d.id]||0)+'%'} · 加成：${d.bonus.map(f=>FA[f]).join('、')}`:`解鎖條件：獎章「${esc(a.n)}」（${esc(a.d)}）`}</div></div>`}).join('')}</div>`;
}
function render(){renderHead();({base:rBase,crew:rCrew,radio:rRadio,log:rLog,menu:rMenu,ach:rAch})[VIEW]();showPop()}
