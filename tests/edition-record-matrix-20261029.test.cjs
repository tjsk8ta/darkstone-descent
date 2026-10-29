'use strict';
const assert=require('node:assert/strict'),test=require('node:test');
const audit=require('../reference/enemy-sheet-audit.json');
const gate=require('../reference/completion-status.json');
const records=require('../rules/enemy-records.js');
test('all 22 unique core enemy and edition sheet entries are source-audited',()=>{
 const expected=['Void Spider','Strangler','Tentacle','Targa Pylon','Night Terror','Goliath','Hellbat','Hungry Dead','Corpse Pile','Slasher','Harbinger'];
 for(const edition of ['original','revised']){
  assert.deepEqual(Object.keys(audit.editionRecords[edition]).sort(),[...expected].sort());
  for(const [name,row] of Object.entries(audit.editionRecords[edition])){
   const record=records.get(edition,name);
   assert.equal(row.status,!record?'missing':record.complete?'full':'partial',edition+' '+name);
   assert.deepEqual(row.verifiedFields.sort(),records.verifiedFields(edition,name).sort());
   assert.equal(row.eliteChartEntriesVerified,record?.eliteChart?.length||0);
   assert.equal(row.fullGameplayAccepted,false);
  }
 }
});
test('completion remains false until all source and gameplay gates pass',()=>{
 const counts={full:0,partial:0,missing:0};
 for(const edition of ['original','revised'])for(const row of Object.values(audit.editionRecords[edition]))counts[row.status]++;
 assert.deepEqual(counts,audit.summary);
 assert.equal(counts.full+counts.partial+counts.missing,22);
 assert.equal(gate.completion,false);
 assert.equal(audit.acceptance.allSheetsSourceVerified,false);
 assert.ok(Object.values(gate.acceptance).some(x=>x.passed===false));
});
