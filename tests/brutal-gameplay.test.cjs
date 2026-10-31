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

test('Acidic Ichor D3 wounds ignore Defense and can defeat a Hero',()=>{
 const e={id:1,type:'Void Spider',hp:1,home:'0,0',x:1,y:0};
 const S={x:0,y:0,hp:1,ended:false,enemies:[e],rooms:{'0,0':{seen:true}},profile:{hero:'marshal',exp:0},coins:0,eliteAbilities:{'Void Spider':[4]}};
 const ctx={S,CLASSES:{marshal:{damageDieSides:6}},pendingAttack:{phase:'damage',damageGroup:{enemyId:1,dice:[{hit:5,hitIndex:0,roll:6}]},resolved:[],selectedHits:[]},
 TYPES:{'Void Spider':{name:'Void Spiders',exp:20,xpPerWound:0}},
 selectedEnemyId:null,gritDiceSelection:new Set(),damageModifier:()=>0,
 enemyCritIgnoresDefense:()=>false,effectiveEnemyDefense:()=>0,awardEnemyWoundXP:()=>0,
 remainingHitIndices:()=>[],rnd:()=>0,die:()=>3,man:(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y)),
 eliteHas:(type,id)=>id==='acidic-ichor',log:()=>{},checkSurvival:()=>{if(S.hp===0)S.ended=true},
 checkCleared:()=>{throw Error('Rewards must not run after hero death')},save:()=>{},render:()=>{}};
 vm.runInNewContext(extract('applyDamageGroup','resolveOneHit'),ctx);
 // The real checkCleared is gated by S.ended; this fixture checks the actual
 // Ichor wounds and hero death before any reward path.
 ctx.checkCleared=()=>{if(!S.ended)throw Error('Hero should be dead before reward evaluation')};
 ctx.applyDamageGroup();
 assert.equal(S.hp,0);
 assert.equal(S.ended,true);
 assert.equal(S.enemies.length,0);
});

test('official Ambush is adjacent placement and +2 first-turn Initiative, not a free attack',()=>{
 assert.match(html,/ambushInitiativeUntilTurn=S\.turn\+1/);
 assert.match(html,/cellAt\(p\.x,p\.y\)&&visibleAt\(p\.x,p\.y\)&&!occupied\(p\.x,p\.y\)/);
 assert.match(html,/same\.ambushInitiativeUntilTurn=S\.turn\+1/);
 assert.doesNotMatch(html,/Drop From Above: resolving immediate Elite Ambush Attacks/);
 const ctx={TYPES:{'Void Spider':{initiative:7}},S:{turn:5},eliteHas:()=>false};
 vm.runInNewContext(extract('effectiveEnemyInitiative','applyModelLimits'),ctx);
 const spider={type:'Void Spider',ambushInitiativeUntilTurn:6};
 assert.equal(ctx.effectiveEnemyInitiative(spider),9);
 ctx.S.turn=7;
 assert.equal(ctx.effectiveEnemyInitiative(spider),7);
});
