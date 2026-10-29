'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),test=require('node:test');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function extract(name,next){
 const start=html.indexOf('const '+name+'='),end=html.indexOf(next,start);
 assert.ok(start>=0&&end>start,'Could not isolate '+name);
 return new Function(html.slice(start,end)+';return '+name+';')();
}
const low=extract('ORIGINAL_LOW_THREAT_REFERENCE','// Card identities/frequencies');
const revisedSwampLow=extract('REVISED_SWAMP_LOW_THREAT','function revisedLowThreatPool(');
const original=extract('ORIGINAL_THREAT_DECKS','const ORIGINAL_THREAT_NAMES=');
const sum=xs=>xs.reduce((n,x)=>n+(Array.isArray(x)?x[0]:x.copies),0);
test('each core edition and set contains 10 Low, 10 Medium, 10 High and 5 Epic cards',()=>{
 for(const set of ['city','swamp']){
  assert.equal(sum(low[set]),10,'original '+set+' low');
  assert.equal(sum(set==='swamp'?revisedSwampLow:low[set]),10,'revised '+set+' low');
  for(const tier of ['medium','high','epic'])assert.equal(sum(original[set][tier]),tier==='epic'?5:10,set+' '+tier);
 }
});
test('revised Swamps Low Threat replaces two zombie-spawner cards with six Hungry Dead',()=>{
 const find=(xs,card)=>xs.find(x=>x.card===card)?.copies||0;
 assert.equal(find(low.swamp,'P Hungry Dead & 1 Corpse Pile'),3);
 assert.equal(find(revisedSwampLow,'P Hungry Dead & 1 Corpse Pile'),1);
 assert.equal(find(revisedSwampLow,'6 Hungry Dead'),2);
});
test('revised Swamps Medium Threat fixes one Slasher and Hellbat quantity to six',()=>{
 const originals=original.swamp.medium.filter(x=>x[1]==='1 Slasher & P Hellbats');
 assert.deepEqual(originals,[[1,'1 Slasher & P Hellbats']]);
 assert.match(html,/c\.card==='1 Slasher & P Hellbats'[\s\S]*?card:'1 Slasher & 6 Hellbats'/);
});
