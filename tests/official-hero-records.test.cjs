'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const q=require('../rules/hero-records.js'),html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('two complete publisher sample sheets are faithfully transcribed',()=>{
 const l=q.get('lawman'),u=q.get('usMarshal');assert.deepEqual([l.hp,l.sanity,l.defense,l.willpower,l.initiative,l.combat],[12,12,4,4,4,2]);assert.deepEqual([u.hp,u.sanity,u.defense,u.willpower,u.initiative,u.combat],[10,10,3,4,4,2]);assert.deepEqual(l.skills,{agility:2,cunning:4,spirit:1,strength:3,lore:2,luck:3});assert.deepEqual(u.skills,{agility:3,cunning:4,spirit:2,strength:2,lore:1,luck:3});
});
test('Lawman fires three D6; U.S. Marshal shotgun one D8 To Hit and Damage',()=>{
 assert.deepEqual([q.apply('lawman',{}).dice,q.apply('lawman',{}).attackDieSides],[3,6]);assert.deepEqual([q.apply('usMarshal',{}).dice,q.apply('usMarshal',{}).attackDieSides,q.apply('usMarshal',{}).damageDieSides],[1,8,8]);assert.match(html,/function heroToHitDie\(\)/);assert.match(html,/function heroDamageDie\(\)/);assert.match(html,/S\.profile\.hero!=='lawman'\|\|pendingAttack\.lawmanUsed/);
});
