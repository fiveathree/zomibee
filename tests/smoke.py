"""煙霧測試：開遊戲、抽卡、倖存者地圖、一鍵分配、模擬 60 日，檢查有冇 JS 錯誤。

用法：
  pip install playwright && playwright install chromium
  sh build.sh && python3 tests/smoke.py
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / 'index.html').as_uri()
ok = True

def check(name, cond, extra=''):
    global ok
    print(('PASS ' if cond else 'FAIL ') + name, extra)
    ok = ok and bool(cond)

with sync_playwright() as p:
    b = p.chromium.launch()
    for vw, vh in [(1440, 900), (390, 800)]:
        pg = b.new_page(viewport={'width': vw, 'height': vh})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(300)
        pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(300)
        pg.click('.opt >> nth=0'); pg.click('#nx'); pg.wait_for_timeout(200)
        # 抽卡：真係撳掣（試過撞名令掣冇反應）
        pg.evaluate("G.res.bat+=20000;go('radio')"); pg.wait_for_timeout(150)
        pg.click('#p10'); pg.wait_for_timeout(1300)
        check(f'[{vw}] 抽卡 3D 登場', pg.locator('.rv').count() == 1)
        if pg.locator('#rvSkip').count(): pg.click('#rvSkip')
        elif pg.locator('#rvNext').count(): pg.click('#rvNext')
        pg.wait_for_timeout(200)
        check(f'[{vw}] 抽卡結果格', pg.locator('.pullgrid').count() == 1)
        pg.evaluate("closeOv()")
        pg.click('[data-rt="gear"]'); pg.click('#g10'); pg.wait_for_timeout(1300)
        check(f'[{vw}] 裝備空投', pg.locator('.rv').count() + pg.locator('.pullgrid').count() >= 1)
        pg.evaluate("closeOv()")
        # 倖存者地圖 + 一鍵分配
        pg.evaluate("""()=>{for(let i=0;i<5;i++){pull(10);closeOv()};G.queue=[];
          ['market','estate','hardware'].forEach(k=>G.clear[k]=100);
          G.outposts={market:{loy:60,last:''},estate:{loy:60,last:''}};save();go('crew')}""")
        pg.wait_for_timeout(200)
        for m in ['bal', 'main', 'def', 'fa']:
            r = pg.evaluate(f"autoDistribute('{m}')")
            check(f'[{vw}] 一鍵分配 {m}', r['main'] > 0, r)
        pg.evaluate("arrangeMap();save();render()"); pg.wait_for_timeout(200)
        if vw > 760:
            ov = pg.evaluate("""(()=>{const n=[...document.querySelectorAll('.mnode')].map(n=>n.getBoundingClientRect());let c=0;
              for(let i=0;i<n.length;i++)for(let j=i+1;j<n.length;j++){const a=n[i],b=n[j];if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)c++}return c})()""")
            check(f'[{vw}] 地圖方塊冇重疊', ov == 0, ov)
        # 分部全部人最叻都係守夜（用家第 86 日撞到 reduce 空陣列，結束一日冇反應）
        r = pg.evaluate("""()=>{const _a=apt;apt=(u,j)=>j==='guard'?50:1;try{return opRoles(G.units.slice(0,4)).map(x=>x.j).join(',')}catch(e){return 'ERROR '+e.message}finally{apt=_a}}""")
        check(f'[{vw}] 分部全部守夜都分到工', 'ERROR' not in r and 'cook' in r, r)
        # 模擬 60 日
        pg.evaluate("""()=>{for(let d=0;d<60;d++){G.queue=[];if(G.over)break;autoAssign();endDay()}}""")
        check(f'[{vw}] 模擬 60 日', pg.evaluate('G.day') > 30, pg.evaluate('G.day'))
        for v in ['base', 'crew', 'radio', 'ach', 'log', 'menu']:
            pg.evaluate(f"go('{v}')"); pg.wait_for_timeout(80)
        if vw > 900:
            # 一版睇晒：據點頁同倖存者頁唔可以捲（用家講過好多次）
            pg.evaluate("""()=>{const cap=bedCap(G);let n=act(G).filter(u=>!isAnimal(u)).length;G.units.forEach(u=>{if(!u.act&&!isAnimal(u)&&n<cap){u.act=true;u.op=null;u.job=bestJob(u);n++}});autoAssign()}""")
            for v in ['base', 'crew']:
                pg.evaluate(f"go('{v}')"); pg.wait_for_timeout(150)
                h = pg.evaluate("document.documentElement.scrollHeight")
                check(f'[{vw}] {v} 一版睇晒（滿床）', h <= vh, h)
        check(f'[{vw}] 冇 JS 錯誤', not errs, errs[:3])
        pg.close()
    b.close()
sys.exit(0 if ok else 1)
