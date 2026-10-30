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
 // Traverse the actual path in order. An occupied square or the Hero is
 // a barrier, not a square the enemy can walk through to a later destination.
 let destination=null;
 for(let i=0;i<Math.min(steps,route.length);i++){
  const p=route[i];
  if(!p||!Number.isInteger(p.x)||!Number.isInteger(p.y))throw Error('Invalid path coordinate');
  if((p.x===hero.x&&p.y===hero.y)||occupied(p))break;
  destination={x:p.x,y:p.y};
 }
 return destination;
}
const api=Object.freeze({chooseDestination});
root.DarkstoneEnemyMovement=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
