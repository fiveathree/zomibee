# 屍城日誌 ZOMIBEE：開發交接筆記

喪屍末日回合制生存網頁遊戲，有抽卡元素，風格參考 XIFM（fiveathree/XIFM）。純 HTML/CSS/JS，冇框架，冇 npm。玩家介面全部用**廣東話繁體字**，同用家溝通都用廣東話。

- Repo：https://github.com/fiveathree/zomibee（`main` branch）
- 上線：GitHub Pages，網址 https://fiveathree.github.io/zomibee/
  - 喺 Settings → Pages → Deploy from a branch → `main` / `(root)` 開啟。
- 存檔：瀏覽器 localStorage，key 係 `zomibee_v1`。

## 檔案結構同 build

```
src/            ← 真正嘅原始碼（改呢度）
build.sh        ← 將 src/ 按次序砌成 index.html
index.html      ← build 出嚟嘅單一檔案遊戲（唔好直接改，會被覆蓋）
favicon.svg
tests/smoke.py  ← Playwright 煙霧測試
README.md       ← 玩家介紹
```

**改完一定要 `sh build.sh`，再 commit `src/` 同 `index.html`。** Pages 讀嘅係 `index.html`。

所有 JS 檔會按次序串成**一個** `<script>`，次序好重要：

| 檔案 | 內容 |
|---|---|
| `1_head.html` | `<title>`、favicon（base64）、全部 CSS，同埋 header 同 tabs 嘅 markup。新 CSS 一律加喺 `</style>` 前面 |
| `2_data.js` | `ST`/`STN`（7 項數值）、`JOBS`、`TR` 特質、`CH_RAW`（第一批角色）、`CH`、`BY_G`、`LOCS`、`RES`、`LSCALE`、`FAC` 設施、`CHAPS` 1–7 章、`BASES`（據點同平面圖區域 `areas` / `z`）、`SPERK` |
| `2b_more.js` | 新特質、`NEW_CH`（UR 傳奇等）、`FA` 陣營、`CFA`（角色→陣營）、第 8–13 章、更多 `LOCS` / `BASES`、`DUNS` 副本、`synergy`、`MUT` 變種人 |
| `2d_water.js` | 水資源：城門水塘、蒸餾水廠、海水化淡廠（`LOCS` 同 `BASES`），中後期地點加水 |
| `3_engine.js` | 核心：`fxOf`（特質效果，有 cache `FXC`）、`statB`/`stat`、`apt`、`eff`、`forecast`、`hordeBase`、**`endDay`**（每日結算）、`autoAssign`、`relocate`、`canMove`。`CAPB`（隊長加能力 cache）喺 `stat` 入面用 |
| `4_events.js` `4b_events.js` | `EV` 事件表。有 `w` 嘅係隨機事件，`pre` 決定出唔出；`opts` 係選項，有 `l`/`req`/`fx` |
| `5_ui.js` | `fresh()` 新遊戲、`save`/`load`、`modal()`、`closeOv()`、`render()`、`doEnd`（每日報告）、`showQueue`、抽卡 `pull()`、`go()` |
| `6_fig.js` | SVG 人物：`LOOK`（髮型、髮色、衫色、膚色、配件）、`fig(u,job,bust)`、`animalSVG`、`av()`、`tok()` |
| `6b_cast.js` | 第二批 47 個角色 `CAST2`（每行最後一欄係陣營字）、佢哋嘅 `LOOK`、寵物顏色 `PETC` |
| `7_gear.js` `7b_more.js` | 裝備 `ITEMS`、稀有度、專屬套裝 `SETS`、裝備抽獎 `pullGear`、廣播頁 `rRadio`、`autoEquip`、`go` |
| `8_ach.js` | 獎章 `ACH`、致敬劇本 `SCRIPTS`、`render` 覆寫（加入 ach 頁） |
| `8b_layout.js` | 據點頁 `rBase`：第一行係 章節｜搜括地點同維修項目｜今晚；平面圖（拖人調工 `startDrag`）。`fitPlan` 喺桌面版（>900px）將平面圖高度定死喺視窗剩低嘅位（`.plan.fit`），人多就喺區域入面捲，成頁永遠唔使捲。桌面版右邊狀態欄 `sideBase`：撳人（`INFO`）顯示狀態，冇揀人就列出據點成員；`showPop` 喺度覆寫，手機版先用浮窗 |
| `8c_outpost.js` | 分部基本：`opMembers`、`reserveFree`、`opRoles`，同 `op_trade`/`op_help`/`op_raid`/`op_rebel` 事件 |
| `9a_char.js` | Diablo 式角色面板 `openUnit`、槍械精通 `GUNNERS`、綁定裝備 `BOUND`、個人背包 `BITEMS`、修仙 |
| `9b_crew.js` | 倖存者頁 `rCrew`：三國志式大地圖，只有地點標記（`.mnode.mk`，`mkHTML`，種類由 `locKind` 判斷：main／op／sq／cand／uncl／site／fog）。撳標記揀地點（`SELLOC`），右邊 `locSide` 顯示詳情同駐守嘅人；後備名單喺地圖下面。拖人 `crewDrag`/`crewMove`、標記排位 `fitNodes`（行兩次）、拖標記 `nodeDrag`、成頁高度 `fitCrew`、右邊闊度 `SIDEW`（`resDrag`）。裝備背包同離開咗嘅人用 `openInv`／`openGone` 彈窗 |
| `9c_reveal.js` | 抽到新角色或新裝備時嘅 3D 旋轉登場 `reveal()` |
| `9d_net.js` | 據點網絡，見下面「據點網絡」 |
| `9e_newgame.js` | 多周目：永久記錄 `meta()`（localStorage `zomibee_meta`：`ach` 永久獎章、`wins` 通關次數，`save` 時 `syncMeta` 同步）；`openNewGame` 開局畫面；`fresh(o)` 支援 `o.start`（`normal`／`ur`／`trio`／`rand`／`pets`／`lone`）、`o.shuffle`、`o.diff`（`DIFF`，寫入 `G.hmul` 乘屍潮）、`o.rich`；`meta().unlock`（兌換碼 `ZOMIPLAY`）等同通關咁解鎖全部開局玩法；兌換碼 `ZOMI86` 補返用家舊局獎章；天崩開局專屬角色 `LONE`／`LONEDOG`（唔入抽卡池）；過場畫面 `chapCard`（`ch_card` 同 `script_open` 喺 `showQueue` 前攔截） |
| `9_boot.js` | 啟動同舊存檔 migrate（**一定要最後**） |

