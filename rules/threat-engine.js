/* Core-set Threat-card resolver. Source: Flying Frog revised City of the Ancients
 * Rulebook pp. 23-25, https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf
 * Card inventories are separate data and must be checked for each edition.
 * This module intentionally does not invent Enemy Record Sheet or Elite Chart text. */
(function(root){
'use strict';
const PERIL_FACES=Object.freeze([3,3,4,4,5,6]);
const ENEMY_NAMES=Object.freeze(['Night Terror','Strangler','Void Spider','Tentacle','Hellbat','Hungry Dead','Corpse Pile','Slasher','Goliath','Harbinger','Ancient Spider','Snow Terror','Bogbat','Swamp Slasher','Targa Pylon']);
function assertRng(rng){if(typeof rng!=='function')throw Error('A random integer source is required');}
function peril(rng){assertRng(rng);const n=rng(6);if(!Number.isInteger(n)||n<0||n>=6)throw Error('Invalid Peril die random result');return PERIL_FACES[n]}
function d3(rng){assertRng(rng);const n=rng(3);if(!Number.isInteger(n)||n<0||n>=3)throw Error('Invalid D3 random result');return n+1}
function quantity(symbol,rng){if(symbol==='P')return peril(rng);if(symbol==='PP')return peril(rng)+peril(rng);if(symbol==='D3')return d3(rng);const n=Number(symbol);if(!Number.isInteger(n)||n<1)throw Error('Invalid threat quantity: '+symbol);return n}
function normalizeName(raw){const x=raw.trim().toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ');
 for(const name of ENEMY_NAMES){const y=name.toLowerCase();if(x===y||x===y+'s'||(y==='hellbat'&&x==='hellbats')||(y==='hungry dead'&&x==='hungry dead'))return name}
 throw Error('Unverified enemy identity: '+raw)}
function resolveCard(card,options={}){
 const {rng,draw,currentTier='low',depth=0,maxDepth=8}=options;
 assertRng(rng);if(typeof draw!=='function')throw Error('A deck draw callback is required');
 if(depth>maxDepth)throw Error('Nested Threat-card recursion limit');
 if(typeof card!=='string'||!card.trim())throw Error('Invalid Threat card');
 const chunks=card.replace(/\s+and\s+/gi,' & ').split(/\s*(?:&|,)\s*/).map(x=>x.trim()).filter(Boolean);
 const groups=[];
 for(const chunk of chunks){
  const m=/^(PP|P|D3|[0-9]+)\s+(.+)$/i.exec(chunk);
  if(!m)throw Error('Unverified Threat-card text: '+chunk);
  const token=m[1].toUpperCase(), target=m[2].trim();
  const nested=/^(?:(Low|Med(?:ium)?|High|Elite)\s+)?Threat\s+Cards?$/i.exec(target);
  if(nested){
   const n=quantity(token,rng),qual=nested[1]?.toLowerCase();
   const tier=qual==='low'?'low':qual?.startsWith('med')?'medium':qual==='high'?'high':currentTier;
   const elite=qual==='elite';
   for(let i=0;i<n;i++){
    const next=draw(tier);
    if(!next||typeof next.card!=='string')throw Error('Missing '+tier+' Threat card in nested draw');
    for(const group of resolveCard(next.card,{rng,draw,currentTier:tier,depth:depth+1,maxDepth})){
     groups.push({...group,elite:group.elite+(elite?1:0)});
    }
   }
  }else groups.push({type:normalizeName(target),n:quantity(token,rng),elite:0});
 }
 if(!groups.length)throw Error('Threat card resolved to no enemies');
 return groups;
}
const api=Object.freeze({PERIL_FACES,ENEMY_NAMES,peril,d3,quantity,normalizeName,resolveCard});
root.DarkstoneThreatEngine=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
