# Darkstone Descent

A mobile-friendly, single-player browser prototype inspired by *Shadows of Brimstone*. The application is **not yet a complete or rules-identical adaptation** of the original (2014) or revised (2020) core sets.

**Play:** https://tjsk8ta.github.io/darkstone-descent/

## Rules implementation

The game supports selecting City of the Ancients, Swamps of Death or both core sets, and choosing original or revised Threat-card inventories. Core combat includes hit allocation across multiple enemies, critical hits, individual damage rolls, Grit rerolls, Enemy Defense, Escape tests, initiative-ordered activation, and a growing collection of enemy abilities.

The physical **Peril die** uses the faces 3, 3, 4, 4, 5, 6. The shared Threat resolver handles independent Peril rolls, nested Threat cards, Elite Threat cards, enemy model caps, physical placement, and nested Fight-loot counting. When a rule or Enemy Record Sheet has not been verified, the engine is designed to record that limitation rather than claim that a provisional rule is official.

The publisher's 2014 and revised rulebooks reproduce the full **Tentacles** normal-side Enemy Record Sheet and its six Elite abilities. Those are the only complete core enemy normal-side records and Elite charts independently verified so far. Other enemy statistics and abilities remain provisional.

## Source verification

- [Official original rulebook (2014)](https://ffpgames.wordpress.com/wp-content/uploads/2014/07/sobs_rulebook_web_publish.pdf)
- [Official revised City of the Ancients rulebook](https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBCA_Rulebook_WEB.pdf)
- [Official revised Swamps of Death rulebook](https://www.flyingfrog.net/shadowsofbrimstone/pdf/REV__SBSD_Rulebook_WEB.pdf)
- [Publisher resources and FAQ](https://www.flyingfrog.net/shadowsofbrimstone/sobs_resources.html)

Community card inventories are useful for identifying card names and frequencies but are **not** a substitute for verifying the physical card faces or Enemy Record Sheets.

The machine-readable [completion gate](rules/completion.json) records every mandatory area, provenance status, unresolved rule, test requirement, and next action. Its `complete` field must remain `false` until every mandatory gate is verified.

## Testing

Run unit tests with Node.js 22 or later:

```sh
npm install
npm test
```

Run browser smoke and combat-flow tests using Chromium:

```sh
npx playwright install chromium
npm run test:e2e
```

GitHub Actions runs both suites on pushes. Tests include original/revised Threat-card parsing, Peril dice, model limits, checkerboard placement and connected-tile overflow, completion-gate validation, desktop/mobile startup and save recovery, and sequential hit allocation.

## Known incomplete areas

The remaining Enemy Record Sheets and Elite charts, OtherWorld variants, physical card-face verification, full original/revised hero classes, official map tiles, Darkness/Depth/Encounter/Growing Dread decks, scenario objectives, and some enemy special mechanics still require implementation and source verification. The prototype uses original artwork, map geometry and substitute content rather than reproducing proprietary assets.