### 覆寫模式（重要）

後面嘅檔案經常覆寫前面嘅函數，有兩種寫法：

1. **同名 `function` 再宣告一次**：因為全部係同一個 script，最後一個生效，而且係 hoist 嘅。例如 `rCrew`、`simOutposts`、`opCands`、`openUnit`。
2. **包一層**：`{const _x=fn; fn=function(){...; return _x.apply(this,arguments)}}`。例如 `render`、`save`、`endDay`、`eff`、`relocate`、`addItem`。

**陷阱：**

- **`const` 箭咀函數唔可以覆寫**（例如 `stat`、`statB`、`opLeader`），要直接改原檔。
- **函數撞名**：所有函數都喺全域。之前 3D 登場用咗 `spin()`，撞咗廣播頁指針嘅 `spin()`，令抽卡掣冇反應，後來改名做 `rvTurn`。加新函數前要先 `grep -n "function 名" src/*.js`。
- **CSS class 撞名**：`.sel` 已經係下拉選單嘅樣式（`width:100%`），揀咗嘅 chip 要用 `.pk`。新 class 名前要先 grep。
- `[hidden]{display:none!important}` 係全域規則。
- `modal(html,bind)`：`.modal.dismiss` 撳外面會關。`closeOv()` 會 `render()`。

## 遊戲狀態 `G`（重點欄位）

