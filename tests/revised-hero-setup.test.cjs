'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const starting=require('../rules/hero-starting.js'),eq=require('../rules/equipment-ui.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('eight revised classes have named Gear and three Starting Upgrades',()=>{
 assert.equal(Object.keys(starting.CLASSES).length,8);
 for(const [key,cl] of Object.entries(starting.CLASSES)){
  assert.equal(cl.upgrades.length,3,key);assert.ok(cl.gear.length,key);
  const r=starting.create(key,cl.upgrades[0],0);
  assert.equal(r.gear.length,cl.gear.length+1);assert.equal(r.gear.at(-1).name,'Old Lantern');assert.equal(r.startingUpgradeEffectVerified,false);
 }
});
test('Personal Items are selected from their core set; invalid upgrades rejected',()=>{
 for(const key of Object.keys(starting.CLASSES)){
  const pool=starting.personalPool(key);
  assert.equal(pool.length,10);
  assert.equal(starting.create(key,starting.get(key).upgrades[1],9).personalItem.name,pool[9]);
  assert.throws(()=>starting.create(key,'Invented Upgrade',0));
  assert.throws(()=>starting.create(key,starting.get(key).upgrades[0],10));
 }
});
test('equipment enforces two hands and upgrade capacity',()=>{
 const items=[eq.make({id:'a',name:'A',hands:2,slots:2}),eq.make({id:'b',name:'B',hands:1})];
 assert.equal(eq.toggle(items,'a'),true);assert.equal(eq.toggle(items,'b'),false);
 assert.equal(eq.toggle(items,'a'),true);assert.equal(eq.toggle(items,'b'),true);
 assert.equal(eq.attach(items[0],{id:'up',requirement:2}),true);
 assert.equal(eq.attach(items[0],{id:'up2',requirement:1}),false);
 assert.throws(()=>eq.make({id:'c',name:'C',hands:3}));
});
test('browser connects Hero setup and saved equipment interface',()=>{
 for(const q of ['id="startingUpgrade"','updateUpgradeChoices()','DarkstoneHeroStarting.create(hero,upgrade','function equipmentModal()','DarkstoneEquipmentUI.toggle','id="equipmentBtn"'])assert.ok(html.includes(q),q);
});
test('new Heroes receive one free token and Bandido recovers Grit on move 1 or 2',()=>{
 assert.match(html,/if\(!profile\.inventory\.initialised\)\{\/\* The revised rule grants ONE free token/);
 assert.match(html,/v===1\|\|\(S\.profile\.hero==='bandido'&&v===2\)/);
});
