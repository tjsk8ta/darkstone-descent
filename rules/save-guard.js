/* Durable, browser-local expedition saves with one previous valid checkpoint.
 * Preserve the legacy primary key for existing players; never advance after
 * a failed write or readback. No network or account is involved. */
(function(root){
'use strict';
const SUFFIX='__previous_valid_v1';
function valid(state){
 return !!(state&&typeof state==='object'&&!Array.isArray(state)&&
  state.profile&&typeof state.profile.hero==='string'&&state.profile.hero.length>0&&
  state.rooms&&typeof state.rooms==='object'&&!Array.isArray(state.rooms)&&
  Object.keys(state.rooms).length>0&&Array.isArray(state.enemies)&&
  Number.isInteger(state.turn)&&state.turn>=0&&
  Number.isFinite(state.x)&&Number.isFinite(state.y));
}
function parse(raw){
 if(typeof raw!=='string'||!raw.length)return null;
 try{const state=JSON.parse(raw);return valid(state)?state:null}
 catch{return null}
}
function read(storage,key){
 const primary=storage.getItem(key),state=parse(primary);
 if(state)return {state,source:'primary',problem:null};
 const previous=storage.getItem(key+SUFFIX),backup=parse(previous);
 if(backup)return {state:backup,source:'backup',problem:primary?'Primary save is invalid; recovered the previous valid checkpoint.':null};
 return {state:null,source:null,problem:primary||previous?'No valid save checkpoint remains.':null};
}
function write(storage,key,state){
 if(!valid(state))throw Error('Invalid expedition snapshot; refusing to overwrite the save');
 // If the primary is damaged, preserve the last valid backup. Do not rotate
 // corrupt bytes into the recovery slot, or erase the only recoverable state.
 const encoded=JSON.stringify(state);
 const current=storage.getItem(key);
 // Require explicit checkpoint recovery before overwriting corrupted or missing primary.
 if(current!==null&&!parse(current))throw Error('Primary save is invalid; recover the verified checkpoint before saving');
 if(current===null&&storage.getItem(key+SUFFIX)!==null)throw Error('Primary save is missing; recover the verified checkpoint before saving');
 if(current&&current!==encoded&&parse(current)){
  storage.setItem(key+SUFFIX,current);
  if(storage.getItem(key+SUFFIX)!==current)throw Error('Save backup readback mismatch');
 }
 storage.setItem(key,encoded);
 if(storage.getItem(key)!==encoded)throw Error('Save readback mismatch');
 return true;
}

// Recovery is an explicit promotion, not a normal write. In particular, do not
// replace a valid backup with a corrupted primary during recovery.
function recover(storage,key){
 const result=read(storage,key);
 if(!result.state)throw Error('No valid expedition checkpoint available for recovery');
 if(result.source==='backup'){
  const encoded=JSON.stringify(result.state);
  storage.setItem(key,encoded);
  if(storage.getItem(key)!==encoded)throw Error('Recovered checkpoint readback mismatch');
 }
 return result.state;
}
const api=Object.freeze({SUFFIX,valid,parse,read,write,recover});
root.DarkstoneSaveGuard=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
