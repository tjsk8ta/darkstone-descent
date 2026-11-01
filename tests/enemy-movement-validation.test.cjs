'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {chooseMove}=require('../rules/enemy-tactics.js');
const walkable=(x,y)=>x>=0&&x<8&&y>=0&&y<8;
test('malformed enemy or Hero positions fail closed',()=>{
 for(const enemy of [{id:1,x:NaN,y:0},{id:1,x:0.5,y:0},{id:1,x:undefined,y:0}])
  assert.throws(()=>chooseMove({enemy,hero:{x:4,y:4},steps:2,walkable}),/Invalid movement coordinates/);
 for(const hero of [{x:NaN,y:4},{x:4,y:Infinity},{x:4,y:undefined}])
  assert.throws(()=>chooseMove({enemy:{id:1,x:0,y:0},hero,steps:2,walkable}),/Invalid movement coordinates/);
});
test('malformed occupied spaces cannot silently corrupt movement',()=>{
 for(const occupants of [[{id:2,x:NaN,y:1}],[{id:2,x:1.5,y:1}],null])
  assert.throws(()=>chooseMove({enemy:{id:1,x:0,y:0},hero:{x:4,y:4},steps:2,walkable,occupants}),/Invalid movement coordinates/);
});
test('valid integer movement remains functional',()=>{
 const r=chooseMove({enemy:{id:1,x:0,y:0},hero:{x:3,y:3},steps:2,walkable});
 assert.deepEqual(r.destination,{x:2,y:2});assert.equal(r.route.length,2);
});
