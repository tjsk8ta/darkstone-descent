'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const records=require('../rules/enemy-records.js');
function extract(first,last){
 const a=html.indexOf('function '+first+'('),b=html.indexOf('function '+last+'(',a);
 assert.ok(a>=0&&b>a,first+' missing');
 return html.slice(a,b);
}
test('Brutal Void Spider selection is restricted to original edition and saved',()=>{
 assert.match(html,/brutalVoidSpiders:selectedEdition==='original'&&selectedBrutalVoidSpiders/);
 assert.match(html,/enemyRecords\.applyFace\('original',name,base,set,'brutal'\)/);
 assert.match(html,/applyEnemyEdition\(S\.coreEdition\|\|'revised',S\.coreThreatSet\|\|'combined'\)/);
});
test('verified Brutal Void Spider face is applied with all six Elite abilities',()=>{
 const base={hp:99,modelCap:12,name:'Void Spiders'};
 const t=records.applyFace('original','Void Spider',base,'city','brutal');
 assert.equal(t.hp,5);
 assert.equal(t.damage,4);
 assert.equal(t.combat,2);
 assert.equal(t.def,0);
 assert.equal(t.recordComplete,true);
 assert.equal(t.recordFace,'brutal');
 assert.equal(t.eliteChart.length,6);
});
test('Brutal Hardened Shells adds two Defense only while its Elite is active',()=>{
 const ctx={TYPES:{'Void Spider':{def:0}},eliteHas:(type,id)=>id==='hardened-shells',S:{}};
 vm.runInNewContext(extract('effectiveEnemyDefense','enemyCritIgnoresDefense'),ctx);
 assert.equal(ctx.effectiveEnemyDefense({type:'Void Spider'}),2);
});
test('Void Venom changes hit target on the next Hero Activation and then expires',()=>{
 const ctx={CLASSES:{marshal:{hit:4}},S:{turn:3,voidVenomUntilTurn:3,profile:{hero:'marshal'}}};
 vm.runInNewContext(extract('heroHitTarget','remainingHitIndices'),ctx);
 assert.equal(ctx.heroHitTarget(),5);
 ctx.S.turn=4;
 assert.equal(ctx.heroHitTarget(),4);
});
test('Brutal Elite attack mechanics and Acidic Ichor are wired into live combat',()=>{
 assert.match(html,/eliteHas\(e\.type,'rapid-climbing'\)\?2:0/);
 assert.match(html,/eliteHas\(e\.type,'vicious-bite'\)\?3:t\.hit/);
 assert.match(html,/t\.smash\|\|eliteHas\(e\.type,'severing-bite'\)/);
 assert.match(html,/if\(physical>0&&t\.voidVenom\)/);
 assert.match(html,/if\(eliteHas\(e\.type,'acidic-ichor'\)&&man\(S,e\)<=1\)/);
 assert.match(html,/eliteHas\(e\.type,'drop-from-above'\)/);
 assert.match(html,/enemyPhase\('ambush'\)/);
});
test('venom penalty is reflected in all To Hit surfaces including dynamite',()=>{
 assert.match(html,/threshold=heroHitTarget\(\)/);
 assert.match(html,/hit=v>=heroHitTarget\(\)/);
 assert.match(html,/pa\.rolls\.filter\(v=>v>=heroHitTarget\(\)\)/);
});
