'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
test('completion must agree across all three independent ledgers',()=>{
 const execution=read('reference/execution-gates.json');
 const status=read('reference/completion-status.json');
 const rules=read('rules/completion.json');
 const mandatory=['input','acquisition','implementation','tests','selfCorrection','stopAuthorization','notification'];
 assert.deepEqual(execution.gates.map(g=>g.id),mandatory);
 const passed=execution.gates.every(g=>g.passed===true);
 const accepted=Object.values(status.acceptance).every(x=>x.passed===true);
 const verified=Object.values(rules.gates).every(x=>x.status==='verified');
 assert.equal(execution.completion,passed&&accepted&&verified&&rules.blockers.length===0);
 assert.equal(status.completion,execution.completion);
 assert.equal(rules.complete,execution.completion);
});
test('unverified physical sheets and edition/type records cannot pass acquisition',()=>{
 const status=read('reference/completion-status.json');
 const sheets=status.lastVerified.physicalSheets;
 const types=status.lastVerified.uniqueEditionEnemyTypes;
 assert.ok(sheets.publisherVerified<=sheets.total);
 assert.equal(types.fullyTranscribed+types.partial+types.missing,types.total);
 if(sheets.publisherVerified<sheets.total||types.partial||types.missing){
  assert.equal(read('reference/execution-gates.json').gates.find(x=>x.id==='acquisition').passed,false);
  assert.equal(status.acceptance.coreEnemySheets.passed,false);
 }
});
test('no success when browser execution remains unverified',()=>{
 const status=read('reference/completion-status.json');
 if(!status.lastVerified.playwrightExecutionVerified){
  assert.equal(status.acceptance.automatedTests.passed,false);
  assert.equal(read('reference/execution-gates.json').completion,false);
 }
});
