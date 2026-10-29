'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function awardEnemyWoundXP(');
const end=html.indexOf('\nfunction applyDamageGroup()',start);
assert.ok(start>=0&&end>start,'wound XP function must be present');
const source=html.slice(start,end);
function harness(type,abilities=[]){
 const context={TYPES:{monster:type},S:{eliteAbilities:{monster:abilities}}};
 vm.runInNewContext(source,context);
 return {award:context.awardEnemyWoundXP,context};
}
test('wound XP base reward is paid only once across different attacks',()=>{
 const {award}=harness({exp:10,xpPerWound:5});
 const enemy={id:1,type:'monster',hp:20};
 assert.equal(award(enemy,2,{}),20);
 assert.equal(award(enemy,1,{}),5);
 assert.equal(award(enemy,3,{}),15);
 assert.equal(enemy.baseXpAwarded,true);
});
test('elite base bonus paid once; wounds always grant wound XP',()=>{
 const {award}=harness({exp:10,xpPerWound:5},[2,5]);
 const enemy={id:1,type:'monster',hp:20};
 assert.equal(award(enemy,1,{}),25);
 assert.equal(award(enemy,1,{}),5);
});
test('separate enemies each earn their own base reward',()=>{
 const {award}=harness({exp:10,xpPerWound:5});
 assert.equal(award({id:1,type:'monster'},1,{}),15);
 assert.equal(award({id:2,type:'monster'},1,{}),15);
});
test('zero damage cannot claim base reward',()=>{
 const {award}=harness({exp:10,xpPerWound:5});
 const enemy={id:1,type:'monster'};
 assert.equal(award(enemy,0,{}),0);
 assert.equal(enemy.baseXpAwarded,undefined);
 assert.equal(award(enemy,1,{}),15);
});
test('reward flag survives save and reload as enemy state',()=>{
 const {award}=harness({exp:10,xpPerWound:5});
 const enemy={id:1,type:'monster'};
 assert.equal(award(enemy,1,{}),15);
 const restored=JSON.parse(JSON.stringify(enemy));
 assert.equal(award(restored,1,{}),5);
});
