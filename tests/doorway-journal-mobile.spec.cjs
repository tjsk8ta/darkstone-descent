const {test,expect}=require('@playwright/test');
test('mobile T-junction blue doorway opens immediately and records the result in Field Journal',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/?recovery');
 await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const key='darkstone_descent_tiles_v3',s=JSON.parse(localStorage.getItem(key));
  s.rooms['4,4']={x:4,y:4,shape:'tee',name:'T-Junction',kind:'normal',
   doors:['S','E','W'],seen:true,explored:true,searched:false,firstJunction:true};
  s.x=4*9+7;s.y=4*7+2;s.actionUsed=false;s.enemies=[];s.move=5;s.moveMax=5;
  localStorage.setItem(key,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.locator('#exploreBtn')).toBeEnabled();
 await page.locator('#exploreBtn').click();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(state.rooms['5,4'].seen).toBe(true);
 expect(state.rooms['5,4'].explored).toBe(false);
 expect(state.log.some(x=>x.text.includes('Look Through Door:'))).toBe(true);
 await page.locator('#journalTab').click();
 await expect(page.locator('#journalDrawer')).toHaveClass(/open/);
 await expect(page.locator('#logList')).toContainText('Look Through Door:');
 expect(errors).toEqual([]);
});
test('mobile Field Journal persists encounter resolution details across reload',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/?recovery');
 await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const key='darkstone_descent_tiles_v3',s=JSON.parse(localStorage.getItem(key));
  s.log.unshift({turn:s.turn,kind:'hit',text:'ENCOUNTER RESULT · T-Junction · LOW Threat · 3 enemy models.'});
  s.log.unshift({turn:s.turn,kind:'info',text:'Threat card: 3 Hellbats. Resolved: 3 Hellbats.'});
  localStorage.setItem(key,JSON.stringify(s));
 });
 await page.reload();
 await page.locator('#journalTab').click();
 await expect(page.locator('#logList')).toContainText('ENCOUNTER RESULT');
 await expect(page.locator('#logList')).toContainText('Threat card: 3 Hellbats');
});
