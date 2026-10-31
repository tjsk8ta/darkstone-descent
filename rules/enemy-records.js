/* Edition-specific Enemy Record Sheet facts. Only fields readable on identified
 * physical record-sheet photographs or the publisher's printed rulebook example
 * are included. Unlisted fields are NOT verified; do not infer them.
 * These are numerical game facts and compact mechanics, not facsimiles of cards. */
(function(root){
'use strict';
const ORIGINAL_CITY='https://www.ebay.com/itm/375750948185';
const ORIGINAL_NIGHT='https://www.scribd.com/document/771872867/SoB-VF-Monstre-Fiche-Terreur-nocturne';
const REVISED_SWAMP='https://www.ebay.com/itm/376978662614';
const ORIGINAL_TENTACLE='https://ffpgames.wordpress.com/wp-content/uploads/2014/07/sobs_rulebook_web_publish.pdf#page=20';
const OFFICIAL_TENTACLE_CITY='https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf#page=22';
const OFFICIAL_TENTACLE_SWAMP='https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBSD_Rulebook_WEB.pdf#page=22';
const original={
 'Goliath':{
  source:ORIGINAL_CITY,corroboratingSource:'https://3.bp.blogspot.com/-uQlPW7PTpTk/VBtJhWjN2rI/AAAAAAAAEKI/H9AGg8xqpIg/s1600/33.jpg',confidence:'2014 physical normal-side card: health 12 +5 per Hero, not flat 24; other stats cross-checked with original photo',complete:true,
  stats:{size:'extra-large',initiative:2,steps:6,escape:4,hit:3,combat:3,damage:3,def:3,hp:12,hpPerHero:5,exp:10,xpPerWound:5,unspeakableTerror:3,attackRange:3,immuneCrit:true},
  mechanics:['Flailing Tentacles: attacks every Hero within 3 spaces, with 3 attack dice','Unspeakable Terror (3)','Immune to Critical Hits'],
  eliteChart:[
   {id:'crushing-blows',name:'Crushing Blows',effect:'+1 melee Damage'},
   {id:'screaming-souls',name:'Screaming of Lost Souls',effect:'Unspeakable Terror (5)'},
   {id:'hardened-skin',name:'Hardened Skin',effect:'+1 Defense'},
   {id:'entangle',name:'Entangle',effect:'Wounded Heroes cannot move during next Activation'},
   {id:'regeneration',name:'Regeneration (2)',effect:'Heal 2 Wounds at the start of each turn'},
   {id:'extra-arms',name:'Extra Arms',effect:'4 Combat Attacks on every Hero in range'}
  ]},
 'Night Terror':{
  source:ORIGINAL_NIGHT,confidence:'original-era French translation of physical card, corroborated by original English photograph',complete:true,
  stats:{size:'large',initiative:3,steps:5,escape:3,hit:5,combat:4,damage:4,def:3,hp:12,exp:10,xpPerWound:5,terror:2},
  mechanics:['Terror (2)'],
  eliteChart:[
   {id:'hypnotic-gaze',name:'Transfixing Stare',effect:'Escape 6+'},
   {id:'walking-nightmare',name:'Gibbering Nightmare',effect:'Replace Terror (2) with Unspeakable Terror (2)'},
   {id:'brute',name:'Brutes',effect:'+6 Health'},
   {id:'mind-drain',name:'Soul Drain',effect:'Combat and Horror Hits deal +2 Damage'},
   {id:'regeneration',name:'Regeneration (2)',effect:'Heal 2 Wounds at start of each turn'},
   {id:'hunter',name:'Hunter',effect:'Melee To Hit 4+'}
  ]},
 'Strangler':{source:ORIGINAL_CITY,confidence:'visible fields on 2014 card; lower stats obscured',complete:false,
  stats:{size:'medium',initiative:4,steps:6,escape:6,hit:3}},
 'Void Spider':{source:ORIGINAL_CITY,confidence:'visible fields on 2014 card; lower stats obscured',complete:false,
  stats:{initiative:6,steps:8,escape:4,hit:4}},
 'Targa Pylon':{source:ORIGINAL_CITY,confidence:'visible fields on 2014 card; lower stats obscured',complete:false,
  stats:{size:'large',initiative:4,steps:0,rangedHit:3,combat:0}},
 'Tentacle':{source:ORIGINAL_TENTACLE,confidence:'original 2014 publisher rulebook page 20; normal-side record and all six Elite abilities directly readable',complete:true,
  stats:{size:'medium',initiative:2,steps:6,escape:4,hit:4,combat:3,damage:3,def:2,hp:4,exp:30,smash:true},
  mechanics:['SMASH: melee rolls of 6 bypass Hero Defense'],
  eliteChart:[
   {id:'entangle',name:'Entangle',effect:'Wounded Heroes cannot move on next Activation'},
   {id:'eruption',name:'Eruption',effect:'Move through models and change target'},
   {id:'writhing',name:'Writhing',effect:'+2 Defense'},
   {id:'tentacle-bonus-damage',name:'Brutal Suckers',effect:'+2 Damage'},
   {id:'lashing-strike',name:'Lashing Strike',effect:'+1 Combat'},
   {id:'swift',name:'Swift',effect:'+2 Initiative'}
  ]}
};
const revised={
 'Tentacle':{...original.Tentacle,source:OFFICIAL_TENTACLE_CITY,confidence:'publisher 2020 City normal-side rulebook example'},
 'Harbinger':{
  source:REVISED_SWAMP,confidence:'readable normal-side 2020 physical card photograph; elite chart too small to verify',complete:false,
  stats:{size:'extra-large',initiative:4,steps:12,escape:3,hit:4,combat:3,damage:4,def:3,hp:14,hpPerHero:3,exp:10,xpPerWound:5,unspeakableTerror:3,immuneCrit:true,flight:true},
  mechanics:['Unspeakable Terror (3)','Flight','Immune to Critical Hits','Bringer of Death D6 table (details require full readable card)']},
 'Corpse Pile':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{size:'large',initiative:0,steps:0,combat:0}},
 'Hungry Dead':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{size:'medium',initiative:1,steps:2}},
 'Hellbat':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{size:'medium',initiative:6,steps:12}},
 'Slasher':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{size:'large',initiative:4,steps:5}}
};
const editions=Object.freeze({original,revised});
/* Original City 2014 physical red face, unobstructed at:
 * https://i.ebayimg.com/images/g/8BEAAOSwHfhnIZEu/s-l1600.webp
 * This is NOT the normal green face, nor the revised edition. */
