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
