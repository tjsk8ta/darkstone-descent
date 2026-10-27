# Development requirements and change-control process

## General principle
Read and preserve relevant user instructions, prior decisions, and their rationale. Never knowingly reintroduce a rejected interaction. If requirements conflict, clarify before changing behavior. Do not equate passing syntax validation with functional testing.

## Authoritative combat UX decision (2026-10-27)
**There is no target selection before rolling To Hit.** Press Attack when at least one enemy is within weapon range and line of sight. Roll all To Hit dice, allow permitted rerolls, and **then allocate individual successful hit dice among eligible enemies**. This is the only enemy target-selection stage. Hits may be split across multiple enemies. Critical-hit identity must be preserved. Roll damage for each assigned hit; apply Defense separately per noncritical hit; support allowed damage rerolls. Never automatically force all hits to an initial enemy. Movement arrows are replaced by contextual combat controls until resolution ends. No enemies in range/line of sight means no To Hit roll and no action spent.

## Known implementation defects / outstanding work
- Current index.html still selects an enemy before To Hit. This violates the authoritative requirement. Remove it in the next combat fix; do not portray current combat as correct.
- Current code auto-assigns hits to the initially selected enemy; this must be removed along with the initial-target dependency.
- Review all hit-allocation transitions, enemy deaths mid-attack, rerolls, and target eligibility.
- Mutation chart and some Growing Dread/Darkness effects are incomplete/prototype; do not claim complete rule fidelity.
- Mobile sticky map and touch behavior have not been browser-tested.

## Required change workflow
1. Read this file and inspect the current relevant source and state transitions.
2. Write a short behavior specification: initial state, user actions, legal outcomes, edge cases, and previously rejected alternatives.
3. Identify all related code paths (UI controls, event handlers, validation, rendering, persistence).
4. Implement the smallest coherent change without sacrificing existing rules.
5. Run syntax validation **and functional tests** for the changed flow. Test both happy paths and regressions; browser-test touch/mobile layout for UI changes when tools allow.
6. Confirm that previously rejected behavior is absent. If functional/browser tests cannot run, disclose that limitation and do not claim verification.
7. Commit with a descriptive message and report exactly what changed, what was tested, and what remains unresolved.

## Combat regression scenarios
- Zero eligible enemies: Attack disabled; no roll; action retained.
- One eligible enemy: Attack starts immediately with no prior selection; successful hits assigned only after rerolls.
- Two or more eligible enemies: To Hit roll occurs before any target selection; individual successful hits can be split among enemies.
- Natural 6: critical identity preserved; Defense ignored for that hit only.
- Multiple hits on same enemy: separate damage dice and separate Defense per hit.
- Grit rerolls: permitted To Hit and damage dice reroll with correct cost and once-per-die limits.
- Enemy dies while attack has unresolved hits: remaining hits can still be assigned to other eligible enemies.
- Attack completion: contextual controls disappear and movement arrows return.
- Dynamite: select and confirm a map tile; no pre-throw action expenditure on cancellation.
- Save/reload during pending combat: no duplicate rolls, lost allocations, or action reset.

## Definition of done
No claim of 'fixed' unless the implemented workflow matches the requirements, relevant regression scenarios pass, and any untested platform behavior is clearly disclosed.
