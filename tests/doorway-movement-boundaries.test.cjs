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
 const PORTAL_LANES={N:[[4,0],[5,0]],S:[[4,6],[5,6]],E:[[8,2],[8,3]],W:[[0,2],[0,3]]};
 const context={portalLane:(r,d,x,y)=>(r.doors||[]).includes(d)&&PORTAL_LANES[d].some(([a,b])=>a===x&&b===y),roomAt:(x,y)=>rooms[Math.floor(x/9)+','+Math.floor(y/7)]||null,adjoiningDoorConnected:()=>connected,W:9,H:7,OPPOSITE_DOOR:{N:'S',S:'N',E:'W',W:'E'},floorLocal:()=>true};
 vm.runInNewContext(html.slice(start,end),context);
 return context.crossesConnectedDoor;
}
test('same-room movement remains available',()=>assert.equal(make()(3,3,4,3),true));
test('connected revealed door allows room crossing',()=>assert.equal(make()(8,2,9,2),true));
test('unrevealed neighbor blocks room crossing',()=>assert.equal(make({seen:false})(8,2,9,2),false));
test('unconnected doors block room crossing',()=>assert.equal(make({connected:false})(8,2,9,2),false));
test('diagonal room-corner transition is forbidden',()=>assert.equal(make()(8,6,9,7),false));
test('a connected boundary is passable only through actual doorway lanes',()=>{assert.equal(make()(8,3,9,3),true);assert.equal(make()(8,1,9,1),false)});
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
