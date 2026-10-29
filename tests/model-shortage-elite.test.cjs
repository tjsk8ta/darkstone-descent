'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('function applyModelLimits('),b=html.indexOf('function previewEliteAbilities(',a);
assert.ok(a>=0&&b>a);
function scenario(alreadyAwarded=false){
 const S={turn:3,coreThreatSet:'city',enemies:[{type:'Void Spider'}],modelShortageEliteTurns:alreadyAwarded?{'Void Spider':3}:{}};
 const ctx={S,TYPES:{'Void Spider':{modelCap:2}}};
 vm.runInNewContext(html.slice(a,b),ctx);
 return ctx.applyModelLimits([{type:'Void Spider',n:3,elite:0}]);
}
test('shortage removes excess models and awards exactly one Elite',()=>{
 const result=scenario(false);
 assert.equal(result[0].n,1);
 assert.equal(result[0].elite,1);
 assert.equal(result[0].shortageEliteAward,true);
});
test('same-turn repeated shortage does not award a second Elite',()=>{
 const result=scenario(true);
 assert.equal(result[0].n,1);
 assert.equal(result[0].elite,0);
 assert.equal(result[0].shortageEliteAward,undefined);
});
test('shortage Elite is recorded only after placement succeeds',()=>{
 assert.match(html,/for\(const g of groups\.filter\(g=>g\.shortageEliteAward\)\)/);
 assert.match(html,/S\.modelShortageEliteTurns\[g\.type\]=S\.turn/);
});
