import {SHAPES,NAMES,ITEMS,COLORS,INITIAL_SEQUENCE,PATTERN_CHOICES,ROCKET_CHOICES,freshState,evaluate,restore,place} from './logic.js';
const $=id=>document.getElementById(id),KEY='pamagochi:island:v1';
let state=freshState(),selected=null,activeSlot=0,world=null,storageOK=true,completionShown=false;
try{state=restore(JSON.parse(localStorage.getItem(KEY)));}catch{storageOK=false;}
const quests=[
 {title:'У каждой вещи — своя форма',description:'Расставь все 4 предмета. Нажми на предмет, затем на площадку с названием его объёмной формы.',hint:'Поворачивай остров, чтобы рассмотреть вещи. У шара нет плоских граней. У куба — квадратные грани. У цилиндра — два круглых основания. У конуса — одно основание и острая вершина.',guide:'В мастерской всё перепуталось. Цвет площадки не важен: ищем похожую форму!'},
 {title:'Два секрета одного моста',description:'Продолжи ряд: заполни места 5 и 6. У форм своё правило, а у цветов — своё. Следи за обоими!',hint:'Сначала назови только формы: куб, шар, конус, куб… Теперь только цвета: красный, синий, красный, синий… Продолжи каждое правило отдельно, затем соедини.',guide:'Мост держится на двух правилах. Восстанови его, чтобы Пик смог пройти дальше.'},
 {title:'Ракета по твоему чертежу',description:'Построй синий корпус-цилиндр и красный нос-конус. Выбирай сразу по двум признакам: форме и цвету.',hint:'Корпус должен быть цилиндром: два одинаковых круглых основания, без вершины. Нос — конус с одной вершиной. Затем проверь цвет каждой детали.',guide:'Последняя мастерская! Нажми на часть ракеты, затем выбери для неё деталь.'}
];
export function icon(shape,color='blue'){
 const c=COLORS[color]||COLORS.blue;
 const paths={sphere:`<circle cx="24" cy="24" r="17" fill="${c}"/><path d="M9 28 Q24 36 39 28 M18 9 Q10 24 18 39"/>`,cube:`<path d="m24 4 18 10v22L24 46 6 36V14Z" fill="${c}"/><path d="m6 14 18 10 18-10M24 24v22"/>`,cylinder:`<path d="M7 13v23c0 11 34 11 34 0V13Z" fill="${c}"/><ellipse cx="24" cy="13" rx="17" ry="8" fill="${c}"/><path d="M7 35c0 10 34 10 34 0"/>`,cone:`<path d="M24 4 6 37c0 11 36 11 36 0Z" fill="${c}"/><path d="M6 37c0 8 36 8 36 0"/>`};
 return `<svg viewBox="0 0 48 48" fill="none" stroke="#385666" stroke-width="1.35" stroke-linejoin="round" aria-hidden="true">${paths[shape]||''}</svg>`;
}
function pieceIcon(value){if(!value)return '<span aria-hidden="true">?</span>';const[c,s]=value.split('-');return icon(s,c);}
function pieceName(value){const[c,s]=value.split('-');return `${c==='coral'?'Красный':'Синий'} ${NAMES[s].toLowerCase()}`;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}$('save-note').textContent=storageOK?'Сохраняем открытия на этом устройстве':'Хранилище недоступно: игра работает без сохранения';}
function invalidate(){state.solved[state.station]=false;$('feedback').textContent='';$('feedback').className='feedback';$('next').hidden=true;save();renderProgress();}
function updateAnswers(){
 const focus=document.activeElement?.dataset;
 let restoreSelector=focus?.item?`[data-item="${focus.item}"]`:focus?.dock?`[data-dock="${focus.dock}"]`:focus?.choice?`[data-choice="${focus.choice}"]`:focus?.slot?`[data-slot="${focus.slot}"]`:null;
 if(state.station===0){
  $('answer-ui').innerHTML=`<p class="step-label">1. Выбери предмет</p><div class="items">${SHAPES.map((s,i)=>`<button class="item ${selected===s?'selected':''} ${Object.values(state.placements).includes(s)?'placed':''}" data-item="${s}" aria-pressed="${selected===s}">${icon(s,['yellow','coral','teal','blue'][i])}<span>${ITEMS[s]}</span>${Object.values(state.placements).includes(s)?'<span class="tick" aria-label="размещён">↗</span>':''}</button>`).join('')}</div><p class="step-label">2. Нажми на площадку</p><div class="docks">${SHAPES.map((s,i)=>`<button class="dock ${state.placements[s]?'filled':''}" data-dock="${s}" aria-label="Площадка ${i+1}: ${NAMES[s]}${state.placements[s]?', '+ITEMS[state.placements[s]]:''}"><b>${i+1}</b>${NAMES[s]}${state.placements[s]?icon(state.placements[s],['yellow','coral','teal','blue'][SHAPES.indexOf(state.placements[s])]):''}</button>`).join('')}</div><p class="selection-note">${selected?'Выбран: '+ITEMS[selected]+'. Куда поставим?':'Можно нажимать на предметы прямо на острове.'}</p>`;
 }else{
  const pattern=state.station===1,values=pattern?state.sequence:state.rocket;
  const slots=pattern?`<div class="sequence-strip">${INITIAL_SEQUENCE.map((v,i)=>`<span class="sequence-tile">${pieceIcon(v)}<small>${i+1}</small><span class="sr-only">${pieceName(v)}</span></span>`).join('')}${values.map((v,i)=>`<button class="sequence-tile slot ${activeSlot===i?'active':''}" data-slot="${i}" aria-pressed="${activeSlot===i}" aria-label="Место ${i+5}: ${v?pieceName(v):'пусто'}">${pieceIcon(v)}<small>${i+5}</small></button>`).join('')}</div>`:`<div class="rocket-slots">${values.map((v,i)=>`<button class="rocket-slot ${activeSlot===i?'active':''}" data-slot="${i}" aria-pressed="${activeSlot===i}">${pieceIcon(v)}<span>${i===0?'Корпус':'Нос'}<small>${v?pieceName(v):'Выбери деталь'}</small></span></button>`).join('')}</div>`;
  $('answer-ui').innerHTML=`<p class="step-label">1. ${pattern?'Выбери пустое место':'Выбери часть ракеты'}</p>${slots}<p class="step-label">2. Выбери подходящую деталь</p><div class="choices">${(pattern?PATTERN_CHOICES:ROCKET_CHOICES).map(v=>`<button class="choice ${values[activeSlot]===v?'selected':''}" data-choice="${v}" aria-pressed="${values[activeSlot]===v}">${pieceIcon(v)}<span>${pieceName(v)}</span></button>`).join('')}</div><p class="selection-note">${pattern?'Заполняем место '+(activeSlot+5):'Сейчас выбираем: '+(activeSlot===0?'корпус':'нос')}. Деталь можно заменить.</p>`;
 }
 if(restoreSelector)$('answer-ui').querySelector(restoreSelector)?.focus({preventScroll:true});
 world?.update(state,selected,activeSlot);
}
function renderProgress(){
 const count=state.solved.filter(Boolean).length;$('star-count').textContent=`${count} из 3 открытий`;$('progress').value=count;
 document.querySelectorAll('[data-station]').forEach(el=>{const i=Number(el.dataset.station);el.classList.toggle('active',i===state.station);el.classList.toggle('done',state.solved[i]);el.setAttribute('aria-current',i===state.station?'step':'false');if(el.querySelector('.station-star'))el.querySelector('.station-star').textContent=state.solved[i]?'✦':'✧';});
}
function go(station,focus=true){
 if(![0,1,2].includes(station))return;
 state.station=station;selected=null;activeSlot=0;const q=quests[station];
 $('quest-number').textContent=`СТАНЦИЯ 0${station+1} / 03`;$('quest-title').textContent=q.title;$('quest-description').textContent=q.description;$('guide-text').textContent=q.guide;$('hint').textContent=q.hint;$('hint').hidden=true;$('hint-toggle').setAttribute('aria-expanded','false');
 $('feedback').textContent=state.solved[station]?evaluate(state,station).message:'';$('feedback').className='feedback'+(state.solved[station]?' success':'');
 $('next').hidden=!state.solved[station];$('next').textContent=station===2?(state.solved.every(Boolean)?'К запуску ракеты →':'Найти оставшиеся открытия →'):'Следующая станция →';
 $('tour').textContent=['К мастерской ↗','К мосту ↗','К ракете ↗'][station];
 save();renderProgress();updateAnswers();if(focus)world?.focus(station);
}
function chooseItem(item){if(state.station!==0)return;selected=selected===item?null:item;updateAnswers();}
function chooseDock(dock){
 if(state.station!==0)return;
 if(!selected){$('feedback').textContent='Сначала выбери предмет — на острове или на карточке.';return;}
 place(state,selected,dock);selected=null;invalidate();updateAnswers();
}
function chooseSlot(slot){if(slot!==0&&slot!==1)return;activeSlot=slot;updateAnswers();}
function choosePiece(value){
 const allowed=state.station===1?PATTERN_CHOICES:ROCKET_CHOICES;if(state.station===0||!allowed.includes(value))return;
 const values=state.station===1?state.sequence:state.rocket;values[activeSlot]=value;invalidate();updateAnswers();
}
$('answer-ui').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.item)chooseItem(b.dataset.item);if(b.dataset.dock)chooseDock(b.dataset.dock);
 if(b.dataset.slot!==undefined)chooseSlot(Number(b.dataset.slot));if(b.dataset.choice)choosePiece(b.dataset.choice);
});
document.querySelectorAll('.stations [data-station]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.station))));
$('check').addEventListener('click',()=>{
 const r=evaluate(state,state.station);state.solved[state.station]=r.ok;$('feedback').textContent=r.message;$('feedback').className='feedback'+(r.ok?' success':'');
 $('next').hidden=!r.ok;$('next').textContent=state.station===2?(state.solved.every(Boolean)?'К запуску ракеты →':'Найти оставшиеся открытия →'):'Следующая станция →';
 save();renderProgress();world?.update(state,selected,activeSlot);if(r.ok)world?.celebrate();
 if(state.solved.every(Boolean)&&!completionShown){completionShown=true;$('complete-dialog').showModal();}
});
$('hint-toggle').addEventListener('click',()=>{$('hint').hidden=!$('hint').hidden;$('hint-toggle').setAttribute('aria-expanded',String(!$('hint').hidden));});
$('next').addEventListener('click',()=>{if(state.solved.every(Boolean))$('complete-dialog').showModal();else go(state.station<2?state.station+1:state.solved.indexOf(false));});
$('overview').addEventListener('click',()=>world?.overview());$('zoom-in').addEventListener('click',()=>world?.zoom(.8));$('zoom-out').addEventListener('click',()=>world?.zoom(1.25));$('orbit').addEventListener('click',()=>world?.orbit());$('tour').addEventListener('click',()=>world?.focus(state.station));
$('reset').addEventListener('click',()=>$('reset-dialog').showModal());$('reset-cancel').addEventListener('click',()=>$('reset-dialog').close());
$('reset-confirm').addEventListener('click',()=>{state=freshState();completionShown=false;$('reset-dialog').close();world?.reset();go(0);});
$('keep-exploring').addEventListener('click',()=>$('complete-dialog').close());
$('launch').addEventListener('click',()=>{$('complete-dialog').close();go(2);world?.launch();$('feedback').textContent='Поехали! Ты справился со всеми заданиями. Можно ещё погулять по острову или начать заново.';});
go(state.station,false);
(async()=>{try{
 const {createWorld}=await import('./world.js');
 world=await createWorld($('viewport'),{onStation:go,onItem:chooseItem,onDock:chooseDock,onSlot:chooseSlot,onPiece:choosePiece,onError:showError});
 $('loading').hidden=true;$('interactions').disabled=false;world.update(state,selected,activeSlot);renderProgress();
}catch(e){console.error('3D lesson loading failed:',e);showError();}})();
function showError(){
 $('interactions').disabled=true;$('loading').hidden=false;
 $('loading').innerHTML='<strong>Не удалось открыть 3D-остров</strong><span>Нужен браузер с WebGL 2. Попробуй обновить страницу. Если открыл файл двойным щелчком, запусти сайт через локальный HTTP-сервер.</span><button id="retry-3d">Попробовать ещё раз</button><a href="index.html#lesson/shapes">Перейти к обычному уроку</a>';
 $('retry-3d').addEventListener('click',()=>location.reload());
}
