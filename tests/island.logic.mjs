import assert from 'node:assert/strict';
import {freshState,evaluate,restore,place,SHAPES,PATTERN_CHOICES,ROCKET_CHOICES} from '../pamagochi_school_site/assets/island/logic.js';
for(let station=0;station<3;station++)assert.equal(evaluate(freshState(),station).ok,false);
for(const [station,choices,field] of [[1,PATTERN_CHOICES,'sequence'],[2,ROCKET_CHOICES,'rocket']]){
 let accepted=0;
 for(const a of choices)for(const b of choices){const state=freshState();state[field]=[a,b];if(evaluate(state,station).ok)accepted++;}
 assert.equal(accepted,1,'There must be one unambiguous solution at station '+station);
}
function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[v,...rest])):[[]];}
let accepted=0;for(const row of permutations(SHAPES)){const s=freshState();SHAPES.forEach((d,i)=>place(s,row[i],d));if(evaluate(s,0).ok)accepted++;}assert.equal(accepted,1);
const s=freshState();place(s,'sphere','cube');place(s,'sphere','sphere');assert.equal(Object.keys(s.placements).length,1);assert.match(evaluate(s,0).message,/Уже верно: 1/);
place(s,'cube','sphere');assert.deepEqual(s.placements,{sphere:'cube'});
assert.deepEqual(restore({version:1,station:100,placements:{sphere:'sphere',cube:'sphere',cone:'<script>'},sequence:['<img>',null],solved:[true,true,true]}),{...freshState(),placements:{sphere:'sphere'}});
assert.deepEqual(restore({version:7}),freshState());
console.log('PASS all 24 matching permutations, all 72 pattern/rocket combinations, empty answers, replacements, corrupt storage, stale schema and forged progress');
