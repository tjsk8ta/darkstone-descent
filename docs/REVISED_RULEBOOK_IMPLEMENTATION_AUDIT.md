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


## Expanded revised-rulebook checklist — 2026-10-30 source discovery

**Evidence caveat:** This is a systematic section-level backlog extracted from the revised City rulebook table of contents and checked against the Swamps rulebook's equivalent rule categories. It is not yet a page-by-page assertion that every mechanic has been implemented or tested. Items marked [ ] remain unaccepted, even if some prototype behavior exists. Reference: https://www.rulespal.com/shadows-of-brimstone-city-of-the-ancients/rulebook and https://www.rulespal.com/shadows-of-brimstone-swamps-of-death/rulebook (readable rulebook transcriptions; cross-check original Flying Frog PDFs before acceptance).

### 1. Foundation, dice, cards and setup
- [ ] D6/D3/D8/Peril rolls, independent dice, one reroll per die, Grit reroll spending and recovery at max Grit.
- [ ] Keywords, icons, Remains in Play, card discard and reshuffle rules; separate draw/discard state per deck.
- [ ] New Hero sequence: choose class; starting items; random Personal Item; choose Starting Upgrade; class-specific cards; Side Bag and free token; name; persist all choices.
- [ ] Revised City U.S. Marshal, Saloon Girl, Gunslinger, Bandido record sheets; revised Swamp Indian Scout, Rancher, Preacher, Lawman sheets. Each requires base stats, starting equipment, three upgrades, class mechanics and skill trees.
- [ ] Hero-count scaling, Threat deck construction, cooperative-versus-solo adaptations, Basic Game versus full rules, mission-specific setup.
- [ ] Physical model counts, Hero/Enemy sheets, card inventory and tokens must be separately source-verified; a deck count is not a card effect.

### 2. Turn structure, initiative, movement, search and exploration
- [ ] Full turn phase sequence: Hold Back the Darkness, initiative-ordered activations, room exploration, end-of-turn and Fight-specific exceptions.
- [ ] Hold Back the Darkness threshold, doubles, Darkness movement, Depth-track interactions, Blood Spatter, Growing Dread, Depth Event and end conditions.
- [ ] Hero Move roll, natural 1 Grit recovery, extra Grit D6, movement points, walls, diagonals, valid >=half-spaces, puzzle connection counted as both tiles.
- [ ] Old Lantern and Voices in the Dark, Searching versus attacking, one search/action restriction, Scavenge counts and markers.
- [ ] Look Through Door: stand on half-space; draw Map Card; green-arrow entrance; rotate alternate entrances; discard failed first tile; after second failed placement cap door; depth and +5 XP; no searching during Fight.
- [ ] Rooms versus passages, exploration token placement and reveal timing, Door/Gate symbols, Clue/Encounter/Attack/Growing Dread tokens, objective trigger and multiple outcomes.
- [ ] Card-specific Encounter skill tests, hero selection, multiple simultaneous encounters, optional Advanced Encounter for unique rooms, world-specific Encounter decks.

### 3. Enemy setup, Threat resolution and Fight
- [ ] Attack token Threat tier, nested card draws, Peril counts, mixed Enemy Types, Epic Threats, model shortage, free Elite, duplicate Elite results.
- [ ] Enemy placement in reverse Initiative order (slowest first), farthest-from-entrance checkerboard, valid doorway half-spaces, overflow onto connected tiles, large/XL bases and model blocking.
- [ ] Ambush Attack placement and enemies appearing mid-turn; when they activate and whether they are allowed immediate attacks.
- [ ] Enemy Type activation order, ties, target selection, staying on target, switching targets, occupied-path movement, immobile, ranged and extra-large rules.
- [ ] Enemy To Hit, defense, wounds, Sanity damage, Fear/Terror/Unspeakable Terror and their timing; KO and enemy-specific innate effects.
- [ ] Hero Escape tests, no Searching during Fight, attack action and Free Attacks, melee versus ranged, line of sight, adjacent enemy priority.
- [ ] To Hit rolls, assigning hits across enemies, damage dice and modifiers, Defense versus criticals, Armor, wounds/XP per wound, death/kill rewards.
- [ ] Revised Hero attack dice limit and dual-wield ranged weapons: verify exact restrictions against revised rulebook/FAQ, do not propagate unsupported critical-hit claims.
- [ ] Catch Your Breath, KO recovery and Loot draws after Fight; ensure nested Threats count as one Fight and loot cap correct.

### 4. Survival, inventory and conditions
- [ ] Health, Sanity, Wounds, Horror/Terror Hits, Defense/Willpower, Armor/Spirit Armor, KO, Revive and healing.
- [ ] Corruption resistance, Mutation roll and death, Dark Stone corruption between adventures, persistent injury and madness.
- [ ] Status effects: Poison, Void Venom, duration, stacking and clearance; expand to every card/record-specific condition.
- [ ] Gear/Artifacts: Hand slots, carrying weight, keyword restrictions, Clothing slots, limited-use items, Personal Items, Dark Stone symbols, trading, upgrades and Side Bag.
- [ ] Loot/Scavenge/Artifact deck effects, money and Dark Stone acquisition, discard and reshuffle, item activation timing and persistent inventory.

