'use strict';
const fs=require('node:fs'),path=require('node:path');
function validate(q,c,workflow,expectedHead){
 const errors=[],bad=s=>errors.push(s);
 if(q?.schemaVersion!==1||c?.schemaVersion!==1)bad('schema mismatch');
 if(q?.plan!=='docs/FOCUS_LOCKED_SEVEN_GATE_IMPLEMENTATION_PLAN.md'||c?.plan!==q?.plan)bad('plan mismatch');
 if(!/^[0-9a-f]{40}$/.test(q?.baselineCommit||'')||c?.baselineCommit!==q?.baselineCommit)bad('baseline mismatch');
 if(!Array.isArray(q?.phases)||q.phases.length!==7)bad('phase count');
 else{let active=0;
  q.phases.forEach((p,i)=>{
   if(p.id!=='P'+(i+1)||JSON.stringify(p.dependsOn)!==JSON.stringify(i?['P'+i]:[]))bad('phase order/dependency '+i);
   if(p.status==='in-progress')active++;
   if(p.status==='passed'&&p.acceptance.some(a=>a.status!=='passed'||!a.evidence.length))bad('unsupported completion '+p.id);
   if(p.status!=='pending'&&q.phases.slice(0,i).some(x=>x.status!=='passed'))bad('phase skipping '+p.id);
   if(!p.acceptance?.length||p.acceptance.some(a=>!['pending','passed','blocked','failed'].includes(a.status)||!Array.isArray(a.evidence)))bad('invalid acceptance '+p.id);
  });
  if(active!==1||q.phases.find(p=>p.id===q.activePhase)?.status!=='in-progress')bad('active phase invalid');
  if(q.phases.some((p,i)=>p.status==='pending'&&q.phases.slice(i+1).some(x=>x.status!=='pending')))bad('pending phase before active work');
 }
 if(q?.activePhase!==c?.activePhase||!c?.activeTask||!c?.nextAction||!Array.isArray(c?.completedPhases)||!Array.isArray(c?.blockers))bad('checkpoint mismatch');
 if(c?.completedPhases?.some(id=>q.phases.find(p=>p.id===id)?.status!=='passed'))bad('unverified checkpoint completion');
 if(q?.phases?.filter(p=>p.status==='passed').some(p=>!c?.completedPhases?.includes(p.id)))bad('checkpoint missing passed phase');
 if(!Array.isArray(c?.evidence))bad('checkpoint evidence invalid');
 if(!/^[0-9a-f]{40}$/.test(c?.lastVerifiedHead||''))bad('checkpoint HEAD invalid');
 if(expectedHead!==undefined&&c?.lastVerifiedHead!==expectedHead)bad('checkpoint HEAD divergence requires reconciliation');
 if(q?.constraints?.manualActions!==true||q?.constraints?.failClosed!==true||q?.constraints?.noPhaseSkipping!==true)bad('controls disabled');
 if(!/^\s*workflow_dispatch\s*:/m.test(workflow)||/^\s*(push|pull_request|schedule|workflow_run|repository_dispatch|workflow_call)\s*:/m.test(workflow))bad('automatic Actions trigger');
 return {accepted:errors.length===0,errors,activePhase:q?.activePhase};
}
if(require.main===module){const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');const result=validate(JSON.parse(read('reference/control-system-queue.json')),JSON.parse(read('reference/control-system-checkpoint.json')),read('.github/workflows/verify.yml'));console.log(JSON.stringify(result,null,2));if(!result.accepted)process.exitCode=1}
module.exports={validate};
