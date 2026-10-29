'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function doorwayHarness({hero,doors,edgeFloor,neighbor=null}){
 const r={x:2,y:2,explored:true,doors};
 const S={x:2*10+hero[0],y:2*6+hero[1],rooms:neighbor?{'3,2':neighbor}:{}};
 const ctx={S,W:10,H:6,N:8,D:{N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]},id:(x,y)=>x+','+y,roomCurrent:()=>r,floorLocal:(_,x,y)=>edgeFloor(x,y),adjoiningDoorConnected:()=>false};
 const start=html.indexOf('function doorwayRoom(){'),end=html.indexOf('function lookThroughDoor()',start);
 assert.ok(start>=0&&end>start);
 vm.runInNewContext(html.slice(start,end),ctx);
 return ctx.doorwayRoom();
}
test('adjacent accessible east doorway can be revealed without exact marker coordinates',()=>{
 const result=doorwayHarness({hero:[8,4],doors:['E'],edgeFloor:(x,y)=>x===9&&y===4});
 assert.equal(result.undrawn,true);
 assert.equal(result.dir,'E');
});
test('door is not available from a distant position',()=>{
 const result=doorwayHarness({hero:[2,2],doors:['E'],edgeFloor:(x,y)=>x===9&&y===4});
 assert.equal(result,null);
});
test('existing room with disconnected door cannot be revealed',()=>{
 const result=doorwayHarness({hero:[8,4],doors:['E'],edgeFloor:(x,y)=>x===9&&y===4,neighbor:{x:3,y:2,seen:false,doors:['W']}});
 assert.equal(result,null);
});
test('end turn does not route an ordinary pending encounter into Growing Dread',()=>{
 assert.match(html,/if\(S\.pendingEvent\)\{log\('Resolve the current encounter before ending the turn/);
 assert.match(html,/if\(S\.finalEncounter&&!S\.finalEncounter\.started\)\{showGrowingDread\(\);return\}/);
});
