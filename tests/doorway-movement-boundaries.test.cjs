'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function crossesConnectedDoor(');
const end=html.indexOf('function occupied(',start);
assert.ok(start>=0&&end>start);
function make({seen=true,connected=true,diagonal=false}={}){
 const rooms={'0,0':{x:0,y:0,doors:['E']},'1,0':{x:1,y:0,seen,doors:['W']},'1,1':{x:1,y:1,seen,doors:['N']}};
 const context={roomAt:(x,y)=>rooms[Math.floor(x/10)+','+Math.floor(y/6)]||null,adjoiningDoorConnected:()=>connected};
 vm.runInNewContext(html.slice(start,end),context);
 return context.crossesConnectedDoor;
}
test('same-room movement remains available',()=>assert.equal(make()(3,3,4,3),true));
test('connected revealed door allows room crossing',()=>assert.equal(make()(9,2,10,2),true));
test('unrevealed neighbor blocks room crossing',()=>assert.equal(make({seen:false})(9,2,10,2),false));
test('unconnected doors block room crossing',()=>assert.equal(make({connected:false})(9,2,10,2),false));
test('diagonal room-corner transition is forbidden',()=>assert.equal(make()(9,5,10,6),false));
test('direct and click-path movement both check connected doors',()=>{
 assert.match(html,/if\(!crossesConnectedDoor\(p\.x,p\.y,x,y\)\)continue/);
 assert.match(html,/if\(!cellAt\(x,y\)\|\|!crossesConnectedDoor\(S\.x,S\.y,x,y\)/);
});

test('line of sight is blocked by disconnected doors and diagonal walls',()=>{
 const a=html.indexOf('function lineOfSight('),b=html.indexOf('function canAttack(',a);
 assert.ok(a>=0&&b>a);
 function run(connected,blocked=false){
  const ctx={cellAt:(x,y)=>!blocked||!(x===1&&y===0),visibleAt:()=>true,crossesConnectedDoor:()=>connected};
  vm.runInNewContext(html.slice(a,b),ctx);
  return ctx.lineOfSight({x:0,y:0},{x:1,y:1});
 }
 assert.equal(run(true,false),true);
 assert.equal(run(false,false),false);
 assert.equal(run(true,true),false);
});
