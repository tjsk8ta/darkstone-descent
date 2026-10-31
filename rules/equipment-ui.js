/* General equipment metadata and hand/upgrade limits; card effects must be verified separately. */
(function(root){'use strict';
function make({id,name,hands=0,slots=0,starting=false}){if(typeof id!=='string'||!id||typeof name!=='string'||!name||![0,1,2].includes(hands)||!Number.isInteger(slots)||slots<0||slots>3)throw Error('Invalid equipment');return {id,name,hands,slots,starting,upgrades:[],equipped:false,verifiedEffect:false}}
function occupied(item){return (item.upgrades||[]).reduce((n,x)=>n+x.requirement,0)}
function canEquip(items,item){return items.filter(x=>x.equipped&&x.id!==item.id).reduce((n,x)=>n+x.hands,0)+item.hands<=2}
function toggle(items,id){const item=items.find(x=>x.id===id);if(!item)return false;if(!item.equipped&&!canEquip(items,item))return false;item.equipped=!item.equipped;return true}
function add(items,item){if(items.some(x=>x.id===item.id))return false;items.push(item);return true}
function attach(item,upgrade){if(!upgrade||typeof upgrade.id!=='string'||!upgrade.id||!Number.isInteger(upgrade.requirement)||upgrade.requirement<1||upgrade.requirement>3||occupied(item)+upgrade.requirement>item.slots||(item.upgrades||[]).some(x=>x.id===upgrade.id))return false;item.upgrades.push({...upgrade});return true}
const api=Object.freeze({make,occupied,canEquip,toggle,add,attach});root.DarkstoneEquipmentUI=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
