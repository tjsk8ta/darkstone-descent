'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const engine=require('../rules/threat-engine.js');
test('nested unqualified Threat cards retain their parent medium tier',()=>{
 const tiers=[];
 const result=engine.resolveEncounter('1 Med Threat Card',{
  currentTier:'low',rng:()=>0,
  draw:tier=>{tiers.push(tier);return {card:tiers.length===1?'1 Threat Card':'P Tentacles'}}
 });
 assert.deepEqual(tiers,['medium','medium']);
 assert.equal(result.groups[0].type,'Tentacle');
 assert.equal(result.groups[0].n,3);
});
test('nested high Threat cards do not fall back to low',()=>{
 const tiers=[];
 engine.resolveEncounter('1 High Threat Card',{
  currentTier:'low',rng:()=>0,
  draw:tier=>{tiers.push(tier);return {card:tiers.length===1?'1 Threat Card':'1 Night Terror'}}
 });
 assert.deepEqual(tiers,['high','high']);
});
test('nested Threat recursion fails closed rather than looping indefinitely',()=>{
 assert.throws(()=>engine.resolveEncounter('1 Med Threat Card',{
  currentTier:'low',rng:()=>0,draw:()=>({card:'1 Threat Card'})
 }),/recursion limit/);
});
