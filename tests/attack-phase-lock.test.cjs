'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function isolate(name,next,context){
 const start=html.indexOf('function '+name+'('),end=html.indexOf('\nfunction '+next+'(',start);
 assert.ok(start>=0&&end>start,'missing function '+name);
 vm.runInNewContext(html.slice(start,end),context);
 return context[name];
}
test('single-die Grit reroll only changes To Hit phase',()=>{
 for(const phase of ['toHit','assign','damage']){
  const ctx={S:{grit:2},pendingAttack:{phase,rolls:[2],rerolled:[]},heroToHitDie:()=>6,log:()=>{},save:()=>{},render:()=>{}};
  isolate('rerollAttackDie','lawmanReroll',ctx)(0);
  assert.equal(ctx.S.grit,phase==='toHit'?1:2);
  assert.equal(ctx.pendingAttack.rolls[0],phase==='toHit'?6:2);
 }
});
test('free Lawman reroll cannot alter confirmed or allocated hits',()=>{
 for(const phase of ['toHit','assign','damage']){
  const ctx={S:{profile:{hero:'lawman'}},pendingAttack:{phase,rolls:[2],rerolled:[],lawmanUsed:false},gritDiceSelection:new Set(),heroToHitDie:()=>6,log:()=>{},save:()=>{},render:()=>{}};
  isolate('lawmanReroll','gritRerollAttack',ctx)(0);
  assert.equal(ctx.pendingAttack.rolls[0],phase==='toHit'?6:2);
  assert.equal(ctx.pendingAttack.lawmanUsed,phase==='toHit');
 }
});
test('multi-die Grit reroll is locked after confirmation',()=>{
 for(const phase of ['toHit','assign','damage']){
  const ctx={S:{grit:2},pendingAttack:{phase,rolls:[2,3],rerolled:[]},gritDiceSelection:new Set([0,1]),heroToHitDie:()=>6,log:()=>{},save:()=>{},render:()=>{}};
  isolate('gritRerollAttack','rerollMovement',ctx)();
  assert.equal(ctx.S.grit,phase==='toHit'?1:2);
  assert.deepEqual(Array.from(ctx.pendingAttack.rolls),phase==='toHit'?[6,6]:[2,3]);
 }
});
