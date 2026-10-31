'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const records=require('../rules/enemy-records.js');
const expected={initiative:2,steps:6,escape:4,hit:4,combat:3,damage:3,def:2,hp:4,exp:30,smash:true};
const ids=['entangle','eruption','writhing','tentacle-bonus-damage','lashing-strike','swift'];
test('official revised Tentacles stats and six Elite effects agree across both cores',()=>{
 for(const set of ['city','swamp']){
  const r=records.get('revised','Tentacle',set);
  assert.equal(r.complete,true);
  for(const [k,v] of Object.entries(expected))assert.equal(r.stats[k],v,set+' '+k);
  assert.deepEqual(r.eliteChart.map(x=>x.id),ids);
  assert.equal(r.eliteChart[3].name,'Brutal Suckers');
 }
});
test('both revised Elite #4 labels describe +2 Damage',()=>{
 const city=records.get('revised','Tentacle','city');
 const swamp=records.get('revised','Tentacle','swamp');
 assert.equal(city.eliteChart[3].effect,swamp.eliteChart[3].effect);
 assert.equal(city.eliteChart[3].effect,'+2 Damage');
});
test('original and revised enemy sheets are not mutated by a previous edition lookup',()=>{
 const original=records.get('original','Tentacle','city');
 const swamp=records.get('revised','Tentacle','swamp');
 const city=records.get('revised','Tentacle','city');
 assert.equal(original.eliteChart[3].name,'Brutal Suckers');
 assert.equal(swamp.eliteChart[3].name,'Brutal Suckers');
 assert.equal(city.eliteChart[3].name,'Brutal Suckers');
});

test('2014 Tentacles card is anchored to the publisher original rulebook, not translation',()=>{
 const r=records.get('original','Tentacle','city');
 assert.ok(r.source.includes('ffpgames.wordpress.com/wp-content/uploads/2014/07/sobs_rulebook_web_publish.pdf#page=20'));
 assert.match(r.confidence,/2014 publisher rulebook page 20/);
});
