(function(root){
'use strict';
function canVisit(town){return !!town&&Number.isInteger(town.day)&&town.day>=1&&town.travelDone===true&&town.lodging!==null&&town.lodging!==undefined&&town.visited!==true}
function canAdvance(town){return !!town&&Number.isInteger(town.day)&&town.day>=1&&town.travelDone===true&&(town.lodging==='hotel'||town.lodging==='camp')}
function canSpend(coins,cost){return Number.isSafeInteger(coins)&&Number.isSafeInteger(cost)&&cost>=0&&coins>=cost}
const api=Object.freeze({canVisit,canAdvance,canSpend});root.DarkstoneTownPhase=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
