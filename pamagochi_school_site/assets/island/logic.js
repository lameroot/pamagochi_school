// The answers checked here are all editable in both the HTML and 3D interfaces.
export const SHAPES=['sphere','cube','cylinder','cone'];
export const NAMES={sphere:'Шар',cube:'Куб',cylinder:'Цилиндр',cone:'Конус'};
export const ITEMS={sphere:'Мяч',cube:'Подарок',cylinder:'Банка',cone:'Колпак'};
export const COLORS={coral:'#ed8271',blue:'#639dec',yellow:'#f6c965',teal:'#409f96'};
export const INITIAL_SEQUENCE=['coral-cube','blue-sphere','coral-cone','blue-cube'];
export const PATTERN_ANSWERS=['coral-sphere','blue-cone'];
export const ROCKET_ANSWERS=['blue-cylinder','coral-cone'];
export const PATTERN_CHOICES=['coral-cube','blue-cube','coral-sphere','blue-sphere','coral-cone','blue-cone'];
export const ROCKET_CHOICES=['coral-cylinder','blue-cylinder','coral-cube','blue-cube','coral-cone','blue-cone'];
export function freshState(){return {version:1,station:0,placements:{},sequence:[null,null],rocket:[null,null],solved:[false,false,false]};}
export function evaluate(state,station){
 if(station===0){
  const filled=SHAPES.filter(s=>state.placements[s]);
  const correct=SHAPES.filter(s=>state.placements[s]===s);
  if(!filled.length)return {ok:false,message:'Сначала выбери предмет, затем площадку для его формы.'};
  if(correct.length===4)return {ok:true,message:'Все 4 предмета на своих местах! Мяч похож на шар, подарок — на куб, банка — на цилиндр, колпак — на конус.'};
  if(correct.length===filled.length)return {ok:false,message:`Уже верно: ${correct.length} из 4. Размести оставшиеся предметы — готовые трогать не нужно.`};
  const wrong=filled.find(s=>s!==state.placements[s]);
  return {ok:false,message:`Верно: ${correct.length} из 4. Посмотри на предмет «${ITEMS[state.placements[wrong]]}» на площадке «${NAMES[wrong]}». Сравни их форму, а не цвет. Можно выбрать предмет ещё раз и переставить.`};
 }
 const values=station===1?state.sequence:state.rocket;
 const answers=station===1?PATTERN_ANSWERS:ROCKET_ANSWERS;
 const labels=station===1?['Пятый элемент','Шестой элемент']:['Корпус','Нос'];
 const good=values.map((v,i)=>v===answers[i]);
 if(good.every(Boolean))return {ok:true,message:station===1?'Мост восстановлен! Формы: куб, шар, конус. Цвета: красный, синий. Ты заметил оба правила!':'Точно по чертежу! Синий цилиндр — корпус, красный конус — нос. Ракета готова!'};
 const missing=values.findIndex(v=>!v);
 if(missing!==-1)return {ok:false,message:`${good.some(Boolean)?'Одна деталь уже верна! ':''}${labels[missing]} пока не выбран. Нажми на его ячейку, затем на деталь.`};
 const wrong=good.indexOf(false), [color,shape]=values[wrong].split('-'), [expectedColor,expectedShape]=answers[wrong].split('-');
 let help=shape===expectedShape?'Форма верна, исправь только цвет.':color===expectedColor?'Цвет верен, исправь только форму.':'Проверь и форму, и цвет.';
 return {ok:false,message:`${good.some(Boolean)?'Одна деталь уже верна! ':''}${labels[wrong]}: ${help}`};
}
export function restore(raw){
 const s=freshState();
 if(!raw||raw.version!==1)return s;
 s.station=[0,1,2].includes(raw.station)?raw.station:0;
 const used=new Set();
 for(const shape of SHAPES){const item=raw.placements?.[shape];if(SHAPES.includes(item)&&!used.has(item)){s.placements[shape]=item;used.add(item);}}
 for(const [field,allowed] of [['sequence',PATTERN_CHOICES],['rocket',ROCKET_CHOICES]])
  for(let i=0;i<2;i++)if(allowed.includes(raw[field]?.[i]))s[field][i]=raw[field][i];
 s.solved=s.solved.map((_,i)=>raw.solved?.[i]===true&&evaluate(s,i).ok);
 return s;
}
export function place(state,item,dock){
 if(!SHAPES.includes(item)||!SHAPES.includes(dock))return;
 for(const shape of SHAPES)if(state.placements[shape]===item)delete state.placements[shape];
 state.placements[dock]=item; // An occupied dock returns its previous item to its plinth.
}
