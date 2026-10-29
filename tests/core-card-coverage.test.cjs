'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');
const engine=require('../rules/threat-engine.js');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function extract(name,next){
 const start=html.indexOf('const '+name+'=');
 assert.ok(start>=0,'missing '+name);
 const end=html.indexOf(next,start);
 assert.ok(end>start,'missing boundary '+next);
 return new Function(html.slice(start,end)+';return '+name+';')();
}
const originals=extract('ORIGINAL_THREAT_DECKS','const ORIGINAL_THREAT_NAMES=');
const low=extract('ORIGINAL_LOW_THREAT_REFERENCE','// Card identities/frequencies');
test('every original core threat card has parseable named enemies and valid Peril quantities',()=>{
 for(const [set,decks] of Object.entries(originals))for(const [tier,cards] of Object.entries(decks)){
  if(tier==='otherworld')continue;
  for(const [copies,card] of cards){
   assert.ok(copies>=1);
   const groups=engine.resolveEncounter(card,{rng:()=>0,currentTier:'low',draw:()=>({card:'1 Tentacle'})}).groups;
   assert.ok(groups.length>0,set+' '+tier+' '+card);
   for(const g of groups){assert.ok(engine.ENEMY_NAMES.includes(g.type));assert.ok(g.n>=1)}
  }
 }
});
test('all original low threat cards parse without substitution',()=>{
 for(const [set,cards] of Object.entries(low))for(const {copies,card} of cards){
  assert.ok(copies>=1);
  const groups=engine.resolveEncounter(card,{rng:()=>0,draw:()=>({card:'1 Tentacle'})}).groups;
  assert.ok(groups.length>0,set+' '+card);
 }
});
