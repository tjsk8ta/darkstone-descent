'use strict';const test=require('node:test'),assert=require('node:assert/strict');const o=require('../rules/objective-threat.js');
test('official 1–2 Hero substitution draws High instead of Epic',()=>{assert.equal(o.tier(1),'high');assert.equal(o.tier(2),'high');assert.equal(o.tier(3),'epic')});
test('voluntary Epic challenge is explicit and persists in selection',()=>{assert.equal(o.tier(1,true),'epic');assert.equal(o.status(1,true).epicOptIn,true);assert.equal(o.status(1).soloSubstitution,true)});
test('invalid Hero count fails closed',()=>{for(const n of [0,-1,1.5,null])assert.throws(()=>o.tier(n))});
