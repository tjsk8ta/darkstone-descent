const {test,expect}=require('@playwright/test');
test('desktop expedition starts, saves, and reloads without runtime exceptions',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('#startGame')).toBeVisible();
 await page.locator('#startGame').click();
 await expect(page.locator('#overlay')).toHaveClass(/hidden/);
 await expect(page.locator('#statHero')).toContainText('Frontier Marshal');
 await expect(page.locator('#attackBtn')).toBeDisabled();
 await expect(page.locator('#map')).toBeVisible();
 await expect(page.locator('#turnCount')).toHaveText('1');
 const saved=await page.evaluate(()=>localStorage.getItem('darkstone_descent_tiles_v3'));
 expect(saved).toContain('"profile"');
 await page.reload();
 await expect(page.locator('#statHero')).toContainText('Frontier Marshal');
 await expect(page.locator('#overlay')).toHaveClass(/hidden/);
 expect(errors).toEqual([]);
});
test('mobile layout opens journal and supports turn controls',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/?recovery');
 await expect(page.locator('#startGame')).toBeVisible();
 await page.locator('#startGame').click();
 await expect(page.locator('#map')).toBeVisible();
 await page.locator('#journalTab').click();
 await expect(page.locator('#journalDrawer')).toHaveClass(/open/);
 await page.locator('#journalClose').click();
 await expect(page.locator('#journalDrawer')).not.toHaveClass(/open/);
 await page.locator('#endBtn').click();
 await expect(page.locator('#turnCount')).toHaveText('2');
 expect(errors).toEqual([]);
});

test('two critical hits can be allocated sequentially across adjacent and distant enemies',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const key='darkstone_descent_tiles_v3',state=JSON.parse(localStorage.getItem(key));
  const mk=(id,type,x,y)=>({id,type,x,y,hp:1,maxHp:1,home:'2,2',spawnTurn:0});
  state.enemies=[mk(100,'Tentacle',state.x+1,state.y),mk(101,'Void Spider',state.x+1,state.y+2)];
  state.nextEnemy=102;
  localStorage.setItem(key,JSON.stringify(state));
  Object.defineProperty(window.crypto,'getRandomValues',{configurable:true,value(arr){arr.fill(5);return arr}});
 });
 await page.reload();
 await page.evaluate(()=>Object.defineProperty(window.crypto,'getRandomValues',{configurable:true,value(arr){arr.fill(5);return arr}}));
 await expect(page.locator('#attackBtn')).toBeEnabled();
 await page.locator('#attackBtn').click();
 await expect(page.locator('[data-toggle-grit]')).toHaveCount(2);
 await page.locator('#confirmAttackRoll').click();
 await expect(page.locator('[data-choose-hit]')).toHaveCount(2);
 await page.locator('[data-choose-hit]').first().click();
 await expect(page.locator('[data-group-enemy="100"]')).toBeVisible();
 await expect(page.locator('[data-group-enemy="101"]')).toHaveCount(0);
 await page.locator('[data-group-enemy="100"]').click();
 await page.locator('#applyDamageDice').click();
 await expect(page.locator('[data-choose-hit]')).toHaveCount(1);
 await page.locator('[data-choose-hit]').click();
 await expect(page.locator('[data-group-enemy="101"]')).toBeVisible();
 await page.locator('[data-group-enemy="101"]').click();
 await page.locator('#applyDamageDice').click();
 await expect(page.locator('#mapEyebrow')).toContainText('0 enemies active');
 expect(errors).toEqual([]);
});

test('entering a revealed passage resolves exploration immediately without End Turn',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await page.locator('#startGame').click();
 await page.evaluate(()=>{
  const key='darkstone_descent_tiles_v3',state=JSON.parse(localStorage.getItem(key));
  state.x=2*9+8;state.y=2*7+3;state.move=5;state.moveMax=5;
  state.rooms['2,2'].doors=['E'];
  state.rooms['3,2']={x:3,y:2,shape:'corridor',name:'Unexplored Passage',kind:'normal',
   doors:['W'],seen:true,explored:false,searched:false,clue:false,token:null,firstJunction:false,entryDir:'W'};
  localStorage.setItem(key,JSON.stringify(state));
 });
 await page.reload();
 await page.keyboard.press('ArrowRight');
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('darkstone_descent_tiles_v3')));
 expect(state.x).toBe(27);
 expect(state.rooms['3,2'].explored).toBe(true);
 expect(state.turn).toBe(1);
 expect(errors).toEqual([]);
});
