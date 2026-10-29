'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),test=require('node:test');
const rule=require('../rules/harbinger-ability.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function resolveHarbingerBringerOfDeath(){'),end=html.indexOf('function endTurn(){',start);
assert.ok(start>=0&&end>start,'Harbinger must run in the live game');
const code=html.slice(start,end);
function run(values,{hp=20,maxHp=20,adjacent=true,hellbats=0}={}){
 const e={id:9,type:'Harbinger',hp,maxHp,home:'0,0',x:1,y:1};
 const S={coreEdition:'revised',enemies:[e,...Array.from({length:hellbats},(_,i)=>({id:100+i,type:'Hellbat'}))],
  hp:20,ended:false,turn:4,profile:{hero:'marshal',upgrades:{armour:0}},rooms:{'0,0':{x:0,y:0}}};
 const TYPES={Harbinger:{damage:4},Hellbat:{modelCap:6}};
 const CLASSES={marshal:{defense:5}};
 const logs=[];let ambush=0,darkness=0,next=200;
 const die=()=>{assert.ok(values.length,'Unexpected D6');return values.shift()};
 const spawnEnemy=(type,home)=>{S.enemies.push({id:next++,type,home:'0,0',spawnTurn:S.turn});return true};
 const fn=new Function('S','TYPES','CLASSES','die','man','log','checkSurvival','spawnEnemy','roomAt','advanceDarkness','enemyPhase',
  'globalThis',code+';return resolveHarbingerBringerOfDeath;')
 (S,TYPES,CLASSES,die,()=>adjacent?1:4,(t)=>logs.push(t),()=>{},spawnEnemy,()=>S.rooms['0,0'],
  ()=>darkness++,()=>ambush++,{DarkstoneHarbinger:rule});
 fn();return {S,e,logs,ambush,darkness};
}
test('official Harbinger D6 table branches are 1-2 sweep, 3-4 summon, 5-6 regenerate',()=>{
 for(let n=1;n<=6;n++){
  const r=rule.rollBringerOfDeath((()=>{const vals=[n,4];return ()=>vals.shift()})());
  assert.equal(r.kind,n<=2?'sweeping-strike':n<=4?'summon-hellbats':'regeneration');
  assert.equal(r.combatHits||r.models||r.wounds,4);
 }
});
test('regeneration heals only missing wounds and journals actual gain',()=>{
 const r=run([6,5],{hp:18,maxHp:20});
 assert.equal(r.e.hp,20);assert.ok(r.logs.some(x=>x.includes('healed 2 Wounds')));
});
test('sweeping strike rolls defense against each Combat Hit for adjacent hero',()=>{
 const r=run([1,2,1,1]);assert.equal(r.S.hp,12);
 assert.ok(r.logs.some(x=>x.includes('8 Wounds')));
 const far=run([1,2],{adjacent:false});assert.equal(far.S.hp,20);
});
test('summoned Hellbats receive immediate ambush activation and respect miniature cap',()=>{
 const r=run([3,3],{hellbats:4});
 assert.equal(r.S.enemies.filter(x=>x.type==='Hellbat').length,6);
 assert.equal(r.ambush,1);assert.equal(r.darkness,1);
 assert.equal(r.S.enemies.at(-1).spawnTurn,3);
});
test('live game invokes Bringer of Death at end of each revised Harbinger turn',()=>{
 assert.ok(html.includes('<script src="rules/harbinger-ability.js"></script>'));
 assert.match(html,/enemyPhase\('after'\);if\(!S\.ended\)resolveHarbingerBringerOfDeath\(\)/);
});
