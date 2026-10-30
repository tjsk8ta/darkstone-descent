'use strict';
const {test,expect}=require('@playwright/test');
const KEY='darkstone_descent_tiles_v3',BACKUP=KEY+'__previous_valid_v1';
test('corrupted current save recovers last valid checkpoint and warns player',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.locator('#startGame').click();
 const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(first.turn).toBe(1);
 await page.locator('#endBtn').click();
 await expect(page.locator('#turnCount')).toHaveText('2');
 const prior=await page.evaluate(()=>{
  const saved=JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3'));
  const backup=JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3__previous_valid_v1'));
  localStorage.setItem('darkstone_descent_tiles_v3','{corrupted');
  return {savedTurn:saved.turn,backupTurn:backup.turn};
 });
 expect(prior).toEqual({savedTurn:2,backupTurn:1});
 await page.reload();
 await expect(page.locator('#turnCount')).toHaveText('1');
 await expect(page.locator('#startupRecovery')).toContainText('recovered the previous valid checkpoint');
 await expect(page.locator('#overlay')).toHaveClass(/hidden/);
 expect(errors).toEqual([]);
});
test('an unresolved combat roll survives reload without rerolling or resetting the spent action',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const state=JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3'));
  state.enemies=[{id:88,type:'Tentacle',x:state.x+1,y:state.y,hp:4,maxHp:4,home:'4,5',spawnTurn:0}];
  state.nextEnemy=89;localStorage.setItem('darkstone_descent_tiles_v3',JSON.stringify(state));
 });
 await page.reload();
 await expect(page.locator('#attackBtn')).toBeEnabled();
 await page.locator('#attackBtn').click();
 await expect(page.locator('[data-toggle-grit]')).toHaveCount(2);
 const pending=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')).savedPendingAttack);
 expect(pending.phase).toBe('toHit');
 await page.reload();
 await expect(page.locator('[data-toggle-grit]')).toHaveCount(2);
 const resumed=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(resumed.savedPendingAttack.rolls).toEqual(pending.rolls);
 expect(resumed.actionUsed).toBe(true);
 expect(errors).toEqual([]);
});
