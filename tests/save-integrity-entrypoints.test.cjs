'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
// Guard game mutations at their entrypoint, even when triggered from keyboard
// handlers or programmatic calls rather than disabled buttons.
for(const signature of ['function moveStep(dx,dy){','function endTurn(){','function attack(){']){
 test(signature+' fails closed under save integrity lock',()=>{
  assert.ok(html.includes(signature+'if(saveFailure)return;'),
   'A game mutation can proceed while its last save is unverified: '+signature);
 });
}
