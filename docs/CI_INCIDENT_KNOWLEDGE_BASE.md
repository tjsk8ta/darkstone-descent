# CI incident knowledge base and remediation roadmap

Updated 2026-10-30. Repository: tjsk8ta/darkstone-descent.

## Confirmed findings (distinguish past failed runs from current head)
- At commit 48124c2, GitHub Actions run #182 (41064931926) FAILED. Unit tests passed; one Chromium test failed: `tests/browser.spec.cjs` at its attack-button centre hit-test. It was a *real historical failure*; GitHub's email is a durable notification and is not rescinded when a subsequent commit succeeds.
- At commit f8a7161, run 41064528080 FAILED: unit tests passed; same Chromium pointer hit-test failed.
- At commit 9da69d7, run 41063935648 FAILED: four VM harness unit tests in portal-authority and two Chromium tests. These are different failure classes; do not treat them as a single generic UI defect.
- At commit 46a22aa, run 41059877048 FAILED: two nested Threat-tier unit tests and four Chromium tests.
- At commit 75e9739, run 41065222586 PASSED all unit tests and real Chromium tests. Attack-button test was amended to scroll into viewport before hit-testing. That is an important root-cause clue: a centre point outside the viewport produces a null or unrelated element from `document.elementFromPoint`, which does not prove the button is covered.
- At commit 27ffccc7, run 41065333206 PASSED; corresponding Pages run 41065333246 PASSED. This commit added pointer hit-test diagnostics. Current verification/deployment is therefore green as of this investigation.
- GitHub Actions notifications are a separate *account-level notification setting*, not the workflow YAML. A failing push can trigger email even if the next push succeeds. The repository GitHub integration available here does not expose the account's notification preferences. Do not claim emails are disabled simply because the workflow has no email action.
- `.github/workflows/verify.yml` runs on EVERY push to main and allows individual test steps to continue on error so it can upload artifacts, but the final gate explicitly fails if either unit or Chromium test outcome is not success. This is intentional and not an email-sending instruction. `concurrency.cancel-in-progress: true` causes rapid successive pushes to cancel earlier runs, creating additional noisy run history.
- The GitHub Pages workflow also runs on push and can succeed while test verification fails: deployment success alone is NOT a quality gate.

## Root causes: separate problems
1. Development discipline: commits were pushed before complete local unit + Chromium acceptance, using CI as a debugging loop. This generates genuine failure emails and needless cancelled runs.
2. Specific UI test defect: checking `elementFromPoint` without first ensuring the button is scrolled into viewport misdiagnosed a viewport/scroll problem as CSS occlusion. Fix: scroll into view; preserve pointer test; on failure log target rect, viewport, actual element, and overlay state.
3. Account notifications: GitHub emails originate from GitHub's notification subscription for workflow failures. No repo code change can retroactively suppress already-sent mail. Account-level Actions email preference must be changed by the account owner or via an authorised account-settings integration.
4. Frequent commits: each push to main starts verification and Pages workflows. More speculative patches mean more potential failed-run emails.

## Roadmap and acceptance gates
A. Maintain this incident ledger; for any new failure record commit SHA, run/job ID, first failing assertion, evidence, root cause, code change and verified outcome. Compare with previous failures before editing.
B. Before each push, reproduce with `npm test` and `npm run test:e2e` using installed Chromium, preferably a local browser trace. If browser execution is unavailable in the tool environment, say so and DO NOT claim local acceptance; batch changes and minimise pushes.
C. Separate flaky test/harness defects from real game logic defects. Never weaken a meaningful assertion just to make CI green. Preserve source-grounded rule checks.
D. Prefer changes on a feature branch + PR verification, merge only after green. This reduces unverified changes to main but PR failures can still generate notifications; account settings are a separate remedy.
E. Keep automated verification active. Do NOT disable tests to suppress emails. Consider gating Pages deployment on successful verification as a separate improvement; Pages currently deploys independent of tests.
F. In GitHub personal Settings > Notifications > System > Actions, disable email delivery for Actions workflow notifications if the owner wants no failure emails. Verify using GitHub's current UI. This action cannot be performed through the present repository-scoped connector.
G. Final acceptance: latest HEAD unit tests green, Chromium E2E green, Pages green, no uninvestigated failures on latest HEAD; report historical failed-run notifications as historical. Gameplay/rules completeness requires separate scenario-level acceptance and cannot be inferred from CI alone.

## Incident table
| Commit | Verification | Failure category | Outcome |
|---|---|---|---|
| 46a22aa | 41059877048 | nested Threat tier + Chromium | failed, superseded |
| 9da69d7 | 41063935648 | VM saveFailure binding + Chromium | failed, superseded |
| f8a7161 | 41064528080 | Chromium attack hit-test | failed, superseded |
| 48124c2 | 41064931926 (#182) | Chromium attack hit-test | failed, superseded; screenshot email |
| 75e9739 | 41065222586 | all verification | passed |
| 27ffccc7 | 41065333206 | all verification | passed; Pages 41065333246 passed |
