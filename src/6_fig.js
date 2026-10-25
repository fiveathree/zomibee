/* ================= 人物繪圖 ================= */
/* 髮型,髮色(或帽色),衫色,膚色,配件 */
const SKIN={L:'#f2d3b6',T:'#e2b98f',M:'#c48d63',D:'#7a4b2f',P:'#f1e6df',F:'#efcb98',K:'#f2b8c6'};
const LOOK={
 u_shen:'crop,#161616,#4b5a3a,T,vest',u_mio:'pony,#111,#efe9dd,T,band hakama',u_grace:'wavy,#d1a96a,#4a6a8a,L,coat glasses',u_han:'helm,#d8a52a,#2e3a52,T,stripe',
 s_ho:'short,#202020,#8a1f2e,T,shades',s_lin:'crop,#2a2a2a,#f3f1ea,T,band apron',s_olga:'bun,#c9bb9c,#c2662a,L,stripe',s_hawk:'cap,#4d5a33,#5b6a3c,M,vest',
 s_park:'bun,#151515,#bfe3e3,T,cross',s_fei:'cap,#1f2f5a,#2a7de1,T,',s_mao:'hat,#111,#d6b85a,T,robe',s_sofia:'long,#24150e,#262626,M,',
 r_rin:'pony,#151515,#1f2a4a,T,band',r_dale:'cap,#6a4a26,#9a7a48,L,star',r_choi:'short,#141414,#2c3440,T,glasses tie',r_hung:'crop,#1d1d1d,#2f5aa0,T,beard',
 r_mei:'long,#2b1d14,#7aa7b0,T,coat glasses',r_hannah:'pony,#d9b36a,#5a7a3a,L,',r_kenji:'wavy,#1d1d1d,#3a3a4a,T,glasses',r_darnell:'crop,#111,#b8352b,D,',
 r_maria:'veil,#111,#1e1e28,L,',r_lee:'helm,#e2be2c,#26324a,T,stripe',r_lulu:'long,#3a1a14,#e88fb0,T,',r_zhou:'short,#c4c4c4,#4d5a3a,T,glasses beard',
 c_may:'pony,#2a1a10,#3aa35a,T,',c_cheung:'cap,#e0a020,#e0a020,T,',c_wong:'short,#6a6a6a,#7a8aa0,T,',c_keung:'helm,#f0d020,#d06a1a,T,stripe',
 c_emily:'pony,#c47a3a,#6a9ab0,L,',c_david:'crop,#111,#262626,D,',c_mrwong:'short,#111,#f2f2f2,T,glasses tie',c_chan:'curly,#2a1a12,#b44a6a,T,apron',
 c_minho:'short,#222,#3a5a8a,T,',c_igor:'bald,#5a3a22,#ece8e0,L,apron beard',c_ana:'pony,#111,#6ab0c0,M,apron',c_tang:'short,#dcdcdc,#2a3a5a,T,beard',
 c_ng:'short,#151515,#f4f4f4,T,tie',n_tanaka:'short,#111,#2b2f38,T,glasses tie',n_ashley:'long,#e6c070,#c04a4a,L,',n_dou:'short,#111,#f0c030,T,kid',
 n_fat:'short,#222,#6a4a8a,T,glasses',n_brad:'crop,#c8a060,#e04040,L,',n_rosa:'wavy,#3a1a10,#202020,M,',n_kwok:'wavy,#1a1a1a,#4a7a5a,T,',n_sun:'bun,#cfcfcf,#6a4a6a,T,glasses'
};
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r*k);g=Math.round(g*k);b=Math.round(b*k);return '#'+[r,g,b].map(v=>Math.min(255,v).toString(16).padStart(2,'0')).join('')}
function hairBack(hs,hc){
  if(hs==='long')return `<path d="M12.5 12 Q12 4 20 4 Q28 4 27.5 12 L28.5 25 L24 24 L24 13 L16 13 L16 24 L11.5 25Z" fill="${hc}"/>`;
  if(hs==='wavy')return `<path d="M12.5 12 Q12 4 20 4 Q28 4 27.5 12 Q29 16 27 19 L24 18 L24 13 L16 13 L16 18 L13 19 Q11 16 12.5 12Z" fill="${hc}"/>`;
  if(hs==='pony')return `<path d="M25 8 Q32 9 31 20 Q29 15 26 12Z" fill="${hc}"/>`;
  if(hs==='redveil')return `<path d="M10.5 14 Q10 2.5 20 2.5 Q30 2.5 29.5 14 L32 30 L8 30Z" fill="${hc}"/>`;
  if(hs==='topknot')return `<path d="M12.5 12 Q12 4 20 4 Q28 4 27.5 12 L28.5 27 L24 26 L24 13 L16 13 L16 26 L11.5 27Z" fill="${hc}"/>`;
  if(hs==='monkey')return `<circle cx="20" cy="12" r="8.8" fill="${hc}"/><circle cx="11.6" cy="12.5" r="2.2" fill="${hc}"/><circle cx="28.4" cy="12.5" r="2.2" fill="${hc}"/>`;
  if(hs==='veil')return `<path d="M11 13 Q11 3 20 3 Q29 3 29 13 L31 26 L9 26Z" fill="${hc}"/>`;
  return '';
}
function hairFront(hs,hc){
  switch(hs){
    case 'short':return `<path d="M12.8 12 Q12.5 4 20 4 Q27.5 4 27.2 12 Q25 7.5 20 8 Q15 7.5 12.8 12Z" fill="${hc}"/>`;
    case 'crop':return `<path d="M13.3 10 Q14 4.8 20 4.8 Q26 4.8 26.7 10 Q23 7 20 7.2 Q17 7 13.3 10Z" fill="${hc}"/>`;
    case 'long':case 'wavy':case 'pony':return `<path d="M12.8 12 Q12.5 4 20 4 Q27.5 4 27.2 12 Q24 6.5 18 9 Q15 9.5 12.8 12Z" fill="${hc}"/>`;
    case 'bun':return `<circle cx="20" cy="3.6" r="3" fill="${hc}"/><path d="M12.8 11 Q12.5 4.5 20 4.5 Q27.5 4.5 27.2 11 Q25 7.5 20 7.8 Q15 7.5 12.8 11Z" fill="${hc}"/>`;
    case 'curly':return [[14,7],[17,5],[20,4.3],[23,5],[26,7],[13.3,10],[26.7,10]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${hc}"/>`).join('');
    case 'bald':return `<path d="M13 13 Q13 10.5 14 10 L14 13Z M27 13 Q27 10.5 26 10 L26 13Z" fill="${hc}"/>`;
    case 'cap':return `<path d="M12.6 10.5 Q13 3.6 20 3.6 Q27 3.6 27.4 10.5Z" fill="${hc}"/><rect x="19" y="9" width="12" height="2.2" rx="1" fill="${shade(hc,.75)}"/>`;
    case 'helm':return `<path d="M11.6 11 Q12 2.2 20 2.2 Q28 2.2 28.4 11Z" fill="${hc}"/><rect x="18.6" y="2.4" width="2.8" height="8.5" fill="${shade(hc,.8)}"/><ellipse cx="20" cy="11" rx="10.5" ry="1.8" fill="${shade(hc,.85)}"/>`;
    case 'hat':return `<path d="M13.2 10 Q13.5 6 20 6 Q26.5 6 26.8 10Z" fill="#222"/><path d="M14 7 L15.5 1.5 L24.5 1.5 L26 7Z" fill="#111"/><rect x="14.5" y="4" width="11" height="1.2" fill="#c33"/>`;
    case 'feather':return `<path d="M16 4 Q9 -4 1 1" stroke="#b33a2a" stroke-width="1.6" fill="none"/><path d="M24 4 Q31 -4 39 1" stroke="#b33a2a" stroke-width="1.6" fill="none"/><path d="M11.8 11 Q12 2.8 20 2.8 Q28 2.8 28.2 11Z" fill="${hc}"/><circle cx="20" cy="4.2" r="1.6" fill="#c33"/><rect x="11.5" y="9.6" width="17" height="1.8" fill="${shade(hc,.75)}"/>`;
    case 'monkey':return `<path d="M13 11 Q13 6 20 5.5 Q27 6 27 11 Q24 8.5 20 9 Q16 8.5 13 11Z" fill="${hc}"/><rect x="12.6" y="6.6" width="14.8" height="1.8" rx=".9" fill="#e8c34a"/>`;
    case 'wing':return `<path d="M12 11 Q12 3 20 3 Q28 3 28 11Z" fill="${hc}"/><path d="M12 7 L4 2 L7 7 L3 6 L12 10Z M28 7 L36 2 L33 7 L37 6 L28 10Z" fill="#f4f4f4"/>`;
    case 'horn':return `<path d="M12 11 Q12 3 20 3 Q28 3 28 11Z" fill="${hc}"/><path d="M15 5 Q10 -2 13 -4 Q13 1 17 4Z M25 5 Q30 -2 27 -4 Q27 1 23 4Z" fill="#d8b03a"/>`;
    case 'wizard':return `<path d="M10 9.5 L30 9.5 L27 8 L21 -6 L19.5 -6 L13 8Z" fill="${hc}"/><circle cx="18" cy="3" r=".9" fill="#f2d38a"/><circle cx="22" cy="6" r=".7" fill="#f2d38a"/><ellipse cx="20" cy="9.6" rx="11" ry="1.6" fill="${shade(hc,.8)}"/>`;
    case 'beret':return `<ellipse cx="19" cy="6.5" rx="9" ry="3.6" fill="${hc}"/><circle cx="19" cy="3" r=".8" fill="${hc}"/>`;
    case 'redveil':return `<path d="M12.5 10 Q13 3.5 20 3.5 Q27 3.5 27.5 10Z" fill="${shade(hc,.85)}"/><path d="M14 9 L26 9 L25.5 11 L14.5 11Z" fill="#e8c34a"/>`;
    case 'topknot':return `<circle cx="20" cy="2.8" r="2.6" fill="${hc}"/><line x1="16" y1="2.2" x2="24" y2="3.4" stroke="#c9a23a" stroke-width=".8"/><path d="M12.8 11 Q12.5 4.5 20 4.5 Q27.5 4.5 27.2 11 Q24 7 20 7.3 Q16 7 12.8 11Z" fill="${hc}"/>`;
    case 'guan':return `<path d="M12.6 10 Q13 3.5 20 3.5 Q27 3.5 27.4 10Z" fill="${hc}"/><path d="M26 6 Q31 8 30 13" stroke="${hc}" stroke-width="1.4" fill="none"/>`;
    case 'monkcap':return `<path d="M13 8.5 L14 3 L17 5 L20 2 L23 5 L26 3 L27 8.5Z" fill="${hc}"/><rect x="13" y="7.6" width="14" height="1.6" fill="#c33"/>`;
    case 'veil':return `<rect x="12.6" y="6.4" width="14.8" height="2.4" rx="1" fill="#f2f2f2"/>`;
  }
  return '';
}
function weaponSVG(k){
  switch(k){
    case 'blade':return `<line x1="33" y1="15" x2="39" y2="1.5" stroke="#d9dde2" stroke-width="1.6" stroke-linecap="round"/><line x1="31.5" y1="14" x2="35" y2="15.8" stroke="#3a2a1a" stroke-width="1.6"/>`;
    case 'club':return `<line x1="33.5" y1="15" x2="38" y2="2.5" stroke="#a87444" stroke-width="3" stroke-linecap="round"/>`;
    case 'axe':return `<line x1="33.5" y1="15" x2="37" y2="2" stroke="#7a5532" stroke-width="2"/><path d="M35.5 2 L40 3.5 L39 8.5 L36.3 6.5Z" fill="#c6352b"/>`;
    case 'spear':return `<line x1="31" y1="30" x2="38.5" y2="3" stroke="#b49a6a" stroke-width="1.6"/><path d="M37.8 0.5 L40 4.5 L37.2 5Z" fill="#cfd4da"/>`;
    case 'bar':return `<path d="M33.5 15 L38 3 L39.5 3.8" stroke="#6b7480" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'knife':return `<path d="M33 14 L36.5 6 L38.2 7 L35 14.5Z" fill="#d9dde2"/>`;
    case 'gun':return `<rect x="33" y="19.2" width="6" height="2.6" fill="#1b1b1b"/><rect x="33.6" y="21" width="1.8" height="3" fill="#1b1b1b"/>`;
    case 'halberd':return `<line x1="31" y1="32" x2="38.5" y2="0" stroke="#7a2a1a" stroke-width="1.6"/><path d="M37 1 L40 -1 L39.5 5Z" fill="#dfe3e8"/><path d="M36.3 6 Q32 4 33.5 9 Q35 7.5 37.3 8.5Z" fill="#dfe3e8"/>`;
    case 'staff':return `<line x1="30" y1="34" x2="39" y2="0" stroke="#c9302a" stroke-width="2"/><rect x="37.2" y="0" width="2.4" height="3" fill="#e8c34a" transform="rotate(15 38 1)"/><rect x="29.5" y="31" width="2.4" height="3" fill="#e8c34a" transform="rotate(15 30.5 32)"/>`;
    case 'hammer':return `<line x1="33.5" y1="16" x2="36.5" y2="6" stroke="#6a4a2a" stroke-width="2"/><rect x="31.5" y="0" width="9" height="6.5" rx="1" fill="#8b939c" transform="rotate(15 36 3)"/>`;
    case 'xbow':return `<line x1="30" y1="22" x2="39" y2="20" stroke="#6a4a2a" stroke-width="2"/><path d="M37 15 Q34 20 37 25" stroke="#3a2a1a" stroke-width="1.2" fill="none"/>`;
    case 'sword':return `<line x1="33" y1="15" x2="38.5" y2="0.5" stroke="#e8f0f4" stroke-width="1.4" stroke-linecap="round"/><line x1="31.6" y1="13.6" x2="34.8" y2="15.4" stroke="#c9a23a" stroke-width="1.4"/><path d="M33 15 L31 19" stroke="#c33" stroke-width=".8"/>`;
    case 'wand':return `<line x1="32" y1="30" x2="37" y2="3" stroke="#6a4a2a" stroke-width="1.6"/><circle cx="37.2" cy="2.6" r="2.2" fill="#8ad0f0"/>`;
    case 'rifle':return `<line x1="22" y1="24.5" x2="40" y2="19.5" stroke="#1b1b1b" stroke-width="2.2"/><rect x="27" y="20" width="4" height="1.6" fill="#1b1b1b"/>`;
  }
  return '';
}
function animalSVG(u,job,bust){
  const pc=PETC[u.id],dog=u.id==='n_tofu'||!!(pc&&pc[2]),vb=bust?(dog?'18 18 22 22':'17 22 20 20'):'0 0 40 56';
  const rest=!bust&&(job==='rest'||u.crit||u.iso);
  const c=u.inf?'#8fa36a':pc?pc[0]:dog?'#d6a24e':'#202024',lt=pc?pc[1]:dog?'#efd09a':'#3a3a40';
  let s='';
  if(dog){
    s+= rest?`<ellipse cx="19" cy="46" rx="12" ry="5" fill="${c}"/><circle cx="30" cy="43" r="5.5" fill="${c}"/><path d="M27.5 38.5 L29 34 L32 38.5Z" fill="${shade(c,.65)}"/><ellipse cx="34.5" cy="45" rx="3" ry="2" fill="${lt}"/><path d="M8 45 Q3 43 5 39" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/><text x="33" y="34" font-size="6" fill="#86afcf">z</text>`
      :`<path d="M8.5 34 Q3 28 6 23.5" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="10" y="38" width="3" height="11" rx="1.4" fill="${shade(c,.85)}"/><rect x="14.5" y="38" width="3" height="11" rx="1.4" fill="${c}"/><rect x="22" y="38" width="3" height="11" rx="1.4" fill="${shade(c,.85)}"/><rect x="26.5" y="38" width="3" height="11" rx="1.4" fill="${c}"/><ellipse cx="19" cy="36" rx="11.5" ry="6.5" fill="${c}"/><rect x="25" y="31" width="5" height="2" fill="#c6352b"/><circle cx="30" cy="27.5" r="6" fill="${c}"/><path d="M26.5 23 L28.3 17.5 L31.6 23Z" fill="${shade(c,.65)}"/><ellipse cx="35" cy="29.5" rx="3.3" ry="2.4" fill="${lt}"/><circle cx="37.8" cy="28.6" r="1.1" fill="#111"/><circle cx="31.2" cy="26" r=".9" fill="#111"/>`;
  }else{
    s+= rest?`<ellipse cx="20" cy="47" rx="10" ry="4.5" fill="${c}"/><circle cx="28" cy="45" r="5" fill="${c}"/><path d="M24.5 42 L25.5 37.5 L28 41Z M28.5 41 L31 37.5 L31.8 42Z" fill="${c}"/><path d="M10 47 Q6 49 9 51" stroke="${c}" stroke-width="2.2" fill="none"/><text x="32" y="38" font-size="6" fill="#86afcf">z</text>`
      :`<path d="M11 41 Q4 32 9 25" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="13" y="42" width="2.6" height="8" rx="1.2" fill="${c}"/><rect x="22.5" y="42" width="2.6" height="8" rx="1.2" fill="${c}"/><ellipse cx="19" cy="41" rx="9.5" ry="5.5" fill="${c}"/><circle cx="28" cy="33" r="5.5" fill="${c}"/><path d="M23.5 30 L24.5 24.5 L27.6 28.4Z M28.4 28.4 L31.5 24.5 L32.6 30Z" fill="${c}"/><circle cx="26.2" cy="32.6" r="1.1" fill="#f2cf3a"/><circle cx="29.8" cy="32.6" r="1.1" fill="#f2cf3a"/><path d="M27.3 35 L28 35.6 L28.7 35" stroke="#888" stroke-width=".5" fill="none"/>`;
  }
  if(u.inj&&!bust)s+=`<rect x="26" y="${dog?20.5:26.5}" width="7" height="2" rx="1" fill="#f4f4f4"/>`;
  return `<svg viewBox="${vb}" aria-hidden="true">${s}</svg>`;
}
function fig(u,job,bust){
  const c=CH[u.id];
  if(c.tr.includes('animal'))return animalSVG(u,job,bust);
  const [hs,hc,oc0,sk,exs,bc]=(LOOK[u.id]||'short,#222,#667788,T,').split(',');
  const X=(exs||'').split(' ');
  const eq=u.eq||{},arm=eq.armor&&ITEMS[eq.armor],wpn=eq.weapon&&ITEMS[eq.weapon],tool=eq.tool&&ITEMS[eq.tool];
  let oc=oc0;if(arm&&arm.k==='suit')oc='#c9a227';if(arm&&arm.k==='jacket')oc='#2a2523';
  const skin=u.mut?'#9fae9a':u.inf?'#a8b88a':SKIN[sk]||sk,dark=shade(oc,.7),pants=X.includes('hakama')?'#25263a':'#2c2b31';
  const pose=bust?'idle':u.crit||u.iso?'lie':job==='rest'?'sit':job||'idle';
  let back='',body='',front='';
  // 背包
  if(tool&&tool.k==='pack'&&!bust)back+=`<rect x="9.5" y="20" width="21" height="15" rx="4" fill="#6b5232"/>`;
  if(X.includes('cape'))back+=`<path d="M11 20 L29 20 L33 48 L7 48Z" fill="#a32a24"/>`;
  back+=hairBack(hs,hc);
  // 腳
  if(pose==='sit')body+=`<rect x="13" y="35" width="17" height="5" rx="2.4" fill="${pants}"/><rect x="13" y="40" width="17" height="4" rx="2" fill="${shade(pants,.85)}"/><rect x="28" y="35" width="4" height="9" rx="1.5" fill="#1a1a1a"/>`;
  else body+=`<rect x="14" y="36" width="5" height="15" rx="2" fill="${pants}"/><rect x="21" y="36" width="5" height="15" rx="2" fill="${shade(pants,.85)}"/><rect x="13" y="49.5" width="6.5" height="2.8" rx="1.3" fill="#151515"/><rect x="20.5" y="49.5" width="6.5" height="2.8" rx="1.3" fill="#151515"/>`;
  // 身
  body+=`<rect x="11" y="19" width="18" height="19" rx="5" fill="${oc}"/>`;
  if(X.includes('coat'))body+=`<path d="M11 21 Q11 19 15 19 L18 19 L17 44 L11.5 44Z M29 21 Q29 19 25 19 L22 19 L23 44 L28.5 44Z" fill="#f4f3ef"/>`;
  if(X.includes('robe'))body+=`<path d="M11.5 30 L28.5 30 L30 46 L10 46Z" fill="${oc}"/><path d="M20 19 L16 27 M20 19 L24 27" stroke="${dark}" stroke-width="1"/>`;
  if(X.includes('sash'))body+=`<path d="M11.5 24 L28.5 30 L28.5 32 L11.5 26Z" fill="#c9a23a"/>`;
  if(X.includes('apron'))body+=`<rect x="14" y="24" width="12" height="15" rx="1.5" fill="#f2efe6"/><path d="M14.5 24 L17 19.5 M25.5 24 L23 19.5" stroke="#f2efe6" stroke-width="1"/>`;
  if(X.includes('vest'))body+=`<rect x="13" y="21" width="14" height="12" rx="2" fill="${shade(oc,.75)}"/><rect x="15" y="24" width="3" height="3" fill="${shade(oc,.6)}"/><rect x="22" y="24" width="3" height="3" fill="${shade(oc,.6)}"/>`;
  if(X.includes('stripe')||(arm&&arm.k==='suit'))body+=`<rect x="11" y="30" width="18" height="2" fill="#dfe6d0"/>`;
  if(X.includes('tie'))body+=`<path d="M19 20 L21 20 L21.6 27 L20 29 L18.4 27Z" fill="#8a2a2a"/>`;
  if(X.includes('star'))body+=`<circle cx="15.5" cy="23.5" r="1.5" fill="#e8c34a"/>`;
  // 左手（盾）
  const sleeve=X.includes('coat')?'#f4f3ef':oc;
  if(pose==='lie'||pose==='sit'||pose==='idle'||pose==='scav'||pose==='medic'||pose==='repair'||pose==='guard'||pose==='patrol'){
    body+=`<rect x="7.6" y="20" width="4" height="14" rx="2" fill="${sleeve}"/><circle cx="9.6" cy="35" r="1.9" fill="${skin}"/>`;
    if(X.includes('fan')&&!bust)body+=`<path d="M9.5 35 L4 27 Q7 24.5 10 25.5Z" fill="#f4f2ea" stroke="#bbb" stroke-width=".4"/>`;
    if(X.includes('cross'))body+=`<rect x="7.9" y="23" width="3.4" height="3.4" fill="#fff"/><path d="M9.6 23.5 V26 M8.4 24.7 H10.8" stroke="#d33" stroke-width=".9"/>`;
    if(arm&&arm.k==='arm')body+=`<rect x="7.4" y="26" width="4.4" height="5" fill="#d8d2c2"/>`;
  }
  // 頭
  body+=`<rect x="18" y="16.5" width="4" height="3.5" fill="${shade(skin,.9)}"/><circle cx="20" cy="12" r="7" fill="${skin}"/>`;
  const ey=u.mut?'#ff4a3a':'#1b1410';body+=(u.mut?`<path d="M14 9 Q16 11 15 14 M26 9 Q24 11.5 25.5 14" stroke="#6a3a7a" stroke-width=".7" fill="none"/>`:'')+`<circle cx="17.6" cy="12.6" r="${u.mut?1.15:.95}" fill="${ey}"/><circle cx="22.4" cy="12.6" r="${u.mut?1.15:.95}" fill="${ey}"/><path d="M18.6 15.6 Q20 16.4 21.4 15.6" stroke="#6a3a2a" stroke-width=".6" fill="none"/>`;
  if(X.includes('beard'))body+=`<path d="M13.6 13 Q14.5 20.5 20 20.2 Q25.5 20.5 26.4 13 Q24.5 16.8 20 16.6 Q15.5 16.8 13.6 13Z" fill="${bc||hc}"/>`;
  if(X.includes('wbeard'))body+=`<path d="M13.4 13 Q13.5 25 20 26 Q26.5 25 26.6 13 Q24.5 17 20 16.8 Q15.5 17 13.4 13Z" fill="#ecebe6"/>`;
  if(X.includes('snout'))body+=`<ellipse cx="20" cy="14.6" rx="3.2" ry="2.2" fill="#e89aac"/><circle cx="19" cy="14.6" r=".6" fill="#8a4a5a"/><circle cx="21" cy="14.6" r=".6" fill="#8a4a5a"/><path d="M12 6 L10 12 L15 9Z M28 6 L30 12 L25 9Z" fill="#e89aac"/>`;
  if(X.includes('ears'))body+=`<path d="M13.2 11 L8.5 7.5 L13 13.5Z M26.8 11 L31.5 7.5 L27 13.5Z" fill="${skin}"/>`;
  if(X.includes('pin'))body+=`<line x1="23" y1="4" x2="29" y2="1.5" stroke="#e8c34a" stroke-width=".9"/><circle cx="29" cy="1.5" r="1" fill="#7ad0e0"/>`;
  if(X.includes('glasses'))body+=`<circle cx="17.4" cy="12.5" r="2.1" stroke="#222" stroke-width=".7" fill="none"/><circle cx="22.6" cy="12.5" r="2.1" stroke="#222" stroke-width=".7" fill="none"/><line x1="19.5" y1="12.4" x2="20.5" y2="12.4" stroke="#222" stroke-width=".6"/>`;
  if(X.includes('shades'))body+=`<rect x="15" y="11.2" width="10" height="2.6" rx="1" fill="#0d0d0d"/>`;
  body+=hairFront(hs,hc);
  if(X.includes('band'))body+=`<rect x="12.8" y="7.6" width="14.4" height="1.9" fill="#f4f1ea"/><circle cx="20" cy="8.5" r=".8" fill="#c33"/>`;
  if(u.inj&&!bust)body+=`<rect x="12.8" y="9" width="14.4" height="2.4" rx="1" fill="#f4f4f4" transform="rotate(-8 20 10)"/><circle cx="24" cy="9.6" r=".9" fill="#c33"/>`;
  // 右手 + 手上嘢
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.9" fill="${skin}"/>`;
  const armLine=(x2,y2)=>`<line x1="29.5" y1="22" x2="${x2}" y2="${y2}" stroke="${sleeve}" stroke-width="4" stroke-linecap="round"/>`;
  if(pose==='guard'){
    const k=wpn?wpn.k:'';
    if(k==='gun'){front+=armLine(34,21)+hand(34.5,21)+weaponSVG(k)}
    else if(k==='rifle'){front+=armLine(30,25)+weaponSVG(k)+hand(30,25)}
    else if(k==='spear'){front+=armLine(32,28)+weaponSVG(k)+hand(32,28)}
    else{front+=armLine(33,15)+weaponSVG(k)+hand(33.5,14.5)}
    if(arm&&arm.k==='shield')front+=`<rect x="3" y="21" width="9" height="16" rx="2" fill="#5d6f85" stroke="#2c3644" stroke-width=".8"/><rect x="4.5" y="25" width="6" height="1.4" fill="#e8e8e8"/>`;
  }else if(pose==='cook'){
    front+=`<line x1="10.5" y1="22" x2="14" y2="29" stroke="${sleeve}" stroke-width="4" stroke-linecap="round"/>${armLine(26,29)}<path d="M11 28 L29 28 L27.5 34 Q20 36 12.5 34Z" fill="${tool&&tool.k==='wok'?'#2a2a2a':'#7d848c'}"/><path d="M15 26 Q16 24 15 22 M20 26 Q21 23.5 20 21 M25 26 Q26 24 25 22" stroke="#d8d8d8" stroke-width=".6" fill="none" opacity=".8"/>`;
  }else if(pose==='medic'){
    front+=armLine(31,31)+`<rect x="28.5" y="30" width="9" height="7" rx="1.2" fill="#f4f4f4"/><path d="M33 31.3 V35.7 M30.8 33.5 H35.2" stroke="#d33" stroke-width="1.3"/>`+hand(30,31);
  }else if(pose==='repair'){
    front+=armLine(31,30)+`<line x1="31" y1="30" x2="37" y2="22" stroke="#8b939c" stroke-width="1.8"/><circle cx="37.3" cy="21.6" r="1.8" fill="none" stroke="#8b939c" stroke-width="1.3"/>`+hand(31,30);
  }else if(pose==='patrol'){
    front+=`<path d="M36 21 L40 15 L40 29Z" fill="#ffe08a" opacity=".55"/>`+armLine(34,22)+`<rect x="33" y="20.5" width="4" height="2.6" rx=".8" fill="#333"/>`+hand(33.5,22);
    if(tool&&tool.k==='bino')front+=`<rect x="15" y="10.5" width="10" height="3.4" rx="1.4" fill="#222"/>`;
  }else if(pose==='scav'){
    front+=`<rect x="28.5" y="20" width="4" height="14" rx="2" fill="${sleeve}"/>`+(tool&&tool.k==='pack'?'':`<path d="M28 35 Q29 33 32 33 Q35 33 36 35 L36.5 44 Q32 46 27.5 44Z" fill="#8a6a3e"/>`)+hand(30.5,35);
  }else{
    front+=`<rect x="28.4" y="20" width="4" height="14" rx="2" fill="${sleeve}"/>`+hand(30.4,35);
  }
  if(pose==='sit')front+=`<text x="29" y="8" font-size="6" fill="#86afcf" font-family="sans-serif">z</text><text x="33" y="4.5" font-size="4.5" fill="#86afcf" font-family="sans-serif">z</text>`;
  let inner=back+body+front;
  if(X.includes('dwarf'))inner=`<g transform="translate(3 9.5) scale(.85)">${inner}</g>`;
  if(X.includes('kid'))inner=`<g transform="translate(4.4 12.3) scale(.78)">${inner}</g>`;
  if(pose==='lie')inner=`<g transform="translate(2 54) rotate(-90) scale(.72)">${inner}</g><rect x="1" y="47" width="38" height="6" rx="2" fill="#4a3f36"/>`+(u.crit?`<path d="M33 40 V46 M30 43 H36" stroke="#e0503b" stroke-width="1.6"/>`:'');
  const vb=bust?'6.5 0.5 27 27':'0 0 40 56';
  return `<svg viewBox="${vb}" aria-hidden="true">${!bust&&pose!=='lie'?'<ellipse cx="20" cy="53" rx="10" ry="2" fill="rgba(0,0,0,.35)"/>':''}${inner}</svg>`;
}
Object.assign(LOOK,{
 u_lubu:'feather,#c9a23a,#9b2a22,T,cape',u_wukong:'monkey,#c98a2a,#c9a23a,F,',u_thor:'long,#c0612a,#4a5a78,L,beard cape',u_davinci:'beret,#5a1a24,#6a2a34,L,wbeard',
 u_bride:'redveil,#b01e22,#b01e22,P,',u_chenmo:'topknot,#111,#1d1d24,T,sash',u_liu:'long,#111,#dfe9f2,P,pin sash',u_merlin:'wizard,#2a3a7a,#2a3a7a,L,wbeard',
 s_zhuge:'guan,#2a3f6a,#e9e6dc,T,beard fan,#222',s_diaochan:'bun,#111,#c23a6a,P,pin',s_huatuo:'topknot,#ddd,#6a5a3a,T,beard,#ddd',s_brynhild:'wing,#cfd6de,#8a95a3,L,cape',
 s_loki:'horn,#3c7a3a,#2f5a2f,L,cape',s_zhongkui:'guan,#222,#9b2a22,M,beard,#111',
 r_bajie:'bald,#000,#3a4a6a,K,snout',r_tang:'monkcap,#d8b03a,#c8742a,L,robe',r_xiaoqian:'long,#111,#f0eeee,P,',r_brokk:'bald,#7a4a22,#5a4030,L,dwarf beard,#a0522d',
 r_elin:'long,#e6d28a,#3f6a3a,L,ears',r_linfan:'topknot,#111,#4a5a6a,T,',r_su:'pony,#111,#e6eef4,L,pin sash',
 c_lam:'short,#222,#3a6a8a,T,',c_yun:'bun,#111,#e8a8c0,T,cross',c_ken:'crop,#222,#7a5a3a,T,',c_frank:'crop,#9a9a9a,#5a6a3a,L,beard',c_sze:'wavy,#2a1a10,#d8a040,T,',
 c_wai:'short,#111,#f2f2f2,T,apron',c_jieun:'long,#3a2018,#f0a0c0,T,',c_pang:'bald,#555,#e8e8e0,T,beard,#888',
 n_b:'short,#111,#f2f2f2,T,',n_fong:'curly,#333,#4a8a6a,T,',n_agent:'short,#111,#2a3a5a,T,tie',n_tom:'wavy,#c9a060,#4a7a9a,L,',n_lin:'pony,#111,#ffffff,T,tie',
 n_leung:'short,#bbb,#7a6a5a,T,glasses',n_fisher:'cap,#4a6a3a,#8a9a6a,T,',n_hawker:'crop,#444,#c0a060,T,'
});
/* 覆寫：頭像同棋子改用人物圖 */
function av(id,extra=''){
  const c=CH[id],u=(G&&G.units.find(x=>x.id===id))||{id};
  return `<div class="av r-${c.g} ${extra}">${fig(u,null,true)}<span>${c.g}</span></div>`;
}
function tok(u){
  const c=CH[u.id],j=canWork(u,u.job)?u.job:'rest';
  return `<button class="tok ${SEL===u.id?'sel':''}" data-tok="${u.id}" aria-label="${esc(c.n)}"><span class="th r-${c.g}" style="--ring:${tokRing(u)}">${fig(u,j,true)}</span>${isS(u,j)?'<i>S</i>':''}<small class="rn ${c.g}">${esc(c.n.split(' ')[0])}</small></button>`;
}
