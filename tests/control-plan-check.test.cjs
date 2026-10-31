'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {validate}=require('../scripts/control-plan-check.cjs');const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const input=()=>[JSON.parse(read('reference/control-system-queue.json')),JSON.parse(read('reference/control-system-checkpoint.json')),read('.github/workflows/verify.yml')];
test('P1 queue and checkpoint accepted',()=>{const x=input();assert.deepEqual(validate(...x).errors,[])});
test('phase skipping rejected',()=>{const x=input();x[0].phases[1].status='in-progress';assert.equal(validate(...x).accepted,false)});
test('completion without evidence rejected',()=>{const x=input();x[0].phases[0].status='passed';x[0].phases[1].status='in-progress';x[0].activePhase=x[1].activePhase='P2';assert.match(validate(...x).errors.join(' '),/unsupported completion/)});
test('baseline divergence rejected',()=>{const x=input();x[1].baselineCommit='0'.repeat(40);assert.equal(validate(...x).accepted,false)});
test('automatic push trigger rejected',()=>{const x=input();x[2]+='\n  push:\n    branches: [main]\n';assert.equal(validate(...x).accepted,false)});
test('missing next action rejected',()=>{const x=input();x[1].nextAction='';assert.equal(validate(...x).accepted,false)});

test('passed phase absent from checkpoint is rejected',()=>{const x=input();x[0].phases[0].status='passed';x[0].phases[0].acceptance.forEach(a=>{a.status='passed';a.evidence=['tests/control-plan-check.test.cjs']});x[0].phases[1].status='in-progress';x[0].activePhase=x[1].activePhase='P2';assert.match(validate(...x).errors.join(' '),/checkpoint missing passed phase/)})
test('checkpoint HEAD mismatch rejected',()=>{const x=input();x[1].lastVerifiedHead='f'.repeat(40);assert.match(validate(...x,x[0].baselineCommit).errors.join(' '),/HEAD divergence/)})
test('workflow_call trigger rejected',()=>{const x=input();x[2]+='\n  workflow_call:\n';assert.equal(validate(...x).accepted,false)})
test('invalid checkpoint evidence rejected',()=>{const x=input();x[1].evidence=null;assert.equal(validate(...x).accepted,false)})
