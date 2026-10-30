/* Revised City of the Ancients Adventure Book p.12, Basic Mission 1. */
(function(root){'use strict';
const LENGTHS=Object.freeze({small:Object.freeze({label:'Small Deposit',clues:2,xp:25,stoneBonus:0}),medium:Object.freeze({label:'Medium Deposit',clues:3,xp:50,stoneBonus:1}),large:Object.freeze({label:'Large Deposit',clues:4,xp:75,stoneBonus:2})});
function get(length){if(!Object.prototype.hasOwnProperty.call(LENGTHS,length))throw Error('Unknown official mission length');return LENGTHS[length]}
function reward(length,d3){const m=get(length);if(!Number.isInteger(d3)||d3<1||d3>3)throw Error('Invalid D3 roll');return {label:m.label,xp:m.xp,stone:d3+m.stoneBonus}}
const api=Object.freeze({LENGTHS,get,reward});root.DarkstoneMission=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
