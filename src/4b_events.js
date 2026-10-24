/* ================= 擴展事件 ================= */
Object.assign(CHEV,{8:'s_train8',9:'s_bunker',10:'s_prison',11:'s_hospital',12:'s_dungeon',13:'s_final'});
const gearGift=r=>{const it=rollItem(r);addItem(it);return `${r} 裝備「${ITEMS[it].n}」`};
function dunReward(d){
  const sets=Object.keys(SETS).filter(k=>CH[SETS[k].owner].fa.includes(d.key));
  const own=i=>(G.inv[i]||0)+G.units.filter(u=>u.eq&&Object.values(u.eq).includes(i)).length;
  const miss=sets.flatMap(k=>SETS[k].items).filter(i=>!own(i));
  const pool=miss.length?miss:sets.flatMap(k=>SETS[k].items);
  if(!pool.length)return gearGift('SSR');
  const it=pick(pool);addItem(it);return `${ITEMS[it].r} 專屬裝備「${ITEMS[it].n}」`;
}
Object.assign(EV,{
 s_raidwarn:{story:1,t:'今晚',txt:c=>`${c.n||'獵人幫'}今晚會嚟。

多啲人守夜，彈藥同圍牆係關鍵。`,opts:[{l:'準備迎戰',fx:()=>{allSan(2);return '大家將所有可以用嘅嘢頂住大門。\n全隊意志 +2'}}]},
 s_cured:{story:1,t:'解藥',txt:()=>`第一支解藥喺凌晨三點完成。

佢救唔返已經變咗嘅人，但可以令被咬嘅人唔再變。

你用最後嘅電池向全城廣播藥方。三日後，你聽到一陣唔同嘅引擎聲——唔係直升機，係火車。`,opts:[{l:'繼續',fx:()=>{addRes({serum:5});return '血清 +5，之後每 3 日自動製成 1 支。\n\n故事未完。'}}]},
 s_train8:{story:1,t:'第八章 · 末日列車',txt:()=>`一列加裝鐵甲嘅列車沿住環城鐵路駛過，車頂架住機槍，車身噴住「北斗號」三個大字。

車長喺電台講：「車上爆咗感染，後面幾卡車廂全部係屍。邊個幫我清走佢哋，呢架車就係邊個嘅。」

【新地點】北斗號列車可以搜括，清場之後可以搬上車做據點（屍潮 -30%）。`,opts:[{l:'接受',fx:()=>`車長留低一箱補給。\n${addRes({ammo:10,parts:10})}`}]},
 s_bunker:{story:1,t:'第九章 · 地洞',txt:()=>`無線電收到一段由地底傳上嚟嘅訊號：「深淵避難所」，冷戰時期嘅防空洞，入面住咗幾百人。

佢哋用菇種糧、用地下河洗水，已經二十年冇見過太陽。佢哋願意用地底技術交換物資。

【新地點】深淵避難所可以搜括，清場後可以搬落去（床位 16、屍潮 -30%，但每日意志 -2）。`,opts:[
  {l:'送 20 食物過去建立關係',req:()=>G.res.food>=20,fx:()=>{addRes({food:-20});return `避難所長老回贈：${addRes({water:30,parts:15})}\n仲有一件${gearGift('SR')}`}},
  {l:'記低位置',fx:()=>'你喺地圖上圈咗避難所入口。'}]},
 s_prison:{story:1,t:'第十章 · 監獄風雲',txt:()=>`十幾架改裝囚車停喺門口。帶頭嘅光頭男人面上有條刀疤，自稱「監獄王」。

「全城據點都要歸順。交一半物資、派兩個人過嚟做苦工。六日後我再嚟。唔肯？我哋有三百人。」`,opts:[
  {l:'派最強嘅人單挑佢',d:'保安效率最高嗰個出手；夠強就收服監獄幫',req:()=>able().some(talker),fx:()=>{G.flags.prisonMet=1;const b=bestTalker(u=>eff(u,'guard'));const p=eff(b,'guard')*rf(.8,1.2);if(p>=45){G.flags.prisonWon=1;checkObj();return `${nm(b)} 行出去，三招之內將刀疤強打到跪低。\n\n監獄幫收咗聲。佢哋願意歸順，以後每日送物資過嚟。\n${addRes({ammo:20,food:20})}`}G.flags.prisonDay=G.day+6;G.flags.prisonAngry=1;const d=hurt(b,ri(15,30));return `${nm(b)} 輸咗（-${d} HP）。\n刀疤強笑住講：「六日後，我帶晒全部人嚟。」`}},
  {l:'假意歸順，交出三分一物資',fx:()=>{G.flags.prisonMet=1;G.flags.prisonDay=G.day+10;const f=Math.floor(G.res.food/3),a=Math.floor(G.res.ammo/3);addRes({food:-f,ammo:-a});return `你交咗 ${f} 食物同 ${a} 彈藥，爭取多啲時間。\n佢哋十日後會再嚟收數——到時候唔會再咁客氣。`}},
  {l:'叫佢哋滾',fx:()=>{G.flags.prisonMet=1;G.flags.prisonDay=G.day+6;allSan(3);return '刀疤強冇講嘢，只係揮手叫人上車。\n全隊意志 +3。六日後監獄幫會大舉進攻。'}}]},
 s_hospital:{story:1,t:'第十一章 · 喪屍醫院',txt:()=>`聖瑪利醫院地庫嘅實驗室燈仲著。監察器上面嘅心跳曲線好規律——但病床上嘅「病人」頭顱已經裂開，入面嘅晶體不斷發光。

紀錄寫住：「零號病人可以指揮周圍嘅感染者。」

【新地點】聖瑪利醫院可以搜括（危險），清場後可以做據點（醫療 +50%）。`,opts:[{l:'記低',fx:()=>`你喺醫院門口執到：${addRes({med:6})}`}]},
 s_dungeon:{story:1,t:'第十二章 · 屍王地宮',txt:()=>`實驗紀錄最後一頁畫住一張地圖：地鐵最深處嘅舊礦坑，標住一個字——「王」。

全城喪屍嘅行動模式，原來全部由一個源頭控制。佢一日唔死，屍潮一日唔停。

【新地點】屍王地宮可以搜括。極度危險，派最強嘅人去。清場就係擊殺屍王。`,opts:[{l:'準備討伐',fx:()=>`大家將最好嘅裝備集中。\n全隊意志 +4`+(allSan(4),'')}]},
 s_kingdead:{story:1,t:'屍王',txt:()=>`地宮最深處，一個三米高嘅身影坐喺由屍骸砌成嘅王座上，胸口嵌住一粒拳頭大嘅晶核。

佢企起身嗰刻，全城嘅喪屍同時停咗落嚟。

一場惡戰之後，佢倒低咗。晶核碎裂，紫光散去。`,opts:[{l:'結束佢',fx:()=>{checkObj();return `屍王已死。\n${addRes({core:5,bat:300})}\n但係，失去控制嘅屍群開始瘋狂湧向全城……`}}]},
 s_final:{story:1,t:'第十三章 · 末日堡壘',txt:()=>`屍王死咗，屍群失去控制，由四方八面湧嚟。全城僅存嘅倖存者開始向你哋嘅據點集中。

七日之後，最後一波屍潮——「屍潮之夜」——會到。

【新地點】堡壘工地可以搜括，清場後可以搬入末日堡壘（床位 24、圍牆 150、夜間防禦 +25）。`,opts:[{l:'起堡壘',fx:()=>{G.flags.finalDay=G.day+7;const t=recruitText(randomRecruit(['R','SR'])||'n_b','（佢帶住一班倖存者投靠你哋。）');return `第 ${G.flags.finalDay} 晚就係屍潮之夜。\n${t}`}}]},
 end_fortress:{story:1,end:'fortress',t:'結局 · 末日堡壘',txt:()=>`天光嗰陣，堡壘外面嘅屍堆高過城牆。

但係城牆冇倒，城入面嘅人都仲喺度。

有人喺城頭升起一面用床單整嘅旗。遠處，其他倖存者嘅據點都相繼升旗回應。

末日冇完。但人類喺入面起咗一座城。`,opts:[{l:'完',fx:()=>{G.over='fortress';return `你哋撐咗 ${G.day-1} 日，擊退咗 ${G.kills} 隻喪屍，招募咗 ${Object.keys(G.dex).length} 個倖存者。\n\n喺設定可以開始新一局。`}}]},
 dun_open:{story:1,t:'副本解鎖',pre:c=>DUNBYID[c.d]?c:null,txt:c=>{const d=DUNBYID[c.d];return `${CH[c.by].n} 加入之後，帶嚟一段只有${FA[d.key]}中人先知道嘅往事。

「${d.n}」已經可以喺搜括地點揀。

陣營加成：${d.bonus.map(f=>FA[f]).join('、')} 嘅人去會更強、更安全。
普通人去會${d.mortal.risk>1?`受傷風險 ×${d.mortal.risk}、`:''}每次意志 -${d.mortal.san}。

完成副本可以攞到專屬裝備。`},opts:[{l:'記低',fx:c=>`「${DUNBYID[c.d].n}」已解鎖。`}]},
 dun_stage:{story:1,t:'副本',pre:c=>DUNBYID[c.d]?c:null,txt:c=>{const d=DUNBYID[c.d];return `【${d.n}】${['第一幕','第二幕','終幕'][c.s]}

${d.st[c.s]}`},opts:[{l:'繼續',fx:c=>{const d=DUNBYID[c.d];if(c.s===0)return `入口搵到：${addRes({bat:80})}`;if(c.s===1)return `搵到：${dunReward(d)}`;addLog(`完成副本「${d.n}」。`);return `副本完成！\n${dunReward(d)}\n${addRes({bat:300,core:3})}`}}]},
 betray:{t:'反骨',pre:c=>uOf(c.u)?c:null,txt:c=>`${nm(uOf(c.u))} 半夜執好兵器，眼神好冷。

「我呂奉先，豈能屈居人下？」佢企喺門口，好似要帶住物資自立門戶。`,opts:[
  {l:'俾佢更多物資留住佢',d:'食物 -10、彈藥 -10',req:()=>G.res.food>=10&&G.res.ammo>=10,fx:c=>{addRes({food:-10,ammo:-10});const u=uOf(c.u);u.san=60;return `${nm(u)} 收低物資，冷笑一聲返入房。\n佢暫時唔會走。`}},
  {l:'搵人同佢講道理',fx:c=>{const u=uOf(c.u),b=bestTalker(x=>stat(x,'wil'),x=>x.id!==c.u);if(b&&stat(b,'wil')+rf(0,10)>=22){u.san=55;return `${nm(b)} 同佢講咗成晚。\n${nm(u)} 終於放低兵器。`}const it=u.eq&&Object.values(u.eq).filter(Boolean);leaveUnit(u,'背叛離隊，帶走咗佢嘅裝備同物資。');if(it&&it.length)it.forEach(i=>{G.inv[i]--;if(G.inv[i]<=0)delete G.inv[i]});addRes({food:-Math.min(G.res.food,10)});return `講唔掂。${nm(u)} 帶住佢嘅兵器同 10 份食物揚長而去。`}},
  {l:'由佢走',fx:c=>{const u=uOf(c.u);leaveUnit(u,'背叛離隊。');return `${nm(u)} 頭都唔回。\n（有貂蟬喺據點，呂布就唔會背叛。）`}}]}
});
/* 截肢：華佗必定成功 */
{const b=EV.bitten.opts.find(o=>o.l==='搵醫生截肢');const fx0=b.fx;b.fx=c=>{if(teamFx(G,'surgeon','any')){const u=uOf(c.u);u.inf=0;u.crit=1;u.inj=1;u.hp=Math.max(1,Math.round(maxHp(u)*.3));return `華佗用麻沸散令 ${nm(u)} 瞓著，刮骨去毒，手起刀落。\n感染止住咗，佢而家重傷，要人照顧。`}return fx0(c)};}
EV.mutant={story:1,t:'變種人',pre:c=>uOf(c.u)&&uOf(c.u).mut?c:null,txt:c=>{const u=uOf(c.u),m=MUT[u.mut.t];return isAnimal(u)?`第三日夜晚，大家都以為 ${nm(u)} 會屍變。

但佢只係抖咗成晚。天光之後，佢對眼變成咗紅色，身形同以前唔同咗，但佢仲認得你，條尾仲擺。

【${m.n}】${m.d}`:`第三日夜晚，所有人都準備好。

${nm(u)} 抽搐咗成晚，皮膚變成灰綠色，血管發紫。但天光嗰陣，佢張開眼——眼仁係紅色嘅，但佢仲叫得出你個名。

佢冇屍變。佢變成咗另一種嘢。

【${m.n}】${m.d}
變種人對病毒免疫，但食量 ×1.5。`},opts:[
  {l:'佢仲係我哋嘅人，留低佢',fx:c=>{const u=uOf(c.u);allSan(-3);u.san=Math.min(100,u.san+15);return `有人唔敢同佢瞓同一間房，但冇人講出口。\n全隊意志 -3，${nm(u)} 意志 +15`}},
  {l:'抽血做研究',d:'解藥研究 +15%，佢會虛弱幾日',fx:c=>{const u=uOf(c.u);G.research=Math.min(100,(G.research||0)+15);u.sta=Math.max(0,u.sta-40);u.hp=Math.max(1,u.hp-15);return `佢嘅血有抗體反應。\n解藥研究 +15%（而家 ${Math.round(G.research)}%）`}},
  {l:'趕佢走',fx:c=>{const u=uOf(c.u);leaveUnit(u,'變成變種人之後被趕走。');allSan(-6);return `${nm(u)} 望住你哋關門，冇講一句說話。\n全隊意志 -6`}}]};
