# Darkstone Descent — development guidance

## Priority
Improve the playable game. Fix actual gameplay defects, implement source-verified Shadows of Brimstone mechanics, and test complete player journeys. Do not resume the abandoned P1–P7 development-control programme or its seven-gate release/stop framework. Old planning and incident records are not authoritative.

## Working method
1. Establish the current user objective and reproduce the observed failure before selecting a tool or solution.
2. Inspect relevant source, game state, rules provenance and existing tests. Distinguish confirmed facts from hypotheses.
3. Investigate plausible root causes and alternative routes; a failed method does not establish that the objective is impossible.
4. Make the smallest coherent fix across UI, rules, state, journal and persistence as applicable.
5. Verify using actual Node tests and Chromium journeys, including mobile/door/combat/save flows when affected. Do not equate green CI with complete rules fidelity.
6. Preserve existing verified mechanics and regression tests; record unresolved source gaps without inventing official rules.
7. Commit coherent, tested changes and report outcomes, evidence and remaining limitations concisely.

## Game-specific requirements to preserve
- Attack rolls precede target allocation. Assign individual successful hits (including criticals) across eligible enemies, with Defense applied separately to noncritical hits.
- Unexplored doorways reveal tiles at the correct rules-defined interaction; never charge movement for blocked moves.
- Enemies must spawn and activate correctly, with reachable exploration, reliable journal outcomes and safe save/reload.
- Maintain original/revised edition distinctions and trace enemy records, cards and abilities to inspected sources.
- Preserve automatic main-branch Node and Chromium verification and separate GitHub Pages deployment.

## Sources of truth
The playable source and executable behavioral tests are primary for implementation state. The official rulebooks and inspected game components are primary for game rules. `rules/completion.json`, enemy-sheet audit and source-linked implementation ledger identify incomplete content; they are **not** instructions to halt development. Historic incident notes, abandoned checklists and unverified plans must not override current evidence or user requirements.
