/* Revised City of the Ancients: Enemy Movement, Targeting Heroes, and Staying on Target.
 * https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf
 * Pure target arbitration; no Enemy Record Sheet values are assumed. */
(function(root){'use strict';
const dist=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
function activationOrder(enemies,heroes){
 if(!Array.isArray(enemies)||!Array.isArray(heroes)||!heroes.length)throw Error('Invalid activation roster');
 return [...enemies].sort((a,b)=>Math.min(...heroes.map(h=>dist(a,h)))-Math.min(...heroes.map(h=>dist(b,h)))||String(a.id).localeCompare(String(b.id)));
}
function chooseTarget(enemy,heroes,{reach,existing=[],ranged=false,random=Math.random}={}){
 if(!enemy||!Array.isArray(heroes)||!heroes.length||typeof reach!=='function')throw Error('Invalid target selection');
 const adjacent=heroes.filter(h=>dist(enemy,h)<=1);
 if(!ranged&&enemy.targetId!==undefined){const held=adjacent.find(h=>h.id===enemy.targetId&&!h.ko);if(held)return held}
 const candidates=heroes.filter(h=>!h.ko&&reach(enemy,h));
 if(!candidates.length)return null;
 const pool=ranged&&adjacent.some(h=>candidates.includes(h))?candidates.filter(h=>adjacent.includes(h)):candidates;
 const count=h=>existing.filter(e=>e.type===enemy.type&&e.targetId===h.id&&e.id!==enemy.id).length;
 const least=Math.min(...pool.map(count));const tied=pool.filter(h=>count(h)===least);
 const r=random();if(typeof r!=='number'||r<0||r>=1)throw Error('Invalid random selection');
 return tied[Math.floor(r*tied.length)];
}
const api=Object.freeze({activationOrder,chooseTarget,dist});root.DarkstoneEnemyTargeting=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
