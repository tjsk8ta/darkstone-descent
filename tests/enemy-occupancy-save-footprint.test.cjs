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
 assert.match(html,/const size=t\.baseSize\|\|'medium';const p=locs\.find\(p=>canPlaceEnemyFootprint\(p,size\)\)/);
 assert.match(html,/baseSize:size/);
});
test('enemy movement uses persisted size for moving enemy and blockers',()=>{
 assert.match(html,/const footprint=e\.baseSize\|\|t\.baseSize\|\|'medium'/);
 assert.match(html,/size:other\.baseSize\|\|TYPES\[other\.type\]\?\.baseSize\|\|'medium'/);
});

const placementMatch=html.match(/function canPlaceEnemyFootprint\(p,size,ignoreEnemyId=null\)\{[^\n]*\}/);
assert.ok(placementMatch,'Shared footprint placement validator must exist');
function canPlace(anchor,size,{hero={x:99,y:99},enemies=[],walkable=()=>true,seen=()=>true,ignoreId=null}={}){
 const context={S:{...hero,enemies},enemyTactics:tactics,cellAt:walkable,roomAt:(x,y)=>({seen:seen(x,y)}),TYPES:{},occupied:(x,y)=>enemies.find(e=>tactics.cells(e,e.baseSize||'medium').some(p=>p.x===x&&p.y===y))};
 vm.runInNewContext(placementMatch[0]+';globalThis.check=canPlaceEnemyFootprint;',context);
 return context.check(anchor,size,ignoreId);
}
test('extra-large ambush cannot overlap hero in any footprint cell',()=>{
 assert.equal(canPlace({x:4,y:4},'extra-large',{hero:{x:5,y:5}}),false);
 assert.equal(canPlace({x:4,y:4},'extra-large',{hero:{x:6,y:6}}),true);
});
test('extra-large ambush cannot overlap another enemy or unseen room',()=>{
 assert.equal(canPlace({x:4,y:4},'extra-large',{enemies:[{x:5,y:4,baseSize:'medium'}]}),false);
 assert.equal(canPlace({x:4,y:4},'extra-large',{seen:(x,y)=>!(x===5&&y===5)}),false);
 assert.equal(canPlace({x:4,y:4},'extra-large',{walkable:(x,y)=>!(x===4&&y===5)}),false);
});
test('normal and drop-from-above spawns share full footprint validation',()=>{
 assert.match(html,/const p=locs\.find\(p=>canPlaceEnemyFootprint\(p,size\)\)/);
 assert.match(html,/\.filter\(p=>canPlaceEnemyFootprint\(p,e\.baseSize\|\|TYPES\[e\.type\]\?\.baseSize\|\|'medium',e\.id\)\&\&lineOfSight\(S,p\)\)/);
});

test('ambush reposition may overlap its own former footprint but not other models',()=>{
 const self={id:1,type:'Goliath',x:4,y:4,baseSize:'extra-large'};
 assert.equal(canPlace({x:5,y:4},'extra-large',{enemies:[self],ignoreId:1}),true);
 assert.equal(canPlace({x:5,y:4},'extra-large',{enemies:[self,{id:2,type:'Tentacle',x:6,y:4,baseSize:'medium'}],ignoreId:1}),false);
});
