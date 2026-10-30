'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const ledger=require('../reference/enemy-record-sheets.json');
const completion=require('../reference/completion-status.json');
test('every core enemy has a tracked normal-side record sheet for both editions',()=>{
 assert.equal(ledger.recordSheets.length,24);
 const keys=new Set(ledger.recordSheets.map(s=>s.edition+'/'+s.set+'/'+s.enemy));
 assert.equal(keys.size,24);
 for(const entry of ledger.recordSheets){assert.equal(typeof entry.status,'string');assert.ok(entry.status.length>0);assert.ok(entry.brutalFace)}
});
test('do not declare game complete while enemy card faces remain unverified',()=>{
 const incomplete=ledger.recordSheets.filter(s=>!(s.statisticsVerified&&s.abilitiesVerified&&s.eliteChartVerified&&s.brutalFace?.statisticsVerified&&s.brutalFace?.abilitiesVerified&&s.brutalFace?.eliteChartVerified));
 if(incomplete.length)assert.equal(completion.completion,false,'completion gate must fail closed');
});
test('verified sheets must cite an actual source and verify stats, abilities and Elite chart',()=>{
 for(const sheet of ledger.recordSheets.filter(s=>s.statisticsVerified&&s.abilitiesVerified&&s.eliteChartVerified)){
  assert.ok(/^https:\/\//.test(sheet.source));
  assert.equal(sheet.statisticsVerified,true);
  assert.equal(sheet.abilitiesVerified,true);
  assert.equal(sheet.eliteChartVerified,true);
 }
});
