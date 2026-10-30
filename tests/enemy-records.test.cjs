'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const records=require('../rules/enemy-records.js');
test('edition records distinguish original Goliath from revised Harbinger',()=>{
 const g=records.get('original','Goliath');
 assert.equal(g.stats.initiative,2);
 assert.equal(g.stats.hp,12);
 assert.equal(g.stats.hpPerHero,5);
 assert.equal(g.stats.attackRange,3);
 assert.equal(g.stats.combat,3);
 assert.equal(g.stats.immuneCrit,true);
 assert.equal(g.stats.xpPerWound,5);
 assert.equal(g.eliteChart.length,6);
 const h=records.get('revised','Harbinger');
 assert.equal(h.stats.initiative,4);
 assert.equal(h.stats.hp,14);
 assert.equal(h.stats.hpPerHero,3);
 assert.equal(h.stats.steps,12);
 assert.equal(h.stats.unspeakableTerror,3);
 assert.equal(h.stats.flight,true);
 assert.equal(h.stats.xpPerWound,5);
 assert.equal(h.complete,false,'partial photograph must not be called a complete sheet');
});
test('original Night Terror has source-grounded 2014 normal-side values and six Elite entries',()=>{
 const n=records.get('original','Night Terror');
 assert.deepEqual([n.stats.initiative,n.stats.steps,n.stats.escape,n.stats.hit,n.stats.combat,n.stats.damage,n.stats.def,n.stats.hp,n.stats.terror],[3,5,3,5,4,4,3,12,2]);
 assert.deepEqual(n.eliteChart.map(x=>x.id),['hypnotic-gaze','walking-nightmare','brute','mind-drain','regeneration','hunter']);
});
test('Tentacle publisher example has same verified core mechanics in both editions',()=>{
 for(const edition of ['original','revised']){
  const t=records.get(edition,'Tentacle');
  assert.deepEqual([t.stats.initiative,t.stats.steps,t.stats.escape,t.stats.hit,t.stats.combat,t.stats.damage,t.stats.def,t.stats.hp],[2,6,4,4,3,3,2,4]);
  assert.equal(t.stats.smash,true);
  assert.equal(t.eliteChart.length,6);
 }
});
test('revised City and Swamps Tentacles have distinct printed Elite #4 names but identical mechanics',()=>{
 const city=records.get('revised','Tentacle','city'),swamp=records.get('revised','Tentacle','swamp'),combined=records.get('revised','Tentacle','combined');
 assert.equal(city.eliteChart[3].name,'Brutal Suckers');
 assert.equal(swamp.eliteChart[3].name,'Bitter Success');
 assert.equal(combined.eliteChart[3].name,'Brutal Suckers / Bitter Success');
 assert.equal(city.eliteChart[3].id,'tentacle-bonus-damage');
 assert.equal(swamp.eliteChart[3].id,'tentacle-bonus-damage');
 assert.equal(city.eliteChart[3].effect,swamp.eliteChart[3].effect);
});
test('Targa Pylon is ranged-only and Corpse Piles cannot make melee attacks',()=>{
 const p=records.get('original','Targa Pylon');
 assert.equal(p.stats.rangedHit,3);
 assert.equal(p.stats.combat,0);
 assert.equal('hit' in p.stats,false,'do not mislabel ranged To Hit as melee To Hit');
 assert.equal(records.get('revised','Corpse Pile').stats.combat,0);
});
test('unverified fields never appear as verified record-sheet data',()=>{
 assert.deepEqual(records.verifiedFields('original','Strangler').sort(),['escape','hit','initiative','size','steps'].sort());
 assert.equal(records.get('original','Strangler').complete,false);
 assert.equal(records.get('revised','Night Terror'),null);
 assert.deepEqual(records.verifiedFields('revised','Corpse Pile').sort(),['combat','initiative','size','steps']);
});
test('applying a record does not mutate base stats or silently transfer another edition',()=>{
 const base={hp:999,initiative:99,eliteChart:[{id:'invented'}]};
 const revised=records.apply('revised','Night Terror',base);
 assert.equal(revised.hp,999);
 const original=records.apply('original','Night Terror',base);
 assert.equal(original.hp,12);
 assert.equal(original.initiative,3);
 assert.equal(base.hp,999);
 assert.equal(original.eliteChart.length,6);
});
test('game loads enemy record data and applies edition on new run and restored saves',()=>{
 const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
 assert.match(html,/<script src="rules\/enemy-records\.js"><\/script>/);
 assert.match(html,/applyEnemyEdition\(S\.coreEdition,S\.coreThreatSet\)/);
 assert.match(html,/applyEnemyEdition\(S\.coreEdition\|\|'revised',S\.coreThreatSet\|\|'combined'\)/);
 assert.match(html,/enemyMaxHp\(type\)/);
 assert.match(html,/enemyCritIgnoresDefense\(d\.hit,e\)/);
});

test('2014 and revised Tentacle record-sheet provenance is reconciled for both core sets',()=>{
 const register=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../reference/enemy-record-sheets.json'),'utf8'));
 for(const edition of ['original','revised'])for(const set of ['city','swamp']){
  const entry=register.recordSheets.find(r=>r.edition===edition&&r.set===set&&r.enemy==='Tentacle');
  assert.ok(entry,edition+' '+set+' Tentacle record missing');
  assert.equal(entry.statisticsVerified,true);
  assert.equal(entry.abilitiesVerified,true);
  assert.equal(entry.eliteChartVerified,true);
  assert.equal(entry.gameplayIntegrated,true);
  const record=records.get(edition,'Tentacle',set);
  assert.equal(record.complete,true);
  assert.equal(record.eliteChart.length,6);
  assert.equal(record.stats.smash,true);
 }
});
