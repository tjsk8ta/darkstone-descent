/* Edition-specific Enemy Record Sheet facts. Only fields readable on identified
 * physical record-sheet photographs or the publisher's printed rulebook example
 * are included. Unlisted fields are NOT verified; do not infer them.
 * These are numerical game facts and compact mechanics, not facsimiles of cards. */
(function(root){
'use strict';
const ORIGINAL_CITY='https://www.ebay.com/itm/375750948185';
const ORIGINAL_NIGHT='https://www.scribd.com/document/771872867/SoB-VF-Monstre-Fiche-Terreur-nocturne';
const REVISED_SWAMP='https://www.ebay.com/itm/376978662614';
const OFFICIAL_TENTACLE='https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf#page=22';
const original={
 'Goliath':{
  source:ORIGINAL_CITY,confidence:'readable original 2014 physical card photograph',complete:true,
  stats:{initiative:2,steps:6,escape:4,hit:3,combat:3,damage:3,def:3,hp:24,unspeakableTerror:3,attackRange:3,immuneCrit:true},
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
  stats:{initiative:3,steps:5,escape:3,hit:5,combat:4,damage:4,def:3,hp:12,terror:2},
  mechanics:['Terror (2)'],
  eliteChart:[
   {id:'hypnotic-gaze',name:'Hypnotic Gaze',effect:'Escape 6+'},
   {id:'walking-nightmare',name:'Walking Nightmare',effect:'Replace Terror (2) with Unspeakable Terror (2)'},
   {id:'brute',name:'Brute',effect:'+6 Health'},
   {id:'mind-drain',name:'Mind Drain',effect:'Combat and Horror Hits deal +2 Damage'},
   {id:'regeneration',name:'Regeneration (2)',effect:'Heal 2 Wounds at start of each turn'},
   {id:'hunter',name:'Hunter',effect:'Melee To Hit 4+'}
  ]},
 'Strangler':{source:ORIGINAL_CITY,confidence:'visible fields on 2014 card; lower stats obscured',complete:false,
  stats:{initiative:4,steps:6,escape:6,hit:3}},
 'Void Spider':{source:ORIGINAL_CITY,confidence:'visible fields on 2014 card; lower stats obscured',complete:false,
  stats:{initiative:6,steps:8,escape:4,hit:4}},
 'Targa Pylon':{source:ORIGINAL_CITY,confidence:'visible fields on 2014 card; lower stats obscured',complete:false,
  stats:{initiative:4,steps:0,hit:3}},
 'Tentacle':{source:OFFICIAL_TENTACLE,confidence:'publisher normal-side example matches original 2014 card image',complete:true,
  stats:{initiative:2,steps:6,escape:4,hit:4,combat:3,damage:3,def:2,hp:4,smash:true},
  mechanics:['SMASH: melee rolls of 6 bypass Hero Defense'],
  eliteChart:[
   {id:'entangle',name:'Entangle',effect:'Wounded Heroes cannot move on next Activation'},
   {id:'eruption',name:'Eruption',effect:'Move through models and change target'},
   {id:'writhing',name:'Writhing',effect:'+2 Defense'},
   {id:'brutal-suckers',name:'Brutal Suckers',effect:'+2 Damage'},
   {id:'lashing-strike',name:'Lashing Strike',effect:'+1 Combat'},
   {id:'swift',name:'Swift',effect:'+2 Initiative'}
  ]}
};
const revised={
 'Tentacle':{...original.Tentacle,source:OFFICIAL_TENTACLE,confidence:'publisher 2020 normal-side rulebook example'},
 'Harbinger':{
  source:REVISED_SWAMP,confidence:'readable normal-side 2020 physical card photograph; elite chart too small to verify',complete:false,
  stats:{initiative:4,steps:12,escape:3,hit:4,combat:3,damage:4,def:3,hp:14,hpPerHero:3,unspeakableTerror:3,immuneCrit:true},
  mechanics:['Unspeakable Terror (3)','Flight','Immune to Critical Hits','Bringer of Death D6 table (details require full readable card)']},
 'Corpse Pile':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{initiative:0,steps:0}},
 'Hungry Dead':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{initiative:1,steps:2}},
 'Hellbat':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{initiative:6,steps:12}},
 'Slasher':{source:REVISED_SWAMP,confidence:'visible header and movement only',complete:false,stats:{initiative:4,steps:5}}
};
const editions=Object.freeze({original,revised});
function get(edition,name){if(!Object.hasOwn(editions,edition))throw Error('Unknown edition '+edition);return editions[edition][name]||null}
function verifiedFields(edition,name){return Object.keys(get(edition,name)?.stats||{})}
function apply(edition,name,base){
 const record=get(edition,name);
 if(!record)return {...base};
 return {...base,...record.stats,eliteChart:record.eliteChart?record.eliteChart.map(x=>({...x})):undefined,recordSource:record.source,recordConfidence:record.confidence,recordComplete:record.complete};
}
const api=Object.freeze({editions,get,verifiedFields,apply});
root.DarkstoneEnemyRecords=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
