'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function spawnSpaces(r){');
const end=html.indexOf('function spawnEnemy(',start);
assert.ok(start>=0&&end>start);
const source=html.slice(start,end);
function make(rooms,connected){
 const D={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]},OP={N:'S',S:'N',E:'W',W:'E'};
 const S={rooms:Object.fromEntries(rooms.map(r=>[r.x+','+r.y,r]))};
 const id=(x,y)=>x+','+y;
 const tileSpawnSpaces=r=>[{x:r.x,y:r.y}];
 const adjoiningDoorConnected=(a,dir,b)=>connected.has(a.x+','+a.y+'>'+b.x+','+b.y);
 const spawnEntrance=()=>null;
 return new Function('D','OP','S','id','tileSpawnSpaces','adjoiningDoorConnected','spawnEntrance',source+';return spawnSpaces;')(D,OP,S,id,tileSpawnSpaces,adjoiningDoorConnected,spawnEntrance);
}
test('large encounters may overflow through multiple connected explored tiles',()=>{
 const rooms=[{x:0,y:0,seen:true},{x:1,y:0,seen:true},{x:2,y:0,seen:true}];
 const edges=new Set(['0,0>1,0','1,0>2,0']);
 const spawn=make(rooms,edges);
 assert.deepEqual(spawn(rooms[0]),[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
});
test('unexplored or disconnected rooms are never used for spawn overflow',()=>{
 const rooms=[{x:0,y:0,seen:true},{x:1,y:0,seen:false},{x:0,y:1,seen:true}];
 const edges=new Set(['0,0>1,0']);
 assert.deepEqual(make(rooms,edges)(rooms[0]),[{x:0,y:0}]);
});
