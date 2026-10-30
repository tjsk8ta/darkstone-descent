/* Verified general rules: Revised City of the Ancients rulebook, Gear and Artifacts, Item Upgrades. Card faces are not supplied here. */
(function(root){'use strict';
function createItem({id,name,hands=0,weight=0,slots=0,starting=false,keywords=[]}){if(typeof id!=='string'||!id||typeof name!=='string'||!name||![0,1,2].includes(hands)||!Number.isInteger(weight)||weight<0||!Number.isInteger(slots)||slots<0||slots>3||!Array.isArray(keywords))throw Error('Invalid item metadata');return {id,name,hands,weight,slots,starting,keywords:[...keywords],upgrades:[]}}
function occupied(item){if(!item||!Array.isArray(item.upgrades))throw Error('Invalid item');return item.upgrades.reduce((n,u)=>n+u.requirement,0)}
function attach(item,upgrade){if(!upgrade||!Number.isInteger(upgrade.requirement)||upgrade.requirement<1||upgrade.requirement>3||typeof upgrade.id!=='string'||!upgrade.id)throw Error('Invalid upgrade');if(item.upgrades.some(u=>u.id===upgrade.id)||occupied(item)+upgrade.requirement>item.slots)return false;item.upgrades.push({...upgrade});return true}
function detach(item,id){const ix=item.upgrades.findIndex(u=>u.id===id);if(ix<0||item.upgrades[ix].forged===true)return false;item.upgrades.splice(ix,1);return true}
function canEquip(items,item){if(!Array.isArray(items))throw Error('Invalid equipped items');return items.reduce((n,i)=>n+i.hands,0)+item.hands<=2}
const api=Object.freeze({createItem,occupied,attach,detach,canEquip});root.DarkstoneHeroEquipment=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
