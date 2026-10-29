const {test,expect}=require('@playwright/test');
test('original Brutal Void Spider selection survives reload and remains source verified',async({page})=>{
 await page.goto('/');
 await page.locator('#coreEdition').selectOption('original');
 await page.locator('#coreSet').selectOption('city');
 await page.locator('#brutalVoidSpiders').check();
 await page.locator('#startGame').click();
 const first=await page.evaluate(()=>({
  edition:window.DarkstoneRuleAudit.getEdition(),
  spider:window.DarkstoneRuleAudit.getEnemyType('Void Spider')
 }));
 expect(first.edition).toBe('original');
 expect(first.spider.recordFace).toBe('brutal');
 expect(first.spider.recordComplete).toBe(true);
 expect(first.spider.hp).toBe(5);
 expect(first.spider.eliteChart).toHaveLength(6);
 await page.reload();
 const resumed=await page.evaluate(()=>window.DarkstoneRuleAudit.getEnemyType('Void Spider'));
 expect(resumed.recordFace).toBe('brutal');
 expect(resumed.hp).toBe(5);
});
test('revised edition never inherits the original Brutal Void Spider sheet',async({page})=>{
 await page.goto('/');
 await page.locator('#coreEdition').selectOption('revised');
 await page.locator('#brutalVoidSpiders').check();
 await page.locator('#startGame').click();
 const spider=await page.evaluate(()=>window.DarkstoneRuleAudit.getEnemyType('Void Spider'));
 expect(spider.recordFace).not.toBe('brutal');
 expect(spider.recordComplete).not.toBe(true);
});