const brutal=Object.freeze({
 original:{
  // French fan translation prints BOTH green and red 2014 faces side-by-side.
  // Transcribed numerical facts are secondary evidence, NOT an inspected
  // unobscured English physical red card; deliberately not gameplay-enabled.
  'Tentacle':{
   source:'https://www.scribd.com/document/771872866/SoB-VF-Monstre-Fiche-Tentacule',
   confidence:'complete translated 2014 red face; independent physical card confirmation outstanding',
   complete:false,face:'brutal',evidenceKind:'translated-recreation',
   stats:{size:'medium',initiative:3,steps:6,escape:4,hit:4,combat:3,damage:5,def:3,hp:5,exp:45,smash:true},
   mechanics:['Smash: melee To Hit rolls of 6 bypass Hero Defense'],
   eliteChart:[
    {id:'entangle',name:'Entangle',effect:'Wounded Hero cannot move on next Activation'},
    {id:'eruption',name:'Eruption',effect:'Move through models; change targets each turn'},
    {id:'lashing-strike',name:'Lashing Strike',effect:'+1 Combat'},
    {id:'void-visions',name:'Visions of the Void',effect:'Wounded Hero suffers D6 Horror Hits'},
    {id:'grasp',name:'Grasp',effect:'Wounded Hero moved to a random empty adjacent square'},
    {id:'void-hydra',name:'Void Hydra',effect:'On death roll D8; on 1–2 replace with one Tentacle and place another adjacent'}
   ]},
  'Night Terror':{
   source:ORIGINAL_NIGHT,
   confidence:'complete translated 2014 red face; independent physical card confirmation outstanding',
   complete:false,face:'brutal',evidenceKind:'translated-recreation',
   stats:{size:'large',initiative:4,steps:5,escape:5,hit:5,combat:4,damage:4,def:3,hp:20,exp:20,xpPerWound:5,terror:2,mindDrain:3,clawsDoubleHits:true},
   mechanics:['Terror (2)','Mind Drain: each Horror Hit causes 3 Sanity Damage','Claws: each Combat Hit counts as two Hits'],
   eliteChart:[
    {id:'hunter',name:'Hunter',effect:'Melee To Hit 4+'},
    {id:'walking-nightmare',name:'Walking Nightmare',effect:'Replace Terror (2) with Unspeakable Terror (2)'},
    {id:'regeneration',name:'Regeneration (2)',effect:'Heal 2 Wounds at start of each turn'},
    {id:'thick-hide',name:'Thick Hide',effect:'+1 Defense'},
    {id:'powerful',name:'Powerful',effect:'Move wounded Hero 2 spaces in random direction'},
    {id:'swift-to-five',name:'Swift',effect:'Initiative becomes 5'}
   ]},
  'Void Spider':{
   source:'https://i.ebayimg.com/images/g/8BEAAOSwHfhnIZEu/s-l1600.webp',
   confidence:'readable 2014 physical red Brutal face photograph',
   complete:true,face:'brutal',
   stats:{size:'small',initiative:7,steps:8,escape:4,hit:4,combat:2,damage:4,def:0,hp:5,exp:20,voidVenom:true},
   mechanics:['Void Venom: a wounded Hero receives -1 To Hit on their next Activation'],
   eliteChart:[
    {id:'drop-from-above',name:'Drop From Above',effect:'Ambush Attack on entry'},
    {id:'hardened-shells',name:'Hardened Shells',effect:'+2 Defense'},
    {id:'vicious-bite',name:'Vicious Bite',effect:'Melee To Hit 3+'},
    {id:'acidic-ichor',name:'Acidic Ichor',effect:'When killed, adjacent Heroes suffer D3 Wounds ignoring Defense'},
    {id:'rapid-climbing',name:'Rapid Climbing',effect:'+2 Combat'},
    {id:'severing-bite',name:'Severing Bite',effect:'To Hit rolls of 6 bypass Hero Defense'}
   ]
  }
 },
 revised:{
  'Corpse Pile':{
   source:'https://i.ebayimg.com/images/g/8MgAAeSwWLhpmIwh/s-l1600.webp',
   confidence:'2020 physical red Brutal face; card readable at front but full Elite and spawn rules not legible',
   complete:false,face:'brutal',
   stats:{size:'large',initiative:0,steps:0,escape:1,combat:0,damage:0,def:0,hp:10,immobile:true,fear:2},
   mechanics:['Immobile','Fear (2)','Fast Spawner (precise D6 and placement details unverified)']
  }
 }
});
function getFace(edition,name,set='city',face='normal'){
 if(face==='normal')return get(edition,name,set);
 if(face!=='brutal')throw Error('Unknown Enemy Record Sheet face '+face);
 if(!Object.hasOwn(brutal,edition))throw Error('Unknown edition '+edition);
 return brutal[edition][name]||null;
}
function applyFace(edition,name,base={},set='city',face='normal'){
 const record=getFace(edition,name,set,face);
 if(!record||!record.complete)throw Error('Unverified or incomplete '+edition+' '+face+' Enemy Record Sheet: '+name);
 return {...base,...record.stats,eliteChart:record.eliteChart?.map(x=>({...x})),
  recordSource:record.source,recordConfidence:record.confidence,recordComplete:record.complete,
  recordFace:face};
}

