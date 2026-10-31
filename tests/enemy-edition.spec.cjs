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
 expect(result.goliath).toMatchObject({initiative:2,steps:6,escape:4,hit:3,combat:3,damage:3,def:3,hp:12,hpPerHero:5,attackRange:3,immuneCrit:true,recordComplete:true});
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

test('original Goliath performs three verified melee attack dice against a solo hero within three spaces',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?recovery');
 await page.locator('#coreEdition').selectOption('original');
 await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const key='darkstone_descent_tiles_v3',state=JSON.parse(localStorage.getItem(key));
  state.enemies=[{id:900,type:'Goliath',x:state.x+3,y:state.y,hp:24,maxHp:24,home:'4,5',spawnTurn:0}];
  state.nextEnemy=901;state.enemyActed=[];
  localStorage.setItem(key,JSON.stringify(state));
 });
 await page.goto('/');
 await page.evaluate(()=>Object.defineProperty(window.crypto,'getRandomValues',{configurable:true,value(arr){arr.fill(2);return arr}}));
 await page.locator('#endBtn').click();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(state.log.some(e=>/Goliath.*attacks: to-hit/.test(e.text))).toBe(true);
 expect(state.log.find(e=>/Goliath.*attacks: to-hit/.test(e.text)).text).toMatch(/\[3 3 3\]/);
 expect(errors).toEqual([]);
});

test('revised City and Swamps Tentacle Elite #4 share their visually verified printed name',async({page})=>{
 const names=[];
 for(const set of ['city','swamp','combined']){
  await page.goto('/?recovery');
  await page.locator('#coreEdition').selectOption('revised');
  await page.locator('#coreSet').selectOption(set);
  await page.locator('#startGame').click();
  names.push(await page.evaluate(()=>window.DarkstoneRuleAudit.getEnemyType('Tentacle').eliteChart[3].name));
 }
 expect(names).toEqual(['Brutal Suckers','Brutal Suckers','Brutal Suckers']);
});
