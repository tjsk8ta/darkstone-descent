'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const extract=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i);return html.slice(i,j)};
function harness({hero=[0,3],doors=['S','E','W'],actionUsed=false,searchUsedTurn=-1,seenNeighbor=false}={}){
 const r={x:4,y:4,shape:'tee',name:'T-Junction',firstJunction:true,doors,explored:true};
 const S={x:4*9+hero[0],y:4*7+hero[1],rooms:{'4,4':r},turn:3,actionUsed,searchUsedTurn,enemies:[],ended:false};
 if(seenNeighbor)S.rooms['3,4']={seen:true};
 const ctx={S,W:9,H:7,N:9,D:{N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]},pendingAttack:null,
  id:(x,y)=>x+','+y,roomCurrent:()=>r,floorLocal:()=>true,$:()=>({classList:{contains:()=>true}})};
 vm.runInNewContext(extract('const PORTAL_LANES=','const MAP_CARD_POOL='),ctx);
 vm.runInNewContext(extract('function doorwayRoom(){','function lookThroughDoor(){'),ctx);
 return ctx;
}
test('west T-Junction boundary enables Look Through Door',()=>{let c=harness();assert.equal(c.doorwayRoom().dir,'W');assert.equal(c.doorwayStatus().ready,true)});
test('east T-Junction boundary enables Look Through Door',()=>{let c=harness({hero:[8,3]});assert.equal(c.doorwayRoom().dir,'E');assert.equal(c.doorwayStatus().ready,true)});
test('legacy T-Junction with missing west door is recovered',()=>{let c=harness({doors:['S','E']});assert.equal(c.doorwayRoom().dir,'W')});
test('non-boundary square is not a door',()=>{let c=harness({hero:[1,3]});assert.equal(c.doorwayRoom(),null);assert.equal(c.doorwayStatus().ready,false)});
test('action spent is visible in status, not silently disabled',()=>{let c=harness({actionUsed:true});assert.match(c.doorwayStatus().reason,/already used/)});
test('previously revealed neighbor is not offered again',()=>{let c=harness({seenNeighbor:true});assert.equal(c.doorwayRoom(),null)});
test('portal geometry shared with cross-room movement',()=>{assert.match(html,/portalLane\(from,dir,fx,fy\)&&portalLane\(to,OPPOSITE_DOOR\[dir\],tx,ty\)/)});
test('button and action handler share doorwayStatus',()=>{assert.match(html,/const doorState=doorwayStatus\(\)/);assert.match(html,/function lookThroughDoor\(\)\{const state=doorwayStatus\(\)/)});
