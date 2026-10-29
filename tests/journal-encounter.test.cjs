'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('encounter card, resolved models, placements, unresolved results and fight outcome are journalled',()=>{
 for(const text of ['ENCOUNTER RESULT','Threat card: ','Encounter placed at: ','ENCOUNTER UNRESOLVED','FIGHT RESULT']){
  assert.ok(html.includes(text),'missing persistent journal record: '+text);
 }
 assert.ok(html.includes('S.log=S.log.slice(0,250)'),'journal retention should preserve 250 records');
});
test('Tentacle Elite chart uses the verified Brutal Suckers name and effect',()=>{
 assert.ok(html.includes("id:'brutal-suckers',name:'Brutal Suckers'"));
 assert.ok(html.includes("eliteHas(e.type,'brutal-suckers')"));
 assert.ok(!html.includes("'bitter-success'"));
});
