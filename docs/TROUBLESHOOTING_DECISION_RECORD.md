# Troubleshooting decision record — evidence, alternatives, and repeat-failure prevention

Established 2026-11-01. Applies to Darkstone Descent engineering and GitHub verification. This is a durable operational record, not a claim that the assistant's underlying model has been retrained.

## Incident: repeated false "GitHub testing is impossible" conclusion

**User's actual objective:** repair underlying gameplay and CI defects autonomously, with source-grounded rules and real Node/Chromium tests; do not require the user to trigger workflows or repeatedly give permission. Avoid needless failing-workflow emails. Do not treat assistant-authored continuation buttons as independent user requirements.

**Failure pattern:** repeatedly attempted or described only the existing `workflow_dispatch` route; when the connector did not expose dispatch and the local environment lacked a checkout/network access, declared testing blocked. Repeated status-only responses and recommendations for user action. Also mistook a self-authored manual-only workflow constraint for a user requirement. These were reasoning/search failures, not proof that all testing routes were unavailable.

**Root causes to distinguish:**
1. Connector operation gap: no direct GitHub workflow-dispatch action; this does **not** prevent GitHub from running workflows on a push.
2. Local environment: inability to clone/execute locally; this does **not** preclude using a GitHub-hosted runner.
3. Repo CI trigger disabled by commit `5faa5e212`: `verify.yml` removed main push trigger. This explained absence of automatic verification, **not** gameplay bugs.
4. Obsolete assertion in `tests/brutal-gameplay.test.cjs`: checked the old `cellAt && visibleAt && !occupied` expression after the implementation moved to `DarkstoneEnemyPlacement.ambushSpaces` plus `canPlaceEnemyFootprint`.
5. Control-system checker in `scripts/control-plan-check.cjs`: encoded automatic CI as forbidden, so restoring push CI initially made the Node suite fail. The associated test reinforced the obsolete constraint.
6. GitHub Pages deployment can pass independently of Node/Chromium verification. Do not infer game correctness from Pages success.

## Successful alternative route — reproduce before declaring blocked

1. Use GitHub connector to inspect the current exact main SHA and workflows.
2. Create an isolated branch from that exact SHA, e.g. `repair/exact-head-verification-20261101`.
3. Commit a branch-only `push`-triggered workflow that runs `npm test` and `npm run test:e2e -- --reporter=line,html` with Chromium installed. A branch push is a legitimate execution route even without a workflow-dispatch connector.
4. Read actual Actions run/job logs; distinguish failures in product code, harness assertions, source-data provenance, and orchestration.
5. Make minimal evidence-based fixes on the isolated branch, rerun both suites, then apply verified changes to main.
6. Restore automatic main push verification when supported by passing evidence, and update contradictory control tests together.
7. Verify **latest** main SHA Node, Chromium, final workflow gate and Pages separately; record run IDs. Avoid speculative repeated pushes.

**Verified evidence (2026-11-01):**
- Branch workflow commit `62c54b40`, run [41284800375](https://github.com/tjsk8ta/darkstone-descent/actions/runs/41284800375): 283/284 Node passed; obsolete Ambush assertion failed.
- Branch fix `e1dc70b9`, run [41284846373](https://github.com/tjsk8ta/darkstone-descent/actions/runs/41284846373): full Node and Chromium suites passed.
- Main fix `08de3e9a`, restored main push trigger `c218200f`; first main run [41284916836](https://github.com/tjsk8ta/darkstone-descent/actions/runs/41284916836) had 283/284 Node passed and 26/26 Chromium passed, failing the final gate because control-plan validation rejected automatic Actions.
- Control checker corrected `283098e5`, regression updated `da70e33e`. Latest main [run 41285008238](https://github.com/tjsk8ta/darkstone-descent/actions/runs/41285008238): full Node and Chromium suites and final verification gate **passed**; [Pages 41285008133](https://github.com/tjsk8ta/darkstone-descent/actions/runs/41285008133) **passed**.
- Passing tests establish tested behavior only, **not** complete gameplay/rules coverage.

## Mandatory problem-solving protocol

**A. Define the actual problem before selecting a tool.** Separate desired outcome, symptoms, evidence, constraints, and unknowns. Trace a failure to its first failing assertion and affected state transition; never conflate test harness, gameplay, workflow, account notifications and deployment.

**B. Generate multiple viable approaches.** Before declaring a blocker, assess at least:
- direct connector action or API read/write;
- alternate event trigger (isolated branch push, PR, other existing workflow);
- exact checkout on an available runner, instead of requiring local clone;
- existing run logs/artifacts and historical good/bad commit comparison;
- isolated code/test fix and a verification branch;
- separate operational controls (notification settings vs workflow YAML).
For each, note why it is available, unavailable, unsafe, or unverified. Never stop after only one failed avenue.

**C. Challenge a claimed impossibility.** Ask: is this an intrinsic limitation or merely a limitation of the specific route tried? Search available tools and their schemas again. An inability to dispatch is not inability to run CI; lack of local network is not lack of remote runners.

**D. Track provenance of constraints.** Distinguish explicit user instructions, assistant-generated continuation text, repository historical configuration, and inferred preferences. Do not turn the latter three into user commands. Reconcile conflicts against the user's underlying goal.

**E. Fix root causes, not cosmetic symptoms.** Do not disable tests to suppress notifications, remove meaningful assertions to turn CI green, or make a speculative code change solely to show activity. A test may be updated when its asserted implementation shape is obsolete, but preserve behavioral checks and explain why.

**F. Close the loop with evidence.** Commit ID, exact tested SHA, test commands, counts, run URL, failed assertion, corrective diff, rerun result, and deployment state. Explicitly separate historical failed runs from latest HEAD. Preserve unknowns and pending acceptance gates.

**G. Communicate only meaningful milestones.** Do not repeatedly announce blockers, restate intentions, ask the user to do available work, or claim a fix from a commit alone. If no route works, provide the attempted alternatives and precise tool-level errors, not a generic impossibility claim.

## Future incident template

- Date / repository / current SHA:
- User-originated goal and constraints (source and provenance):
- Observable symptom and reproduction:
- First failure, run/job ID, logs, source evidence:
- Hypotheses (at least two) and how distinguished:
- Alternative routes considered, with availability/reasons:
- Root cause (verified vs hypothesis):
- Code/test/workflow correction and commit:
- Exact Node/Chromium/Pages evidence:
- Remaining unknowns and next autonomous action:
- Prevention control or regression added:

## Remaining caution

Automatic push CI is restored, so future failures can again generate GitHub notification emails; email preferences are account-level and not controlled by the workflow file. A clean CI run is not proof that unresolved rule fidelity, mobile UX or save-recovery edge cases are complete. Use branch verification for speculative changes and avoid repeated untested pushes to main.
