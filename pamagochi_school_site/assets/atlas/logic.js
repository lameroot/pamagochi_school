// Pure learning rules and save validation, independent of rendering.
export const SAVE_KEY = 'pamagochi-atlas-v1';
export const SHAPES = ['circle', 'square', 'triangle'];
export const CHOICES = ['coral','blue'].flatMap(c => SHAPES.map(s => `${c}-${s}`));
export const STATIONS = [
  { name: 'Мост узоров', x: -3.5, z: 2, title: 'Почини волшебный мост', text: 'Формы повторяются: круг, квадрат, треугольник. Цвета чередуются: красный, синий. Положи следующие две плитки.', hint: 'Следи за формой и цветом отдельно. После треугольника снова идёт круг. Какой цвет идёт после синего?', reward: 'Мост готов! Ты заметил сразу два правила. Теперь можно перейти реку.' },
  { name: 'Сад фонариков', x: 5, z: -3, title: 'Разбуди сад фонариков', text: 'Сосчитай большие жёлтые фонарики и все синие. Введи числа и сравни их.', hint: 'В первой группе нужны сразу два признака: жёлтый цвет И большой размер. Во второй считай все синие, даже маленькие.', reward: 'Сад засиял! Больших жёлтых — 4, синих — 3. Энергия сада вернулась к маяку.' },
  { name: 'Звёздный маяк', x: 9, z: 3, title: 'Верни свет маяку', text: 'В каждой строке один цвет. В каждом столбце одна форма. Заполни две пустые клетки.', hint: 'Для каждой пустой клетки возьми цвет из её строки, а форму — из её столбца.', reward: 'Маяк светит! Ты соединил правило строки и правило столбца. Первый остров снова на карте.' }
];
export const LANTERNS = [
  ['yellow',true],['blue',false],['yellow',false],['yellow',true],['blue',true],
  ['yellow',true],['yellow',false],['blue',false],['yellow',true],['yellow',false]
];
export function freshState() { return { version: 1, answers: [[null,null],['','',''],[null,null]], solved: [false,false,false], scarf:'blue' }; }
export function evaluate(index, a) {
  if (index === 1) {
    const n = [a[0] === '4', a[1] === '3'];
    if (n.every(Boolean)) return a[2] === '>' ? {ok:true, message:STATIONS[1].reward} : {ok:false,message:'Оба числа верны! Осталось выбрать знак: сравни 4 и 3.'};
    if (n[0]) return {ok:false,message:'Большие жёлтые посчитаны верно! Посчитай только синие фонарики.'};
    if (n[1]) return {ok:false,message:'Синие посчитаны верно! Проверь только большие жёлтые.'};
    return {ok:false,message:a[0]==='' && a[1]==='' ? 'Сначала сосчитай фонарики и введи два числа.' : 'Посчитай отдельно большие жёлтые и отдельно все синие. Маленькие жёлтые не нужны.'};
  }
  const expected = index === 0 ? ['coral-circle','blue-square'] : ['blue-triangle','gold-square'];
  const right = a.map((v,i)=>v === expected[i]);
  if (right.every(Boolean)) return {ok:true,message:STATIONS[index].reward};
  const i = right[0] ? 1 : 0;
  const prefix = right.some(Boolean) ? `Клетка ${right[0]?1:2} верна! ` : '';
  if (!a[i]) return {ok:false,message:prefix+`Выбери деталь для клетки ${i+1}.`};
  const [c,s] = a[i].split('-'), [ec,es] = expected[i].split('-');
  return {ok:false,message:prefix+`В клетке ${i+1} `+(c===ec?'цвет верный — исправь только форму.':s===es?'форма верная — исправь только цвет.':'проверь и цвет, и форму.')};
}
export function restore(raw) {
  const s = freshState();
  if (!raw || raw.version !== 1 || !Array.isArray(raw.answers)) return s;
  for (let i=0;i<3;i++) {
    const allowed = i===0?CHOICES:i===2?[...CHOICES,...SHAPES.map(x=>'gold-'+x)]:null;
    s.answers[i] = s.answers[i].map((fallback,j)=>{
      const v = raw.answers[i]?.[j];
      return allowed ? (allowed.includes(v)?v:fallback) : (typeof v==='string' && (j===2?['<','=','>'].includes(v):/^(0|[1-9]|10)$/.test(v))?v:fallback);
    });
    s.solved[i] = (i===0 || s.solved[i-1]) && raw.solved?.[i] === true && evaluate(i,s.answers[i]).ok;
  }
  s.scarf = ['blue','purple','green'].includes(raw.scarf)?raw.scarf:'blue';
  return s;
}
export const OBSTACLES = [ [-10,-4,1.3],[-7,-5,1],[-12,3,1],[-5,6,1], [3,5,1],[7,-6,1],[11,-4,1],[11,3,1.2] ];
export function walkable(x,z,bridge) {
  if (x < -13 || x > 13 || z < -7 || z > 7) return false;
  if (Math.abs(x) < 1.75 && !(bridge && Math.abs(z-2) < .78)) return false;
  return !OBSTACLES.some(([ox,oz,r])=>Math.hypot(x-ox,z-oz)<r+.3);
}
// Small grid route search, no diagonal corner-cutting; shares actual collision rules.
export function route(from,to,bridge) {
  const key=(x,z)=>`${x},${z}`, start=[Math.round(from.x*2),Math.round(from.z*2)], end=[Math.round(to.x*2),Math.round(to.z*2)];
  if(!walkable(end[0]/2,end[1]/2,bridge))return [];
  const queue=[start], prev=new Map([[key(...start),null]]); let found=false;
  for(let head=0;head<queue.length;head++) {
    const p=queue[head]; if(p[0]===end[0]&&p[1]===end[1]){found=true;break;}
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const n=[p[0]+dx,p[1]+dz], k=key(...n);
      if(!prev.has(k)&&walkable(n[0]/2,n[1]/2,bridge)){prev.set(k,p);queue.push(n);}
    }
  }
  if(!found)return [];
  const result=[];let p=end;
  while(p){result.push({x:p[0]/2,z:p[1]/2});p=prev.get(key(...p));}
  return result.reverse();
}
