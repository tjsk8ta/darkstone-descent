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
