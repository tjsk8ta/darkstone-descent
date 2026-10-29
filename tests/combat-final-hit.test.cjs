'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('function applyDamageGroup()');
const b=html.indexOf('\nfunction resolveOneHit(',a);
assert.ok(a>=0&&b>a);
const code=html.slice(a,b);
function scenario({enemyCount=1,remaining=[1],hp=1}={}){
 const enemy={id:1,type:'Tentacle',hp,maxHp:hp,home:'1,1'};
 const S={enemies:[enemy,...Array.from({length:enemyCount-1},(_,i)=>({id:i+2,type:'Tentacle',hp:5,home:'1,1'}))],profile:{exp:0},coins:0,rooms:{'1,1':{seen:true,rewarded:true}}};
 const pendingAttack={phase:'damage',damageGroup:{enemyId:1,dice:[{hit:5,hitIndex:0,roll:6}]},resolved:[],selectedHits:[]};
 const events=[],ctx={S,pendingAttack,TYPES:{Tentacle:{name:'Tentacles',exp:30,xpPerWound:0}},
 selectedEnemyId:null,gritDiceSelection:new Set(),damageModifier:()=>0,
 enemyCritIgnoresDefense:()=>false,effectiveEnemyDefense:()=>0,
 awardEnemyWoundXP:()=>0,remainingHitIndices:()=>remaining,
 rnd:()=>0,log:msg=>events.push(msg),checkCleared:()=>events.push('CLEAR_STATE:'+String(ctx.pendingAttack?.phase||'none')),save:()=>{},render:()=>{}};
 vm.runInNewContext(code,ctx);
 ctx.applyDamageGroup();
 return {S,ctx,events};
}
test('last enemy death ends allocation even with unused successful hits',()=>{
 const {S,ctx,events}=scenario({enemyCount:1,remaining:[1,2]});
 assert.equal(S.enemies.length,0);
 assert.equal(ctx.pendingAttack,null);
 assert.ok(events.some(x=>x.includes('2 unassigned hit(s) discarded')));
});
test('other enemies alive retain hit allocation for reassignment',()=>{
 const {S,ctx}=scenario({enemyCount:2,remaining:[1]});
 assert.equal(S.enemies.length,1);
 assert.equal(ctx.pendingAttack.phase,'assign');
});
test('attack closes after all hits resolved regardless of surviving enemies',()=>{
 const {ctx}=scenario({enemyCount:2,remaining:[]});
 assert.equal(ctx.pendingAttack,null);
});
test('enemy sheet Elite label remains edition-specific and is not overwritten by Threat resolution',()=>{
 assert.doesNotMatch(html,/TYPES\.Tentacle\.eliteChart\[3\]\.name\s*=/);
 assert.match(html,/function applyEnemyEdition\(edition,set='combined'\)/);
});

test('fight reward check occurs only after final attack state is cleared',()=>{
 const {events}=scenario({enemyCount:1,remaining:[1,2]});
 assert.ok(events.includes('CLEAR_STATE:none'));
});
