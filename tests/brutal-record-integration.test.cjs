'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const records=require('../rules/enemy-records.js');
test('original 2014 Brutal Void Spider has independently verified red-face stats',()=>{
 const r=records.getFace('original','Void Spider','city','brutal');
 assert.equal(r.complete,true);
 assert.equal(r.face,'brutal');
 assert.deepEqual([r.stats.initiative,r.stats.steps,r.stats.escape,r.stats.hit,r.stats.combat,r.stats.damage,r.stats.def,r.stats.hp,r.stats.exp],[7,8,4,4,2,4,0,5,20]);
 assert.equal(r.stats.voidVenom,true);
 assert.deepEqual(r.eliteChart.map(x=>x.id),['drop-from-above','hardened-shells','vicious-bite','acidic-ichor','rapid-climbing','severing-bite']);
});
test('Brutal face applies without mutating prototype or normal face',()=>{
 const base={hp:100,recordFace:'normal'};
 const applied=records.applyFace('original','Void Spider',base,'city','brutal');
 assert.equal(applied.hp,5);
 assert.equal(applied.recordFace,'brutal');
 assert.equal(applied.recordComplete,true);
 assert.equal(base.hp,100);
 assert.equal(base.recordFace,'normal');
 assert.equal(records.get('original','Void Spider').complete,false);
});
test('unverified Brutal faces fail closed rather than substituting normal stats',()=>{
 assert.throws(()=>records.applyFace('revised','Corpse Pile',{},'swamp','brutal'),/Unverified or incomplete/);
 assert.throws(()=>records.applyFace('revised','Void Spider',{},'city','brutal'),/Unverified or incomplete/);
 assert.throws(()=>records.applyFace('original','Night Terror',{},'city','brutal'),/Unverified or incomplete/);
});
