# Darkstone Descent — Focus-Locked Seven-Gate Implementation Plan

Status: **APPROVED FOR PLANNING; IMPLEMENTATION NOT STARTED**. Logged 2026-10-31 at user request. This document is the authoritative implementation plan for the development-control system, not a completion claim.

## Objective and non-negotiable constraints

Build executable controls that make Darkstone Descent development source-grounded, end-to-end, regression-tested, recoverable, and resistant to premature closure. The work is **the control system first**, then gameplay development under it. Do not drift into unrelated gameplay implementation while the control system is being built. Do not overwrite or weaken existing `scripts/seven-gate-check.cjs`, `reference/execution-gates.json`, source audit or established release gates. Preserve the user's request to keep automatic GitHub Actions disabled; do not change workflow triggers without explicit approval. Never fabricate card faces, test evidence or successful deployment.

## Scope lock and work queue

Complete the following phases in order. Only fix unrelated code when it prevents a phase's acceptance test; record the reason and return to the phase. No new feature requests or opportunistic refactors until all control-system phases have acceptance evidence.

1. **Baseline and reconcile:** Snapshot current HEAD; inspect existing gate checker, task ledger, workflow triggers, tests and CI history; record overlaps, contradictions and gaps. Write a machine-readable control-system work queue with stable IDs, dependencies, evidence and statuses.
2. **Durable execution checkpoint:** Implement an atomic, validated checkpoint (task ID, baseline commit, active phase, accepted requirements, completed gates, next executable action, blockers, source/test evidence). On restart, reconcile checkpoint against HEAD and the queue; fail closed on divergence. Never treat mere investigation as completion.
3. **Executable acceptance contracts:** Define independent checks for complete UI-to-state-to-save-to-reload workflows, authenticated rule provenance, no fabricated values, and meaningful tests. Distinguish a partial feature from a released feature. Reuse and extend the existing seven-gate checker rather than introducing competing truth sources.
4. **Local verification runner:** Implement a single reproducible command that executes static validation, Node tests, integration tests and actual Chromium desktop/mobile journeys where available. Record commands, exit codes, source fingerprint and test evidence. Missing Chromium is a BLOCKED gate, never a pass.
5. **Adversarial checker tests:** Deliberately introduce controlled fixture failures (missing handler, fabricated rule source, corrupted save, absent Chromium evidence, stale source digest, incomplete workflow). Verify each is rejected without modifying production state.
6. **Release discipline:** Configure or document a development-branch-to-protected-main path with required checks and a Pages deployment dependency on accepted verification, subject to repository permissions and user's disabled-automatic-Actions constraint. Do not claim branch protection or deployment gating unless verified through GitHub settings/workflow evidence.
7. **Recovery and completion audit:** Prove interrupted-run recovery from checkpoint, produce an evidence-based matrix mapping every requirement to tests and files, and update runbook/incident ledger. Declare the control system complete only if all phases' acceptance evidence is present and independently checked.

## Mandatory operating loop for every implementation turn

- **LOAD:** Read this plan, queue, checkpoint, current HEAD and existing gates. Identify exactly one active phase and its unfinished acceptance items.
- **LOCK:** State internally the allowed file set and intended deliverables. Reject attractive unrelated tasks. Only expand scope for a documented dependency that blocks acceptance.
- **EXECUTE:** Implement the phase's full deliverable (code + integration + tests + persistence), not an isolated helper. Keep working through ordinary test failures.
- **PROVE:** Run available local tests, then adversarial cases; validate exact commit/source digest. No fabricated results. Where an environment/tool blocks testing, record the limitation and do not promote.
- **CHECK:** Compare against acceptance contract and phase queue; if incomplete, preserve the next action and continue instead of treating the phase as finished.
- **COMMIT:** Make coherent atomic changes after available pre-commit checks. Prefer a feature branch. Never silently change Actions triggers or claim deployment succeeded.
- **HANDOFF:** Persist checkpoint and evidence. A user-facing report is not a substitute for an acceptance gate.

## Anti-drift enforcement

- Stable phase IDs P1–P7 and explicit `activePhase`; a new phase cannot become active until the previous phase's evidence is verified.
- Every code change must cite a queue item; CI should reject changed files without a linked task/evidence manifest where technically feasible.
- A pre-report audit rejects closure when the phase has open required acceptance items. The audit is advisory for conversation termination (ChatGPT cannot be technically prevented from stopping), but mandatory for repository completion claims.
- No fake minimum lines-of-code threshold: substantial work is measured by accepted end-to-end behavior.
- Maintain `blocked` distinct from `passed`; external limitations are recorded with precise failed commands, missing permissions and next action.
- Do not rewrite history or lower test standards to manufacture green results.
- If HEAD differs from checkpoint, reconcile before editing. If source evidence is missing, fail closed rather than invent.

## Acceptance matrix

| Phase | Observable acceptance |
| --- | --- |
| P1 | Baseline and contradictions documented; queue IDs and existing controls reconciled |
| P2 | Restart/recovery test verifies exact active task, evidence and HEAD mismatch detection |
| P3 | Tests reject missing UI integration, absent persistence and unsupported rules provenance |
| P4 | Single runner produces reproducible pass/fail/blocked report with real Node and Chromium execution where available |
| P5 | At least six deliberate defect fixtures are detected; production files unaffected |
| P6 | Branch protection and deployment gating verified, or marked blocked with exact permission/workflow reason; no automatic Actions re-enabled |
| P7 | End-to-end interrupted-run recovery passes and independent requirement/evidence audit is complete |

## Reporting and stop conditions

Only report **what changed, what was executed, what passed/failed, what remains blocked, exact HEAD and next action**. Do not issue repeated low-value progress reports. Do not claim this plan is implemented because it is written down. Stop on genuine external execution constraints only after saving a recoverable checkpoint; conversational execution limits remain outside repository enforcement.

## Immediate next action

**P1:** inspect the current repository state, reconcile the pre-existing seven-gate checker with this plan, create the durable task queue and checkpoint schema, and add tests. Do not begin with unrelated Hero/enemy mechanics.
