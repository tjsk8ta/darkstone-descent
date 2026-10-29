'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function extract(name,next){
 const start=html.indexOf('function '+name+'('),end=html.indexOf('function '+next+'(',start);
 assert.ok(start>=0&&end>start,'Cannot extract '+name);
 return html.slice(start,end);
}
const source=extract('applyModelLimits','previewEliteAbilities');
const TYPES={'Tentacle':{modelCap:6},'Void Spider':{modelCap:12},'Night Terror':{modelCap:3}};
function limits(groups,existing=[],set='city'){
 const S={enemies:existing.map(type=>({type})),coreThreatSet:set};
 return new Function('S','TYPES',source+';return applyModelLimits;')(S,TYPES)(groups);
}
test('Miniature shortages cap physical models and grant one group Elite',()=>{
 const out=limits([{type:'Tentacle',n:8,elite:0}]);
 assert.equal(out[0].n,6);assert.equal(out[0].elite,1);
});
test('Existing models reduce available figures',()=>{
 const out=limits([{type:'Tentacle',n:5,elite:0}],['Tentacle','Tentacle']);
 assert.equal(out[0].n,4);assert.equal(out[0].elite,1);
});
test('Combined core sets have twelve Tentacles available',()=>{
 const out=limits([{type:'Tentacle',n:10,elite:0}],[],'combined');
 assert.equal(out[0].n,10);assert.equal(out[0].elite,0);
});
test('Shortage across multiple groups does not create more figures than the box',()=>{
 const out=limits([{type:'Void Spider',n:9,elite:0},{type:'Void Spider',n:9,elite:0}]);
 assert.equal(out.reduce((n,g)=>n+g.n,0),12);
 assert.equal(out.reduce((n,g)=>n+g.elite,0),1);
});
test('Model limits never alter an encounter that fits',()=>{
 const out=limits([{type:'Night Terror',n:3,elite:0}]);
 assert.equal(out[0].n,3);assert.equal(out[0].elite,0);
});
