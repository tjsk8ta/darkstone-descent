'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),test=require('node:test');
const records=require('../rules/enemy-records.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const i=html.indexOf('function awardEnemyWoundXP('),j=html.indexOf('function applyDamageGroup(',i);
assert.ok(i>=0&&j>i);
const source=html.slice(i,j);
function setup(elite=[]){
 const TYPES={Goliath:records.apply('original','Goliath',{})};
 const S={eliteAbilities:{Goliath:elite}};
 const award=new Function('TYPES','S',source+';return awardEnemyWoundXP;')(TYPES,S);
 return award;
}
test('large-enemy base XP is awarded once per attack, plus 5 XP per actual Wound',()=>{
 const award=setup(),e={id:7,type:'Goliath'},attack={};
 assert.equal(award(e,2,attack),20);
 assert.equal(award(e,3,attack),15);
 assert.equal(award(e,0,attack),0);
 assert.equal(award(e,1,{}),15);
});
test('Elite abilities increase base XP but do not multiply wound XP',()=>{
 const award=setup([1,2]),e={id:8,type:'Goliath'};
 assert.equal(award(e,2,{}),30);
});
test('ordinary enemies receive no per-wound XP',()=>{
 const TYPES={Tentacle:records.apply('original','Tentacle',{})};
 const S={eliteAbilities:{}};
 const award=new Function('TYPES','S',source+';return awardEnemyWoundXP;')(TYPES,S);
 assert.equal(award({id:1,type:'Tentacle'},3,{}),0);
});
test('per-wound XP and killing XP are mutually exclusive in the game',()=>{
 assert.match(html,/let earned=TYPES\[e\.type\]\.xpPerWound\?0:/);
 assert.match(html,/actualWounds=Math\.min\(Math\.max\(0,e\.hp\),total\)/);
});
