/* Revised City of the Ancients Rulebook, Enemy Movement pp.28-30 and Extra Large Enemies.
 * https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf
 * Pure geometry/occupancy; no enemy sheet values are inferred.
 */
(function(root){'use strict';
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function cells(anchor,size='medium'){if(!anchor||!Number.isInteger(anchor.x)||!Number.isInteger(anchor.y))throw Error('Invalid anchor');return size==='extra-large'?[{x:anchor.x,y:anchor.y},{x:anchor.x+1,y:anchor.y},{x:anchor.x,y:anchor.y+1},{x:anchor.x+1,y:anchor.y+1}]:[{x:anchor.x,y:anchor.y}]}
function overlap(a,as,b,bs){return cells(a,as).some(p=>cells(b,bs).some(q=>p.x===q.x&&p.y===q.y))}
function adjacent(a,as,b,bs){return cells(a,as).some(p=>cells(b,bs).some(q=>Math.max(Math.abs(p.x-q.x),Math.abs(p.y-q.y))===1))}
function chooseMove({enemy,hero,steps,walkable,occupants=[],canStep,allowDisplace=false}){
 if(!enemy||!hero||!Number.isInteger(steps)||steps<0||typeof walkable!=='function')throw Error('Invalid move');
 const size=enemy.size||'medium';const start={x:enemy.x,y:enemy.y};const target={x:hero.x,y:hero.y};
 const visited=new Set([start.x+','+start.y]),queue=[{p:start,route:[],displaced:[]}];let best=null;
 const valid=(a,b)=>{if(typeof canStep==='function'&&!canStep(a,b))return false;return cells(b,size).every(p=>walkable(p.x,p.y))};
 while(queue.length){const state=queue.shift(),pos=state.p;
  const near=adjacent(pos,size,target,'medium');
  const dist=Math.max(...cells(pos,size).map(p=>Math.max(Math.abs(p.x-target.x),Math.abs(p.y-target.y))));
  const score=(near?100000:0)+state.route.length*100-dist;
  if(!best||score>best.score)best={...state,score,near};
  if(state.route.length===steps)continue;
  for(const [dx,dy] of DIRS){
   const next={x:pos.x+dx,y:pos.y+dy},key=next.x+','+next.y;
   if(visited.has(key)||!valid(pos,next)||overlap(next,size,target,'medium'))continue;
   if(dx&&dy&&(!valid(pos,{x:pos.x+dx,y:pos.y})||!valid(pos,{x:pos.x,y:pos.y+dy})))continue;
   const conflicts=occupants.filter(o=>o.id!==enemy.id&&overlap(next,size,o,o.size||'medium'));
   if(conflicts.length>1||conflicts.some(o=>(o.size||'medium')!=='medium'&&(o.size||'medium')!=='small')||conflicts.length&&(!allowDisplace||size==='medium'||size==='small'))continue;
   const displaced=state.displaced.slice();
   if(conflicts.length){const other=conflicts[0];if(overlap(pos,size,target,'medium')||occupants.some(o=>o.id!==enemy.id&&o.id!==other.id&&overlap(pos,size,o,o.size||'medium')))continue;displaced.push({id:other.id,x:pos.x,y:pos.y})}
   visited.add(key);queue.push({p:next,route:state.route.concat([next]),displaced});
  }
 }
 return best?{destination:best.p,route:best.route,displaced:best.displaced,adjacent:best.near}:null;
}
const api=Object.freeze({cells,overlap,adjacent,chooseMove});root.DarkstoneEnemyTactics=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
