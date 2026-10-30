'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),guard=require('../rules/save-guard.js');
const KEY='darkstone_descent_tiles_v3';
const state=(turn=1)=>({profile:{hero:'marshal'},rooms:{'4,5':{x:4,y:5}},x:40,y:40,turn,enemies:[],savedPendingAttack:null});
function storage(){
 const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),raw:m};
}
test('legacy primary saves load unchanged and preserve pending attack',()=>{
 const s=storage(),a=state();a.savedPendingAttack={phase:'assign',rolls:[6,4],resolved:[0]};
 s.setItem(KEY,JSON.stringify(a));
 assert.deepEqual(guard.read(s,KEY),{state:a,source:'primary',problem:null});
});
test('previous valid checkpoint survives corrupted primary',()=>{
 const s=storage(),first=state(1),second=state(2);
 guard.write(s,KEY,first);guard.write(s,KEY,second);
 s.setItem(KEY,'{damaged');
 const recovered=guard.read(s,KEY);
 assert.equal(recovered.source,'backup');assert.equal(recovered.state.turn,1);
 assert.match(recovered.problem,/recovered/);
});
test('invalid snapshots never overwrite valid checkpoint',()=>{
 const s=storage();guard.write(s,KEY,state());
 assert.throws(()=>guard.write(s,KEY,{profile:{hero:'marshal'}}),/Invalid expedition/);
 assert.equal(guard.read(s,KEY).state.turn,1);
});
test('failed primary write leaves recoverable prior checkpoint',()=>{
 const s=storage(),original=state(1);
 guard.write(s,KEY,original);
 const failing={getItem:s.getItem,setItem:(k,v)=>{if(k===KEY)throw Error('storage full');s.setItem(k,v)}};
 assert.throws(()=>guard.write(failing,KEY,state(2)),/storage full/);
 assert.equal(guard.read(s,KEY).state.turn,1);
});
test('silent partial write is rejected by readback validation',()=>{
 const s=storage(),old=state(1);guard.write(s,KEY,old);
 const corrupt={getItem:s.getItem,setItem:(k,v)=>s.setItem(k,k===KEY?'partial':v)};
 assert.throws(()=>guard.write(corrupt,KEY,state(2)),/readback mismatch/);
 assert.equal(guard.read(s,KEY).source,'backup');
});
test('corruption of all copies cannot be misrepresented as a resumed run',()=>{
 const s=storage();s.setItem(KEY,'not json');s.setItem(KEY+guard.SUFFIX,'[]');
 const recovered=guard.read(s,KEY);assert.equal(recovered.state,null);assert.match(recovered.problem,/No valid/);
});
