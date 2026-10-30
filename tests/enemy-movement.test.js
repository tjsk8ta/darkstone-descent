'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {chooseDestination}=require('../rules/enemy-movement.js');
const route=[{x:1,y:0},{x:2,y:0},{x:3,y:0}];
const hero={x:3,y:0};
test('Enemy movement never enters the Hero space',()=>{
 assert.deepEqual(chooseDestination(route,3,hero,()=>false),{x:2,y:0});
});
test('Enemy respects movement allowance',()=>{
 assert.deepEqual(chooseDestination(route,1,hero,()=>false),{x:1,y:0});
 assert.equal(chooseDestination(route,0,hero,()=>false),null);
});
test('Enemy does not overlap an occupied space',()=>{
 assert.deepEqual(chooseDestination(route,3,hero,p=>p.x===2),{x:1,y:0});
 assert.equal(chooseDestination(route,3,hero,p=>p.x<=2),null);
});
test('Invalid enemy path inputs fail closed',()=>{
 assert.throws(()=>chooseDestination(null,1,hero,()=>false),/Invalid/);
 assert.throws(()=>chooseDestination(route,-1,hero,()=>false),/Invalid/);
});

test('Enemy cannot pass through an occupied intermediate square to reach a free destination',()=>{
 assert.equal(chooseDestination(route,3,{x:9,y:9},p=>p.x===1),null);
 assert.deepEqual(chooseDestination(route,3,{x:9,y:9},p=>p.x===2),{x:1,y:0});
});
test('Enemy stops before Hero rather than passing through to a later square',()=>{
 assert.deepEqual(chooseDestination(route,3,{x:2,y:0},()=>false),{x:1,y:0});
});
test('Malformed traversed coordinates fail closed even when later points are valid',()=>{
 assert.throws(()=>chooseDestination([{x:NaN,y:0},...route],4,{x:9,y:9},()=>false),/Invalid path coordinate/);
});
