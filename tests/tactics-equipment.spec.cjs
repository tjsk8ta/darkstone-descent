'use strict';
const {test,expect}=require('@playwright/test');
test('saved equipment records and attached upgrades survive reload',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?recovery');await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const gear=DarkstoneEquipmentUI.make({id:'e2e-rifle',name:'Test Rifle',hands:2,slots:2});
  if(!DarkstoneEquipmentUI.add(S.profile.gear,gear)||!DarkstoneEquipmentUI.toggle(S.profile.gear,'e2e-rifle'))throw Error('Cannot equip');
  if(!DarkstoneHeroEquipment.attach(gear,{id:'test-sight',requirement:2,forged:false}))throw Error('Cannot attach');
  if(!save())throw Error('Save failed');
 });
 await page.reload();await page.locator('#equipmentBtn').click();
 await expect(page.locator('#overlay')).not.toHaveClass(/hidden/);
 await expect(page.locator('#overlay')).toContainText('Test Rifle');
 await expect(page.locator('#overlay')).toContainText('test-sight');
 const state=await page.evaluate(()=>{const i=S.profile.gear.find(x=>x.id==='e2e-rifle');return {equipped:i.equipped,slots:i.upgrades[0].requirement}});
 expect(state).toEqual({equipped:true,slots:2});expect(errors).toEqual([]);
});
test('live tactical module prevents occupying Hero and represents Extra Large footprints',async({page})=>{
 await page.goto('/?recovery');await page.locator('#startGame').click();
 const result=await page.evaluate(()=>{
  const move=DarkstoneEnemyTactics.chooseMove({enemy:{id:7,x:0,y:0},hero:{x:3,y:0},steps:2,walkable:(x,y)=>x>=0&&y>=0&&x<8&&y<8});
  return {adjacent:move.adjacent,position:move.destination,large:DarkstoneEnemyTactics.cells({x:2,y:2},'extra-large').length};
 });
 expect(result).toEqual({adjacent:true,position:{x:2,y:0},large:4});
});
