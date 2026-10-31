'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const q=require('../rules/objective-sequence.js');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('Dread resolves LIFO, supports cancellation and records physical card',()=>{
 const f=q.begin('0,0',2);q.add(f,'track');q.reveal(f,'Last drawn');q.resolve(f,'Effect resolved');assert.equal(f.manualResolutions[0].order,3);assert.equal(f.manualResolutions[0].automated,false);q.cancel(f);assert.equal(f.manualResolutions[1].order,2);q.reveal(f,'First');q.resolve(f,'Effect applied');assert.equal(q.ready(f),true);
});
test('Dread cannot silently skip card effects',()=>{
 const f=q.begin('0,0',1);assert.equal(q.ready(f),false);assert.throws(()=>q.reveal(f,''));q.reveal(f,'Physical card');assert.throws(()=>q.resolve(f,''));q.cancel(f);assert.equal(q.ready(f),true);
});
test('objective draws official Epic Threat, not a fabricated fixed boss',()=>{
 assert.match(html,/const placed=drawThreat\(r,'epic'\)/);assert.match(html,/EPIC THREAT UNRESOLVED/);assert.doesNotMatch(html,/DREAD_EFFECTS/);assert.doesNotMatch(html,/r\.finalEnemies=S\.coreThreatSet/);
});
