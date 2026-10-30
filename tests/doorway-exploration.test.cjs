'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function doorwayHarness({hero,doors,edgeFloor,neighbor=null}){
 const r={x:2,y:2,explored:true,doors,firstJunction:doors.includes('S')&&doors.includes('E'),name:doors.includes('S')&&doors.includes('E')?'T-Junction':'Chamber'};
 const S={x:2*9+hero[0],y:2*7+hero[1],rooms:neighbor?{'3,2':neighbor}:{}};
 const ctx={S,W:9,H:7,N:9,D:{N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]},id:(x,y)=>x+','+y,roomCurrent:()=>r,floorLocal:(_,x,y)=>edgeFloor(x,y)};
 const shared=html.slice(html.indexOf('const PORTAL_LANES='),html.indexOf('const MAP_CARD_POOL='));
 vm.createContext(ctx);
 vm.runInContext(shared,ctx);
 const start=html.indexOf('function doorwayRoom(){'),end=html.indexOf('function lookThroughDoor()',start);
 assert.ok(start>=0&&end>start);
 vm.runInContext(html.slice(start,end),ctx);
 return ctx.doorwayRoom();
}
test('hero standing on the actual east boundary half-space can reveal door',()=>{
 const result=doorwayHarness({hero:[8,2],doors:['E'],edgeFloor:(x,y)=>x===8&&y===2});
 assert.equal(result.undrawn,true);
 assert.equal(result.dir,'E');
});
test('door is not available from a distant position',()=>{
 const result=doorwayHarness({hero:[2,2],doors:['E'],edgeFloor:(x,y)=>x===8&&y===2});
 assert.equal(result,null);
});
test('adjacent but non-boundary position cannot reveal a door',()=>{
 const result=doorwayHarness({hero:[7,3],doors:['E'],edgeFloor:(x,y)=>x===8&&y===2,neighbor:{x:3,y:2,seen:false,doors:['W']}});
 assert.equal(result,null);
});
test('end turn does not route an ordinary pending encounter into Growing Dread',()=>{
 assert.match(html,/if\(S\.pendingEvent\)\{log\('Resolve the current encounter before ending the turn/);
 assert.match(html,/if\(S\.finalEncounter&&!S\.finalEncounter\.started\)\{showGrowingDread\(\);return\}/);
});

test('non-doorway edge squares cannot reveal adjacent rooms',()=>{
 const result=doorwayHarness({hero:[8,4],doors:['E'],edgeFloor:(x,y)=>x===8&&y===4});
 assert.equal(result,null);
});

test('adjacent but non-boundary square cannot look through door',()=>{
 const result=doorwayHarness({hero:[7,3],doors:['E'],edgeFloor:(x,y)=>x===8&&y===2});
 assert.equal(result,null);
});

test('western end of first T-Junction is a valid Look Through Door square',()=>{
 const result=doorwayHarness({hero:[0,3],doors:['S','E','W'],edgeFloor:(x,y)=>x===0&&y===3});
 assert.equal(result.undrawn,true);
 assert.equal(result.dir,'W');
});
test('eastern end of first T-Junction is a valid Look Through Door square',()=>{
 const result=doorwayHarness({hero:[8,3],doors:['S','E','W'],edgeFloor:(x,y)=>x===8&&y===3});
 assert.equal(result.undrawn,true);
 assert.equal(result.dir,'E');
});
test('the row above the passage end does not incorrectly qualify',()=>{
 const result=doorwayHarness({hero:[0,1],doors:['W'],edgeFloor:(x,y)=>x===0&&y===1});
 assert.equal(result,null);
});

test('older T-Junction save without west exit still recognises hero on west end',()=>{
 const result=doorwayHarness({hero:[0,3],doors:['S','E'],edgeFloor:(x,y)=>x===0&&y===3});
 assert.equal(result.undrawn,true);
 assert.equal(result.dir,'W');
});
test('unseen pre-generated neighbor does not suppress visible T-Junction exit',()=>{
 const result=doorwayHarness({hero:[8,3],doors:['S','E','W'],edgeFloor:(x,y)=>x===8&&y===3,neighbor:{x:3,y:2,seen:false,doors:['W']}});
 assert.equal(result.x,3);assert.equal(result.seen,false);
});