### 5. OtherWorlds, missions and campaign
- [ ] Gate icons and end caps; Looking Through Gate, World Card draw, OtherWorld map deck and terrain, break in map, exploration token on other side.
- [ ] Movement/line of sight through gates, adjacent tiles across worlds, world-specific Encounter/Depth/Ambush interactions.
- [ ] World global rules, Targa Plateau/Pylons, Jargono and respective artifacts, threats, maps, enemies and missions.
- [ ] Official Adventure Book missions, starting conditions, special tokens, objectives, clues, boss/Epic Threat and success/failure rewards; remove placeholder final guardian when official logic is verified.
- [ ] End-of-adventure sequence, Dark Stone corruption, injuries/madness/death, town travel and town stay, start-of-next-adventure sequence.
- [ ] Frontier Town locations and reference charts: town size, travel hazards, events, day limits, visits/actions, buying/selling, item availability, services, healing, resurrection and campaign economy. Adventure Book/reference charts are necessary sources.
- [ ] Level-up XP thresholds, class skill trees, upgrades, restrictions and campaign persistence.

### 6. Optional rules, edition differences, and release
- [ ] Fixed Hero Move; Advanced Encounters; Below the Darkness; Hard-Core; Themed Threat Decks; Dangerous Dynamite — each separately selectable, never silently enabled.
- [ ] Apply official FAQ v2.01 and token reference v1.01 with section-specific errata and source trace.
- [ ] Edition-aware card effects, revised starting upgrades, enemy Elite/Brutal sheets and town locations; do not use original-era data as revised without confirmation.
- [ ] Verify mobile UI, map/journal/door prompts, no unreachable spaces, pending choices, save/reload, and no state mutation after save failure.
- [ ] Acceptance requires source provenance, executable rule-specific tests, multi-chamber Chromium play, latest-HEAD CI and Pages success. Keep completion=false until complete.

## Online asset/source investigation

| Material | Found online | Sufficiency | Next use |
| --- | --- | --- | --- |
| Revised City and Swamp rules | Official Flying Frog PDFs; readable RulesPal transcriptions | High for general mechanics; verify precise text against publisher | Build executable common-rule matrix |
| FAQ and token descriptions | Publisher resources, FAQ v2.01 (2025-10-24), token reference v1.01 (2025-11-06) | High for FAQ/token definitions | Apply corrections and token semantics |
| Mine map-card inventory | Revised City rulebook enumerates 18 Mine Map Cards, 1 Entrance, 8 Unique Room, 4 Standard Room, 6 Passage | Counts only, not every tile/card face | Build exact geometry ledger |
| Physical map geometry | https://github.com/templebay33/brimstone_reference/blob/main/map_tiles.md | Useful fan transcription of Entrance and common passages, with some expansion rooms; incomplete City/Swamp unique rooms | Cross-check common passage geometry against original photos; do not mark publisher verified |
| Core map/card inventory | BoardGameGeek core-set component inventories; community list of nearly everything | Useful names and counts, not effects | Reconcile physical card list and edition |
| Card-face effects, Exploration tokens, Encounter text | Rulebooks explain the systems; individual complete core card-face sets not established from this search | Insufficient for exact card-by-card fidelity | Continue public authorized image/file searches; request photos later only for unresolved entries |
| Hero/Enemy faces and Adventure Book charts | Official product descriptions and rulebook examples; incomplete physical record/card coverage | Insufficient for full implementation | Seek publisher Adventure Book PDFs, downloadable class sheets and permitted photos; mark missing entries |

**Source discovery outcome:** Online resources are sufficient to implement a large amount of the core mechanics now. Missing card faces are *not* a reason to postpone turn sequence, geometry, enemy movement/placement, character creation, inventory architecture, town lifecycle or campaign state. Keep missing individual card/record values as explicit data gaps instead of invented official values.

## Execution priority (correcting earlier overfocus on CI)
1. First build the rule-engine foundations and tests for movement/placement, turn sequence and legal actions.
2. Then complete Hero setup and item slots, with saved inventory and persistent upgrades.
3. Implement town/travel/campaign phases from rulebook and Adventure Book sources.
4. Expand verified map geometry, Exploration tokens, Encounters, Darkness, Loot and other card effects as authorized sources are found.
5. Complete enemy record-sheet abilities, missions, OtherWorlds and long-tail optional rules; verify real browser expeditions.
6. Treat CI reliability as a necessary quality gate, **not** the development objective. No repetitive documentation-only pushes without meaningful new evidence.
