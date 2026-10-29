'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function part(startName,endName){
 const a=html.indexOf('function '+startName+'('),b=html.indexOf('function '+endName+'(',a);
 assert.ok(a>=0&&b>a,startName+' function boundaries');
 return html.slice(a,b);
}
function scenario(doorOpen){
 const rooms={'0,0':{x:0,y:0,seen:true,doors:['E']},'1,0':{x:1,y:0,seen:true,doors:['W']}};
 const ctx={S:{x:8,y:2,enemies:[],rooms},W:9,H:7,floorLocal:()=>true,
  roomAt:(x,y)=>rooms[Math.floor(x/9)+','+Math.floor(y/7)]||null,
  adjoiningDoorConnected:()=>doorOpen,
  cellAt:(x,y)=>x>=0&&x<18&&y>=0&&y<7,
  visibleAt:()=>true,
  id:(x,y)=>x+','+y,occupied:()=>false};
 vm.runInNewContext(part('crossesConnectedDoor','occupied'),ctx);
 vm.runInNewContext(part('path','doorwayRoom'),ctx);
 vm.runInNewContext(part('lineOfSight','canAttack'),ctx);
 return ctx;
}
test('integrated exploration and combat geometry: open doorway',()=>{
 const ctx=scenario(true);
 const route=ctx.path({x:8,y:2},{x:9,y:2});
 assert.equal(route.length,1);
 assert.equal(route[0].x,9);
 assert.equal(ctx.lineOfSight({x:8,y:2},{x:9,y:2}),true);
});
test('integrated exploration and combat geometry: closed doorway',()=>{
 const ctx=scenario(false);
 assert.equal(ctx.path({x:8,y:2},{x:9,y:2}),null);
 assert.equal(ctx.lineOfSight({x:8,y:2},{x:9,y:2}),false);
});
