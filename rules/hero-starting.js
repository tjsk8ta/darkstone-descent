/* Source-linked revised core class card IDENTITIES. Effects are not inferred from card names.
 Sources: https://shadows-of-brimstone.fandom.com/wiki/City_of_the_Ancients_Revised_Edition
 https://shadows-of-brimstone.fandom.com/wiki/Swamps_of_Death_Revised_Edition
 https://www.rulespal.com/shadows-of-brimstone-city-of-the-ancients/rulebook
 https://www.rulespal.com/shadows-of-brimstone-swamps-of-death/rulebook */
(function(root){'use strict';
const CITY_PERSONAL=['Ace of Spades','Adventure Boots','Cigarette','Hand Mirror','Locket','Personal Journal','Pocket Watch','Shackles','Weathered Poncho','Worn Eye Patch'];
const SWAMP_PERSONAL=['Ancient Coin','Bear Claw','Boot Knife','Concealed Flask','Lucky Charm','Ribbon','Roughskin Gloves','Silver Dice','Spectacles','Weathered Hat'];
const CLASSES=Object.freeze({
 usMarshal:{name:'U.S. Marshal',set:'city',gear:['Shotgun','Marshal Badge'],upgrades:['Cleaning Up The West','Hardened Resolve','Rolling Thunder']},
 saloonGirl:{name:'Saloon Girl',set:'city',gear:['Hold-Out Pistol'],upgrades:['Acrobatic Dodge',"Dirty Fightin'",'Knockout Punch']},
 gunslinger:{name:'Gunslinger',set:'city',gear:['Pistol'],upgrades:['Pistol Fanning','Quickdraw','Reload']},
 bandido:{name:'Bandido',set:'city',gear:['Pistol','Pistol','Dynamite Satchel'],upgrades:['Explosives Expert','Swindler','Twin Guns']},
 lawman:{name:'Lawman',set:'swamp',gear:['Peacekeeper Pistol','Sheriff Badge'],upgrades:['Frontier Justice','Iron Will','Strong Leadership']},
 rancher:{name:'Rancher',set:'swamp',gear:['Hunting Rifle'],upgrades:['Farmstead Defender','Home Remedies','Swinging Rifle']},
 indianScout:{name:'Indian Scout',set:'swamp',gear:['Carbine','Indian Hatchet'],upgrades:['Cavalry Scout','Heightened Senses','Savage Attack']},
 preacher:{name:'Preacher',set:'swamp',gear:['Holy Book','Redemptionist Shotgun'],upgrades:['Firebrand','Missionary','Redemptionist']}
});
function get(key){if(!Object.prototype.hasOwnProperty.call(CLASSES,key))throw Error('Unknown revised core Hero class');return CLASSES[key]}
function personalPool(key){return get(key).set==='city'?CITY_PERSONAL:SWAMP_PERSONAL}
function create(key,upgrade,randomIndex){const hero=get(key);if(!hero.upgrades.includes(upgrade))throw Error('Starting Upgrade must belong to chosen Hero class');const pool=personalPool(key);if(!Number.isInteger(randomIndex)||randomIndex<0||randomIndex>=pool.length)throw Error('Invalid Personal Item draw');return {classKey:key,className:hero.name,gear:[...hero.gear,'Old Lantern'].map((name,index)=>({id:key+'-starting-'+index,name,starting:true,verifiedEffect:false,equipped:false})),personalItem:{id:key+'-personal-'+randomIndex,name:pool[randomIndex],starting:true,verifiedEffect:false,equipped:false},startingUpgrade:upgrade,startingUpgradeEffectVerified:false,cardEffectStatus:'pending printed card face',sourceSet:hero.set}}
const api=Object.freeze({CLASSES,CITY_PERSONAL,SWAMP_PERSONAL,get,personalPool,create});root.DarkstoneHeroStarting=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
