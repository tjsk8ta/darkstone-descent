/* Revised Swamps of Death Harbinger: Bringer of Death end-of-turn table.
 * Physical green face photographed at https://www.ebay.com/itm/376978662614
 * Source image: https://i.ebayimg.com/images/g/qx4AAeSwwoppmIwY/s-l1600.webp
 * Only this three-branch table is represented. The rest of the sheet,
 * its Elite chart, and the red Brutal side are NOT certified complete. */
(function(root){
'use strict';
function rollBringerOfDeath(die){
 if(typeof die!=='function')throw Error('D6 roller required');
 const roll=die();
 if(!Number.isInteger(roll)||roll<1||roll>6)throw Error('Invalid Bringer of Death D6');
 const amount=die();
 if(!Number.isInteger(amount)||amount<1||amount>6)throw Error('Invalid Bringer of Death effect D6');
 if(roll<=2)return {roll,kind:'sweeping-strike',combatHits:amount};
 if(roll<=4)return {roll,kind:'summon-hellbats',models:amount,ambush:true};
 return {roll,kind:'regeneration',wounds:amount};
}
const api=Object.freeze({rollBringerOfDeath});
root.DarkstoneHarbinger=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
