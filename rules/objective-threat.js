/* Flying Frog revised City of the Ancients Rulebook p.31, Epic Threats, 1 or 2 Heroes. */
(function(root){'use strict';
function tier(heroCount,epicOptIn=false){if(!Number.isInteger(heroCount)||heroCount<1)throw Error('Invalid Hero count');return heroCount<=2&&!epicOptIn?'high':'epic'}
function status(heroCount,epicOptIn=false){const selected=tier(heroCount,epicOptIn);return {tier:selected,heroCount,epicOptIn:!!epicOptIn,soloSubstitution:heroCount<=2&&!epicOptIn}}
const api=Object.freeze({tier,status});root.DarkstoneObjectiveThreat=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
