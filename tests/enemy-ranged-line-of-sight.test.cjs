'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const enemyTargeting=require('../rules/enemy-targeting.js');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function enemyPhase('),end=html.indexOf('function checkSurvival(',start);
assert.ok(start>=0&&end>start);
function scenario(los){
 const e={id:1,type:'Goliath',x:2,y:0,spawnTurn:0};
 const S={x:0,y:0,turn:1,ended:false,hp:5,sanity:5,enemies:[e],enemyActed:[],profile:{hero:'marshal',upgrades:{armour:0}}};
 let attacks=0;
 const ctx={enemyTargeting,S,CLASSES:{marshal:{initiative:2,defense:4}},TYPES:{Goliath:{name:'Goliath',initiative:4,steps:0,attackRange:3,combat:1,hit:4,damage:1}},eligibleEnemyActivations:xs=>xs,
 enemyActivationOrder:xs=>xs,effectiveEnemyInitiative:()=>4,man:(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y)),eliteHas:()=>false,
 lineOfSight:()=>los,roll:()=>{attacks++;return [5]},die:()=>1,log:()=>{},checkSurvival:()=>{},occupied:()=>false,enemyMovement:{chooseDestination:()=>null}};
 vm.runInNewContext(html.slice(start,end),ctx);
 ctx.enemyPhase('before');
 return {hp:S.hp,attacks};
}
test('verified Goliath ranged attack cannot pass through disconnected doorway',()=>{
 assert.deepEqual(scenario(false),{hp:5,attacks:0});
});
test('verified Goliath ranged attack still works with unobstructed sight',()=>{
 assert.deepEqual(scenario(true),{hp:4,attacks:1});
});
