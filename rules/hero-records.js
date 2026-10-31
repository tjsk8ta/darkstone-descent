/* Direct visual verification: publisher Revised City/Swamps Rulebooks p.6.
 * Only these two sample Hero sheets are complete; no other Hero is inferred. */
(function(root){'use strict';
const SHEETS={
 usMarshal:{name:'U.S. Marshal',initiative:4,hp:10,sanity:10,defense:3,willpower:4,hit:4,meleeHit:4,combat:2,maxGrit:2,skills:{agility:3,cunning:4,spirit:2,strength:2,lore:1,luck:3},gear:['Shotgun','Marshal Badge'],weapon:{shots:1,toHitSides:8,damageSides:8},ability:'Double-Shot',source:'https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf#page=6'},
 lawman:{name:'Lawman',initiative:4,hp:12,sanity:12,defense:4,willpower:4,hit:4,meleeHit:4,combat:2,maxGrit:2,skills:{agility:2,cunning:4,spirit:1,strength:3,lore:2,luck:3},gear:['Peacekeeper Pistol','Sheriff Badge'],weapon:{shots:3,toHitSides:6,damageSides:6},ability:'Laying Down the Law',source:'https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBSD_Rulebook_WEB.pdf#page=6'}
};
function get(key){return SHEETS[key]||null}
function apply(key,base){const r=get(key);return r?{...base,initiative:r.initiative,hp:r.hp,sanity:r.sanity,defense:r.defense,willpower:r.willpower,hit:r.hit,meleeHit:r.meleeHit,combat:r.combat,maxGrit:r.maxGrit,skills:{...r.skills},strength:r.skills.strength,dice:r.weapon.shots,attackDieSides:r.weapon.toHitSides,damageDieSides:r.weapon.damageSides,skill:r.ability,officialClass:true,sheetVerified:true,weaponRangeVerified:false,heroRecordSource:r.source,desc:'Publisher-verified Hero sheet and attack dice; other equipment effects remain unverified'}:{...base}}
const api=Object.freeze({SHEETS,get,apply});root.DarkstoneHeroRecords=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