// Directly inspected publisher PDF card IMAGES: both revised cores say Brutal
// Suckers. PDF extracted visual metadata incorrectly said Bitter Success.
const revisedSwampTentacle={...revised.Tentacle,source:OFFICIAL_TENTACLE_SWAMP,
 confidence:'publisher revised Swamps p22 image directly inspected; Elite #4 Brutal Suckers',
 eliteChart:revised.Tentacle.eliteChart.map(e=>({...e}))};
const revisedCombinedTentacle={...revised.Tentacle,
 confidence:'publisher City and Swamps p22 images both say Brutal Suckers',
 eliteChart:revised.Tentacle.eliteChart.map(e=>({...e})),
 variantSources:[OFFICIAL_TENTACLE_CITY,OFFICIAL_TENTACLE_SWAMP]};
function get(edition,name,set='city'){
 if(!Object.hasOwn(editions,edition))throw Error('Unknown edition '+edition);
 if(edition==='revised'&&name==='Tentacle'){
  if(set==='swamp')return revisedSwampTentacle;
  if(set==='combined')return revisedCombinedTentacle;
 }
 return editions[edition][name]||null;
}
function verifiedFields(edition,name,set){return Object.keys(get(edition,name,set)?.stats||{})}
function apply(edition,name,base,set){
 const record=get(edition,name,set);
 if(!record)return {...base};
 return {...base,...record.stats,eliteChart:record.eliteChart?record.eliteChart.map(x=>({...x})):undefined,recordSource:record.source,recordConfidence:record.confidence,recordComplete:record.complete};
}
const api=Object.freeze({editions,brutal,get,getFace,applyFace,verifiedFields,apply});
root.DarkstoneEnemyRecords=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
