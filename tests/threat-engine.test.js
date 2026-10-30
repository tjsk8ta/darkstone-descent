'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const engine=require('../rules/threat-engine.js');
const fixed=n=>0;
test('Peril die uses official faces 3,3,4,4,5,6',()=>assert.deepEqual(engine.PERIL_FACES,[3,3,4,4,5,6]));
test('P and PP use peril faces, D3 uses 1-3',()=>{
 assert.equal(engine.quantity('P',fixed),3);
 assert.equal(engine.quantity('PP',fixed),6);
 assert.equal(engine.quantity('D3',fixed),1);
});
test('two Low Threat cards resolve once each',()=>{
 let calls=0;
 const result=engine.resolveEncounter('2 Low Threat Cards',{rng:fixed,draw:tier=>{calls++;assert.equal(tier,'low');return {card:'1 Tentacle'}}});
 assert.equal(calls,2);
 assert.deepEqual(result.groups.map(g=>g.type),['Tentacle','Tentacle']);
});
test('nested generic Threat draws inherit the enclosing card tier',()=>{
 const calls=[];
 const result=engine.resolveEncounter('1 Medium Threat Card',{rng:fixed,currentTier:'low',draw:tier=>{
 calls.push(tier);return calls.length===1?{card:'1 Threat Card'}:{card:'1 Slasher'};
 }});
 assert.deepEqual(calls,['medium','medium']);
 assert.equal(result.groups[0].type,'Slasher');
});
test('Elite subdraws mark all enemies Elite, leaving chart verification to the placement gate',()=>{
 const result=engine.resolveEncounter('2 Elite Threat Cards',{rng:fixed,currentTier:'low',draw:()=>({card:'1 Slasher'})});
 assert.deepEqual(result.groups.map(g=>g.elite),[1,1]);
});
test('unrecognised enemies fail closed',()=>{
 assert.throws(()=>engine.resolveEncounter('1 Invented Beast',{rng:fixed,draw:()=>null}),/Unverified enemy/);
});
