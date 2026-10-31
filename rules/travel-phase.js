/* Revised City of the Ancients Adventure Book p.28: each Hero D6; 1-2 adds one hazard; 3D6 chart. No chart outcomes are fabricated. */
(function(root){'use strict';
function valid(d){return Number.isInteger(d)&&d>=1&&d<=6}
function roll(die){if(typeof die!=='function')throw Error('Dice generator required');const check=die();if(!valid(check))throw Error('Invalid travel die');if(check>2)return {travelDie:check,hazardDice:[],hazardTotal:null,pending:false};const dice=[die(),die(),die()];if(!dice.every(valid))throw Error('Invalid travel hazard dice');return {travelDie:check,hazardDice:dice,hazardTotal:dice.reduce((a,b)=>a+b,0),pending:true}}
function acknowledge(town){if(!town||!town.travelRoll||!town.travelRoll.pending||town.travelDone)throw Error('No pending hazard');town.travelRoll.pending=false;town.travelDone=true;town.travelRoll.manuallyResolved=true;return town}
const api=Object.freeze({roll,acknowledge});root.DarkstoneTravelPhase=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
