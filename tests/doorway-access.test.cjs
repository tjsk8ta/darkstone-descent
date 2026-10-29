'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('function doorwayRoom(){'),b=html.indexOf('function lookThroughDoor()',a);
assert.ok(a>=0&&b>a);
const source=html.slice(a,b);
function doorway(room,hero,seen=false){
 const W=9,H=7,N=9,D={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]};
 const S={x:hero[0],y:hero[1],rooms:{'0,0':room,...(seen?{'1,0':{seen:true}}:{})}};
 const roomCurrent=()=>room;
 const floorLocal=()=>true;
 const id=(x,y)=>x+','+y;
 return new Function('S','W','H','N','D','roomCurrent','floorLocal','id',source+';return doorwayRoom;')(S,W,H,N,D,roomCurrent,floorLocal,id)();
}
test('T junction east blue exit can be activated at marker and adjacent floor',()=>{
 const r={x:0,y:0,explored:true,doors:['E','W','S']};
 assert.ok(doorway(r,[8,2]));
 assert.ok(doorway(r,[7,2]));
 assert.ok(doorway(r,[6,2]));
});
test('already revealed doors and remote floor do not offer exploration',()=>{
 const r={x:0,y:0,explored:true,doors:['E']};
 assert.equal(doorway(r,[8,2],true),null);
 assert.equal(doorway(r,[4,3]),null);
});
