'use strict';
/* Seven-gate, fail-closed acceptance checker. Audit mode reports outstanding
 * work without hiding it; --release exits nonzero until independently verified.
 * No syntax-only check, commit or listing URL can satisfy a release gate. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const exists=p=>fs.existsSync(path.join(root,p));
const results=[],fail=(gate,reason)=>{let g=results.find(x=>x.id===gate);g.pass=false;g.blockers.push(reason)};
for(let i=1;i<=7;i++)results.push({id:i,pass:true,blockers:[]});
const required=['reference/enemy-record-sheets.json','reference/enemy-sheet-audit.json','reference/completion-status.json','reference/execution-gates.json','rules/completion.json','rules/enemy-records.js','index.html','package.json'];
for(const p of required)if(!exists(p))fail(1,'Required input missing: '+p);
if(results[0].pass){
 const ledger=read(required[0]),audit=read(required[1]),status=read(required[2]),gates=read(required[3]),completion=read(required[4]);
 const faces=ledger.recordSheets||[],keys=new Set();
 if(faces.length!==24)fail(1,'Expected 24 edition/set enemy records; found '+faces.length);
 for(const f of faces){
  const key=[f.edition,f.set,f.enemy].join('/');
  if(keys.has(key))fail(1,'Duplicate record: '+key);
  keys.add(key);
  if(!['original','revised'].includes(f.edition)||!['city','swamp'].includes(f.set))fail(1,'Invalid edition/set: '+key);
  for(const [face,record] of [['normal',f],['brutal',f.brutalFace]]){
   if(!record){fail(2,'Missing '+face+' face: '+key);continue}
   const verified=record.statisticsVerified===true&&record.abilitiesVerified===true&&record.eliteChartVerified===true;
   if(!verified){fail(2,key+' '+face+' unverified ('+(record.status||'no status')+')');continue}
   if(!/^https:\/\//.test(record.source||''))fail(2,key+' '+face+' lacks inspected source URL');
   if(/listing-only|unviewed|partial|occluded|unreadable/i.test((record.status||'')+' '+(record.notes||'')))fail(2,key+' '+face+' marked verified despite unresolved visibility');
   if(record.gameplayIntegrated!==true&&f.gameplayIntegrated!==true)fail(3,key+' '+face+' not integrated');
   if(face==='brutal'&&record.gameplayIntegrated!==true)fail(3,key+' brutal not integrated');
  }
 }
 if(status.completion!==false&&results.some(x=>!x.pass))fail(1,'completion-status contradicts incomplete ledger');
 if(completion.complete===true&&results.some(x=>!x.pass))fail(1,'rules/completion falsely claims complete');
 if(audit.acceptance?.allSheetsSourceVerified!==true)fail(2,'Independent sheet audit not accepted');
 if(completion.gates?.combat?.status!=='complete'||completion.gates?.exploration?.status!=='complete'||completion.gates?.threatDecks?.status!=='complete'||completion.gates?.characters?.status!=='complete')fail(3,'Rules engine / missions / hero / threats not fully implemented');
 const evidence=gates.testEvidence||{};
 const sourceFiles=['index.html','rules/enemy-records.js','rules/threat-engine.js','rules/enemy-movement.js','reference/enemy-record-sheets.json'];
 const digest=crypto.createHash('sha256');
 for(const f of sourceFiles){if(exists(f))digest.update(f).update(fs.readFileSync(path.join(root,f)));else fail(4,'Missing source for fingerprint: '+f)}
 const fingerprint=digest.digest('hex');
 for(const suite of ['unit','integration','chromiumDesktop','chromiumMobileDoor','chromiumMobileJournal','saveRecovery']){
  const item=evidence[suite];
  if(!item||item.status!=='passed'||item.sourceDigest!==fingerprint||!item.runUrl||!item.verifiedAt)fail(4,'Missing passing independent '+suite+' evidence for current source fingerprint');
 }
 const deploy=evidence.pages;
 if(!deploy||deploy.status!=='passed'||deploy.sourceDigest!==fingerprint||!deploy.url||!deploy.verifiedAt||!deploy.deploymentRunUrl)fail(4,'Pages deployment not independently verified for current source fingerprint');
 const regressions=gates.recurringFailures||{};
 for(const category of ['short-run','links-only','peripheral-work','fabricated-rules','untested-deploy','door-regression','journal-omission','premature-completion']){
  if(!regressions[category]?.control||!regressions[category]?.verification)fail(5,'Missing correction and verification control: '+category);
 }
 if(results.slice(0,5).some(g=>!g.pass))fail(6,'Stop not authorised: preceding acceptance gates remain open');
 if(results.slice(0,6).some(g=>!g.pass))fail(7,'Completion notification prohibited; continue work or record precise external blocker');
 if(status.completion===true&&results.some(g=>!g.pass))fail(7,'Premature completion status');
 const output={releaseAccepted:results.every(x=>x.pass),sourceDigest:fingerprint,gateResults:results,unverifiedFaces:faces.reduce((n,f)=>n+Number(!(f.statisticsVerified&&f.abilitiesVerified&&f.eliteChartVerified))+Number(!(f.brutalFace?.statisticsVerified&&f.brutalFace?.abilitiesVerified&&f.brutalFace?.eliteChartVerified)),0)};
 if(process.argv.includes('--json'))process.stdout.write(JSON.stringify(output,null,2)+'\n');
 else for(const g of results)process.stdout.write('GATE '+g.id+' '+(g.pass?'PASS':'BLOCKED')+' '+(g.pass?'':g.blockers.length+' issue(s): '+g.blockers.slice(0,4).join(' | '))+'\n');
 if(process.argv.includes('--release')&&!output.releaseAccepted)process.exitCode=1;
}else{for(const g of results)if(g.id>1)fail(g.id,'Cannot evaluate until required input exists');process.stdout.write(JSON.stringify({releaseAccepted:false,gateResults:results},null,2)+'\n');if(process.argv.includes('--release'))process.exitCode=1}
