/* ================= 事件 ================= */
const CHEV={2:'s_train',3:'s_school',4:'s_herb',5:'s_evolve',6:'s_hunters',7:'s_cure'};
const BEATS=[{ch:1,off:3,id:'s_bridge'},{ch:2,off:3,id:'s_trainnews'}];
const able=()=>act(G).filter(u=>!u.crit&&!u.iso);
const scavPow=u=>apt(u,'scav')*condMult(u)*(fxOf(u).job.scav||1);
const bestTalker=(fn,f)=>bestBy(fn,u=>talker(u)&&(!f||f(u)));
function recruitText(id,why){
  const r=addUnit(G,id);const c=CH[id];
  if(r.type==='new')return `${c.n}（${c.g}·${c.job}）加入${r.u.act?'據點':'後備名單（床位唔夠）'}。${why||''}`;
  if(r.type==='star')return `${c.n} 再次聯絡上，突破到 ${r.u.star} 星。`;
  if(r.type==='dead'){addRes({bat:40});return `……可惜，佢已經唔喺度。（電池 +40）`}
  addRes({bat:60});return `${c.n} 已經滿星。（電池 +60）`;
}
function randomRecruit(grades){
  const pool=CH_RAW.filter(r=>grades.includes(r[2])&&!CH[r[0]].tr.includes('animal')&&!G.units.some(u=>u.id===r[0])&&!(G.gone[r[0]]&&G.gone[r[0]].dead)).map(r=>r[0]);
  return pool.length?pick(pool):null;
}
function rescueSchool(){
  const A=able();if(A.length<2)return null;
  const top=[...A].sort((a,b)=>scavPow(b)-scavPow(a)).slice(0,2);
  const pw=(scavPow(top[0])+scavPow(top[1]))*rf(.8,1.25);
  if(pw>=22){
    G.flags.rescued=1;
    const t1=recruitText('r_rin'),t2=recruitText('c_ng');
    addLog(`${top.map(nm).join('同')}由後樓梯殺上中學天台，救返啲學生。`);
    return `${top.map(nm).join('同')}由消防梯爬上天台，清走樓梯口嘅喪屍。\n\n一個綁馬尾、揸住木刀嘅女仔企喺最前面，身後有十幾個學生。\n\n${t1}\n${t2}\n其他學生跟住老師去咗避難中心。（電池 +80）`+(addRes({bat:80}),'');
  }
  const v=pick(top);const d=hurt(v,ri(15,30));
  return `樓梯間太多喪屍，${top.map(nm).join('同')}被逼撤退。${nm(v)} 受傷（-${d} HP）。\n天台嘅反光仲喺度閃緊……可能過兩日再試。`;
}
const EV={
 /* ---------- 劇情 ---------- */
 s_intro:{story:1,t:'第一章 · 爆發',txt:()=>`十月某個星期五，港灣市冇預兆咁淪陷。

先係急症室爆滿，跟住地鐵停駛，到半夜，成條彌敦道都係尖叫聲。

你同幾個陌生人一路逃一路避，身後嘅尖叫聲越嚟越近。前面有幾個地方仲可以躲。

收音機斷斷續續咁講：「……唔好出街……唔好俾佢哋咬到……」

【點玩】每日喺「據點」幫每個倖存者揀工作。每個人嘅數值決定佢擅長做咩（S 最好，D 最差）。撳「結束今日」之後會結算白天、晚飯同夜晚屍潮。
用電池喺「廣播」招募更多倖存者。撐落去，跟住劇情行。

你哋要喺邊度過第一晚？`,opts:['store','mall','tenement'].map(k=>({l:BASES[k].n,d:`${BASES[k].d} 床位 ${BASES[k].beds}、圍牆 ${BASES[k].wall}。${BASES[k].pd}`,fx:()=>{G.base=k;G.fort=Math.round(fortMax(G)*.8);G.units.forEach((u,i)=>u.act=i<bedCap(G));addLog(`喺${BASES[k].n}落腳。`);return `你哋拉實${BASES[k].z.guard[0]}，喺${BASES[k].n}入面點算物資。
幾箱罐頭、幾支水、一個急救箱。
仲有一部收音機同一大袋電池——用嚟廣播，或者會有人聽到。

清場其他地點之後，可以搬去更大更好守嘅據點。`}}))},
 s_bridge:{story:1,t:'封橋',txt:()=>`收音機傳嚟消息：政府封鎖咗跨海大橋同所有隧道，「為咗控制疫情」。

聽講橋頭聚集咗幾千人，軍隊喺另一邊。`,opts:[
  {l:'派最快嗰個去橋頭睇吓',d:'可能有收穫，有風險',req:()=>able().length>0,fx:()=>{const u=bestTalker(scavPow);if(R()<.6){addRes({bat:120,food:4});return `${nm(u)} 喺橋頭見到軍隊開槍。佢冇停留，喺棄置嘅車入面執咗啲嘢返嚟。\n電池 +120、食物 +4\n「冇人會嚟救我哋。」佢講。`}const d=hurt(u,ri(15,25));return `橋頭一片混亂。${nm(u)} 喺人群中被推跌，受傷返嚟（-${d} HP）。\n「冇人會嚟救我哋。」`}},
  {l:'留守，繼續聽收音機',fx:()=>{allSan(-3);return '收音機一直重複同一段錄音。大家都知道佢想講乜。\n全隊意志 -3'}}]},
 s_train:{story:1,t:'第二章 · 南下列車',txt:()=>`緊急廣播：「明早七點，中央車站會開出最後一班南下列車，前往南方安全區。名額有限。」

有人即刻開始執嘢。有人話車站一定擠爆，去就係送死。

【新地點】警署、地鐵站已經可以搜括。`,opts:[
  {l:'派一個人去車站探路',req:()=>able().length>0,fx:()=>{const u=bestTalker(scavPow);let t=`${nm(u)} 天未光就出發。\n\n車站已經失守。月台上面有一卡卡車廂，入面有嘢喺度撞玻璃。\n佢喺站長室搵到隧道地圖同一盒子彈。\n電池 +100、彈藥 +6`;addRes({bat:100,ammo:6});if(R()<.35){const d=hurt(u,ri(12,24));t+=`\n返嚟途中受傷（-${d} HP）`}return t}},
  {l:'大家投票決定',fx:()=>{const b=bestTalker(u=>stat(u,'wil'));if(b&&stat(b,'wil')>=14){allSan(4);return `${nm(b)} 企出嚟：「我哋有牆、有食物、有彼此。出面乜都冇。」\n投票結果：留低。大家好似定咗啲。\n全隊意志 +4`}allSan(-6);return '投票結果一半一半。最後大家都留低，但氣氛好差。\n全隊意志 -6'}},
  {l:'當聽唔到',fx:()=>{allSan(-4);return '你熄咗收音機。冇人再提過列車。\n全隊意志 -4'}}]},
 s_trainnews:{story:1,t:'列車上的消息',txt:()=>`夜晚，你一個人聽收音機，收到一段斷斷續續嘅求救：

「……南下列車……車廂入面有人屍變……我哋鎖咗門……安全區……冇回應……」

之後就係雜音。

其他人仲未知。`,opts:[
  {l:'話俾大家知',fx:()=>{const c=teamFx(G,'calm','any');allSan(c?-5:-10);G.flags.truth=1;return `大家聽完都好靜。有人喊咗出嚟。\n${c?'但隊長拍拍佢膊頭：「起碼我哋知道真相。」':''}\n全隊意志 ${c?-5:-10}`}},
  {l:'收埋唔講',d:'而家冇事，之後可能會穿煲',fx:()=>{G.flags.hid=1;return '你熄咗收音機。聽朝大家問有冇新消息，你搖頭。'}}]},
 s_school:{story:1,t:'第三章 · 學園默示錄',txt:()=>`對面中學嘅天台，有人用鏡反光打訊號。三短、三長、三短。

用望遠鏡睇過去，天台上面有十幾個着校服嘅學生，最前面有個女仔揸住一把木刀。

樓梯口已經被喪屍塞滿。

【新地點】對面中學已經可以搜括。`,opts:[
  {l:'組隊救援（派兩個最好嘅搜括手）',d:'需要至少 2 個可以出動嘅人',req:()=>able().length>=2,fx:()=>rescueSchool()},
  {l:'用無線電教佢哋點樣自己落嚟',fx:()=>{if(R()<.5){G.flags.rescued=1;return `你用摩斯密碼教佢哋由後面消防梯落嚟。\n佢哋做到。\n\n${recruitText('r_rin')}\n${recruitText('c_ng')}`}allSan(-8);return '佢哋試咗……但喺三樓被截住。之後天台再冇反光。\n全隊意志 -8'}},
  {l:'我哋自身難保',fx:()=>{allSan(-10);return '你拉埋窗簾。\n嗰晚冇人講嘢。\n全隊意志 -10'}}]},
 s_herb:{story:1,t:'第四章 · 生死草',txt:()=>`一段韓語廣播，由一位自稱歷史學者嘅人播出：

「……歷史博物館嘅朝鮮王朝特展……《疫屍錄》……記載咗一場宮廷疫症，同一種叫『生死草』嘅植物……令死人復生……佢哋同而家一模一樣……」

廣播突然中斷。

【新地點】歷史博物館已經可以搜括。搜括一次就有機會搵到《疫屍錄》。`,opts:[
  {l:'記低博物館位置',fx:()=>{const m=G.units.find(u=>u.id==='s_mao'&&u.act);return m?'茅一清聽完，沉默咗好耐：「我祖師爺嘅筆記入面，都有提過一種草。」':'你喺地圖上圈咗博物館。'}},
  {l:'呢啲鬼神之說……',fx:()=>'你半信半疑。但博物館入面，起碼有啲值錢嘢。'}]},
 codex:{story:1,t:'《疫屍錄》',txt:()=>`喺博物館地庫，玻璃櫃已經爆咗。古籍仲喺度。

泛黃嘅紙上用漢字寫住：某年宮中大疫，御醫以「生死草」救垂死世子。世子復醒，然而「不知飢飽，見人則噬」。疫由宮中蔓延至都城，最後以火焚城方止。

最後一頁，有人用硃砂寫咗一個藥方。缺咗一味藥。`,opts:[{l:'帶返據點',fx:()=>{G.flags.codex=1;checkObj();addLog('喺歷史博物館搵到《疫屍錄》。');const s=G.units.find(u=>(u.id==='u_grace'||u.id==='u_shen')&&u.act);return `《疫屍錄》到手。之後研究解藥時進度唔會減半。${s?`\n\n${nm(s)} 睇完個藥方：「缺嗰味……可能就喺我哋身上。」`:''}`}}]},
 s_evolve:{story:1,t:'第五章 · 進化',txt:()=>`今晚嘅屍潮唔同。

有啲跑得好快，好似人一樣。有一隻兩米幾高，撞凹咗捲閘。有一隻識叫，一叫就成條街嘅都湧過嚟。

天光之後，有人喺一隻變異體嘅頭殼入面，搵到一粒發住紫光嘅晶體。

【新機制】由今日起守住夜襲有機會得到晶核。晶核可以喺「倖存者」度強化角色。屍潮會明顯變大。
【新地點】軍營已經可以搜括。`,opts:[{l:'研究呢粒晶核',fx:()=>{addRes({core:1});return '晶核握喺手入面係暖嘅。\n將佢磨碎溶落水，有人飲完之後成個人精神咗。\n晶核 +1（用嚟強化倖存者）'}}]},
 s_hunters:{story:1,t:'第六章 · 人禍',txt:()=>`三架改裝貨車停喺商場門口。帶頭嗰個光頭男人自稱「雷哥」，背後十幾個人揸住槍。

「呢幾條街而家係獵人幫管。每個據點都要交保護費——一半食物，一半彈藥。四日後我哋返嚟收。唔交？我哋晚上嚟攞。」`,opts:[
  {l:'交出一半食物同彈藥',fx:()=>{G.flags.huntersMet=1;G.flags.raidDay=G.day+4;G.flags.paid=1;G.flags.raidWon=1;const f=Math.floor(G.res.food/2),a=Math.floor(G.res.ammo/2);addRes({food:-f,ammo:-a});allSan(-6);checkObj();return `你叫人搬咗物資出去。雷哥笑住拍拍你塊面。\n食物 -${f}、彈藥 -${a}、全隊意志 -6\n佢哋唔會再嚟。暫時。`}},
  {l:'同佢傾（派意志最強嗰個）',d:'成功會變盟友；失敗佢哋會更嬲',req:()=>able().some(talker),fx:()=>{G.flags.huntersMet=1;G.flags.raidDay=G.day+4;const b=bestTalker(u=>stat(u,'wil')+(fxOf(u).deal?4:0));const roll=stat(b,'wil')+(fxOf(b).deal?4:0)+rf(0,8);if(roll>=20){G.flags.allied=1;G.flags.raidWon=1;addRes({ammo:10,med:3});checkObj();return `${nm(b)} 同雷哥傾咗成個鐘。\n佢哋原來都有傷者，需要醫療人手。最後講掂：互相交換物資，互不侵犯。\n彈藥 +10、藥品 +3，獵人幫唔會夜襲。`}G.flags.angry=1;return `${nm(b)} 講到一半，雷哥一槍打爛咗門口嘅燈。\n「四日後，晚上見。」\n（四日後會有更大規模嘅夜襲）`}},
  {l:'叫佢哋滾',fx:()=>{G.flags.huntersMet=1;G.flags.raidDay=G.day+4;allSan(3);return '雷哥冇嬲，只係笑。\n「好。四日後，晚上見。」\n全隊意志 +3。四日後嘅晚上獵人幫會趁屍潮夜襲，準備好彈藥同圍牆。'}}]},
 s_raidwarn:{story:1,t:'今晚',txt:()=>`遠處傳嚟貨車引擎聲。

今晚獵人幫會趁屍潮一齊嚟。多啲人守夜，彈藥同圍牆係關鍵。`,opts:[{l:'準備迎戰',fx:()=>{allSan(2);return '大家將所有可以用嘅嘢頂住捲閘。\n全隊意志 +2'}}]},
 s_cure:{story:1,t:'第七章 · 解藥',txt:()=>`收音機收到一段英語廣播，來自城北嘅製藥廠研究所：

「……後備發電機仍然運作……實驗室資料完整……需要醫療人員……」

如果有足夠嘅醫療人手同藥品，或者可以完成解藥。

【新地點】製藥廠研究所已經可以搜括（有機會搵到血清）。
【研究】由今日起，做醫療嘅人會同時推進解藥研究，每日用 1 份藥品。完成 100% 就係結局。`,opts:[{l:'開始研究',fx:()=>{const g=G.units.find(u=>u.id==='u_grace'&&u.act);return g?'Grace 戴返副眼鏡：「俾我三個禮拜。」':'冇專家，只能夠由頭摸索。多派人做醫療會快啲。'}}]},
 labfind:{story:1,t:'研究所',txt:()=>`研究所入面仲有電。白色走廊、閃爍嘅燈、一排排凍櫃。

一部電腦仲開住，螢幕上係一份未完成嘅報告：「樣本對特定抗體有反應……」`,opts:[{l:'抄低所有資料',fx:()=>{G.flags.labData=1;return '研究資料到手。解藥研究速度 +25%。'}}]},
 end_cure:{story:1,end:'cure',t:'結局 · 黎明',txt:()=>`第一支解藥喺凌晨三點完成。

佢未必可以救返已經變咗嘅人，但可以令被咬嘅人唔再變。

你用最後嘅電池，向全城廣播藥方。

三日後，天空第一次出現直升機。`,opts:[{l:'完',fx:()=>{G.over='cure';return `你哋撐咗 ${G.day-1} 日，擊退咗 ${G.kills} 隻喪屍。\n\n喺設定可以開始新一局。`}}]},
 end_fort:{story:1,end:'fort',t:'結局 · 堡壘',txt:()=>`第六十日。

解藥未出現，救援都未出現。但你哋仲喺度。

商場變成咗一座小鎮：有菜園、有診所、有人夜晚喺天台唱歌。附近嘅倖存者開始搬過嚟。

末日冇完。但你哋已經學識喺入面生活。`,opts:[{l:'完',fx:()=>{G.over='fort';return `你哋撐咗 ${G.day-1} 日，擊退咗 ${G.kills} 隻喪屍。\n\n喺設定可以開始新一局。`}}]},
 cleared:{t:'清場完成',pre:c=>c.loc&&BASES[c.loc]&&G.base!==c.loc?c:null,txt:c=>{const b=BASES[c.loc];return `${b.n}入面最後一隻喪屍倒低咗。

呢度可以做新據點：床位 ${b.beds}（而家 ${bedCap(G)}）、基本圍牆 ${b.wall}（而家 ${BS(G).wall}）。
${b.d}
${b.pd}

搬過去要放棄約四分一帶唔走嘅物資，所有設施各跌 1 級。之後喺「據點」頁都可以隨時搬。`},opts:[
  {l:c=>`而家搬去${BASES[c.loc].n}`,fx:c=>relocate(c.loc)},
  {l:'遲啲先算',fx:()=>'你喺地圖上記低咗呢個位置。'}]},
 /* ---------- 決策 ---------- */
 bitten:{t:'被咬',pre:c=>uOf(c.u)&&uOf(c.u).inf>0?c:null,txt:c=>{const u=uOf(c.u);return isAnimal(u)?`${nm(u)} 後腿有個齒印，已經開始發黑。

佢一拐一拐咁行返嚟，伏喺你腳邊，舐住個傷口，條尾仲擺緊。

照計佢三日內會屍變。點處理？`:`${nm(u)} 手臂上有個齒印，已經開始發黑。

佢話：「我冇事……真係冇事……」

照計佢三日內會屍變。點處理？`},opts:[
  {l:'用血清',d:'消耗 1 支血清，即刻治好',req:()=>G.res.serum>0,fx:c=>{const u=uOf(c.u);G.res.serum--;u.inf=0;u.iso=0;return `血清打落去，黑色嘅血管慢慢褪色。\n${nm(u)} 得救。`}},
  {l:'搵醫生截肢',d:'需要一個醫術 14 以上、未受傷嘅人；一半機會成功',req:c=>!!bestTalker(x=>stat(x,'med'),x=>x.id!==c.u&&stat(x,'med')>=14),fx:c=>{const u=uOf(c.u),d=bestTalker(x=>stat(x,'med'),x=>x.id!==c.u&&stat(x,'med')>=14);if(R()<.5+(fxOf(d).cure?.2:0)){u.inf=0;u.crit=1;u.inj=1;u.hp=Math.max(1,Math.round(maxHp(u)*.2));return `${nm(d)} 落刀好快。\n${nm(u)} 痛到暈咗，但感染止住咗。佢而家重傷，要人照顧。`}u.crit=1;u.hp=Math.max(1,Math.round(u.hp*.5));return `太遲了，病毒已經擴散。${nm(u)} 仲受咗重傷。\n佢仍然會屍變。`}},
  {l:'隔離佢',d:'佢唔可以工作；如果屍變，唔會傷到其他人',fx:c=>{const u=uOf(c.u);u.iso=1;u.job='rest';return isAnimal(u)?`${nm(u)} 被抱入咗後倉。\n佢喺門後面嗚咗成晚。`:`${nm(u)} 自己行入咗後倉。\n佢叫大家唔好鎖門。大家都鎖咗。`}},
  {l:'趁早了斷',d:'佢會死，全隊意志大跌',fx:c=>{const u=uOf(c.u);killUnit(u,'喺屍變之前，被同伴親手了斷。');allSan(-6);return isAnimal(u)?`冇人想做，但總要有人做。\n${nm(u)} 到最後都仲望住你，條尾擺咗兩下。\n全隊意志大跌`:`冇人想做，但總要有人做。\n${nm(u)} 最後講咗句多謝。\n全隊意志大跌`}},
  {l:'相信佢會冇事',d:'佢可以繼續工作……',fx:c=>isAnimal(uOf(c.u))?`${nm(uOf(c.u))} 照舊喺據點周圍行，大家摸佢之前都會猶豫一下。`:`${nm(uOf(c.u))} 繼續做嘢，好似咩事都冇發生過。\n大家都避開佢隻手。`}]},
 breakdown:{t:'崩潰',pre:c=>uOf(c.u)?c:null,txt:c=>{const u=uOf(c.u);return isAnimal(u)?`${nm(u)} 成日縮喺角落，唔食嘢，有聲就嚇到彈起。

今朝佢不停抓門，想衝出去。`:`${nm(u)} 喺角落縮埋一嚿，不停喃喃自語。

佢突然企起身，話要出去搵屋企人。`},opts:[
  {l:'搵人安撫佢',d:'需要一個意志 12 以上嘅人',req:c=>!!bestTalker(x=>stat(x,'wil'),x=>x.id!==c.u&&stat(x,'wil')>=12),fx:c=>{const u=uOf(c.u),b=bestTalker(x=>stat(x,'wil'),x=>x.id!==c.u);u.san=35;u.bd=0;b.sta=Math.max(0,b.sta-15);return isAnimal(u)?`${nm(b)} 抱住佢坐咗成晚。\n${nm(u)} 終於喺佢懷入面瞓著咗。\n${nm(u)} 意志回升到 35`:`${nm(b)} 陪咗佢成晚。\n${nm(u)} 終於喊咗出嚟，然後瞓著咗。\n${nm(u)} 意志回升到 35`}},
  {l:'俾佢休息幾日',fx:c=>{const u=uOf(c.u);u.job='rest';if(R()<.3){leaveUnit(u,'崩潰之後，趁大家瞓著自己走咗。');return isAnimal(u)?`第二朝，${nm(u)} 由通風口鑽咗出去，冇再返嚟。`:`第二朝，${nm(u)} 個床係空嘅。\n佢走咗。`}u.san=25;u.bd=0;return isAnimal(u)?`${nm(u)} 瞓咗成日，醒咗之後肯食返嘢。`:`${nm(u)} 瞓咗成日。醒返之後冇再講要走。`}},
  {l:'由佢走',fx:c=>{const u=uOf(c.u);if(isAnimal(u)){leaveUnit(u,'跑咗出去，冇再返嚟。');return `你打開門。${nm(u)} 頭都唔回咁跑咗出去。`}const f=Math.min(G.res.food,3);addRes({food:-f});leaveUnit(u,'崩潰之後離開咗據點。');return `${nm(u)} 帶住 ${f} 份食物行咗出去。\n冇人知佢去咗邊。`}}]},
 /* ---------- 隨機 ---------- */
 visitor:{w:3,t:'門外嘅母子',txt:()=>`捲閘外面有人拍門。一個女人抱住個細路，話佢哋兩日冇食過嘢。

「求下你哋……我乜都識做……」`,opts:[
  {l:'收留佢哋',d:'食物 -3，多一個人',fx:()=>{addRes({food:-3});const id=randomRecruit(['C','R']);if(!id){allSan(3);return '佢哋入咗嚟，食完嘢之後去咗避難中心。全隊意志 +3'}return recruitText(id,'\n（個細路跟咗佢去避難中心。）')}},
  {l:'俾啲食物，叫佢哋去避難中心',d:'食物 -3',fx:()=>{addRes({food:-3});allSan(2);return '佢哋多謝完就走咗。\n全隊意志 +2'}},
  {l:'唔開門',fx:()=>{allSan(-5);return '拍門聲持續咗好耐，然後停咗。\n全隊意志 -5'}}]},
 quarrel:{w:3,t:'爭執',pre:()=>{const A=able();if(A.length<3)return null;const T=A.filter(talker);if(T.length<2)return null;const h=T.find(u=>fxOf(u).hot)||pick(T);const o=pick(T.filter(u=>u!==h));return{a:h.id,b:o.id}},txt:c=>`${nm(uOf(c.a))} 同 ${nm(uOf(c.b))} 為咗分配食物嗌到拍枱，差啲郁手。

其他人望住你。`,opts:[
  {l:c=>`撐 ${nm(uOf(c.a))}`,fx:c=>{sanD(uOf(c.a),8);sanD(uOf(c.b),-15);return `${nm(uOf(c.b))} 摔門走入房。`}},
  {l:c=>`撐 ${nm(uOf(c.b))}`,fx:c=>{sanD(uOf(c.b),8);sanD(uOf(c.a),-15);return `${nm(uOf(c.a))} 好唔服氣。`}},
  {l:'兩個都減糧一日',fx:c=>{sanD(uOf(c.a),-6);sanD(uOf(c.b),-6);addRes({food:2});return '兩個都收聲。省返 2 份食物。'}}]},
 airdrop:{w:2,t:'空投',txt:()=>`一架直升機喺上空經過，丟咗個降落傘箱落兩條街外嘅球場。

成區嘅喪屍都聽到。`,opts:[
  {l:'派最快嗰個去搶',req:()=>able().length>0,fx:()=>{const u=bestBy(scavPow);if(R()<.35*fxOf(u).risk){const d=hurt(u,ri(15,30));let t=`${nm(u)} 被一大群包圍，受傷撤退（-${d} HP）。`;if(R()<.3){const x=infect(u,'空投');if(x)t+='\n'+x}return t}const it=pick(['pistol','shield','medkit','firesuit','binoc']);addItem(it);return `${nm(u)} 搶到箱！入面有：${addRes({med:ri(3,6),ammo:ri(5,10),food:ri(4,8)})}，仲有一件${ITEMS[it].n}`}},
  {l:'唔好冒險',fx:()=>'第二朝，箱已經唔見咗。'}]},
 rain:{w:2,t:'大雨',txt:()=>'落咗成晚大雨。雨聲蓋過咗外面嘅聲音，大家難得瞓得好。',opts:[{l:'用晒所有桶裝水',fx:()=>{allSan(3);return addRes({water:4+G.fac.rain*3})+'，全隊意志 +3'}}]},
 trader:{w:2,t:'行商',txt:()=>`一個推住超市手推車嘅阿伯喺門口叫：「換嘢！換嘢！」

${teamFx(G,'deal','any')?'你哋隊入面有人識講價，條件好咗。':''}`,opts:[
  {l:()=>`5 食物 → ${teamFx(G,'deal','any')?6:4} 彈藥`,req:()=>G.res.food>=5,fx:()=>addRes({food:-5,ammo:teamFx(G,'deal','any')?6:4})},
  {l:()=>`6 零件 → ${teamFx(G,'deal','any')?4:3} 藥品`,req:()=>G.res.parts>=6,fx:()=>addRes({parts:-6,med:teamFx(G,'deal','any')?4:3})},
  {l:()=>`4 水 → ${teamFx(G,'deal','any')?90:60} 電池`,req:()=>G.res.water>=4,fx:()=>addRes({water:-4,bat:teamFx(G,'deal','any')?90:60})},
  {l:()=>`${teamFx(G,'deal','any')?6:8} 食物 → 一件隨機裝備`,req:()=>G.res.food>=(teamFx(G,'deal','any')?6:8),fx:()=>{addRes({food:-(teamFx(G,'deal','any')?6:8)});const it=pick(Object.keys(ITEMS).filter(k=>!ITEMS[k].bind&&ITEMS[k].r!=='UR'));addItem(it);return `阿伯由車底拎出一件${ITEMS[it].n}。`}},
  {l:'唔換',fx:()=>'阿伯推住車走咗，車轆吱吱聲。'}]},
 nightmare:{w:2,t:'噩夢',pre:()=>{const A=act(G).filter(talker);return A.length?{u:pick(A).id}:null},txt:c=>`${nm(uOf(c.u))} 半夜大叫醒咗。佢夢見屋企人喺門外叫佢開門。`,opts:[
  {l:'搵人陪佢傾',req:c=>act(G).length>1,fx:c=>{const b=bestTalker(x=>stat(x,'wil'),x=>x.id!==c.u);if(!b){sanD(uOf(c.u),-12);return '冇人得閒。'}b.sta=Math.max(0,b.sta-10);sanD(uOf(c.u),18);return `${nm(b)} 陪佢坐到天光。\n${nm(uOf(c.u))} 意志 +18`}},
  {l:'由佢',fx:c=>{sanD(uOf(c.u),-12);return `${nm(uOf(c.u))} 之後成日都冇講嘢。意志 -12`}}]},
 bday:{w:2,t:'生日',pre:()=>{const A=act(G).filter(talker);return A.length>2?{u:pick(A).id}:null},txt:c=>`今日係 ${nm(uOf(c.u))} 生日。佢冇講，係其他人睇到佢身份證先知。`,opts:[
  {l:'用罐頭整個蛋糕',d:'食物 -3',req:()=>G.res.food>=3,fx:c=>{addRes({food:-3});allSan(6);sanD(uOf(c.u),10);return '午餐肉疊成嘅蛋糕，插住一支蠟燭。\n全隊意志 +6'}},
  {l:'下次先算',fx:c=>{sanD(uOf(c.u),-6);return `${nm(uOf(c.u))} 笑笑口話冇所謂。`}}]},
 booze:{w:2,t:'一箱酒',txt:()=>'搜括嘅人喺貨倉搵到一整箱威士忌。',opts:[
  {l:'今晚開派對',fx:()=>{allSan(9);act(G).forEach(u=>u.sta=Math.max(0,u.sta-12));return '有人唱歌，有人喊，有人笑到碌地。\n全隊意志 +9、體力 -12'}},
  {l:'留嚟消毒傷口',fx:()=>addRes({med:3})},
  {l:'拎去換電池',fx:()=>addRes({bat:70})}]},
 hordewarn:{w:2,ch:2,t:'屍潮預警',txt:()=>'收音機傳嚟警告：一大群喪屍由東面向呢區移動，明晚會經過。',opts:[
  {l:'即刻加固圍牆',d:'零件 -5，圍牆 +15',req:()=>G.res.parts>=5,fx:()=>{addRes({parts:-5});G.fort=Math.min(fortMax(G),G.fort+15);G.warn=1.4;return '大家通宵加固。\n圍牆 +15。今晚屍潮會特別大（×1.4），記得多派人守夜。'}},
  {l:'知道，多派人守夜',fx:()=>{G.warn=1.4;return '今晚屍潮會特別大（×1.4）。'}}]},
 desert:{w:3,t:'想走',pre:()=>{const A=act(G).filter(u=>u.san<40&&!u.iso&&talker(u));return A.length&&act(G).length>2?{u:pick(A).id}:null},txt:c=>`${nm(uOf(c.u))} 執好咗背囊。

「我要去搵我屋企人。佢哋可能仲喺度。」`,opts:[
  {l:'勸佢留低',d:'派意志最強嘅人',fx:c=>{const u=uOf(c.u),b=bestTalker(x=>stat(x,'wil'),x=>x.id!==c.u);if(b&&stat(b,'wil')+rf(0,10)>=16){u.san=Math.max(u.san,45);return `${nm(b)} 同佢講咗好耐。\n${nm(u)} 放低咗背囊。`}leaveUnit(u,'執好背囊去搵屋企人。');return `勸唔到。${nm(u)} 天光就走咗。`}},
  {l:'祝佢好運',fx:c=>{const u=uOf(c.u);addRes({food:-Math.min(2,G.res.food)});leaveUnit(u,'出發去搵屋企人。');allSan(-2);return `${nm(u)} 帶咗 2 份食物出發。\n大家喺門口送佢。`}},
  {l:'鎖住佢',fx:c=>{const u=uOf(c.u);u.san=Math.max(0,u.san-20);u.job='rest';allSan(-4);return `${nm(u)} 被鎖喺房入面，喊咗成晚。\n全隊意志 -4`}}]},
 fever:{w:2,t:'發燒',pre:()=>{const A=act(G).filter(u=>!fxOf(u).noSick&&!u.sick&&talker(u));return A.length?{u:pick(A).id}:null},txt:c=>`${nm(uOf(c.u))} 發高燒，額頭燙到不得了。大家第一個諗法：係咪被咬？

檢查過，冇傷口。`,opts:[
  {l:'用藥',d:'藥品 -2',req:()=>G.res.med>=2,fx:c=>{addRes({med:-2});return `退燒藥食落去，聽朝 ${nm(uOf(c.u))} 已經冇事。`}},
  {l:'隔離休息',fx:c=>{const u=uOf(c.u);u.sick=1;u.job='rest';return `${nm(u)} 病咗，要休息幾日。`}},
  {l:'叫佢照做嘢',fx:c=>{const u=uOf(c.u);u.sick=1;const o=act(G).filter(x=>x!==u&&!fxOf(x).noSick&&R()<.4);o.forEach(x=>x.sick=1);return `${nm(u)} 帶病開工。${o.length?`${o.map(nm).join('、')} 都被傳染。`:''}`}}]},
 rooftop:{w:2,t:'天台求救',txt:()=>'附近一棟大廈嘅天台，有人揮緊件紅色衫。',opts:[
  {l:'去救',req:()=>able().length>0,fx:()=>{const u=bestBy(scavPow);if(scavPow(u)*rf(.7,1.3)>=11){addRes({bat:60});const id=R()<.6?randomRecruit(['C','R','SR']):null;return `${nm(u)} 打通咗樓梯。\n${id?recruitText(id):'天台上嘅人多謝完就自己走咗，留低一啲電池。'}\n電池 +60`}const d=hurt(u,ri(12,25));return `${nm(u)} 救唔到，自己仲受傷（-${d} HP）。`}},
  {l:'我哋幫唔到',fx:()=>{allSan(-5);return '個天台到夜晚就冇人再揮衫。\n全隊意志 -5'}}]},
 dog:{w:2,t:'一隻唐狗',pre:()=>!G.units.some(u=>u.id==='n_tofu')&&!G.gone.n_tofu?{}:null,txt:()=>'搜括嘅人返嚟，後面跟住一隻黃色唐狗，條尾不停擺。佢對住外面低聲吠咗兩聲——三秒後，轉角行出一隻喪屍。',opts:[
  {l:'收養佢',fx:()=>recruitText('n_tofu')},{l:'趕走佢',fx:()=>'唐狗喺門口坐咗一晚，第二朝走咗。'}]},
 cat:{w:2,t:'一隻黑貓',pre:()=>!G.units.some(u=>u.id==='n_kuro')&&!G.gone.n_kuro?{}:null,txt:()=>'一隻黑貓由通風口鑽咗入嚟，坐喺倉庫門口，嘴入面咬住一隻老鼠。',opts:[
  {l:'留低佢',fx:()=>recruitText('n_kuro')},{l:'放佢走',fx:()=>'黑貓望咗你一眼，自己行咗出去。'}]},
 diary:{w:2,t:'日記',txt:()=>`喺一具屍體身上搵到本日記。最後一頁寫住：

「第九日。佢哋好似識得記住邊度有人。我哋要搬。如果有人睇到呢本日記——唔好去中央車站。」`,opts:[{l:'收好',fx:()=>addRes({bat:30})}]},
 secret:{w:4,ch:3,t:'穿煲',pre:()=>G.flags.hid&&!G.flags.secretOut?{}:null,txt:()=>'有人喺收音機旁邊搵到你寫低嘅筆記：「列車屍變，安全區失聯。」\n\n大家望住你。',opts:[{l:'承認',fx:()=>{G.flags.secretOut=1;allSan(-12);return '「點解唔講？」冇人再相信你講嘅消息。\n全隊意志 -12'}}]},
 schoolRetry:{w:5,ch:3,t:'天台仲有反光',pre:()=>reached(G,3)&&!G.flags.rescued&&!G.flags.schoolGone?{}:null,txt:()=>'對面中學天台嘅反光仲喺度，但慢咗好多。',opts:[
  {l:'再救一次',req:()=>able().length>=2,fx:()=>rescueSchool()},
  {l:'放棄',fx:()=>{G.flags.schoolGone=1;allSan(-6);return '之後再冇反光。\n全隊意志 -6'}}]},
 generator:{w:2,t:'發電機壞咗',txt:()=>'據點唯一一部發電機冒煙，燈全部熄晒。',opts:[
  {l:'用零件修',d:'零件 -3',req:()=>G.res.parts>=3,fx:()=>addRes({parts:-3})+'，燈返咗'},
  {l:'摸黑過一晚',fx:()=>{allSan(-5);return '成晚漆黑，每個聲音都好似喺門外。\n全隊意志 -5'}}]},
 neighbor:{w:2,ch:2,t:'隔籬據點',txt:()=>'無線電接通咗兩條街外另一個據點。對方話有個人想過嚟，佢嗰邊食物唔夠。',opts:[
  {l:'接佢過嚟',d:'食物 -4',req:()=>G.res.food>=4,fx:()=>{addRes({food:-4});const id=randomRecruit(['R','SR']);return id?recruitText(id):'對方最後冇過嚟。'}},
  {l:'交換情報',fx:()=>addRes({bat:50})+'，對方報咗幾個有物資嘅地方'}]},
 giant:{w:3,ch:5,t:'巨屍',txt:()=>'一隻兩米半高嘅巨屍喺附近遊蕩，佢頭殼入面發緊紫光。',opts:[
  {l:'派最勁嘅人去獵',req:()=>able().length>0,fx:()=>{const u=bestBy(x=>eff(x,'guard'));if(eff(u,'guard')*rf(.7,1.3)>=14){return `${nm(u)} 引佢入窄巷，一擊入腦。\n${addRes({core:2})}`}const d=hurt(u,ri(20,35));return `${nm(u)} 被巨屍一掌拍飛（-${d} HP）。`}},
  {l:'避開佢',fx:()=>'巨屍喺街上徘徊咗一日，然後走咗。'}]}
};
function randomEvent(){
  const pool=[];
  for(const id in EV){const e=EV[id];if(!e.w)continue;if(e.ch&&!reached(G,e.ch))continue;let c={};if(e.pre){c=e.pre({});if(!c)continue}pool.push({id,c,w:e.w})}
  if(!pool.length)return;
  let r=R()*pool.reduce((s,p)=>s+p.w,0);for(const p of pool){r-=p.w;if(r<=0){G.queue.push({id:p.id,c:p.c});return}}
}
