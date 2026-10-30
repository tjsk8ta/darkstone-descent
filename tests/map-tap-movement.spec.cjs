'use strict';
const {test,expect}=require('@playwright/test');
test('tapping an unobstructed map floor actually moves the Hero and autosaves',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.locator('#startGame').click();
 const data=await page.evaluate(()=>{
  const v=DarkstoneRuleAudit.getMapView();
  const b=document.querySelector('#map').getBoundingClientRect();
  const s=JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3'));
  return {x:s.x,y:s.y,move:s.move,clickX:b.left+(v.cx+v.unit)/document.querySelector('#map').width*b.width,
   clickY:b.top+v.cy/document.querySelector('#map').height*b.height};
 });
 expect(data.move).toBeGreaterThan(0);
 await page.mouse.click(data.clickX,data.clickY);
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(after.x).toBe(data.x+1);
 expect(after.y).toBe(data.y);
 expect(after.move).toBe(data.move-1);
 expect(errors).toEqual([]);
});
test('touch-size viewport exposes one-click floor movement, no pre-roll target selection',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');await page.locator('#startGame').click();
 const data=await page.evaluate(()=>{
  const v=DarkstoneRuleAudit.getMapView(),c=document.querySelector('#map'),b=c.getBoundingClientRect();
  const s=JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3'));
  return {x:s.x,move:s.move,clickX:b.left+(v.cx+v.unit)/c.width*b.width,clickY:b.top+v.cy/c.height*b.height};
 });
 expect(data.move).toBeGreaterThan(0);
 await page.mouse.click(data.clickX,data.clickY);
 const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(s.x).toBe(data.x+1);
 await expect(page.locator('#attackBtn')).toHaveText('⚔ Attack · roll To Hit');
});
