'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const records=require('../rules/enemy-records.js');
test('2014 physical Goliath normal card scales 12 Health plus 5 per Hero',()=>{
 const g=records.get('original','Goliath','city');
 assert.equal(g.stats.hp,12);
 assert.equal(g.stats.hpPerHero,5);
 assert.equal(g.stats.hp+g.stats.hpPerHero,17,'solo Goliath has 17 Health before modifiers');
 assert.ok(g.corroboratingSource.includes('blogspot.com'));
});
test('2014 Night Terror original printed Elite chart names retain mechanical identifiers',()=>{
 const n=records.get('original','Night Terror','city');
 assert.deepEqual(n.eliteChart.map(x=>x.name),[
  'Transfixing Stare','Gibbering Nightmare','Brutes','Soul Drain','Regeneration (2)','Hunter'
 ]);
 assert.deepEqual(n.eliteChart.map(x=>x.id),[
  'hypnotic-gaze','walking-nightmare','brute','mind-drain','regeneration','hunter'
 ]);
});
test('revised Tentacle City and Swamp Elite number 4 share the same printed name',()=>{
 assert.equal(records.get('revised','Tentacle','city').eliteChart[3].name,'Brutal Suckers');
 assert.equal(records.get('revised','Tentacle','swamp').eliteChart[3].name,'Brutal Suckers');
});
