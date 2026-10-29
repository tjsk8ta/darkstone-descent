'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const engine=require('../rules/threat-engine.js');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function literal(start,end){
 const a=html.indexOf(start),b=html.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,'Missing inventory '+start);
 return vm.runInNewContext('('+html.slice(a+start.length,b).trim().replace(/;\s*$/,'')+')');
}
const originalLow=literal('const ORIGINAL_LOW_THREAT_REFERENCE=','// Card identities/frequencies');
const revisedSwamp=literal('const REVISED_SWAMP_LOW_THREAT=','function revisedLowThreatPool(');
const originalTiers=literal('const ORIGINAL_THREAT_DECKS=','const ORIGINAL_THREAT_NAMES=');
const draw=tier=>({card:tier==='low'?'P Tentacles':tier==='medium'?'6 Stranglers':'3 Slashers'});
const resolve=(card,rng=()=>0)=>engine.resolveCard(card,{rng,draw,currentTier:'low'});
test('Peril die has exactly six documented faces',()=>{
 assert.deepEqual([...Array(6)].map((_,i)=>engine.peril(()=>i)),[3,3,4,4,5,6]);
 assert.throws(()=>engine.peril(()=>6),/Invalid/);
});
test('P and PP use Peril rather than standard D6; D3 is 1-3',()=>{
 assert.equal(resolve('P Tentacles')[0].n,3);
 assert.equal(resolve('PP Void Spiders')[0].n,6);
 assert.equal(resolve('PP Void Spiders',n=>n-1)[0].n,12);
 assert.equal(resolve('D3 Night Terrors')[0].n,1);
 assert.equal(resolve('D3 Night Terrors',n=>n-1)[0].n,3);
});
test('Mixed quantities are independently rolled',()=>{
 const groups=resolve('1 Slasher & PP Hungry Dead & 3 Corpse Piles');
 assert.deepEqual(groups.map(x=>[x.type,x.n]),[['Slasher',1],['Hungry Dead',6],['Corpse Pile',3]]);
});
test('Nested Low, Medium, generic and Elite Threats have correct semantics',()=>{
 const calls=[],groups=engine.resolveCard('2 Elite Threat Cards & 1 Low Threat Card & 1 Threat Card',{
  rng:()=>0,currentTier:'low',draw:t=>{calls.push(t);return {card:'P Tentacles'}}
 });
 assert.deepEqual(calls,['low','low','low','low']);
 assert.deepEqual(groups.map(g=>g.elite),[1,1,0,0]);
});
test('Unknown enemy and malformed cards fail closed',()=>{
 assert.throws(()=>resolve('P Mystery Beast'),/Unverified enemy/);
 assert.throws(()=>resolve('Wandering Enemy'),/Unverified Threat-card text/);
 assert.throws(()=>resolve('P Tentacles & Something Else'),/Unverified Threat-card text/);
});
test('Nested recursion is bounded',()=>{
 assert.throws(()=>engine.resolveCard('1 Threat Card',{rng:()=>0,draw:()=>({card:'1 Threat Card'}),maxDepth:3}),/recursion limit/);
});
test('Both original core-set physical Threat decks have correct sizes',()=>{
 for(const set of ['city','swamp']){
  assert.equal(originalLow[set].reduce((n,c)=>n+c.copies,0),10,set+' Low');
  for(const [tier,expected] of [['medium',10],['high',10],['epic',5]]){
   assert.equal(originalTiers[set][tier].reduce((n,[copies])=>n+copies,0),expected,set+' '+tier);
  }
 }
 assert.equal(revisedSwamp.reduce((n,c)=>n+c.copies,0),10);
});
test('Every recorded Mines Threat-card title resolves without silent omissions',()=>{
 for(const set of ['city','swamp']){
  for(const {card} of originalLow[set])assert.ok(resolve(card).length,set+' Low: '+card);
  for(const tier of ['medium','high','epic'])
   for(const [,card] of originalTiers[set][tier])assert.ok(resolve(card).length,set+' '+tier+': '+card);
 }
 for(const {card} of revisedSwamp)assert.ok(resolve(card).length,'revised Swamps Low: '+card);
});
test('Browser loads shared engine and no longer scales solo Threat tier by depth',()=>{
 assert.match(html,/<script src="rules\/threat-engine\.js"><\/script>/);
 assert.match(html,/count=drawThreat\(r,'low'\)/);
 assert.match(html,/threatEngine\.resolveEncounter\(/);
});

test('Loot counts actual enemy-bearing Threat cards, not empty parents',()=>{
 assert.equal(engine.resolveEncounter('P Tentacles',{rng:()=>0,draw}).lootThreats,1);
 assert.equal(engine.resolveEncounter('2 Low Threat Cards',{rng:()=>0,draw}).lootThreats,2);
 assert.equal(engine.resolveEncounter('1 Night Terror & 1 Low Threat Card',{rng:()=>0,draw}).lootThreats,2);
 assert.equal(engine.resolveEncounter('2 Elite Threat Cards',{rng:()=>0,draw}).lootThreats,2);
});
