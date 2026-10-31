'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const enemyTargeting=require('../rules/enemy-targeting.js');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('function enemyActivationOrder('),b=html.indexOf('function eligibleEnemyActivations(',a);
assert.ok(a>=0&&b>a);
function order(enemies){
 const ctx={enemyTargeting,S:{x:0,y:0},effectiveEnemyInitiative:e=>e.initiative,shuffleDeck:x=>x,man:(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y))};
 vm.runInNewContext(html.slice(a,b),ctx);
 return Array.from(ctx.enemyActivationOrder(enemies),e=>e.id);
}
test('enemy groups activate in initiative order and closest model moves first within type',()=>{
 assert.deepEqual(order([
  {id:'far',type:'Tentacle',initiative:4,x:5,y:0},
  {id:'slow',type:'Strangler',initiative:2,x:1,y:0},
  {id:'near',type:'Tentacle',initiative:4,x:1,y:0},
  {id:'middle',type:'Tentacle',initiative:4,x:3,y:0}
 ]),['near','middle','far','slow']);
});
test('enemy order preserves tied distance stability within a type',()=>{
 assert.deepEqual(order([
  {id:'a',type:'Tentacle',initiative:4,x:1,y:0},
  {id:'b',type:'Tentacle',initiative:4,x:0,y:1}
 ]),['a','b']);
});
