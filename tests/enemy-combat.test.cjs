'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),test=require('node:test');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const records=require('../rules/enemy-records.js');
function functionSource(name,next){
 const i=html.indexOf('function '+name+'('),j=html.indexOf('function '+next+'(',i);
 assert.ok(i>=0&&j>i,name+' missing or moved');
 return html.slice(i,j);
}
test('source-verified original Goliath resists critical defense bypass and receives hardened skin',()=>{
 const g=records.apply('original','Goliath',{def:0});
 const TYPES={Goliath:g};
 const eliteHas=(type,id)=>id==='hardened-skin';
 const code=functionSource('effectiveEnemyDefense','enemyMaxHp');
 const funcs=new Function('TYPES','eliteHas',code+';return {effectiveEnemyDefense,enemyCritIgnoresDefense,effectiveEnemyEscape}')(TYPES,eliteHas);
 const e={type:'Goliath'};
 assert.equal(funcs.effectiveEnemyDefense(e),4);
 assert.equal(funcs.enemyCritIgnoresDefense(6,e),false);
 assert.equal(funcs.enemyCritIgnoresDefense(5,e),false);
});
test('Night Terror hypnotic gaze raises escape to 6+',()=>{
 const TYPES={'Night Terror':records.apply('original','Night Terror',{})};
 const eliteHas=(type,id)=>id==='hypnotic-gaze';
 const code=functionSource('effectiveEnemyDefense','enemyMaxHp');
 const funcs=new Function('TYPES','eliteHas',code+';return {effectiveEnemyEscape}')(TYPES,eliteHas);
 assert.equal(funcs.effectiveEnemyEscape({type:'Night Terror'}),6);
});
test('Mind Drain increases failed Horror Hit damage, and walking nightmare affects adjacent tiles',()=>{
 const source=functionSource('resolveHorrorHits','enemyActivationOrder');
 const make=(elite,enemyTile,heroTile)=>{
  const TYPES={'Night Terror':records.apply('original','Night Terror',{})};
  const S={enemies:[{type:'Night Terror',x:0,y:0}],ended:false,profile:{hero:'marshal'},sanity:20};
  const CLASSES={marshal:{willpower:4}};
  const roomAt=()=>enemyTile,roomCurrent=()=>heroTile;
  const eliteHas=(type,id)=>elite.includes(id);
  const roll=n=>Array(n).fill(1);
  const log=()=>{},checkSurvival=()=>{};
  const f=new Function('S','CLASSES','TYPES','roomAt','roomCurrent','man','lineOfSight','eliteHas','roll','log','checkSurvival',source+';return resolveHorrorHits;')(S,CLASSES,TYPES,roomAt,roomCurrent,()=>3,()=>false,eliteHas,roll,log,checkSurvival);
  f();return S.sanity;
 };
 const room={x:0,y:0};
 assert.equal(make([],room,room),18,'Terror (2) deals two failed Horror Hits');
 assert.equal(make(['mind-drain'],room,room),14,'Mind Drain makes each failed Horror Hit deal 3 Sanity Damage');
 assert.equal(make(['walking-nightmare'],room,{x:1,y:0}),18,'Unspeakable Terror reaches adjacent tile');
 assert.equal(make([],room,{x:1,y:0}),20,'Normal Terror does not reach adjacent tile');
});
