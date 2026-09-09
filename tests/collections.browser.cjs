const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.env.APP_URL||'http://127.0.0.1:8775/pamagochi_school_site/index.html';
const solutions={1:{p0:'food',p1:'wear',p2:'food',p3:'wear',p4:'music',p5:'music',count:'3'},2:{rule:'color',p0:'a',p1:'b'},3:{f0:'circle',s0:'big',f1:'square',s1:'small',f2:'circle',s2:'big',f3:'square',s3:'small',f4:'circle',s4:'small',f5:'square',s5:'big'},4:{p0:'bc',p1:'ys',p2:'yc',p3:'bs',p4:'bc',p5:'ys',count:'2'},5:{p0:'both',p1:'neither',p2:'circle',p3:'blue',p4:'both',p5:'neither'},6:{wrong:'2',replace:'a'},7:{b6:'yellow',b8:'blue',b10:'yellow',b11:'blue',blue:'4',yellow:'8',total:'12',sign:'<'},8:{pick:'0,2,3,4',count:'4'}};
(async()=>{const browser=await chromium.launch();try{for(const width of [1440,390,320]){
 const context=await browser.newContext({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);const root=page.locator('#collections');
 const go=async id=>{await page.evaluate(id=>location.hash='#lesson/'+id,id);await root.locator(id==='group-workshop'?'#t1':'#t5').waitFor();};
 const check=async(id,ok)=>{await root.locator(`[data-check="${id}"]`).click();assert.equal(await root.locator('#t'+id).evaluate(e=>e.classList.contains('done')),ok,'task '+id);};
 const set=async(id,k,v)=>{const key=id+'.'+k;const field=root.locator(`[data-input="${key}"]`);if(await field.count()){if(await field.evaluate(e=>e.tagName==='SELECT'))await field.selectOption(v);else await field.fill(v);}else if(k==='pick'){for(const n of v.split(','))await root.locator(`[data-multi="${key}"][data-value="${n}"]`).click();}else await root.locator(`[data-key="${key}"][data-value="${v}"]`).click();};
 assert.equal(await page.locator('.lesson-card').count(),9);
 for(const route of ['group-workshop','collection-secrets']){await go(route);for(const id of route==='group-workshop'?[1,2,3,4]:[5,6,7,8]){
 await check(id,false);await root.locator(`[data-hint="${id}"]`).click();assert.ok(await root.locator('#h'+id).isVisible());await root.locator(`[data-hint="${id}"]`).click();
 const entries=Object.entries(solutions[id]);await set(id,...entries[0]);await check(id,false);for(const [k,v] of entries.slice(1))await set(id,k,v);await check(id,true);await check(id,true);
 // Change one answer to a genuinely incorrect response, then retry.
 const [k,v]=entries[0];let wrong;if(k==='pick')wrong='1';else if(await root.locator(`[data-input="${id}.${k}"]`).count()){const input=root.locator(`[data-input="${id}.${k}"]`);wrong=await input.evaluate((e,v)=>e.tagName==='SELECT'?[...e.options].find(o=>o.value&&o.value!==v).value:'19',v);}else wrong=id===2?'shape':'0';
 await set(id,k,wrong);await check(id,false);if(k==='pick')await set(id,k,wrong);else await set(id,k,v);await check(id,true);
 }
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(await root.locator('.task').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.id)),[]);
 await page.screenshot({path:`/tmp/collections-${route}-${width}.png`,fullPage:true});
 }
 assert.equal(await page.locator('#total-count').textContent(),'8 / 36');await page.reload();assert.equal(await page.locator('#total-count').textContent(),'8 / 36');await page.locator('#reset-open').click();await page.locator('#reset-cancel').click();assert.equal(await page.locator('#total-count').textContent(),'8 / 36');await page.locator('#reset-open').click();await page.locator('#reset-confirm').click();assert.equal(await page.locator('#total-count').textContent(),'4 / 36');await go('group-workshop');assert.equal(await root.locator('.task.done').count(),4);
 await go('collection-secrets');await root.locator('[data-key="6.wrong"][data-value="2"]').focus();await page.keyboard.press('Enter');assert.equal(await root.locator('[data-key="6.wrong"][data-value="2"]').getAttribute('aria-pressed'),'true');
 // Correct numbers must not trigger a recount prompt when only the comparison is missing.
 for(const [k,v] of Object.entries(solutions[7]).filter(([k])=>k!=='sign'))await set(7,k,v);await check(7,false);assert.match(await root.locator('#t7 .feedback').textContent(),/Осталось сравнить/);
 assert.deepEqual(errors,[]);console.log('PASS collections',width);await context.close();
 }
 for(const corrupt of [true,false]){const context=await browser.newContext();const page=await context.newPage();await page.addInitScript(corrupt=>{if(corrupt)localStorage.setItem('pamagochi-collections-v1','{broken');else{Storage.prototype.getItem=()=>{throw Error('denied')};Storage.prototype.setItem=()=>{throw Error('denied')};}},corrupt);await page.goto(url+'#lesson/group-workshop');assert.equal(await page.locator('#collections .task').count(),4);assert.match(await page.locator('#storage-note').textContent(),/недоступно/);await context.close();}
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
