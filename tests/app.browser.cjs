const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.APP_URL||'http://127.0.0.1:8775/pamagochi_school_site/index.html';
(async()=>{const browser=await chromium.launch();try{
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900}}), errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 const root=page.locator('#foundations');const click=s=>root.locator(s).click();
 const go=async id=>{await page.evaluate(id=>location.hash='#lesson/'+id,id);await page.waitForTimeout(60);};
 const fill=async values=>{for(const [id,v] of Object.entries(values))await root.locator('#'+id).fill(String(v));};
 const select=async values=>{for(const [id,v] of Object.entries(values))await root.locator('#'+id).selectOption(v);};
 const pick=(group,id)=>click(`[data-single="${group}"] [data-id="${id}"]`);
 const check=async(n,ok)=>{await click(`[data-action="check${n}()"]`);assert.equal(await root.locator('#t'+n).evaluate(t=>t.classList.contains('done')),ok,'task '+n);};
 const sort=async n=>{while(await root.locator(`#t${n} .items .drag`).count()){const item=root.locator(`#t${n} .items .drag`).first();const kind=await item.getAttribute('data-kind');await item.click();await root.locator(`#t${n} .zone[data-kind="${kind}"] h3`).click();}};
 assert.equal(await page.locator('.lesson-card').count(),10);await page.screenshot({path:`/tmp/school-home-${width}.png`,fullPage:true});
 for(const [i,id] of ['shapes','numbers','properties','patterns'].entries()){
  await go(id);assert.equal(await root.locator('.task:visible').count(),4);
  for(let n=i*4+1;n<=i*4+4;n++){await check(n,false);await click(`#t${n} .hintbtn`);assert.equal(await root.locator('#h'+n).isVisible(),true);await click(`#t${n} .hintbtn`);}
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+id+' '+width);
 }
 await go('shapes');await click('[data-multi="t1"] [data-id="book"]');await check(1,false);await click('[data-multi="t1"] [data-id="book"]');await click('[data-multi="t1"] [data-id="ball"]');await check(1,false);await click('[data-multi="t1"] [data-id="apple"]');await check(1,true);await check(1,true);
 await sort(2);await check(2,true);await select({m3a:'ball',m3b:'gift',m3c:'can',m3d:'hat'});await check(3,true);await pick('t4','A');await check(4,true);assert.equal(await page.locator('#lesson-complete').isVisible(),true);
 await go('numbers');await pick('t5','bluecircle');await check(5,true);await fill({redCount:5,greenCount:5,yellowCount:3});await click('[data-group="cmp6"][data-sym="="]');await check(6,true);
 await fill({a3:3,a4s:4,a4r:4,a5:5});await check(7,false);await fill({a0:0});await check(7,true);await fill({codeRect:4,codePent:5});await check(8,true);
 await go('properties');await select({t9q1:'color',t9q2:'use',t9q3:'matr'});await check(9,true);await fill({t10red:2,t10yellow:4,t10big:6,t10small:9,t10all:15});await check(10,false);assert.match(await root.locator('#f10').textContent(),/Все числа верны/);await click('[data-group="cmp10"][data-sym="<"]');await check(10,true);
 await fill({t10red:3});assert.equal(await root.locator('#t10').evaluate(t=>t.classList.contains('done')),false);await fill({t10red:2});await check(10,true);
 for(const [g,ids] of [['q11a',['glass','tank']],['q11b',['ball','globe']],['q11c',['box','tank']]])for(const id of ids)await click(`[data-multi="${g}"] [data-id="${id}"]`);
 await check(11,true);await sort(12);await check(12,true);
 await go('patterns');await fill({t13c:8,t13t:6,t13s:5,t13r:5});await select({t13most:'circles'});await check(13,true);
 await select({p14a:'chick',p14b:'mitten',p14c:'frog',p14d:'berry',p14e:'bluesq',p14f:'yellowcir',p14g:'greenrect',p14h:'redtri'});await check(14,true);
 await click('#breakRow [data-index="9"]');await check(15,false);await pick('t15replace','blue');await pick('t15a','yb');await check(15,true);await pick('t16left','blue');await pick('t16right','tri');await check(16,true);
 assert.equal(await page.locator('#total-count').textContent(),'16 / 40');await page.reload();assert.equal(await page.locator('#total-count').textContent(),'16 / 40');
 await page.screenshot({path:`/tmp/school-lesson-${width}.png`,fullPage:true});
 await page.locator('#reset-open').click();await page.locator('#reset-cancel').click();assert.equal(await page.locator('#total-count').textContent(),'16 / 40');await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();assert.equal(await page.locator('#total-count').textContent(),'12 / 40');
 await go('shapes');assert.equal(await root.locator('#t2 .zone .drag').count(),4);await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();assert.equal(await root.locator('#sortItems1 .drag').count(),4);assert.equal(await page.locator('#total-count').textContent(),'8 / 40');
 await root.locator('#t1 [data-id="ball"]').focus();await page.keyboard.press('Enter');assert.equal(await root.locator('#t1 [data-id="ball"]').evaluate(e=>e.classList.contains('selected')),true);
 await page.setViewportSize({width:320,height:800});for(const id of ['shapes','numbers','properties','patterns','transformations','sizes','groups','group-workshop','collection-secrets','equal-groups']){await go(id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'320 overflow '+id);const clipped=await page.locator('.engine:not([hidden]) .task:visible').evaluateAll(nodes=>nodes.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.id));assert.deepEqual(clipped,[],'clipped task '+id);}
 await page.locator('#home-link').click();await page.locator('#parent-open').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#parent-dialog').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('PASS',width,'all 16 foundations, explicit zero, partial, saved sorting, retry, isolated reset, keyboard, seven lesson routes and 320px');await page.close();
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
