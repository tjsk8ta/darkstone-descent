'use strict';
const {test,expect}=require('@playwright/test');
test('complete opening: entrance, T-junction, first chamber and enemies',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const state=await page.evaluate(()=>{
  const hero=Object.keys(CLASSES)[0];
  makeRun(createProfile(hero),'story');
  const entry=roomCurrent();
  S.x=entry.x*W+4;S.y=entry.y*H;
  S.actionUsed=false;S.searchUsedTurn=-1;
  const first=doorwayRoom();
  if(!first)return {error:'Entrance north door inaccessible'};
  lookThroughDoor();
  const junction=Object.values(S.rooms).find(r=>r.firstJunction);
  if(!junction?.seen)return {error:'T-Junction was not revealed'};
  S.x=junction.x*W+4;S.y=junction.y*H+3;enterRoom(junction);
  S.x=junction.x*W;S.y=junction.y*H+3;
  S.actionUsed=false;S.searchUsedTurn=-1;
  const west=doorwayRoom();
  if(!west)return {error:'West T-Junction exit inaccessible',rooms:S.rooms};
  S.mapDeck=[{name:'Test Chamber',shape:'chamber'}];
  S.explorationDeck=[{clue:false,exits:1,event:'attack'}];
  lookThroughDoor();
  const chamber=Object.values(S.rooms).find(r=>r.name==='Test Chamber');
  if(!chamber?.seen)return {error:'Chamber not revealed'};
  S.x=chamber.x*W+4;S.y=chamber.y*H+3;
  enterRoom(chamber);
  return {junction:junction.explored,chamber:chamber.explored,
   enemies:S.enemies.length,pending:!!chamber.pendingThreat,pendingError:chamber.pendingThreatError,
   exits:roomExits(chamber),logs:S.log.slice(0,12).map(x=>x.text)};
 });
 expect(errors).toEqual([]);
 expect(state.error||'').toBe('');
 expect(state.junction).toBe(true);
 expect(state.chamber).toBe(true);
 expect(state.pendingError||'').toBe('');
 expect(state.enemies).toBeGreaterThan(0);
 expect(state.exits.length).toBeGreaterThanOrEqual(2);
});
test('legacy T-junction has accessible western passage and coherent walkable floor',async({page})=>{
 await page.goto('/');
 const state=await page.evaluate(()=>{
  const hero=Object.keys(CLASSES)[0];makeRun(createProfile(hero),'story');
  const r={x:4,y:4,shape:'tee',name:'T-Junction',firstJunction:true,explored:true,seen:true,doors:['S','E']};
  S.rooms={'4,4':r};S.x=4*W;S.y=4*H+3;S.actionUsed=false;S.searchUsedTurn=-1;
  return {floor:cellAt(S.x,S.y),door:doorwayRoom()?.dir,status:doorwayStatus()};
 });
 expect(state.floor).toBe(true);
 expect(state.door).toBe('W');
 expect(state.status.ready).toBe(true);
});

test('multi-chamber expedition preserves reachable frontier and encounters',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const result=await page.evaluate(()=>{
  makeRun(createProfile(Object.keys(CLASSES)[0]),'story');
  const opened=[],blocked=[];
  for(let step=0;step<8;step++){
   if(S.pendingEvent){S.pendingEvent=null;closeModal()}
   // Clear fights in this topology-focused test; separate combat tests own damage.
   S.enemies=[];for(const r of Object.values(S.rooms)){r.pendingThreat=false;r.pendingThreatError=null}
   const current=roomCurrent();
   if(current?.seen&&!current.explored)enterRoom(current);
   ensureOpenFrontier();
   const exits=frontierCandidates();
   if(!exits.length){blocked.push({step,room:roomCurrent()?.name});break}
   const next=exits[0];
   const square=PORTAL_LANES[next.dir].find(([x,y])=>
    path({x:S.x,y:S.y},{x:next.room.x*W+x,y:next.room.y*H+y},false,false)!==null);
   if(!square){blocked.push({step,reason:'unreachable portal'});break}
   S.x=next.room.x*W+square[0];S.y=next.room.y*H+square[1];
   S.actionUsed=false;S.searchUsedTurn=-1;
   const revealed=doorwayRoom();
   if(!revealed){blocked.push({step,reason:'doorway unavailable'});break}
   lookThroughDoor();
   const neighbor=S.rooms[id(next.room.x+D[next.dir][0],next.room.y+D[next.dir][1])];
   if(!neighbor?.seen){blocked.push({step,reason:'room not revealed'});break}
   const back=OPPOSITE_DOOR[next.dir];
   const entry=PORTAL_LANES[back].find(([x,y])=>floorLocal(neighbor,x,y));
   if(!entry){blocked.push({step,reason:'new tile has no reciprocal entrance'});break}
   S.x=neighbor.x*W+entry[0];S.y=neighbor.y*H+entry[1];
   enterRoom(neighbor);
   opened.push({name:neighbor.name,shape:neighbor.shape,enemies:S.enemies.length,pending:!!neighbor.pendingThreat});
  }
  return {opened,blocked,logs:S.log.slice(0,10).map(x=>x.text)};
 });
 expect(errors).toEqual([]);
 expect(result.blocked).toEqual([]);
 expect(result.opened.length).toBe(8);
 expect(result.opened.some(r=>r.shape==='chamber')).toBe(true);
});

test('Encounter Exploration Token resolves an event without an automatic Threat',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const result=await page.evaluate(()=>{
  makeRun(createProfile(Object.keys(CLASSES)[0]),'story');
  const r={x:4,y:4,shape:'chamber',name:'Encounter Chamber',kind:'normal',doors:['S'],entryDir:'S',seen:true,explored:false};
  S.rooms[id(4,4)]=r;S.x=4*W+4;S.y=4*H+3;
  S.explorationDeck=[{clue:false,exits:1,event:'encounter'}];
  enterRoom(r);
  return {enemies:S.enemies.length,pending:r.pendingThreat||false,
    event:!!S.pendingEvent,token:r.token?.event};
 });
 expect(errors).toEqual([]);
 expect(result.token).toBe('encounter');
 expect(result.pending).toBe(false);
 expect(result.enemies).toBe(0);
 expect(result.event).toBe(true);
});
test('Attack Exploration Token draws a Threat and places enemies',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const result=await page.evaluate(()=>{
  makeRun(createProfile(Object.keys(CLASSES)[0]),'story');
  const r={x:4,y:4,shape:'chamber',name:'Attack Chamber',kind:'normal',doors:['S'],entryDir:'S',seen:true,explored:false};
  S.rooms[id(4,4)]=r;S.x=4*W+4;S.y=4*H+3;
  S.explorationDeck=[{clue:false,exits:1,event:'attack'}];
  enterRoom(r);
  return {enemies:S.enemies.length,pending:r.pendingThreat||false,
    pendingError:r.pendingThreatError||'',event:!!S.pendingEvent,token:r.token?.event};
 });
 expect(errors).toEqual([]);
 expect(result.token).toBe('attack');
 expect(result.pendingError).toBe('');
 expect(result.pending).toBe(false);
 expect(result.enemies).toBeGreaterThan(0);
 expect(result.event).toBe(false);
});
