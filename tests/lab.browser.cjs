// Optional development test. The website itself needs no Node.js or build.
// NODE_PATH=/path/to/node_modules node tests/lab.browser.cjs
// Start a repository-root HTTP server first; override LAB_URL if needed.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.LAB_URL||'http://127.0.0.1:8775/pamagochi_school_site/index.html#lesson/transformations';
const path=require('node:path');
const output=process.env.LAB_SCREENSHOTS||'/tmp';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const context=await browser.newContext({viewport,isMobile:viewport.width<600,hasTouch:viewport.width<600});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))errors.push(m.text());});
  await page.goto(url);
  const go=async id=>{await page.evaluate(id=>location.hash='#lesson/'+id,id);await page.locator('#laboratory #t'+({transformations:1,sizes:5,groups:9}[id])).waitFor({state:'visible'});};
  const click=async selector=>{
   if(selector==='#next'){await page.locator('#next-lesson').click();return;}
   if(['#restart','#cancel-reset','#confirm-reset'].includes(selector)){await page.locator({'#restart':'#reset-open','#cancel-reset':'#reset-cancel','#confirm-reset':'#reset-confirm'}[selector]).click();return;}
   return page.locator('#laboratory').locator(selector).click();
  };
  const pick=(k,v)=>click(`[data-key="${k}"][data-value="${v}"]`);
  const fill=(k,v)=>page.locator('#laboratory ').locator(`[data-input="${k}"]`).fill(String(v));
  const choose=(k,v)=>page.locator('#laboratory ').locator(`[data-input="${k}"]`).selectOption(String(v));
  const multi=(k,v)=>click(`[data-multi="${k}"][data-value="${v}"]`);
  const check=async(id,ok)=>{await click(`[data-check="${id}"]`);assert.equal(await page.locator('#laboratory ').locator(`#t${id}`).evaluate(e=>e.classList.contains('done')),ok,'task '+id);assert.ok(await page.locator('#laboratory ').locator(`#t${id} .feedback`).textContent());};
  const paint=async(id,c,k)=>{await click(`#t${id} [data-paint="${c}"]`);await click(`[data-color-key="${k}"]`);};
  const builder=async(n,s,c,z)=>{await pick(n+'.shape',s);await pick(n+'.color',c);await pick(n+'.size',z);};
  const emptyAndHints=async(start)=>{for(let n=start;n<start+4;n++){await check(n,false);await click(`[data-hint="${n}"]`);assert.equal(await page.locator('#laboratory ').locator('#h'+n).isVisible(),true);await click(`[data-hint="${n}"]`);assert.equal(await page.locator('#laboratory ').locator('#h'+n).isVisible(),false);}};
  const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${viewport.width}`);
  await emptyAndHints(1);
  await page.screenshot({path:path.join(output,`lab-${viewport.width}-lesson3.png`),fullPage:true});
  await noOverflow();
  await pick('1.0','circle');await check(1,false);await pick('1.0','triangle');await check(1,false);
  await pick('1.1','circle');await pick('1.2','rect');await pick('1.3','circle');await check(1,true);await check(1,true);
  assert.match(await page.locator('#total-count').textContent(),/^1 \//);
  await builder(2,'circle','red','big');await check(2,false);await builder(2,'triangle','blue','small');await check(2,true);
  for(const [i,c] of [[5,'yellow'],[7,'yellow'],[9,'blue'],[10,'yellow']])await paint(3,c,'3.b'+i);
  await check(3,false);await fill('3.blue',5);await fill('3.yellow',8);await fill('3.total',12);await check(3,false);await fill('3.blue',4);await check(3,true);
  for(const [i,c] of ['red','blue','red','red','green','green','blue','yellow','yellow','yellow'].entries())await paint(4,c,'4.p'+i);
  await fill('4.tri',3);await fill('4.cir',3);await check(4,false);assert.match(await page.locator('#laboratory ').locator('#t4 .feedback').textContent(),/Осталось заполнить 1/);
  await choose('4.sign','>');await check(4,false);await choose('4.sign','=');await check(4,true);
  // Editing a solved answer removes its completion until checked again.
  await fill('4.tri',2);assert.match(await page.locator('#total-count').textContent(),/^3 \//);await fill('4.tri',3);await check(4,true);
  await page.reload();assert.match(await page.locator('#total-count').textContent(),/^4 \//);assert.equal(await page.locator('#laboratory ').locator('[data-input="4.tri"]').inputValue(),'3');
  await go('sizes');await emptyAndHints(5);await noOverflow();
  await page.screenshot({path:path.join(output,`lab-${viewport.width}-lesson4.png`),fullPage:true});
  for(const l of ['А','Б','В','Г'])await click(`[data-rank="${l}"]`);await check(5,false);
  for(let i=0;i<4;i++)await click('[data-unrank="0"]');
  for(const l of ['Г','Б','А','В'])await click(`[data-rank="${l}"]`);await check(5,true);
  await builder(6,'square','blue','big');await multi('6.props','0');await check(6,false);await multi('6.props','2');await check(6,true);
  const pixels=['001100','011110','110011','111111','010010','110011'].join('');
  await click('[data-pixel="0"]');await check(7,false);await click('[data-clear-grid]');
  for(let i=0;i<pixels.length;i++)if(pixels[i]==='1')await click(`[data-pixel="${i}"]`);
  await check(7,false);await fill('7.count',4);await check(7,true);
  await pick('8.a','sm');await pick('8.b','wrong');await check(8,false);await pick('8.a','md');await pick('8.b','right');await check(8,true);
  await click('#next');await emptyAndHints(9);await noOverflow();
  await page.screenshot({path:path.join(output,`lab-${viewport.width}-lesson5.png`),fullPage:true});
  await multi('9.props','small');await pick('9.new','a');await check(9,false);await multi('9.props','small');await multi('9.props','green');await multi('9.props','triangle');await pick('9.new','c');await check(9,true);
  await click('[data-cargo="0"]');await click('[data-zone="Г"]');await check(10,false);
  for(const [i,z] of ['A','Г','Б','В','Б','В','Г','A'].entries()){await click(`[data-cargo="${i}"]`);await click(`[data-zone="${z}"]`);}
  await fill('10.count',2);await check(10,true);
  for(const [i,c] of ['blue','green','blue'].entries()){await choose('11.c'+i,c);await choose('11.a'+i,i===2?1:2);}
  await multi('11.team','2');await check(11,false);await multi('11.team','2');await multi('11.team','1');await check(11,true);
  for(let i=0;i<6;i++)await paint(12,'blue','12.v'+i);await check(12,false);
  for(const [i,c] of ['blue','green','red','green','blue','red'].entries())await paint(12,c,'12.v'+i);await check(12,true);
  assert.match(await page.locator('#total-count').textContent(),/^12 \//);assert.equal(await page.locator('#lesson-complete').isVisible(),true);
  await page.reload();assert.match(await page.locator('#total-count').textContent(),/^12 \//);
  // A second valid palette must also pass (not a hidden fixed answer).
  for(const [i,c] of ['yellow','red','green','red','yellow','green'].entries())await paint(12,c,'12.v'+i);await check(12,true);
  await click('#restart');await click('#cancel-reset');assert.match(await page.locator('#total-count').textContent(),/^12 \//);
  await click('#restart');await click('#confirm-reset');assert.match(await page.locator('#total-count').textContent(),/^8 \//);await page.evaluate(()=>location.hash='#lesson/transformations');await page.waitForTimeout(50);await click('#restart');await click('#confirm-reset');assert.equal(await page.locator('#lesson-complete').isVisible(),false);
  await page.reload();assert.equal(await page.locator('#laboratory ').locator('[data-input="3.total"]').inputValue(),'');assert.equal(await page.locator('#laboratory ').locator('#h1').isVisible(),false);
  // Keyboard SVG painting, selection, and hint access.
  await page.locator('#laboratory ').locator('[data-color-key="4.p0"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#laboratory ').locator('[data-color-key="4.p0"]').getAttribute('fill'),'#5792e5');
  // 320px is an additional narrow layout check across all chapters.
  if(viewport.width===390){await page.setViewportSize({width:320,height:700});for(let i=0;i<3;i++){await go(['transformations','sizes','groups'][i]);await noOverflow();}}
  assert.deepEqual(errors,[]);console.log(`PASS ${viewport.width}: all 12 tasks, wrong/empty/partial/retry, hints, progress, reload, reset, keyboard, layout`);
  await context.close();
 }
 const context=await browser.newContext();const p=await context.newPage();
 await p.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')};});await p.goto(url);assert.match(await p.locator('#storage-note').textContent(),/недоступно/);await p.locator('#laboratory [data-check="1"]').click();await context.close();
 const p2=await browser.newPage();await p2.goto(url);await p2.evaluate(()=>localStorage.setItem('pamagochi-lab-v1','{broken'));await p2.reload();assert.equal(await p2.locator('#laboratory .task').count(),4);
 await p2.goto('http://127.0.0.1:8775/');await p2.waitForURL('**/pamagochi_school_site/index.html');await p2.locator('.lesson-card[href="#lesson/transformations"]').click();assert.match(p2.url(),/#lesson\/transformations$/);
 console.log('PASS unavailable storage, corrupt storage, root entry point and old-to-new navigation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
