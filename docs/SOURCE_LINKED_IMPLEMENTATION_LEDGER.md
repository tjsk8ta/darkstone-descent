# Source-linked implementation ledger — 2026-10-30

This ledger records only code actually changed in commit following ed7b0fd5; it is not a full completion certificate.

| Rule | Source | Implementation | Verification | Unresolved |
| --- | --- | --- | --- | --- |
| Create a Hero: one free Side Bag token, choose Bandages/Whiskey/Dynamite/Tonic; capacity 5 | Flying Frog Revised City of the Ancients Rulebook p.7, Creating a New Hero; https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf | rules/hero-inventory.js; setup choice and persisted profile starting token in index.html | tests/hero-inventory-placement.test.cjs | Character class sheets, Starting Gear cards, Personal Item deck, class Starting Upgrades, tonic use and complete item equip UI unverified. Existing prototype starting supplies remain and are not fully reconciled with Side Bag inventory. |
| Enemy groups placed in reverse Initiative order, random tie ordering | Flying Frog Revised City Rulebook p.24, Placing Enemies on the Board | rules/enemy-placement.js orderGroups/orderTypes; threat and final encounter placement in index.html | tests/hero-inventory-placement.test.cjs | Large/XL bases and exact map half-spaces; prototype room geometry and missing enemy records |
| Ambush enemies placed adjacent to Hero when valid | Flying Frog Revised City Rulebook p.24, Ambush Attacks; https://www.rulespal.com/shadows-of-brimstone-city-of-the-ancients/rulebook | rules/enemy-placement.js ambushSpaces; prototype spider Ambush event invokes it | tests/hero-inventory-placement.test.cjs | Multiple Hero target balancing; +2 Initiative and full mid-turn ambush activation timing; model shortage |
| Frontier Town lifecycle preconditions | Flying Frog Revised Swamps Adventure Book p.31, End of the Day; https://flyingfrog.net/ShadowsOfBrimstone/pdf/REV__SBSD_AdvBook_WEB.pdf | rules/town-phase.js from prior commit | tests/town-phase.test.cjs | Town events, travel chart, price tables and event outcomes remain provisional; leaving-town timing not fully implemented |

**Release gate:** Source-backed general mechanics do not authenticate missing card faces or Hero/Enemy record sheets. Continue fail-closed for unknown effects and keep gameplay marked prototype until fully integrated.
