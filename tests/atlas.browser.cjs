const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.APP_URL||'http://127.0.0.1:8775/pamagochi_school_site/atlas.html';
(async()=>{
const browser=await chromium.launch({args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width===390,isMobile:width===390});
  const errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failures.push(r.url()));
  await page.goto(url);await page.locator('#start:not([disabled])').waitFor({timeout:30000});
  await page.waitForTimeout(800);await page.screenshot({path:'/private/tmp/atlas-'+width+'.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#start').click();
  const pos=await page.locator('#world').getAttribute('data-position');
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(400);await page.keyboard.up('ArrowRight');
  assert.notEqual(await page.locator('#world').getAttribute('data-position'),pos);
  const before=await page.locator('#world').getAttribute('data-position');
  const dpad=page.locator('[data-dir="down"]');await dpad.dispatchEvent('pointerdown',{pointerId:1});await page.waitForTimeout(350);await dpad.dispatchEvent('pointerup',{pointerId:1});
  assert.notEqual(await page.locator('#world').getAttribute('data-position'),before);
  await page.locator('[data-mission="1"]').click();assert.match(await page.locator('#travel-status').textContent(),/Сначала/);
  async function mission(i){await page.locator('[data-mission="'+i+'"]').click();await page.waitForFunction(i=>document.querySelector('#interact').textContent.includes(['Мост узоров','Сад фонариков','Звёздный маяк'][i])&&!document.querySelector('#nearby').hidden,i,{timeout:30000});await page.locator('#interact').click();}
  const check=async()=>{await page.locator('#check').click();return page.locator('#feedback').textContent();};
  const choice=async v=>page.locator('[data-choice="'+v+'"]').click();
  await mission(0);assert.match(await check(),/Выбери/);
  await page.locator('#hint-button').click();assert.ok(await page.locator('#hint').isVisible());await page.locator('#hint-button').click();assert.equal(await page.locator('#hint').isVisible(),false);
  await choice('blue-circle');assert.match(await check(),/форма верная/);
  await page.locator('[data-slot="0"]').click();await choice('coral-circle');assert.match(await check(),/Клетка 1 верна/);
  await choice('blue-square');assert.match(await check(),/Мост готов/);
  assert.equal(await page.locator('#world').getAttribute('data-bridge'),'true');
  await page.locator('#return-world').click();
  await mission(1);assert.match(await check(),/Сначала/);
  await page.locator('#yellow-count').fill('4');assert.match(await check(),/посчитаны верно/);
  await page.locator('#blue-count').fill('2');assert.match(await check(),/Посчитай только синие/);
  await page.locator('#blue-count').fill('3');assert.match(await check(),/Оба числа верны/);
  await page.locator('[data-sign="<"]').click();assert.match(await check(),/Оба числа верны/);
  await page.locator('[data-sign=">"]').click();assert.match(await check(),/Сад засиял/);
  assert.equal(await page.locator('#world').getAttribute('data-garden'),'true');await page.locator('#return-world').click();
  await mission(2);assert.match(await check(),/Выбери/);
  await choice('blue-circle');assert.match(await check(),/цвет верный/);
  await page.locator('[data-slot="0"]').click();await choice('blue-triangle');assert.match(await check(),/Клетка 1 верна/);
  await choice('gold-square');assert.match(await check(),/Маяк светит/);assert.equal(await page.locator('#world').getAttribute('data-beacon'),'true');
  await page.locator('#return-world').click();assert.ok(await page.locator('#victory').isVisible());
  await page.locator('[data-scarf="purple"]').click();await page.locator('[data-close="victory"]').click();
  await page.locator('#camera').click();await page.waitForTimeout(800);await page.screenshot({path:'/private/tmp/atlas-complete-'+width+'.png',fullPage:true});
  await page.reload();await page.locator('#start:not([disabled])').waitFor();
  assert.equal(await page.locator('#progress-text').textContent(),'3 из 3 открытий');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('pamagochi-atlas-v1')).scarf),'purple');
  await page.evaluate(()=>localStorage.setItem('ordinary-lesson-sentinel','keep'));
  await page.locator('#reset').click();await page.locator('[data-close="reset-dialog"]').click();assert.equal(await page.locator('#progress-text').textContent(),'3 из 3 открытий');
  await page.locator('#reset').click();await page.locator('#reset-confirm').click();assert.equal(await page.locator('#progress-text').textContent(),'0 из 3 открытий');
  assert.equal(await page.evaluate(()=>localStorage.getItem('ordinary-lesson-sentinel')),'keep');
  await page.setViewportSize({width:320,height:850});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log('PASS',width,'movement, missions, all answer states, world rewards, save/reload, cosmetic, reset, mobile layout; no JS errors');await page.close();
}
const denied=await browser.newPage();await denied.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('denied')};Storage.prototype.getItem=function(){throw Error('denied')};});await denied.goto(url);await denied.locator('#start:not([disabled])').waitFor();assert.match(await denied.locator('#save-note').textContent(),/недоступно/);await denied.close();
const corrupt=await browser.newPage();await corrupt.addInitScript(()=>localStorage.setItem('pamagochi-atlas-v1','broken json'));await corrupt.goto(url);await corrupt.locator('#start:not([disabled])').waitFor();assert.equal(await corrupt.locator('#progress-text').textContent(),'0 из 3 открытий');assert.match(await corrupt.locator('#save-note').textContent(),/Сохраняется/);await corrupt.close();
const failed=await browser.newPage();await failed.route('**/vendor/three.module.js',r=>r.abort());await failed.goto(url);await failed.getByRole('button',{name:'Перезагрузить',exact:true}).waitFor();assert.ok(await failed.locator('#start').isDisabled());await failed.close();
console.log('PASS denied storage and renderer loading fallback');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
