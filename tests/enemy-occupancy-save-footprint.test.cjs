'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const tactics=require('../rules/enemy-tactics.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const match=html.match(/function occupied\(x,y\)\{[^\n]*\}/);
assert.ok(match,'Browser occupancy implementation must exist');
function check(enemies,types,x,y){
 const context={S:{enemies},TYPES:types,enemyTactics:tactics};
 vm.runInNewContext(match[0]+';globalThis.check=occupied;',context);
 return context.check(x,y);
}
test('restored extra-large footprint blocks all four occupied spaces',()=>{
 const enemy={id:7,type:'Goliath',x:4,y:5,baseSize:'extra-large'};
 const types={Goliath:{baseSize:'medium'}};
 for(const [x,y] of [[4,5],[5,5],[4,6],[5,6]])assert.equal(check([enemy],types,x,y).id,7);
 assert.equal(check([enemy],types,6,6),undefined);
});
test('legacy saves without baseSize use the type footprint',()=>{
 const enemy={id:8,type:'Goliath',x:1,y:2};
 assert.equal(check([enemy],{Goliath:{baseSize:'extra-large'}},2,3).id,8);
});
test('ordinary enemies occupy one space only',()=>{
 const enemy={id:9,type:'Tentacle',x:1,y:2,baseSize:'medium'};
 assert.equal(check([enemy],{Tentacle:{baseSize:'medium'}},1,2).id,9);
 assert.equal(check([enemy],{Tentacle:{baseSize:'medium'}},2,2),undefined);
});

test('enemy spawning preserves edition-specific large and extra-large sizes',()=>{
 assert.match(html,/const size=t\.baseSize\|\|'medium';const p=locs\.find/);
 assert.match(html,/baseSize:size/);
});
test('enemy movement uses persisted size for moving enemy and blockers',()=>{
 assert.match(html,/const footprint=e\.baseSize\|\|t\.baseSize\|\|'medium'/);
 assert.match(html,/size:other\.baseSize\|\|TYPES\[other\.type\]\?\.baseSize\|\|'medium'/);
});
