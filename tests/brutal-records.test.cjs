'use strict';
const assert=require('node:assert/strict'),test=require('node:test');
const records=require('../rules/enemy-records.js');
const ledger=require('../reference/enemy-record-sheets.json');
test('all 24 physical sheet entries independently track normal and red Brutal face evidence',()=>{
 assert.equal(ledger.recordSheets.length,24);
 for(const entry of ledger.recordSheets){
  assert.ok(entry.brutalFace);
  assert.ok(['verified-third-party-physical-card-photo','partial-overlapped-photo','not-acquired'].includes(entry.brutalFace.status));
  if(entry.brutalFace.status==='verified-third-party-physical-card-photo'){
   assert.ok(entry.brutalFace.source?.includes('i.ebayimg.com'));
   assert.equal(entry.brutalFace.statisticsVerified,true);
   assert.equal(entry.brutalFace.abilitiesVerified,true);
   assert.equal(entry.brutalFace.eliteChartVerified,true);
  }
 }
});
test('original 2014 Brutal Void Spider matches unobstructed red physical face',()=>{
 const r=records.getFace('original','Void Spider','city','brutal');
 assert.deepEqual([r.stats.initiative,r.stats.steps,r.stats.escape,r.stats.hit,r.stats.combat,r.stats.damage,r.stats.def,r.stats.hp,r.stats.exp],[7,8,4,4,2,4,0,5,20]);
 assert.equal(r.stats.voidVenom,true);
 assert.deepEqual(r.eliteChart.map(x=>x.id),['drop-from-above','hardened-shells','vicious-bite','acidic-ichor','rapid-climbing','severing-bite']);
 assert.equal(r.complete,true);
 assert.equal(records.getFace('original','Void Spider','city','normal').complete,false);
});
test('unknown Brutal face is never silently replaced by original normal or revised edition',()=>{
 assert.equal(records.getFace('revised','Void Spider','city','brutal'),null);
 assert.equal(records.getFace('original','Harbinger','swamp','brutal'),null);
 assert.throws(()=>records.applyFace('revised','Void Spider',{},'city','brutal'),/Unverified/);
 assert.throws(()=>records.getFace('original','Void Spider','city','other'),/Unknown/);
 const r=records.applyFace('original','Void Spider',{hp:999},'city','brutal');
 assert.equal(r.hp,5);assert.equal(r.recordFace,'brutal');
});
