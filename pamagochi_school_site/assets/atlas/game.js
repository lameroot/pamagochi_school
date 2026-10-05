import {SAVE_KEY,STATIONS,CHOICES,SHAPES,LANTERNS,freshState,restore,evaluate} from './logic.js';
const $=s=>document.querySelector(s);
let state=freshState(),storageOK=true,world,started=false,near=-1,current=0,slot=0,failed=false,celebrate=false;
try{const saved=localStorage.getItem(SAVE_KEY);if(saved){try{state=restore(JSON.parse(saved));}catch{state=freshState();}}}catch{storageOK=false;}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{storageOK=false;}$('#save-note').textContent=storageOK?'Сохраняется на этом устройстве':'Сохранение недоступно — не закрывай страницу';}
const colors={coral:'#df705e',blue:'#639cce',gold:'#e6b749'};
const names={coral:'Красный',blue:'Синий',gold:'Жёлтый',circle:'круг',square:'квадрат',triangle:'треугольник'};
function shape(value){
  const [c,s]=value.split('-');
  const geometry={circle:'<circle cx="24" cy="24" r="17"/>',square:'<rect x="8" y="8" width="32" height="32" rx="2"/>',triangle:'<path d="M24 6 L43 40 H5 Z"/>'}[s];
  return '<svg viewBox="0 0 48 48" role="img" aria-label="'+names[c]+' '+names[s]+'" fill="'+colors[c]+'" stroke="#344e5a" stroke-width="1.5">'+geometry+'</svg>';
}
function refresh(){
  const count=state.solved.filter(Boolean).length,next=state.solved.indexOf(false);
  $('#progress-text').textContent=count+' из 3 открытий';$('#stars').textContent=state.solved.map(s=>s?'✦':'◇').join(' ');
  $('#objective-text').textContent=next<0?'Остров снова светится!':STATIONS[next].name;
  $('.missions').innerHTML=STATIONS.map((s,i)=>'<button class="mission '+(state.solved[i]?'done':i===next?'active':'')+'" data-mission="'+i+'" '+(!world||failed?'disabled':'')+'><span class="number">'+(state.solved[i]?'✓':'0'+(i+1))+'</span><span><b>'+s.name+'</b><small>'+(state.solved[i]?'Готово · полюбоваться':i>next&&next>=0?'Сначала '+STATIONS[i-1].name.toLowerCase():['Два правила · восстановить мост','Счёт и сравнение · оживить сад','Логическая таблица · зажечь маяк'][i])+'</small></span><span class="arrow">'+(state.solved[i]?'✦':'→')+'</span></button>').join('');
  world?.update(state);save();
  if(near>=0)$('#interact').textContent=(state.solved[near]?'Посмотреть':'Исследовать')+' · '+STATIONS[near].name+' [E]';
  document.querySelectorAll('[data-scarf]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scarf===state.scarf)));
}
function syncPause(){world?.pause(!started||failed||!!document.querySelector('dialog[open]'));}
function start(){if(!world||failed)return;started=true;$('#welcome').hidden=true;$('#objective').hidden=false;world.setOverview(false);$('#camera').textContent='⌖ Обзор';syncPause();$('#world').focus({preventScroll:true});}
function showDialog(id){$(id).showModal();syncPause();}
function closePuzzle(){
  $('#puzzle').close();
  if(celebrate){celebrate=false;showDialog('#victory');}
  syncPause();$('#world').focus({preventScroll:true});
}
function renderAnswer(){
  const a=state.answers[current],done=state.solved[current];
  const cell=(value)=>'<span class="shape-cell">'+shape(value)+'</span>';
  const empty=(i)=>'<button class="shape-cell slot" data-slot="'+i+'" aria-label="Клетка '+(i+1)+'" aria-pressed="'+(slot===i)+'" '+(done?'disabled':'')+'>'+(a[i]?shape(a[i]):String(i+1)+' ?')+'</button>';
  if(current===1){
    $('#answer-ui').innerHTML='<div class="lanterns" aria-label="Фонарики для счёта">'+LANTERNS.map(([color,big])=>'<span class="lantern '+(big?'':'small')+'"><svg viewBox="0 0 48 58" role="img" aria-label="'+(big?'Большой':'Маленький')+' '+(color==='yellow'?'жёлтый':'синий')+' фонарик"><path d="M17 9 Q24 -3 31 9" fill="none" stroke="#536b65" stroke-width="3"/><rect x="6" y="10" width="36" height="40" rx="13" fill="'+(color==='yellow'?'#ebc04f':'#699fca')+'" stroke="#506b70" stroke-width="2"/><path d="M19 13 L19 46 M29 13 L29 46" stroke="#ffffff66" stroke-width="2"/></svg></span>').join('')+'</div><div class="counts"><label>Большие жёлтые<input id="yellow-count" type="number" inputmode="numeric" min="0" max="10" step="1" data-count="0" value="'+a[0]+'" '+(done?'disabled':'')+'></label><label>Все синие<input id="blue-count" type="number" inputmode="numeric" min="0" max="10" step="1" data-count="1" value="'+a[1]+'" '+(done?'disabled':'')+'></label></div><p class="instruction">Большие жёлтые … все синие. Выбери знак:</p><div class="signs">'+['<','=','>'].map(s=>'<button data-sign="'+s+'" aria-label="'+({'<':'Меньше','=':'Равно','>':'Больше'}[s])+'" aria-pressed="'+(a[2]===s)+'" '+(done?'disabled':'')+'>'+({'<':'&lt;','>':'&gt;','=':'='}[s])+'</button>').join('')+'</div>';
  }else{
    const preview=current===0?'<div class="sequence">'+['coral-circle','blue-square','coral-triangle','blue-circle','coral-square','blue-triangle'].map(cell).join('')+empty(0)+empty(1)+'</div>':'<div class="matrix">'+cell('coral-circle')+cell('coral-square')+cell('coral-triangle')+cell('blue-circle')+cell('blue-square')+empty(0)+cell('gold-circle')+empty(1)+cell('gold-triangle')+'</div>';
    const choices=current===0?CHOICES:[...CHOICES,...SHAPES.map(s=>'gold-'+s)];
    $('#answer-ui').innerHTML=preview+(done?'':'<p class="instruction">Нажми на пустую клетку, затем выбери деталь. Сейчас: клетка '+(slot+1)+'.</p><div class="palette">'+choices.map(v=>'<button data-choice="'+v+'" aria-label="'+names[v.split('-')[0]]+' '+names[v.split('-')[1]]+'">'+shape(v)+'</button>').join('')+'</div>');
  }
  $('#check').hidden=done;$('#return-world').hidden=!done;
}
function openPuzzle(i){
  if(!started||failed)return;
  if(i>0&&!state.solved[i-1]){$('#travel-status').textContent='Сначала помоги острову: '+STATIONS[i-1].name+'.';return;}
  current=i;slot=0;
  $('#puzzle-label').textContent='ОТКРЫТИЕ 0'+(i+1)+' / 03';
  $('#puzzle-title').textContent=STATIONS[i].title;$('#puzzle-description').textContent=STATIONS[i].text;
  $('#hint').textContent=STATIONS[i].hint;$('#hint').hidden=true;$('#hint-button').setAttribute('aria-expanded','false');
  $('#feedback').textContent=state.solved[i]?STATIONS[i].reward:'';$('#feedback').className=state.solved[i]?'success':'';
  renderAnswer();showDialog('#puzzle');
}
function error(){
  failed=true;$('#loading').hidden=false;$('#loading').replaceChildren();
  const message=document.createElement('p');message.textContent='Не удалось открыть 3D-мир. Нужен браузер с WebGL2. Можно перезагрузить игру или вернуться к обычным урокам.';
  const retry=document.createElement('button');retry.className='primary';retry.textContent='Перезагрузить';retry.onclick=()=>location.reload();
  const back=document.createElement('a');back.href='index.html';back.textContent=' К урокам →';
  $('#loading').append(message,retry,back);$('#welcome').hidden=true;$('#nearby').hidden=true;$('#start').disabled=true;
  syncPause();refresh();
}
$('#start').onclick=start;
$('#camera').onclick=()=>{if(!world)return;world.setOverview(!world.getOverview());$('#camera').textContent=world.getOverview()?'⌖ За Люми':'⌖ Обзор';};
$('#help').onclick=()=>showDialog('#help-dialog');$('#reset').onclick=()=>showDialog('#reset-dialog');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',syncPause));
$('#puzzle').addEventListener('cancel',e=>{e.preventDefault();closePuzzle();});
$('#puzzle-close').onclick=closePuzzle;$('#return-world').onclick=closePuzzle;
$('#interact').onclick=()=>{if(near>=0)openPuzzle(near);};
$('.missions').onclick=e=>{
  const b=e.target.closest('[data-mission]');if(!b||!world||failed)return;
  const i=Number(b.dataset.mission);
  if(i>0&&!state.solved[i-1]){$('#travel-status').textContent='Сначала '+STATIONS[i-1].name.toLowerCase()+'. Знания откроют дорогу!';return;}
  start();if(near===i){openPuzzle(i);return;}
  if(world.travel(STATIONS[i]))$('#travel-status').textContent='Люми идёт: '+STATIONS[i].name+'. На месте нажми «Исследовать».';
};
$('#answer-ui').onclick=e=>{
  if(state.solved[current])return;
  const s=e.target.closest('[data-slot]'),c=e.target.closest('[data-choice]'),sign=e.target.closest('[data-sign]');
  if(s){slot=Number(s.dataset.slot);renderAnswer();$('#answer-ui [data-slot="'+slot+'"]').focus();return;}
  if(c){state.answers[current][slot]=c.dataset.choice;slot=slot===0&&!state.answers[current][1]?1:slot;renderAnswer();const focus=$('#answer-ui [data-choice="'+c.dataset.choice+'"]');focus?.focus();}
  if(sign){state.answers[current][2]=sign.dataset.sign;document.querySelectorAll('[data-sign]').forEach(b=>b.setAttribute('aria-pressed',String(b===sign)));}
  if(c||sign){$('#feedback').textContent='';save();}
};
$('#answer-ui').oninput=e=>{if(e.target.matches('[data-count]')&&!state.solved[current]){state.answers[current][Number(e.target.dataset.count)]=e.target.value;$('#feedback').textContent='';save();}};
$('#hint-button').onclick=()=>{$('#hint').hidden=!$('#hint').hidden;$('#hint-button').setAttribute('aria-expanded',String(!$('#hint').hidden));};
$('#check').onclick=()=>{
  if(state.solved[current])return;
  const result=evaluate(current,state.answers[current]);$('#feedback').textContent=result.message;$('#feedback').className=result.ok?'success':'';
  if(result.ok){state.solved[current]=true;celebrate=state.solved.every(Boolean);refresh();renderAnswer();$('#return-world').focus();$('#travel-status').textContent=STATIONS[current].reward;}
};
$('#reset-confirm').onclick=()=>{state=freshState();celebrate=false;near=-1;world?.resetPosition();$('#nearby').hidden=true;refresh();$('#reset-dialog').close();$('#travel-status').textContent='Новая экспедиция! Начни с моста узоров.';if(world&&!failed)start();};
document.querySelectorAll('[data-scarf]').forEach(b=>b.onclick=()=>{state.scarf=b.dataset.scarf;refresh();});
document.querySelectorAll('[data-dir]').forEach(b=>{
  b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!started)start();world?.direction(b.dataset.dir,true);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>world?.direction(b.dataset.dir,false));
  b.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!started)start();world?.direction(b.dataset.dir,true);}});
  b.addEventListener('keyup',()=>world?.direction(b.dataset.dir,false));b.addEventListener('blur',()=>world?.direction(b.dataset.dir,false));
});
refresh();
try{
  const {createWorld}=await import('./world.js');
  world=createWorld($('#world'),{
    onNear(i){near=i;$('#nearby').hidden=i<0||!started||failed;$('#interact').textContent=i>=0?(state.solved[i]?'Посмотреть':'Исследовать')+' · '+STATIONS[i].name+' [E]':'Исследовать';},
    onInteract:openPuzzle,
    onBlocked(){$('#travel-status').textContent=state.solved[0]?'Туда не пройти. Выбери свободное место на земле.':'Река пока закрыта. Сначала почини мост узоров.';},
    onError:error
  });
  refresh();$('#loading').hidden=true;$('#start').disabled=false;
}catch(e){console.warn('Atlas renderer unavailable:',e.message);error();}
