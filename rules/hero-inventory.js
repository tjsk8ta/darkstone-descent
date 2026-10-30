/* Revised City rulebook p.7: Side Bag holds up to five tokens; choose one free token. */
(function(root){'use strict';
const TOKENS=Object.freeze(['bandages','whiskey','dynamite','tonic']);
function create(freeToken){if(!TOKENS.includes(freeToken))throw Error('Unknown starting Side Bag token');return {capacity:5,tokens:{[freeToken]:1},startingToken:freeToken,startingGear:[],personalItem:null,startingUpgrade:null,verifiedStartingGear:false}}
function count(inventory){if(!inventory||!inventory.tokens||typeof inventory.tokens!=='object')throw Error('Invalid Side Bag');let n=0;for(const [key,value] of Object.entries(inventory.tokens)){if(!TOKENS.includes(key)||!Number.isInteger(value)||value<0)throw Error('Invalid Side Bag token');n+=value}return n}
function add(inventory,token,amount=1){if(!TOKENS.includes(token)||!Number.isInteger(amount)||amount<1||!inventory||!Number.isInteger(inventory.capacity)||inventory.capacity!==5)throw Error('Invalid Side Bag operation');if(count(inventory)+amount>inventory.capacity)return false;inventory.tokens[token]=(inventory.tokens[token]||0)+amount;return true}
function remove(inventory,token,amount=1){if(!TOKENS.includes(token)||!Number.isInteger(amount)||amount<1||count(inventory)<amount||(inventory.tokens[token]||0)<amount)return false;inventory.tokens[token]-=amount;return true}
function migrate(existing,legacy,startingToken='bandages'){
 if(existing&&existing.initialised===true){count(existing);return {inventory:existing,overflow:[]}}
 if(!legacy||typeof legacy!=='object')throw Error('Missing legacy counters');
 const inventory=create(startingToken),overflow=[];inventory.tokens={};
 for(const token of TOKENS){const raw=legacy[token];const n=raw===undefined?0:raw;if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid legacy Side Bag quantity');for(let i=0;i<n;i++){if(!add(inventory,token))overflow.push(token)}}
 inventory.initialised=true;inventory.migrationOverflow=overflow.slice();return {inventory,overflow};
}
const api=Object.freeze({TOKENS,create,count,add,remove,migrate});root.DarkstoneHeroInventory=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
