'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const tactics=require('../rules/enemy-tactics.js'),equipment=require('../rules/hero-equipment.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const floor=(x,y)=>x>=0&&x<9&&y>=0&&y<7;
test('enemy approaches to adjacent square without stepping onto Hero',()=>{
 const m=tactics.chooseMove({enemy:{id:1,x:0,y:0},hero:{x:3,y:0},steps:2,walkable:floor});
 assert.equal(m.adjacent,true);assert.notDeepEqual(m.destination,{x:3,y:0});
 assert.equal(m.route.length,2);
});
test('enemy cannot walk through another model in a narrow corridor',()=>{
 const m=tactics.chooseMove({enemy:{id:1,x:0,y:0},hero:{x:3,y:0},steps:4,walkable:(x,y)=>y===0&&x>=0&&x<5,occupants:[{id:2,x:1,y:0}]});
 assert.deepEqual(m.destination,{x:0,y:0});
});
test('ranged movement and combat remain separated in the activation pipeline',()=>{
 assert.match(html,/const ranged=Number\.isInteger\(t\.attackRange\)/);
 assert.match(html,/if\(!ranged\|\|!inRange\)/);
 assert.match(html,/enemyTactics\.chooseMove/);
});
test('2x2 Extra Large footprints are four spaces and cannot overlap the Hero',()=>{
 assert.deepEqual(tactics.cells({x:2,y:3},'extra-large'),[{x:2,y:3},{x:3,y:3},{x:2,y:4},{x:3,y:4}]);
 assert.equal(tactics.overlap({x:2,y:3},'extra-large',{x:3,y:4},'medium'),true);
 const m=tactics.chooseMove({enemy:{id:1,x:0,y:0,size:'extra-large'},hero:{x:4,y:1},steps:5,walkable:floor});
 assert.equal(tactics.overlap(m.destination,'extra-large',{x:4,y:1},'medium'),false);
});
test('Large enemies may displace smaller models but never another Large enemy',()=>{
 const args={enemy:{id:1,x:0,y:0,size:'large'},hero:{x:3,y:0},steps:2,walkable:(x,y)=>y===0&&x>=0&&x<5,allowDisplace:true};
 const small=tactics.chooseMove({...args,occupants:[{id:2,x:1,y:0,size:'medium'}]});
 assert.equal(small.displaced.length,1);assert.deepEqual(small.displaced[0],{id:2,x:0,y:0});
 const large=tactics.chooseMove({...args,occupants:[{id:2,x:1,y:0,size:'large'}]});
 assert.deepEqual(large.destination,{x:0,y:0});
});
test('equipment upgrade slots, duplicates and forged removals',()=>{
 const item=equipment.createItem({id:'p',name:'Pistol',hands:1,slots:3});
 assert.equal(equipment.attach(item,{id:'sight',requirement:2,forged:true}),true);
 assert.equal(equipment.attach(item,{id:'grip',requirement:2}),false);
 assert.equal(equipment.attach(item,{id:'sight',requirement:1}),false);
 assert.equal(equipment.attach(item,{id:'stock',requirement:1}),true);
 assert.equal(equipment.detach(item,'sight'),false);
 assert.equal(equipment.detach(item,'stock'),true);
});
test('equipment upgrade controls and footprint-aware spawning wired to game',()=>{
 for(const q of ['data-upgrade=','data-detach=','DarkstoneHeroEquipment.attach','DarkstoneHeroEquipment.detach','enemyTactics.cells(p,size)','baseSize:size'])assert.ok(html.includes(q),q);
});
