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
test('standard mission reveals a random first tile without forced T-Junction',async({page})=>{
 await begin(page);
 await page.evaluate(()=>{
  const k='darkstone_descent_tiles_v3',s=JSON.parse(localStorage.getItem(k));
  s.x=4*9+4;s.y=5*7;s.move=5;s.actionUsed=false;s.mapDeck=[{name:'Mobile First Chamber',shape:'chamber'}];
  localStorage.setItem(k,JSON.stringify(s));
 });
 await page.reload();
 await expect(page.locator('#mapTitle')).toContainText('Mine Entrance');
 await expect(page.locator('#exploreBtn')).toBeEnabled();
 await page.locator('#exploreBtn').click();
 await expect(page.locator('#mapEyebrow')).toContainText('enemies active');
 await page.evaluate(()=>{
  const k='darkstone_descent_tiles_v3',s=JSON.parse(localStorage.getItem(k));
  if(s.ended)throw Error('Revealing the first random tile must not end the expedition');
  if(Object.keys(s.rooms).length!==2)throw Error('Expected entrance plus random first tile');if(!Object.values(s.rooms).some(r=>r.name==='Mobile First Chamber'&&!r.firstJunction))throw Error('Expected random chamber, not forced T-Junction');
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
