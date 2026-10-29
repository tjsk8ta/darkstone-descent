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
