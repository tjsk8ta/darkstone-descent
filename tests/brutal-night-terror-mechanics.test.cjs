'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const extract=(a,b)=>{const i=html.indexOf('function '+a+'('),j=html.indexOf('function '+b+'(',i);assert.ok(i>=0&&j>i);return html.slice(i,j)};
test('translated Brutal Night Terror Thick Hide adds one Defense',()=>{
 const ctx={TYPES:{'Night Terror':{def:3}},eliteHas:(type,id)=>id==='thick-hide'};
 vm.runInNewContext(extract('effectiveEnemyDefense','enemyCritIgnoresDefense'),ctx);
 assert.equal(ctx.effectiveEnemyDefense({type:'Night Terror'}),4);
});
test('translated Brutal Night Terror Swift sets Initiative to 5, not normal +2',()=>{
 const ctx={TYPES:{'Night Terror':{initiative:4}},S:{turn:3},eliteHas:(type,id)=>id==='swift-to-five'};
 vm.runInNewContext(extract('effectiveEnemyInitiative','applyModelLimits'),ctx);
 assert.equal(ctx.effectiveEnemyInitiative({type:'Night Terror'}),5);
});
test('translated Brutal Night Terror Mind Drain makes each failed Horror Hit 3 Sanity',()=>{
 const S={enemies:[{type:'Night Terror',x:0,y:0}],sanity:12,ended:false};
 const ctx={S,TYPES:{'Night Terror':{terror:2,mindDrain:3}},CLASSES:{marshal:{willpower:5}},
  roomCurrent:()=>({x:0,y:0}),roomAt:()=>({x:0,y:0}),man:()=>0,lineOfSight:()=>true,
  eliteHas:()=>false,roll:n=>Array(n).fill(1),log:()=>{},checkSurvival:()=>{}};
 // roomCurrent and roomAt must return the SAME room object for Terror.
 const room={x:0,y:0};ctx.roomCurrent=()=>room;ctx.roomAt=()=>room;S.profile={hero:'marshal'};
 vm.runInNewContext(extract('resolveHorrorHits','enemyActivationOrder'),ctx);
 ctx.resolveHorrorHits();assert.equal(S.sanity,6);
});
test('translated Brutal Night Terror Claws doubles Combat Hits before Defense',()=>{
 assert.match(html,/if\(t\.clawsDoubleHits\)hits=hits\.flatMap\(v=>\[v,v\]\)/);
});
