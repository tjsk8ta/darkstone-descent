'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function eligibleEnemyActivations('),end=html.indexOf('function enemyPhase(',start);
assert.ok(start>=0&&end>start,'ambush activation helper missing');
const context={effectiveEnemyInitiative:e=>e.initiative};
vm.runInNewContext(html.slice(start,end),context);
const eligible=context.eligibleEnemyActivations;
test('newly summoned low-initiative HellBats receive an immediate Ambush Attack',()=>{
 const bats=[{id:1,initiative:6,spawnTurn:4,ambushPending:true},{id:2,initiative:1,spawnTurn:4,ambushPending:true}];
 assert.deepEqual(Array.from(eligible(bats,'ambush',4,5),e=>e.id),[1,2]);
 assert.deepEqual(Array.from(eligible(bats,'before',4,5),e=>e.id),[]);
 assert.deepEqual(Array.from(eligible(bats,'after',4,5),e=>e.id),[]);
});
test('ordinary enemy initiative remains split before and after hero',()=>{
 const enemies=[{id:1,initiative:6,spawnTurn:3},{id:2,initiative:1,spawnTurn:3}];
 assert.deepEqual(Array.from(eligible(enemies,'before',4,5),e=>e.id),[1]);
 assert.deepEqual(Array.from(eligible(enemies,'after',4,5),e=>e.id),[2]);
});
test('Ambush only activates explicitly pending enemies',()=>{
 const enemies=[{id:1,initiative:6,spawnTurn:3},{id:2,initiative:1,spawnTurn:4,ambushPending:true}];
 assert.deepEqual(Array.from(eligible(enemies,'ambush',4,5),e=>e.id),[2]);
});
test('summoned bats use Ambush phase without reclassifying spawn turn',()=>{
 assert.match(html,/bat\.ambushPending=true;spawned\+\+/);
 assert.match(html,/enemyPhase\('ambush'\)/);
 assert.match(html,/if\(when!=='ambush'&&distance>1&&t\.steps>0\)/);
});

test('Ambush attack resolves without movement and does not spend regular activation',()=>{
 const a=html.indexOf('function enemyPhase('),b=html.indexOf('function checkSurvival(',a);
 assert.ok(a>=0&&b>a);
 const bat={id:9,type:'Hellbat',x:1,y:0,spawnTurn:4,ambushPending:true};
 const S={x:0,y:0,turn:4,ended:false,hp:5,sanity:5,enemies:[bat],enemyActed:[],profile:{hero:'marshal',upgrades:{armour:0}}};
 const ctx={S,CLASSES:{marshal:{initiative:5,defense:4}},TYPES:{Hellbat:{name:'Hellbat',initiative:1,steps:12,attackRange:1,combat:1,hit:4,damage:1}},
 eligibleEnemyActivations:xs=>xs.filter(e=>e.ambushPending),enemyActivationOrder:xs=>xs,effectiveEnemyInitiative:()=>1,
 man:(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y)),eliteHas:()=>false,lineOfSight:()=>true,
 roll:()=>[5],die:()=>1,log:()=>{},checkSurvival:()=>{},occupied:()=>false,enemyMovement:{chooseDestination:()=>null}};
 vm.runInNewContext(html.slice(a,b),ctx);
 ctx.enemyPhase('ambush');
 assert.equal(S.hp,4);
 assert.equal(bat.ambushPending,false);
 assert.deepEqual(S.enemyActed,[]);
 assert.equal(bat.x,1);
});
