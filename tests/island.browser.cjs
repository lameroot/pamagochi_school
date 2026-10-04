const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.APP_URL||'http://127.0.0.1:8775/pamagochi_school_site/island.html';
(async()=>{const browser=await chromium.launch({args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390});
  const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>requests.push(r.url()));
  await page.goto(url);await page.locator('#interactions:not([disabled])').waitFor({timeout:30000});
  assert.equal(await page.locator('#viewport canvas').count(),1);
  await page.waitForTimeout(1400);await page.screenshot({path:`/private/tmp/island-overview-${width}.png`,fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
  const feedback=()=>page.locator('#feedback').textContent();
  const check=async()=>{await page.locator('#check').click();return await feedback();};
  const pick=async(id)=>page.locator(`[data-item="${id}"]`).click();
  const dock=async(id)=>page.locator(`[data-dock="${id}"]`).click();
  const station=async(i)=>page.locator(`.stations [data-station="${i}"]`).click();
  assert.match(await check(),/Сначала/);await page.locator('#hint-toggle').click();assert.equal(await page.locator('#hint').isVisible(),true);
  await page.locator('#hint-toggle').click();assert.equal(await page.locator('#hint').isVisible(),false);
  await dock('sphere');assert.match(await feedback(),/Сначала/);
  await pick('sphere');await dock('cube');assert.match(await check(),/Посмотри/);
  await pick('sphere');await dock('sphere');assert.match(await check(),/Уже верно: 1/);
  // Reassigning an occupied dock returns its previous item. No duplication.
  await pick('cube');await dock('sphere');await pick('sphere');await dock('sphere');
  for(const s of ['cube','cylinder','cone']){await pick(s);await dock(s);}
  assert.match(await check(),/Все 4/);await check();assert.equal(await page.locator('#star-count').textContent(),'1 из 3 открытий');
  await page.locator('#tour').click();await page.waitForTimeout(1300);await page.screenshot({path:`/private/tmp/island-workshop-${width}.png`,fullPage:true});
  await station(1);assert.match(await check(),/Пятый элемент пока/);
  const slot=async(i)=>page.locator(`[data-slot="${i}"]`).click();
  const choice=async(s)=>page.locator(`[data-choice="${s}"]`).click();
  await choice('coral-sphere');assert.match(await check(),/Одна деталь уже верна/);
  await slot(1);await choice('coral-cone');assert.match(await check(),/исправь только цвет/);
  await choice('blue-cube');assert.match(await check(),/исправь только форму/);
  await choice('blue-cone');assert.match(await check(),/Мост восстановлен/);
  await page.waitForTimeout(1100);await page.screenshot({path:`/private/tmp/island-bridge-${width}.png`,fullPage:true});
  await station(2);assert.match(await check(),/Корпус пока/);
  await choice('blue-cylinder');assert.match(await check(),/Нос пока/);
  await slot(1);await choice('blue-cone');assert.match(await check(),/исправь только цвет/);
  await choice('coral-cone');await check();assert.equal(await page.locator('#complete-dialog').isVisible(),true);
  assert.equal(await page.locator('#star-count').textContent(),'3 из 3 открытий');
  await page.locator('#launch').click();await page.waitForTimeout(1800);assert.match(await feedback(),/Поехали/);
  await page.reload();await page.locator('#interactions:not([disabled])').waitFor();assert.equal(await page.locator('#star-count').textContent(),'3 из 3 открытий');
  await station(2);await choice('coral-cylinder');assert.equal(await page.locator('#star-count').textContent(),'2 из 3 открытий');
  await choice('blue-cylinder');await check();await page.locator('#keep-exploring').click();
  await page.locator('#reset').click();await page.locator('#reset-cancel').click();assert.equal(await page.locator('#star-count').textContent(),'3 из 3 открытий');
  await page.evaluate(()=>localStorage.setItem('ordinary-lesson-sentinel','keep'));
  await page.locator('#reset').click();await page.locator('#reset-confirm').click();assert.equal(await page.locator('#star-count').textContent(),'0 из 3 открытий');
  assert.equal(await page.evaluate(()=>localStorage.getItem('ordinary-lesson-sentinel')),'keep');
  // Keyboard and camera controls; all maths controls have native button semantics.
  await page.locator('[data-item="sphere"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-item="sphere"]').getAttribute('aria-pressed'),'true');
  await page.locator('#viewport').focus();await page.keyboard.press('ArrowRight');
  for(const id of ['zoom-in','zoom-out','orbit','overview'])await page.locator('#'+id).click();
  await page.setViewportSize({width:320,height:850});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);console.log('PASS',width,'3D GLB loads; empty/wrong/partial/correct/retry; hint; persistence; progress invalidation; isolated reset; launch; keyboard; 320px');await page.close();
 }
 // Denied/corrupt storage is recoverable, never renders unchecked HTML from storage.
 const page=await browser.newPage();await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('denied')};Storage.prototype.getItem=function(){throw Error('denied')}});await page.goto(url);await page.locator('#interactions:not([disabled])').waitFor();assert.match(await page.locator('#save-note').textContent(),/недоступно/);await page.close();
 const broken=await browser.newPage();await broken.route('**/island.glb',r=>r.abort());await broken.goto(url);await broken.locator('#retry-3d').waitFor();assert.equal(await broken.locator('#check').isDisabled(),true);await broken.close();
 console.log('PASS unavailable storage and model-load error recovery');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
