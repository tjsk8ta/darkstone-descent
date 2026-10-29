'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('function moveStep('),b=html.indexOf('function moveTowards(',a);
assert.ok(a>=0&&b>a);
function scenario(dx,dy,escapeRoll){
 const e={id:1,x:1,y:0,type:'Tentacle'};
 const room={seen:true,explored:true};
 const S={x:0,y:0,move:4,turn:1,ended:false,escapedValue:1,enemies:[e],pendingEvent:null};
 let rolls=0;
 const ctx={S,pendingAttack:null,$:()=>({classList:{contains:()=>true}}),
  log:()=>{},render:()=>{},save:()=>{},cellAt:()=>true,crossesConnectedDoor:()=>true,
  occupied:()=>false,roomAt:()=>room,enterRoom:()=>{},effectiveEnemyEscape:()=>4,
  man:(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y)),
  die:()=>{rolls++;return escapeRoll;}};
 vm.runInNewContext(html.slice(a,b),ctx);
 ctx.moveStep(dx,dy);
 return {x:S.x,y:S.y,rolls,move:S.move};
}
test('remaining adjacent to enemy does not require Escape roll',()=>{
 assert.deepEqual(scenario(0,1,1),{x:0,y:1,rolls:0,move:3});
});
test('leaving adjacency requires Escape and failed roll does not spend movement',()=>{
 assert.deepEqual(scenario(-1,0,1),{x:0,y:0,rolls:1,move:4});
});
test('successful Escape permits movement',()=>{
 assert.deepEqual(scenario(-1,0,5),{x:-1,y:0,rolls:1,move:3});
});
