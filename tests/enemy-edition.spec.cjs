const {test,expect}=require('@playwright/test');
test('original 2014 expedition loads the actual Goliath and Night Terror record fields',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?recovery');
 await page.locator('#coreEdition').selectOption('original');
 await page.locator('#coreSet').selectOption('city');
 await page.locator('#startGame').click();
 const result=await page.evaluate(()=>({
  edition:window.DarkstoneRuleAudit.getEdition(),
  goliath:window.DarkstoneRuleAudit.getEnemyType('Goliath'),
  night:window.DarkstoneRuleAudit.getEnemyType('Night Terror')
 }));
 expect(result.edition).toBe('original');
 expect(result.goliath).toMatchObject({initiative:2,steps:6,escape:4,hit:3,combat:3,damage:3,def:3,hp:24,attackRange:3,immuneCrit:true,recordComplete:true});
 expect(result.goliath.eliteChart).toHaveLength(6);
 expect(result.night).toMatchObject({initiative:3,steps:5,escape:3,hit:5,combat:4,damage:4,def:3,hp:12,terror:2,recordComplete:true});
 expect(result.night.eliteChart).toHaveLength(6);
 expect(errors).toEqual([]);
});
test('revised 2020 expedition loads Harbinger HP-per-hero and does not reuse original Goliath sheet',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?recovery');
 await page.locator('#coreEdition').selectOption('revised');
 await page.locator('#coreSet').selectOption('swamp');
 await page.locator('#startGame').click();
 const result=await page.evaluate(()=>({
  edition:window.DarkstoneRuleAudit.getEdition(),
  harbinger:window.DarkstoneRuleAudit.getEnemyType('Harbinger'),
  goliath:window.DarkstoneRuleAudit.getEnemyType('Goliath'),
  tentacle:window.DarkstoneRuleAudit.getEnemyType('Tentacle')
 }));
 expect(result.edition).toBe('revised');
 expect(result.harbinger).toMatchObject({initiative:4,steps:12,escape:3,hit:4,combat:3,damage:4,def:3,hp:14,hpPerHero:3,recordComplete:false});
 expect(result.goliath.recordComplete).not.toBe(true);
 expect(result.tentacle).toMatchObject({initiative:2,steps:6,escape:4,hit:4,combat:3,damage:3,def:2,hp:4,smash:true,recordComplete:true});
 expect(errors).toEqual([]);
});
