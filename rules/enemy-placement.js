/* Revised City rulebook pp.23-24: reverse initiative placement; Ambush adjacent. */
(function(root){'use strict';
function orderGroups(groups,types,shuffle){if(!Array.isArray(groups)||typeof shuffle!=='function')throw Error('Invalid enemy groups');for(const g of groups)if(!g||!types[g.type]||!Number.isInteger(types[g.type].initiative))throw Error('Unknown enemy initiative');return shuffle([...groups]).sort((a,b)=>types[a.type].initiative-types[b.type].initiative)}
function orderTypes(names,types,shuffle){return orderGroups(names.map(type=>({type})),types,shuffle).map(g=>g.type)}
function ambushSpaces(state,cellAt,roomAt,room){if(!state||!Number.isInteger(state.x)||!Number.isInteger(state.y)||!Array.isArray(state.enemies))throw Error('Invalid ambush state');const result=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const x=state.x+dx,y=state.y+dy;if(!cellAt(x,y)||!roomAt(x,y)?.seen||state.enemies.some(e=>e.x===x&&e.y===y))continue;result.push({x,y})}return result}
const api=Object.freeze({orderGroups,orderTypes,ambushSpaces});root.DarkstoneEnemyPlacement=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
