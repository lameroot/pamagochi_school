'use strict';
(() => {
 const $=s=>document.querySelector(s), lessons=window.schoolLessons;
 const total=lessons.reduce((n,l)=>n+l.tasks.length,0), scores={foundations:[],laboratory:[],collections:[]}, storage={foundations:true,laboratory:true,collections:true,shell:true};
 let active=null,last='',mounted=false;
 try{last=localStorage.getItem('pamagochi-last-lesson')||'';}catch{storage.shell=false;}
 const done=l=>l.tasks.filter(n=>scores[l.engine].includes(n)).length;
 function refresh(){
  if(!mounted)return;
  const count=lessons.reduce((n,l)=>n+done(l),0);
  $('#total-progress').max=total;$('#total-progress').value=count;$('#total-count').textContent=`${count} / ${total}`;
  $('#total-label').textContent=count===total?'Все открытия — твои!':'Твоя коллекция открытий';
  $('#storage-note').textContent=Object.values(storage).every(Boolean)?'Прогресс сохраняется на этом устройстве':'Сохранение недоступно — не закрывай эту страницу';
  $('#lesson-grid').innerHTML=lessons.map((l,i)=>`<a class="lesson-card ${l.color}" href="#lesson/${l.id}"><div class="card-top"><span class="lesson-icon">${l.icon}</span><span class="card-number">УРОК ${i+1}</span>${done(l)===l.tasks.length?'<span class="completed-mark" aria-label="Пройден">✓</span>':''}</div><h3>${l.title}</h3><p>${l.subtitle}</p><div class="card-bottom"><span class="mini-stars" aria-label="Решено ${done(l)} из ${l.tasks.length}">${l.tasks.map((_,n)=>`<i class="${n<done(l)?'earned':''}">✦</i>`).join('')}</span><span>${done(l)} / ${l.tasks.length} <b>→</b></span></div></a>`).join('');
  const resume=lessons.find(l=>l.id===last&&done(l)<l.tasks.length)||lessons.find(l=>done(l)<l.tasks.length)||lessons[0];
  $('#continue').href='#lesson/'+resume.id;$('#continue').innerHTML=`${count===total?'Повторить открытия':last||count?'Продолжить приключение':'Начать приключение'} <span>→</span>`;
  if(active){$('#lesson-score').textContent=`✦ ${done(active)} / ${active.tasks.length} открытий`;$('#lesson-complete').hidden=done(active)!==active.tasks.length;$('#task-nav').innerHTML=active.tasks.map((n,i)=>`<button data-task="${n}" aria-label="Задание ${i+1}${scores[active.engine].includes(n)?', решено':''}" class="${scores[active.engine].includes(n)?'earned':''}">${scores[active.engine].includes(n)?'✓':i+1}<span>Задание ${i+1}</span></button>`).join('');}
 }
 const engines={};
 for(const [name,mount] of [['foundations',window.mountFoundations],['laboratory',window.mountLaboratory],['collections',window.mountCollections]]){
  const root=$('#'+name).attachShadow({mode:'open'});
  engines[name]=mount(root,(solved,ok)=>{scores[name]=solved;storage[name]=ok;refresh();});
  for(const file of [`lessons/${name}.css`,'exercise-theme.css']){const link=document.createElement('link');link.rel='stylesheet';link.href='assets/'+file;root.prepend(link);}
  // Insert shared theme last so it wins over engine-specific compatibility styles.
  const shared=root.querySelector('link[href$="exercise-theme.css"]');root.append(shared);
 }
 mounted=true;$('#catalog-count').textContent=`${lessons.length} уроков · ${total} открытий`;
 function route(){
  const id=location.hash.replace(/^#lesson\//,'');active=lessons.find(l=>l.id===id)||null;
  $('#home').hidden=!!active;$('#study').hidden=!active;$('#home-link').setAttribute('aria-current',active?'false':'page');
  for(const name of Object.keys(engines))$('#'+name).hidden=!active||active.engine!==name;
  if(active){last=active.id;try{localStorage.setItem('pamagochi-last-lesson',last);}catch{storage.shell=false;}
   engines[active.engine].show(active.engine==='laboratory'?active.chapter:active.tasks);
   const i=lessons.indexOf(active);$('#lesson-position').textContent=`Урок ${i+1} из ${lessons.length}`;$('#lesson-name').textContent=active.title;$('#lesson-description').textContent=active.subtitle;$('#lesson-skill').textContent=active.skill;$('#lesson-icon').textContent=active.icon;$('#lesson-icon').className='lesson-icon '+active.color;
   for(const [sel,n] of [['#previous',i-1],['#next-lesson',i+1]]){const el=$(sel);el.hidden=!lessons[n];if(lessons[n]){el.href='#lesson/'+lessons[n].id;el.textContent=n<i?'← Предыдущий':'Следующий урок →';}}
   document.title=active.title+' · Памагочи';$('#lesson-name').focus({preventScroll:true});
  }else document.title='Памагочи · Математика с открытиями';
  refresh();window.scrollTo({top:0,behavior:'instant'});
 }
 $('#task-nav').addEventListener('click',e=>{const b=e.target.closest('[data-task]');if(!b||!active)return;const t=$('#'+active.engine).shadowRoot.getElementById('t'+b.dataset.task);t.tabIndex=-1;t.focus({preventScroll:true});t.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
 $('#parent-open').onclick=()=>$('#parent-dialog').showModal();$('#parent-close').onclick=()=>$('#parent-dialog').close();
 $('#reset-open').onclick=()=>$('#reset-dialog').showModal();$('#reset-cancel').onclick=()=>$('#reset-dialog').close();
 $('#reset-confirm').onclick=()=>{if(active)engines[active.engine].reset(active.tasks);$('#reset-dialog').close();refresh();};
 window.addEventListener('hashchange',route);route();
})();
