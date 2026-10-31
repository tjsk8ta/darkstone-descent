'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('For a Few Dark Stone More uses standard randomized Mine Map setup, not forced T-Junction',()=>{
 const start=html.indexOf('function drawNextMap('),end=html.indexOf('function resolveExplorationToken(',start);
 assert.ok(start>0&&end>start);
 const code=html.slice(start,end);
 assert.match(code,/let firstJunction=false;let card=S\.mapDeck\.pop\(\)/);
 assert.doesNotMatch(code,/firstJunction\?\{name:'T-Junction'/);
 assert.match(code,/log\('Map card drawn: '/);
});
test('dynamite D8 bounce directions agree with printed 2020 back-cover diagram',()=>{
 const start=html.indexOf('function throwDynamite('),end=html.indexOf('function supply(',start);
 assert.ok(start>0&&end>start);
 const code=html.slice(start,end);
 assert.match(code,/dirs=\[\[-1,-1\],\[0,-1\],\[1,-1\],\[1,0\],\[1,1\],\[0,1\],\[-1,1\],\[-1,0\]\]/);
 assert.match(code,/if\(cellAt\(nx,ny\)\)/);
});
