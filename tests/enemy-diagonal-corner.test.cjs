'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {chooseMove}=require('../rules/enemy-tactics.js');
test('enemy cannot cut diagonally between occupied orthogonal squares',()=>{
 const r=chooseMove({enemy:{id:1,x:0,y:0},hero:{x:2,y:2},steps:1,
  walkable:(x,y)=>x>=0&&x<=2&&y>=0&&y<=2,
  occupants:[{id:2,x:1,y:0},{id:3,x:0,y:1}]});
 assert.deepEqual(r.destination,{x:0,y:0});
 assert.equal(r.route.length,0);
});
test('enemy can travel diagonally through an unobstructed corner',()=>{
 const r=chooseMove({enemy:{id:1,x:0,y:0},hero:{x:2,y:2},steps:1,
  walkable:(x,y)=>x>=0&&x<=2&&y>=0&&y<=2});
 assert.deepEqual(r.destination,{x:1,y:1});
});
test('one blocked orthogonal side prevents diagonal corner cutting',()=>{
 const r=chooseMove({enemy:{id:1,x:0,y:0},hero:{x:2,y:2},steps:1,
  walkable:(x,y)=>x>=0&&x<=2&&y>=0&&y<=2,
  occupants:[{id:2,x:1,y:0}]});
 assert.notDeepEqual(r.destination,{x:1,y:1});
});
