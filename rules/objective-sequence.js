/* Publisher Revised City Adventure Book p.12: Growing Dread before Epic Threat.
 * Actual Growing Dread card effects are not available and are never invented. */
(function(root){'use strict';
function begin(roomId,count){if(!Number.isInteger(count)||count<0)throw Error('Invalid Dread count');return {roomId,stack:Array.from({length:count},(_,i)=>({order:i+1})),remaining:count,drawn:null,resolved:0,started:false,epicDrawn:false,manualResolutions:[]}}
function normalize(f){if(!Array.isArray(f.stack))f.stack=Array.from({length:f.remaining||0},(_,i)=>({order:i+1}));f.remaining=f.stack.length;if(!Array.isArray(f.manualResolutions))f.manualResolutions=[];return f}
function add(f,source){normalize(f);f.stack.push({order:f.stack.length+1,source});f.remaining=f.stack.length;return f.remaining}
function reveal(f,name){normalize(f);if(!f.remaining||f.drawn!==null)throw Error('No hidden Dread card');if(typeof name!=='string'||!name.trim())throw Error('Card name required');f.drawn={name:name.trim(),order:f.stack.at(-1).order};return f.drawn}
function cancel(f){normalize(f);if(!f.remaining)throw Error('No Dread to cancel');const card=f.stack.pop();f.manualResolutions.push({order:card.order,name:f.drawn?.name||null,method:'cancel-1-grit'});f.drawn=null;f.remaining=f.stack.length;f.resolved++;return f.remaining}
function resolve(f,description){normalize(f);if(!f.drawn)throw Error('Reveal card first');if(typeof description!=='string'||!description.trim())throw Error('Describe physical card effect');const card=f.stack.pop();f.manualResolutions.push({order:card.order,name:f.drawn.name,description:description.trim(),method:'physical-card-manual',automated:false});f.drawn=null;f.remaining=f.stack.length;f.resolved++;return f.remaining}
function ready(f){normalize(f);return f.remaining===0&&f.drawn===null}
const api=Object.freeze({begin,normalize,add,reveal,cancel,resolve,ready});root.DarkstoneObjectiveSequence=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
