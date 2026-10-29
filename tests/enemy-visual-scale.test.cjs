'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('const ENEMY_VISUAL_SCALE='),b=html.indexOf('function drawEnemyIcon(',a);
assert.ok(a>=0&&b>a);
const ctx={};vm.runInNewContext(html.slice(a,b)+'\nthis.enemyVisualScale=enemyVisualScale;',ctx);
test('large creatures are visibly larger than small creatures',()=>{
 assert.ok(ctx.enemyVisualScale('Goliath')>ctx.enemyVisualScale('Night Terror'));
 assert.ok(ctx.enemyVisualScale('Night Terror')>ctx.enemyVisualScale('Void Spider'));
 assert.ok(ctx.enemyVisualScale('Void Spider')>ctx.enemyVisualScale('Hellbat'));
});
test('unknown enemies fall back to normal size',()=>assert.equal(ctx.enemyVisualScale('unlisted'),1));
test('silhouette scaling does not alter the one-cell movement and collision rules',()=>{
 assert.match(html,/const size=unit\*enemyVisualScale\(type\)/);
 assert.match(html,/function occupied\(x,y\)\{return S\.enemies\.find\(e=>e\.x===x&&e\.y===y\)\}/);
});
