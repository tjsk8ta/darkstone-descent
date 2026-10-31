'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('encounter card, resolved models, placements, unresolved results and fight outcome are journalled',()=>{
 for(const text of ['ENCOUNTER RESULT','Threat card: ','Encounter placed at: ','ENCOUNTER UNRESOLVED','FIGHT RESULT']){
  assert.ok(html.includes(text),'missing persistent journal record: '+text);
 }
 assert.ok(html.includes('S.log=S.log.slice(0,250)'),'journal retention should preserve 250 records');
});
test('Tentacle Elite #4 uses publisher-verified identical printed names and mechanics',()=>{
 const records=require('../rules/enemy-records.js');
 const city=records.get('revised','Tentacle','city');
 const swamp=records.get('revised','Tentacle','swamp');
 assert.equal(city.eliteChart[3].name,'Brutal Suckers');
 assert.equal(swamp.eliteChart[3].name,'Brutal Suckers');
 assert.equal(city.eliteChart[3].id,'tentacle-bonus-damage');
 assert.equal(swamp.eliteChart[3].id,'tentacle-bonus-damage');
 assert.equal(city.eliteChart[3].effect,swamp.eliteChart[3].effect);
 assert.ok(html.includes("eliteHas(e.type,'tentacle-bonus-damage')"));
});
