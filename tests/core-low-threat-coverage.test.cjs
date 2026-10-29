'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const path=require('node:path'),engine=require('../rules/threat-engine.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('const ORIGINAL_LOW_THREAT_REFERENCE='),b=html.indexOf('// The revised Swamps medium deck',a);
assert.ok(a>=0&&b>a);
const {originalLowThreatPool,revisedLowThreatPool}=new Function(html.slice(a,b)+'return {originalLowThreatPool,revisedLowThreatPool}')();
test('all 2014 and revised low Threat card copies resolve to nonempty enemy groups',()=>{
 let checked=0;
 for(const [edition,pool] of [['original',originalLowThreatPool],['revised',revisedLowThreatPool]]){
  for(const set of ['city','swamp','combined']){
   for(const card of pool(set)){
    const result=engine.resolveEncounter(card.card,{rng:()=>0,draw:()=>{throw Error('unexpected nested draw')}});
    assert.ok(result.groups.length>0,edition+' '+set+' '+card.card);
    assert.ok(result.groups.every(g=>g.n>0),edition+' '+set+' '+card.card);
    checked++;
   }
  }
 }
 assert.equal(checked,80);
});
test('Peril die is the published 3,3,4,4,5,6 distribution',()=>{
 assert.deepEqual([...engine.PERIL_FACES],[3,3,4,4,5,6]);
});
