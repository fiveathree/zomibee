/* ================= 水資源平衡：多水嘅地點同據點 ================= */
LOCS.push(
 {id:'reservoir',n:'城門水塘',ch:2,dg:.16,loot:{water:3.2,food:.5}},
 {id:'bottling',n:'蒸餾水廠',ch:3,dg:.2,loot:{water:2.8,parts:.6,bat:.4}},
 {id:'desal',n:'海水化淡廠',ch:5,dg:.26,loot:{water:2.6,parts:.8,food:.6}}
);
Object.assign(BASES,{
 reservoir:{n:'城門水塘',beds:6,wall:36,horde:.9,d:'水塘邊嘅管理站，四面環水，得一條堤壩入嚟。',perk:{water:6,food:1},pd:'取水同捉魚：每日水 +6、食物 +1；屍潮 -10%',areas:A5,
  z:{scav:['堤壩','搜括'],guard:['管理站閘口','保安'],patrol:['環塘步道','巡邏'],rest:['職員宿舍','休息','碌架床 × 6'],cook:['燒烤爐','煮飯','炭爐 · 魚網'],repair:['抽水房','維修','水泵 · 喉管'],medic:['急救站','醫療','急救箱']}},
 bottling:{n:'蒸餾水廠',beds:9,wall:55,d:'廠房鐵閘厚，生產線仲有幾萬支水未運走。',perk:{water:8},pd:'生產線存貨：每日水 +8',areas:A4,
  z:{scav:['貨倉','搜括'],guard:['廠房鐵閘','保安'],patrol:['停車場','巡邏'],rest:['員工休息室','休息','摺床 × 9'],cook:['員工飯堂','煮飯','大鑊'],repair:['蒸餾機房','維修','鍋爐 · 濾芯'],medic:['醫務室','醫療','藥箱']}},
 desal:{n:'海水化淡廠',beds:12,wall:70,horde:1.1,d:'海邊嘅化淡廠，化淡機仲開得郁，但碼頭成日有屍群上岸。',perk:{water:12,food:1},pd:'化淡機日夜運作：每日水 +12、食物 +1；屍潮 +10%',areas:A3,
  z:{scav:['碼頭','搜括'],guard:['廠區閘口','保安'],patrol:['海堤','巡邏'],rest:['控制室宿舍','休息','碌架床 × 12'],cook:['漁民飯堂','煮飯','石油氣爐 · 魚'],repair:['化淡機房','維修','反滲透膜 · 水泵'],medic:['醫務室','醫療','摺床']}}
});
/* 其他地點都多少有水 */
{const add={metro:1.0,school:.9,police:.3,barracks:.6,prison:.5,hospital:.6,train:.5,fortress:1,museum:.3,lab:.4};
 LOCS.forEach(l=>{if(add[l.id]!==undefined)l.loot.water=Math.max(l.loot.water||0,add[l.id])})}
FAC.rain.d='每日 +5 水';
