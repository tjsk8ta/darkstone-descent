'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const cp=require('node:child_process'),path=require('node:path');
const root=path.join(__dirname,'..');
function run(){
 const p=cp.spawnSync(process.execPath,['scripts/seven-gate-check.cjs','--json','--release'],{cwd:root,encoding:'utf8'});
 assert.equal(p.error,undefined,p.error?.message);
 assert.ok(p.stdout,'Checker produced no machine-readable output: '+p.stderr);
 return {code:p.status,result:JSON.parse(p.stdout)};
}
test('seven release gates report exact blockers and fail closed',()=>{
 const {code,result}=run();
 assert.equal(result.gateResults.length,7);
 assert.deepEqual(result.gateResults.map(x=>x.id),[1,2,3,4,5,6,7]);
 assert.equal(code,result.releaseAccepted?0:1);
 for(const gate of result.gateResults){
  assert.equal(typeof gate.pass,'boolean');
  assert.ok(Array.isArray(gate.blockers));
  if(!gate.pass)assert.ok(gate.blockers.length>0,'Blocked gate must explain why');
 }
});
test('unverified enemy faces cannot pass release acquisition gate',()=>{
 const {result}=run();
 if(result.unverifiedFaces>0){
  assert.equal(result.releaseAccepted,false);
  assert.equal(result.gateResults[1].pass,false);
  assert.equal(result.gateResults[5].pass,false);
  assert.equal(result.gateResults[6].pass,false);
 }
});
test('CI and deployment evidence must match actual source digest',()=>{
 const {result}=run();
 assert.match(result.sourceDigest,/^[0-9a-f]{64}$/);
 const gates=require('../reference/execution-gates.json');
 if(!gates.testEvidence?.chromiumMobileDoor||!gates.testEvidence?.pages)
  assert.equal(result.gateResults[3].pass,false);
});

test('translated card recreations cannot satisfy the 48 inspected physical faces',()=>{
 const ledger=require('../reference/enemy-record-sheets.json');
 const translated=ledger.recordSheets.filter(x=>x.brutalFace?.evidenceKind==='translated-recreation');
 assert.ok(translated.length>=2);
 for(const x of translated){
  assert.equal(x.brutalFace.statisticsVerified,true);
  assert.equal(x.brutalFace.inspectedFace,true);
  assert.notEqual(x.brutalFace.evidenceKind,'physical-original-card');
 }
 const {result}=run();assert.equal(result.gateResults[1].pass,false);
});
