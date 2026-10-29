const {test,expect}=require('@playwright/test');
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
async function begin(page){
 await page.goto('/');
 await page.locator('#startGame').click();
 await expect(page.locator('#mapTitle')).toContainText('Mine Entrance');
}
test('mobile journal uses viewport width and full available height',async({page})=>{
 await begin(page);
 await page.locator('#journalTab').click();
 const rect=await page.locator('#journalDrawer').boundingBox();
 expect(rect).toBeTruthy();
 expect(rect.width).toBeGreaterThanOrEqual(385);
 expect(rect.height).toBeGreaterThanOrEqual(800);
 await expect(page.locator('#logList')).toBeVisible();
 await page.locator('#journalClose').click();
 await expect(page.locator('#journalDrawer')).toHaveAttribute('aria-hidden','true');
});
test('initial T-Junction remains active, safe and traversable rather than ending expedition',async({page})=>{
 await begin(page);
 await page.evaluate(()=>{
  const k='darkstone_descent_tiles_v3',s=JSON.parse(localStorage.getItem(k));
  s.x=4*9+4;s.y=5*7;s.move=5;s.actionUsed=false;
  localStorage.setItem(k,JSON.stringify(s));
 });
 await page.reload();
 await page.locator('#resumeGame').click();
 await expect(page.locator('#exploreBtn')).toBeEnabled();
 await page.locator('#exploreBtn').click();
 await expect(page.locator('#mapEyebrow')).toContainText('enemies active');
 await page.evaluate(()=>{
  const k='darkstone_descent_tiles_v3',s=JSON.parse(localStorage.getItem(k));
  if(s.ended)throw Error('Revealing the first junction must not end the expedition');
  if(Object.keys(s.rooms).length!==2)throw Error('Expected entrance plus junction');
  if(s.move!==0||!s.actionUsed)throw Error('Look through door must consume the Search');
 });
 await expect(page.locator('#searchBtn')).toBeDisabled();
 await expect(page.locator('#exploreBtn')).toBeDisabled();
});
test('scavenge spends action and prevents look-through-door in same activation',async({page})=>{
 await begin(page);
 await page.locator('#searchBtn').click();
 await expect(page.locator('#exploreBtn')).toBeDisabled();
 await expect(page.locator('#attackBtn')).toBeDisabled();
 await page.evaluate(()=>{
  const s=JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3'));
  if(!s.actionUsed||s.searchUsedTurn!==s.turn||s.move!==0)throw Error('Search action not recorded');
 });
});
