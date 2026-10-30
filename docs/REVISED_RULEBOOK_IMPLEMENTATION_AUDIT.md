# Revised Core Rules — implementation gap audit and delivery plan

Status: OPEN. Initial evidence-based baseline, 2026-10-30. Not a claim of complete page-by-page verification.

## Source of truth and method
- Flying Frog revised City of the Ancients rulebook: https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf
- Flying Frog revised Swamps of Death rulebook: https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBSD_Rulebook_WEB.pdf
- Publisher FAQ (v2.01, 2025) and token reference: https://www.flyingfrog.net/shadowsofbrimstone/sobs_resources.html
- Separate Adventure Books, character/starting-upgrade sheets, enemy normal/Brutal faces, and card faces are mandatory sources for their specific rules. A rulebook contents list does not verify individual cards.
- Implementation evidence: rules/completion.json, reference/completion-status.json, reference/enemy-record-sheets.json, rules/*.js, index.html and tests/. These completion files contain stale test/deployment observations; do not mistake them for current CI status.
- Classify each item as VERIFIED, PARTIAL, PROVISIONAL, ABSENT, or NOT YET AUDITED. A test that passes against a provisional constant is not rule verification.
- For each implementation task: capture publisher section/page, exact rule and exceptions, current code location, failing regression scenario, fix, local Node/Chromium results, GitHub CI and Pages results. Do not push untested speculative changes.

## P0 — functional core: playable expedition and combat
1. **Map-card-driven exploration and geometry** — PARTIAL. Prototype rooms/corridors and doorways exist; actual 18 Mine Map card faces, unique tile footprints, half-space connections, end caps, exploration-token distribution, and map-deck exhaustion are not comprehensively verified. Deliver: source-backed map/card data, graph invariants, mobile multi-room browser journeys. Rulebooks: Map Tiles, Map Cards, Exploration.
2. **Exploration tokens, clues, encounters, gates** — PARTIAL/PROVISIONAL. Third-clue objective and doorway resolution exist; all token outcomes, official encounter card effects, clue and mission-specific rules, gates and OtherWorld transitions do not. Deliver: deterministic event/state machine with unresolved effects blocking turn advancement. Rulebooks: Exploration, Encounters, OtherWorlds; Adventure Books.
3. **Turn sequence, Hold Back the Darkness, depth and Darkness cards** — PARTIAL. Verify activation ordering, doubles, Growing Dread, depth events, persistent Darkness effects, discard reshuffle, and end conditions against revised rules. Deliver: phase-specific tests and journal output. Rulebooks: Turn Sequence, Hold Back the Darkness, Darkness, Depth Track.
4. **Hero attack pipeline** — PARTIAL. Hit allocation, crits, Defense and Grit are implemented in part. Audit melee/ranged, line of sight, cover, attack-dice cap, revised dual wield, adjacent-enemy priority, all reroll timing and one-reroll-per-die, damage prevention and armor ordering, dynamite/splash, and attack action economy. Deliver: rules matrix and playable combat scenarios. Rulebooks: Combat, Re-rolls; FAQ v2.01.
5. **Enemy activation and positioning** — PARTIAL/PROVISIONAL. Path movement and some attack logic exist; verify targeting, ties, large/XL footprints, occupancy, ranged/flight/immobile movement, fear/terror, ambush, Escape, knockback, special attacks and group effects. Deliver: record-specific tests and combat encounter scenarios. Rulebooks: Enemy Movement, Enemy Attacks, Large Enemies.
6. **Threat decks and placement** — PARTIAL. Core threat inventory and nested/peril resolver exist, but card faces and full Elite/Brutal effects remain unverified. Verify exact original/revised edition card contents, deck mixing, OtherWorld decks, Wandering Enemies, shortage/Elite, ambush and placement. Deliver: audited card ledger and encounter-to-loot E2E tests.

## P1 — core content fidelity and persistent consequences
7. **Enemy record sheets and Elite/Brutal faces** — PROVISIONAL. rules/completion.json identifies Tentacle as the only fully publisher-verified normal record/chart; most other original/revised enemies and OtherWorld variants remain unverified. Source ledger currently demands 48 physical faces; obtain readable permitted evidence and keep missing values explicitly blocked rather than fabricated. Deliver per-face stat/ability provenance and executable test cases.
8. **All eight revised Hero classes** — INCOMPLETE. Three prototype classes exist; verify revised Hero sheets, starting equipment, personal items, three starting upgrades per class, unique abilities, sermon/faith and gunslinger ammo, skill limits, injury interactions and progression. Deliver character sheet UI and class-specific integration tests.
9. **Loot, Scavenge, Gear and Artifacts** — PARTIAL/PROVISIONAL. Verify deck draw/discard/reshuffle rules, capacity, item keywords, equipping, Side Bag, scavenged markers, bonuses, money/Dark Stone, loot per Fight and item effects. Deliver item inventory and deterministic deck tests.
10. **Damage, sanity, conditions and recovery** — PARTIAL. Verify defense/armor/willpower, fear/terror, poison, corruption/mutation, KO, Revive, wounds, injury and madness tables, heal timing and cross-mission persistence. Deliver lifecycle tests.
11. **Official mission structure and boss encounter** — PROVISIONAL. Current third-clue guardian is explicitly an approximation; implement official missions and Epic Threat/Growing Dread resolution from the relevant Adventure Book, with victory/failure conditions and rewards.
12. **OtherWorlds: Targa and Jargono** — INCOMPLETE. Implement world effects, map cards, encounters, threats, artifacts, gates, variants and return transitions with source-backed data.

## P2 — campaign and long-tail mechanics
13. **Between-mission campaign and Frontier Town** — INCOMPLETE. Character XP/levels, revised skill trees, injury/madness recovery, town visits, buying/selling, travel hazards, upgrades and mission selection need publisher source comparison and persistent save tests.
14. **Optional rules and FAQ/errata overlay** — NOT YET AUDITED. Treat optional rules as configurable, never silently mandatory. Incorporate current FAQ v2.01 and token reference, including corrections to revised rules; track precedence and edition applicability.
15. **Deck and card-face coverage** — INCOMPLETE. Rulebooks enumerate City and Swamp Mine Map, Gear, Artifact, Encounter, Darkness, Growing Dread, Loot, Scavenge, Personal Item, OtherWorld and Threat decks. Verify actual card text/frequencies against authorized evidence; inventory counts alone do not establish functional coverage.
16. **Solo adaptation policy** — NOT YET AUDITED. The official game scales with hero count; record each deliberate solo deviation separately from bugs and publisher mechanics. Avoid implying house rules are revised rules.
17. **Accessibility and journal fidelity** — PARTIAL. Test mobile door interaction, touch targets, map pan/zoom, journal outcomes, no missing prompts, and resumed modal/pending-attack state across reload.
18. **Save Integrity Lock and release gating** — PARTIAL. Primary/backup readback and explicit recovery exist; test every mutating entrypoint, pending encounters, storage exhaustion, partial writes and actual reload. Prevent deployment of unverified commits if feasible without disabling tests. Keep the seven-gate release checker fail-closed.

## Delivery order and acceptance
- **Sprint A (P0)**: audited turn/phase model, map+door exploration, threat-to-combat-to-loot vertical slice, mobile Chromium multi-room scenario, recovery.
- **Sprint B (P0)**: combat and enemy activation matrix, verified enemy faces where available, Elite/Brutal and special ability coverage.
- **Sprint C (P1)**: all Hero classes and inventory/gear, conditions, encounter and card effects.
- **Sprint D (P1)**: official missions, OtherWorlds, full card decks and final fights.
- **Sprint E (P2)**: progression, Town, FAQ/optional variants, solo-policy, comprehensive scenario and persistence acceptance.
- Every sprint ends with a single tested atomic commit where possible, latest-HEAD Node and Chromium CI passing, Pages verified, and unresolved source gaps recorded. No green CI result is equivalent to game-complete acceptance.
- Prioritize acquiring legitimate physical card/record-sheet evidence; rulebook PDFs alone cannot certify the full card-driven game.

## Immediate next executable tasks
1. Expand this matrix into a rule-by-rule source-page ledger, distinguishing common revised core rules from City/Swamp-specific sections and Adventure Book material.
2. Inventory every active game mechanic and flag provisional constants; reconcile contradictions between rules/completion.json and reference/completion-status.json.
3. Implement an end-to-end expedition acceptance path (door -> reveal -> token -> Threat -> enemy placement -> combat -> loot -> save/reload), using official evidence for each transition.
4. Audit revised combat mechanics, particularly dual wield, rerolls, damage prevention and attack caps, against both publisher rulebooks and FAQ v2.01.
5. Acquire and verify outstanding record sheets and card faces before coding guessed values.
