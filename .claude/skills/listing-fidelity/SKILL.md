---
name: listing-fidelity
description: How to match a UI element to the reference page exactly. Use when building or adjusting any visual part of the listing clone.
---

# Matching an element to the reference

1. Find the element in `docs/reference/page.pretty.html` and note its class names. They're obfuscated,
   which is fine — they're only a lookup key.

2. Grep those class names in `docs/reference/styles.css` and copy every rule across into the component's
   CSS module under a semantic name: the base rule, `:hover`, `:active`, `:after`, transitions, media
   queries. Swap in a token from `src/styles/tokens.css` wherever one holds the identical value.

3. Copy and data go in `src/data/listing.ts`. Icons come from `icons.generated.ts` — if the icon is new,
   add it to the name list in `scripts/gen-icons.py` and run `npm run icons`.

4. Build the interaction on a real button or link. Overlays go through `useOverlay`, URL state through
   `useOverlayHistory`. `docs/reference/BEHAVIOUR.md` records what the reference actually does and how
   long it takes.

5. Run `npm run verify`. The geometry diff has to come back with no differences and the keyboard tests
   have to pass.

6. Run the `fidelity-reviewer` and `a11y-auditor` agents, fix what they report, and verify again.