| 欄位 | 內容 |
|---|---|
| `day`、`ch` | 日數同第幾章（難度、日數跟佢）。`chDay` 記每章開始日。亂數局有 `order`（第幾章 → 講邊個故事），一律用 `stN(g,pos)`、`curChap(g)`、`reached(g,n)`、`posOf(g,n)`，唔好直接用 `CHAPS[g.ch-1]` 或者 `l.ch<=g.ch` |
| `scrMap`、`mode` | 亂數局：獎章 → 解鎖邊個致敬劇本（用 `achUnl(a)`）；特別開局種類 |
| `res` | food、water、med、parts、ammo、bat（電池＝抽卡貨幣）、core（晶核）、serum |
| `fort`、`fac` | 圍牆值同設施等級 |
| `base` | 主據點 id |
| `clear[id]` | 清場度。100 先可以搬去或者開分部 |
| `units[]` | `{id,act,job,hp,sta,san,inj,crit,inf,iso,sick,star,eq:{weapon,armor,tool},bag,mut,cult,op}`。`act` 表示喺主據點；`op` 係分部 id 或者 `'squad'`（游擊隊） |
| `outposts[id]` | `{loy,last,stock}`（stock 係未連主據點時暫存嘅物資） |
| `lines[]` | 補給線，格式 `'base|market'`，`'base'` 永遠代表而家嘅主據點 |
| `cap{}` | 隊長：`{base:uid, market:uid, squad:uid}` |
| `sqT`、`sqAt`、`sqLast` | 游擊隊：協防目標（auto 或據點 key）、昨晚去咗邊、報告 |
| `idle{id}` | 已清場但無人駐守嘅日數，夠 7 日會被重新佔據 |
| `mapPos{}`、`mapFix{}` | 地圖方塊位置（%）、用家手動拖過嘅方塊 |
| `dex`、`gdex` | 角色圖鑑、裝備圖鑑（`gdex` 用嚟判斷係咪新裝備） |
| `inv`、`stash`、`ach`、`dun`、`queue`、`pity`、`gpity` | 背包、倉庫、獎章、副本、事件隊列、抽卡保底 |

## `endDay` 流程

1. **白天**：搜括、巡邏、維修、醫療
2. **被動**：設施產出、據點 perk
3. **晚飯**
4. **`simOutposts`**，由 `9d_net.js` 覆寫：
   - 主據點隊長效果
   - 分部搜括
   - 補給線互相送物資
   - 援兵、游擊隊
   - 分部夜晚，人手唔夠或者淪陷
   - 運物資返主據點
   - 無人地點 `siteDecay`
   - `bondDaily`（同陣形友好、適合據點）
   - 回傳主據點收到嘅援兵防禦
5. **夜晚**：屍潮對防禦
6. **狀態**、感染同變種
7. 死亡
8. 新一日、章節檢查 `checkObj`（每章送 900 電池）、獎章 `checkAch`

## 據點網絡（`9d_net.js`）

- **補給線**：分部唔夠食物或者水，會沿線由近到遠向其他分部或主據點攞。每段路有 4% 機會被截。隊長有 `line` 技能嘅話唔會被截，條線會變綠色。
- **未連主據點**：分部嘅剩餘物資會存入 `o.stock`。
- **援兵**：防守有餘嘅鄰近據點，會派一半餘力去協防唔夠嘅據點。
- **游擊隊**：`op='squad'`，最多 6 人。每晚去 `sqT` 或者自動去最危險嘅據點，會食主據點嘅糧。
- **隊長**：`CAPSK[id]` 定義隊長技能，欄位有 `def`、`loot`、`loy`、`heal`、`san`、`eat`、`line`、`squad`、`reinf`，`b` 係幫隊員加嘅能力。
  - 一般隊長（`capGen`）：每點意志防禦 +0.5%。
  - 隊長效果讀 `capFx(k,key)`。
  - 隊員加能力寫入 `CAPB`，喺 `render`、`save`、`endDay` 時用 `capCache()` 重算。
