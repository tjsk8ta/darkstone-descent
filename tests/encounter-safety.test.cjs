'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const records=require('../rules/enemy-records.js');

test('Elite selection requires complete verified record sheet, not merely six names',()=>{
 assert.match(html,/!chart\|\|chart\.length!==6\|\|!TYPES\[g\.type\]\.recordComplete/);
 assert.match(html,/g\.elite&&\!\(TYPES\[g\.type\]\?\.recordComplete&&TYPES\[g\.type\]\?\.eliteChart\?\.length===6\)/);
 assert.equal(records.get('revised','Harbinger').complete,false);
 assert.equal(records.get('original','Night Terror').complete,true);
});
test('unresolved final encounter cannot award room completion before enemy placement',()=>{
 assert.match(html,/function checkCleared\(r\)\{if\(!r\?\.seen\|\|r\.pendingThreat\|\|r\.kind==='boss'&&S\.finalEncounter&&!S\.finalEncounter\.started\)return/);
});
test('movement cannot bypass encounter modal through directional keys or map clicks',()=>{
 assert.match(html,/function moveStep\(dx,dy\)[\s\S]*?S\.pendingEvent\|\|!\$\('overlay'\)\.classList\.contains\('hidden'\)/);
 assert.match(html,/function moveTowards\(x,y\)[\s\S]*?dynamiteAim\|\|pendingAttack\|\|S\.pendingEvent/);
});

test('room rewards and clues are withheld during any active Fight or unresolved Threat',()=>{
 assert.match(html,/function checkCleared\(r\)\{if\(!r\?\.seen\|\|r\.pendingThreat\|\|Object\.values\(S\.rooms\)\.some\(room=>room\.pendingThreat\)\|\|S\.enemies\.length/);
});
