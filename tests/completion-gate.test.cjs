'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const report=JSON.parse(fs.readFileSync(path.join(__dirname,'..','rules','completion.json'),'utf8'));
test('Completion gate cannot be true while any mandatory gate is incomplete',()=>{
 const required=['enemyRecordSheets','otherworldVariants','eliteCharts','threatDecks','combat','exploration','characters','tests','deployment'];
 for(const name of required)assert.ok(report.gates[name],'Missing completion gate '+name);
 const allVerified=required.every(name=>report.gates[name].status==='verified');
 assert.equal(report.complete,allVerified&&report.blockers.length===0,
  'Do not certify completion without all verified gates and no blockers');
});
test('Verified enemy records and charts must identify their publisher sources',()=>{
 const entries=report.gates.enemyRecordSheets.entries;
 assert.equal(Object.keys(entries).length,11);
 for(const [name,record] of Object.entries(entries)){
  const verified=record.originalNormal==='publisher_verified'||record.revisedNormal==='publisher_verified'
   ||record.originalEliteChart==='publisher_verified'||record.revisedEliteChart==='publisher_verified';
  if(verified)assert.ok(record.source?.length,'Missing source for '+name);
 }
});
test('Every outstanding gate has a recorded next action',()=>{
 assert.ok(report.nextActions.length>=5);
 assert.ok(report.blockers.every(b=>b.id&&b.kind&&b.details));
});