- **陣形**：`BASE_FA` 定義每個據點適合嘅陣營。合適嘅人效率 ×1.15、意志 +1。同陣形嘅朋友會：
  - 減少爭執
  - 令反骨角色唔背叛
  - 令分部唔容易叛變
- **人手**：`opNeed`（大約床位 / 4）。人手唔夠會令屍群壓力增加；屍群大過防守 1.5 倍時，有 45% 機會淪陷（`opFall`）。
- **一鍵分配**：`autoDistribute(mode)`，四個 mode：`bal`、`main`、`def`、`fa`。
- **還原位置**：`arrangeMap()` 清空 `G.mapPos`，全部地點返去 `MAPPOS` 原位。
- **其他**：
  - 水車商人事件 `EV.water_trade`
  - 有人駐守嘅分部每日 +2 水

## 加嘢嘅方法

- **新角色**：喺 `6b_cast.js` 嘅 `CAST2` 加一行。
  - 格式：`[id,名,等級,出身,職業,[力,敏,感,技,醫,廚,意],[特質],專長名,專長描述,{fx},簡介,頭像字,陣營字]`
  - 再喺 `LOOK` 加外形。髮型可以用：short crop bald curly cap beret feather guan bun wing horn monkcap wizard long wavy pony topknot veil redveil hat helm monkey。
  - 強角可以喺 `9d_net.js` 嘅 `CAPSK` 加隊長技能。
- **新地點或據點**：`LOCS` 加 `{id,n,ch,dg,loot}`。`BASES` 加 `{n,beds,wall,horde,d,perk,pd,areas:A3|A4|A5,z:{各區名}}`，另外要加：
  - `MAPPOS`（地圖位置 %）
  - `BASE_FA`（適合陣營）
  - `LOCITEM`（可以搵到嘅裝備）
- **新事件**：`EV.xxx={w,t,pre,txt,opts}`。事件 `c` 入面唔好用 `u`、`a`、`b` 做非角色嘅 key，`showQueue` 會當佢係角色 id，搵唔到就剔走個事件。
- **新特質效果 key**：喺 `fxOf` 嘅結果讀。乘數類嘅 key 要加入 `MULK`。

## 測試

```sh
pip install playwright && playwright install chromium   # 第一次
sh build.sh && python3 tests/smoke.py
```

會用桌面 1440×900 同手機 390×800 兩個尺寸測：

- 真正撳抽卡掣
- 3D 登場
- 裝備空投
- 四種一鍵分配
- 地圖方塊冇重疊
- 模擬 60 日
- 滿床時據點頁同倖存者頁一版睇晒（電腦版）
- 逐頁切換，冇 JS 錯誤

改 UI 之後最好用 Playwright 截圖睇吓，特別係：

- 據點頁桌面版要一版睇晒、唔使捲（`fitPlan`）
- 角色面板一版睇晒
- 每日報告一版睇晒

## 設計原則（用家要求過）

- **全部人都有用**：唔可以靠全 UR 隊無敵。冇人煮飯、巡邏、維修都會出事。
- **一版睇晒**：據點頁、倖存者頁、角色面板、報告都唔使捲，地圖標記唔好遮住。用家講過好多次，**最重要**。`tests/smoke.py` 會用滿床據點檢查電腦版據點頁同倖存者頁唔會捲。平面圖上嘅人用頭像（`tok()` 用 `fig(u,j,true)`），唔用全身。
- **名字顏色**：跟稀有度，用 `.rn.UR/SSR/SR/R/C`。
- **寵物**：貓狗唔識講嘢，唔佔床位，唔做煮飯、維修、醫療。
- **人工**：唔好用真實在世人物，亦唔好用有版權嘅角色名。歷史人物同神話人物可以用。

## 已知可以再做嘅嘢

- 裝備圖鑑都按等級分組（倖存者圖鑑已經分咗）
- 水同食物仍然要留意平衡，`tests` 入面可以加資源流量模擬
- 手機版地圖標記好密，加新地點時要留意會唔會重疊（`fitNodes` 搵唔到空位就會撞埋）
