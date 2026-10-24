/* ================= 啟動 ================= */
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>go(b.dataset.v));
G=load();
if(G){if(!G.base)G.base='mall';if(!G.clear)G.clear={};if(!G.ach)G.ach={};if(!G.stash)G.stash={pill:0,manual:0};G.units.forEach(u=>{u.bag=u.bag||{};giveKit(G,u.id);if(u.eq)for(const sl in u.eq){const k=u.eq[sl];if(k&&ITEMS[k]&&ITEMS[k].gun&&!canGun(u)){addItem(k);u.eq[sl]=null}}});if(!G.inv)G.inv={bat:1,cleaver:1,armguard:1};if(!G.dun){G.dun={};Object.keys(G.dex).forEach(id=>{if(CH[id])CH[id].fa.forEach(f=>{const d=DUNS.find(x=>x.key===f);if(d)G.dun[d.id]=1})})}if(G.over==='cure'||G.over==='fort'){G.over=null;G.flags.ended=0;G.flags.overShown=0}if(!G.chDay){G.chDay={};CHAPS.forEach(c=>{if(c.n<=G.ch)G.chDay[c.n]=c.day});if(G.ch>=6&&G.flags.huntersMet&&!G.flags.raidDay)G.flags.raidDay=40;}}else{fresh();save()}
render();
if(G.queue.length)showQueue();

