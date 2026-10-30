'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const records=require('../rules/enemy-records.js');
const ledger=require('../reference/enemy-record-sheets.json');
test('translated 2014 Brutal Tentacle statistics and six Elite entries are captured but not enabled',()=>{
 const t=records.getFace('original','Tentacle','city','brutal');
 assert.deepEqual([t.stats.initiative,t.stats.steps,t.stats.escape,t.stats.hit,t.stats.combat,t.stats.damage,t.stats.def,t.stats.hp,t.stats.exp],[3,6,4,4,3,5,3,5,45]);
 assert.deepEqual(t.eliteChart.map(x=>x.id),['entangle','eruption','lashing-strike','void-visions','grasp','void-hydra']);
 assert.equal(t.complete,false);
 assert.throws(()=>records.applyFace('original','Tentacle',{},'city','brutal'),/incomplete/);
});
test('translated 2014 Brutal Night Terror has distinct Mind Drain and Claws, but cannot spawn as verified',()=>{
 const n=records.getFace('original','Night Terror','city','brutal');
 assert.deepEqual([n.stats.initiative,n.stats.steps,n.stats.escape,n.stats.hit,n.stats.combat,n.stats.damage,n.stats.def,n.stats.hp,n.stats.exp],[4,5,5,5,4,4,3,20,20]);
 assert.equal(n.stats.mindDrain,3);
 assert.equal(n.stats.clawsDoubleHits,true);
 assert.equal(n.eliteChart.length,6);
 assert.equal(n.complete,false);
 assert.throws(()=>records.applyFace('original','Night Terror',{},'city','brutal'),/incomplete/);
});
test('complete translated sheets cannot satisfy inspected physical card acceptance',()=>{
 for(const enemy of ['Tentacle','Night Terror']){
  const face=ledger.recordSheets.find(x=>x.edition==='original'&&x.set==='city'&&x.enemy===enemy).brutalFace;
  assert.equal(face.evidenceKind,'translated-recreation');
  assert.equal(face.gameplayIntegrated,false);
 }
});
