/* Revised City rulebook pp.28,32: movement, displacement, 2x2 Extra Large footprints. */
(function(root){'use strict';
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function cells(anchor,size='medium'){if(!anchor||!Number.isInteger(anchor.x)||!Number.isInteger(anchor.y))throw Error('Invalid anchor');return size==='extra-large'?[{x:anchor.x,y:anchor.y},{x:anchor.x+1,y:anchor.y},{x:anchor.x,y:anchor.y+1},{x:anchor.x+1,y:anchor.y+1}]:[{x:anchor.x,y:anchor.y}]}
function overlap(a,as,b,bs){return cells(a,as).some(p=>cells(b,bs).some(q=>p.x===q.x&&p.y===q.y))}
function adjacent(a,as,b,bs){return cells(a,as).some(p=>cells(b,bs).some(q=>Math.max(Math.abs(p.x-q.x),Math.abs(p.y-q.y))===1))}
function chooseMove({enemy,hero,steps,walkable,occupants=[],canStep,allowDisplace=false}){
 if(!enemy||!hero||!Number.isInteger(steps)||steps<0||typeof walkable!=='function')throw Error('Invalid move');
 const size=enemy.size||'medium',start={x:enemy.x,y:enemy.y},target={x:hero.x,y:hero.y};
 const initial=occupants.filter(o=>o.id!==enemy.id).map(o=>({...o,size:o.size||'medium'}));
 const keyOf=(p,others)=>p.x+','+p.y+'|'+others.map(o=>o.id+':'+o.x+','+o.y).join('|');
 const visited=new Set([keyOf(start,initial)]),queue=[{p:start,route:[],others:initial}],original=new Map(initial.map(o=>[o.id,o]));let best=null;
 const valid=(a,b)=>{if(typeof canStep==='function'&&!canStep(a,b))return false;return cells(b,size).every(p=>walkable(p.x,p.y))};
 while(queue.length){const state=queue.shift(),pos=state.p;
  const near=adjacent(pos,size,target,'medium');
  const dist=Math.min(...cells(pos,size).map(p=>Math.max(Math.abs(p.x-target.x),Math.abs(p.y-target.y))));
  const score=(near?100000:0)-dist*100+state.route.length;
  if(!best||score>best.score)best={...state,score,near};
  if(state.route.length===steps)continue;
  for(const [dx,dy] of DIRS){
   const next={x:pos.x+dx,y:pos.y+dy};
   if(!valid(pos,next)||overlap(next,size,target,'medium'))continue;
   if(dx&&dy&&(!valid(pos,{x:pos.x+dx,y:pos.y})||!valid(pos,{x:pos.x,y:pos.y+dy})))continue;
   const conflicts=state.others.filter(o=>overlap(next,size,o,o.size));
   if(conflicts.length&&(!allowDisplace||size==='medium'||size==='small'||conflicts.some(o=>o.size!=='medium'&&o.size!=='small')))continue;
   const moved=state.others.map(o=>({...o}));let legal=true;
   for(const conflict of conflicts){
    const o=moved.find(o=>o.id===conflict.id),shift=size==='extra-large'?2:1;
    const dest={x:o.x-dx*shift,y:o.y-dy*shift};
    if(!cells(pos,size).some(c=>c.x===dest.x&&c.y===dest.y)||!walkable(dest.x,dest.y)||overlap(next,size,dest,'medium')||overlap(dest,'medium',target,'medium')||moved.some(other=>other.id!==o.id&&overlap(dest,'medium',other,other.size))){legal=false;break}
    o.x=dest.x;o.y=dest.y;
   }
   if(!legal||moved.some((o,i)=>moved.slice(i+1).some(other=>overlap(o,o.size,other,other.size))))continue;
   const key=keyOf(next,moved);if(visited.has(key))continue;visited.add(key);
   queue.push({p:next,route:state.route.concat([next]),others:moved});
  }
 }
 if(!best)return null;
 const displaced=best.others.filter(o=>{const orig=original.get(o.id);return orig&&(orig.x!==o.x||orig.y!==o.y)}).map(o=>({id:o.id,x:o.x,y:o.y}));
 return {destination:best.p,route:best.route,displaced,adjacent:best.near};
}
const api=Object.freeze({cells,overlap,adjacent,chooseMove});root.DarkstoneEnemyTactics=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
