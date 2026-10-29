'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const part=(a,b)=>{let x=html.indexOf('function '+a+'('),y=html.indexOf('function '+b+'(',x);assert.ok(x>=0&&y>x);return html.slice(x,y)};
test('mobile journal fills available drawer width and full-height scroll region',()=>{
 assert.match(html,/width:min\(100vw,680px\)/);
 assert.match(html,/max-height:none!important;height:auto!important/);
});
test('look through door requires hero to stand on actual boundary half-space',()=>{
 const ctx={S:{x:8,y:1,rooms:{'0,0':{x:0,y:0,explored:true,doors:['E'],shape:'chamber'}}},W:9,H:7,N:9,D:{E:[1,0]},id:(x,y)=>x+','+y,roomCurrent:()=>ctx.S.rooms['0,0'],floorLocal:()=>true,adjoiningDoorConnected:()=>true};
 vm.runInNewContext(part('doorwayRoom','lookThroughDoor'),ctx);
 assert.ok(ctx.doorwayRoom());
 ctx.S.x=7;assert.equal(ctx.doorwayRoom(),null);
});
test('searching consumes the movement phase and prevents another search',()=>{
 assert.match(html,/S\.searchUsedTurn=S\.turn;S\.actionUsed=true;S\.move=0;S\.profile\.exp\+=5/);
 assert.match(html,/S\.searchUsedTurn=S\.turn;S\.actionUsed=true;S\.move=0;let rs=roll\(3\)/);
 assert.match(html,/if\(S\.searchUsedTurn===S\.turn\|\|S\.actionUsed\)/);
});
test('event choices are recorded at reveal, with concise result and numeric enemy delta',()=>{
 assert.match(html,/log\('EVENT: '\+event\.title/);
 assert.match(html,/log\('EVENT CHOICE: '\+option\.title/);
 assert.match(html,/\['Enemies',S\.enemies\.length-before\.enemies\]/);
 assert.doesNotMatch(html,/S\.enemies\.length-before\.enemies\.length/);
});
test('empty first junction and corridor do not award imaginary room-clearing loot',()=>{
 assert.match(html,/!r\.firstJunction&&r\.shape!=='corridor'&&!S\.pendingEvent&&\(r\.fightThreats>0\|\|r\.hadEnemies\)/);
});

test('an unresolved event prevents room reward and clue before choosing',()=>{
 assert.match(html,/!r\.firstJunction&&r\.shape!=='corridor'&&!S\.pendingEvent&&\(r\.fightThreats>0\|\|r\.hadEnemies\)/);
 assert.match(html,/if\(r\.clue&&!r\.clueFound&&!S\.pendingEvent\)/);
});
test('both searches consume the action and cannot be combined with attacking',()=>{
 assert.match(html,/if\(S\.searchUsedTurn===S\.turn\|\|S\.actionUsed\)/);
 assert.match(html,/\$\('exploreBtn'\)\.disabled=[^;]*s\.actionUsed/);
 assert.match(html,/\$\('searchBtn'\)\.disabled=[^;]*s\.searchUsedTurn===s\.turn/);
});
test('safe junctions and corridors give explicit onward exploration instructions',()=>{
 assert.match(html,/Initial T-Junction: no Exploration Token or enemies/);
 assert.match(html,/Passage: no Exploration Token or enemies/);
});

test('empty token chambers cannot claim fight rewards before actual combat',()=>{
 assert.match(html,/if\(count>0\)r\.hadEnemies=true/);
 assert.match(html,/\(r\.fightThreats>0\|\|r\.hadEnemies\)/);
});
