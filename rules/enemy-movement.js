/* Enemy movement destination selector. Prevents a monster occupying the Hero's
 * square while preserving the ordered route and its movement allowance.
 * The official revised core rulebook, Enemy Movement pp. 29-30, requires
 * enemies to move adjacent to their target rather than onto the target. */
(function(root){
'use strict';
function chooseDestination(route,steps,hero,occupied){
 if(!Array.isArray(route)||!Number.isInteger(steps)||steps<0||
    !hero||!Number.isInteger(hero.x)||!Number.isInteger(hero.y)||
    typeof occupied!=='function')throw Error('Invalid enemy movement arguments');
 for(let i=Math.min(steps,route.length)-1;i>=0;i--){
  const p=route[i];
  if(!p||!Number.isInteger(p.x)||!Number.isInteger(p.y))throw Error('Invalid path coordinate');
  if(p.x===hero.x&&p.y===hero.y)continue;
  if(occupied(p))continue;
  return {x:p.x,y:p.y};
 }
 return null;
}
const api=Object.freeze({chooseDestination});
root.DarkstoneEnemyMovement=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
