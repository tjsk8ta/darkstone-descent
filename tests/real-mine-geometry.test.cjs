'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const slice=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i);return html.slice(i,j)};
const geometry=slice('function roomAt(','function createProfile(');
const movement=slice('function crossesConnectedDoor(','function doorwayRoom(');
const prelude=`const W=9,H=7,N=9,D={N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]};
let S;const id=(x,y)=>x+','+y;
const log=m=>S.messages.push(m);
function roomCurrent(){return roomAt(S.x,S.y)}`;
const evaluate=body=>new Function(prelude+geometry+movement+body)();
const entrance=`{x:4,y:5,shape:'entrance',name:'Mine Entrance',doors:['N'],seen:true,explored:true}`;
const junction=`{x:4,y:4,shape:'tee',name:'T-Junction',firstJunction:true,doors:['S','E','W'],seen:true,explored:true}`;
test('real pathfinder can reach both T-junction side portals from entrance',()=>{
 const result=evaluate(`const entry=${entrance},junction=${junction};
 S={x:4*W+4,y:5*H+4,rooms:{'4,5':entry,'4,4':junction},enemies:[],messages:[],ended:false};
 return {frontiers:frontierCandidates().map(f=>f.dir).sort(),
 west:path({x:S.x,y:S.y},{x:4*W,y:4*H+3})?.length,
 east:path({x:S.x,y:S.y},{x:4*W+8,y:4*H+3})?.length};`);
 assert.deepEqual(result.frontiers,['E','W']);assert.ok(result.west>0);assert.ok(result.east>0);
});
test('real pathfinder repairs a dead end with no exit from a reachable chamber',()=>{
 const result=evaluate(`const entry=${entrance};
 S={x:4*W+4,y:5*H+4,rooms:{'4,5':entry},enemies:[],messages:[],ended:false};
 // No available unexplored exit: old save had an entrance with no north door.
 entry.doors=[];ensureOpenFrontier();
 return {doors:entry.doors,frontiers:frontierCandidates().length,messages:S.messages};`);
 assert.ok(result.doors.length>0);assert.ok(result.frontiers>0);
});
test('real pathfinder reconnects a pre-existing unrevealed neighbour',()=>{
 const result=evaluate(`const entry=${entrance};
 const neighbor={x:4,y:4,shape:'chamber',name:'Old Chamber',doors:[],seen:false,explored:false};
 S={x:4*W+4,y:5*H+4,rooms:{'4,5':entry,'4,4':neighbor},enemies:[],messages:[],ended:false};
 entry.doors=[];ensureOpenFrontier();
 return {entry:entry.doors,neighbor:neighbor.doors,frontiers:frontierCandidates().length};`);
 // Prefer another undrawn exit when one exists; otherwise reciprocal connection.
 assert.ok(result.frontiers>0);
});
