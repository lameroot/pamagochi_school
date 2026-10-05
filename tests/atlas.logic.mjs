import assert from 'node:assert/strict';
import {freshState,restore,evaluate,CHOICES,SHAPES,walkable,route,STATIONS,LANTERNS} from '../pamagochi_school_site/assets/atlas/logic.js';
for(let i=0;i<3;i++)assert.equal(evaluate(i,freshState().answers[i]).ok,false);
for(const i of [0,2]){
  const choices=i===0?CHOICES:[...CHOICES,...SHAPES.map(s=>'gold-'+s)];
  let accepted=0;for(const a of choices)for(const b of choices)if(evaluate(i,[a,b]).ok)accepted++;
  assert.equal(accepted,1);
}
let accepted=0;
for(let a=0;a<=10;a++)for(let b=0;b<=10;b++)for(const s of ['','<','=','>'])if(evaluate(1,[String(a),String(b),s]).ok)accepted++;
assert.equal(accepted,1);
assert.equal(LANTERNS.filter(([c,b])=>c==='yellow'&&b).length,4);assert.equal(LANTERNS.filter(([c])=>c==='blue').length,3);
assert.match(evaluate(1,['4','3','']).message,/Оба числа верны/);
assert.match(evaluate(0,['coral-circle',null]).message,/Клетка 1 верна/);
assert.match(evaluate(0,['blue-circle',null]).message,/форма верная/);
assert.match(evaluate(0,['coral-square',null]).message,/цвет верный/);
const s=freshState();s.answers=[['coral-circle','blue-square'],['4','3','>'],['blue-triangle','gold-square']];s.solved=[true,true,true];
assert.deepEqual(restore(JSON.parse(JSON.stringify(s))),s);
assert.deepEqual(restore({version:8}),freshState());
assert.deepEqual(restore({version:1,answers:[],solved:[true,true,true]}),freshState());
assert.deepEqual(restore({version:1,answers:[['<script>'],[{},null,[]]],scarf:'<script>'}),freshState());
assert.equal(walkable(0,2,false),false);assert.equal(walkable(0,2,true),true);assert.equal(walkable(0,0,true),false);
assert.deepEqual(route({x:-8.5,z:4},STATIONS[1],false),[]);
for(const [from,to,bridge] of [[{x:-8.5,z:4},STATIONS[0],false],[STATIONS[0],STATIONS[1],true],[STATIONS[1],STATIONS[2],true]]){
  const points=route(from,to,bridge);assert.ok(points.length>0);
  for(const p of points)assert.ok(walkable(p.x,p.z,bridge));
}
console.log('PASS Atlas: all answer combinations, feedback, save validation, world collision, mission routes');
