'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const a=html.indexOf('function spawnEntrance('),b=html.indexOf('function spawnEnemy(',a);
assert.ok(a>=0&&b>a,'Missing placement functions');
const code=html.slice(a,b);
const W=9,H=7,D={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]},OP={N:'S',S:'N',E:'W',W:'E'};
function harness({withParent=true,enemyCount=0}={}){
 const r={x:1,y:1,doors:['S'],entryDir:'S',seen:true};
 const parent={x:1,y:2,doors:['N'],seen:true};
 const S={x:W+4,y:2*H+3,enemies:[],rooms:{'1,1':r}};
 if(withParent)S.rooms['1,2']=parent;
 const id=(x,y)=>x+','+y;
 const roomAt=(x,y)=>S.rooms[id(Math.floor(x/W),Math.floor(y/H))]||null;
 const cellAt=(x,y)=>!!roomAt(x,y);
 const adjoiningDoorConnected=()=>true;
 const f=new Function('S','W','H','D','OP','id','cellAt','roomAt','adjoiningDoorConnected',
  code+';return {spawnSpaces,tileSpawnSpaces,spawnEntrance};');
 const api=f(S,W,H,D,OP,id,cellAt,roomAt,adjoiningDoorConnected);
 for(let i=0;i<enemyCount;i++)S.enemies.push({x:W+i%W,y:H+Math.floor(i/W)});
 return {S,r,parent,api};
}
test('Normal placement uses checkerboard first, then remaining spaces',()=>{
 const {r,api}=harness({withParent:false});
 const positions=api.tileSpawnSpaces(r,'S');
 assert.equal(positions.length,W*H);
 assert.equal(new Set(positions.map(p=>p.x+','+p.y)).size,W*H);
 const parity=(positions[0].x+positions[0].y)%2;
 assert.ok(positions.slice(0,Math.ceil(W*H/2)).every(p=>(p.x+p.y)%2===parity));
});
test('Overflow uses only the room connected to the encounter entrance',()=>{
 const {r,parent,api}=harness();
 const spaces=api.spawnSpaces(r);
 assert.equal(spaces.length,2*W*H-1);
 assert.ok(spaces.slice(0,W*H).every(p=>Math.floor(p.y/H)===r.y));
 assert.ok(spaces.slice(W*H).every(p=>Math.floor(p.y/H)===parent.y));
});
test('No parent means no overflow and no occupied hero square',()=>{
 const {r,api,S}=harness({withParent:false});
 const spaces=api.spawnSpaces(r);
 assert.equal(spaces.length,W*H);
 assert.ok(!spaces.some(p=>p.x===S.x&&p.y===S.y));
});
test('Occupied enemy squares are excluded from spawn capacity',()=>{
 const {r,api}=harness({withParent:false,enemyCount:3});
 assert.equal(api.spawnSpaces(r).length,W*H-3);
});
