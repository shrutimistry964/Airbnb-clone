# Working notes

A desktop clone of a vacation-rental listing page and its two overlays, the Photo Tour and the
Lightbox. Vite + React 18 + TypeScript (strict) + CSS Modules, no backend. "Save" persists to
localStorage; overlay state lives in the URL (`?modal=PHOTO_TOUR_SCROLLABLE&modalItem=10xx`).

## The reference is the source of truth

`docs/reference/` holds the captured reference: `styles.css` is its stylesheet, `page.pretty.html` its
DOM, `svgs.json` its icons, `extracted.json` its content, `measure/ref-1200.txt` the bounding box of
every element, and `BEHAVIOUR.md` the interactions and timings observed on the live page.

Match those. Don't guess a value that can be read. Where the clone deliberately differs it's listed in
`BEHAVIOUR.md` — add to that list rather than deviating quietly.

## Commands

```
npm run dev        dev server on :5173
npm run build      type-check and build — must pass before finishing anything
npm run measure    geometry diff against the capture — must report no differences
npm run a11y       keyboard and focus tests for the overlays — must all pass
npm run verify     all three
npm run icons      regenerate icons.generated.ts from the captured SVGs
```

## Layout

- `src/data/listing.ts` — all content and copy. Components don't hard-code either.
- `src/styles/tokens.css` — colours, fonts, shadows, easing, durations.
- `src/styles/global.css` — reset, font-face, skip link, `.container`, keyboard-only focus rings.
- `src/hooks/useOverlay.ts` — the only implementation of scroll lock, focus trap, Escape and focus
  restore. Every modal surface uses it; don't re-implement focus handling in a component.
- `src/hooks/useOverlayHistory.ts` — the only place that touches the URL or history.
- `src/components/` — a component and its CSS module side by side. Class names are semantic; each rule
  mirrors one in `docs/reference/styles.css`. Two modules are shared and have no component of their
  own: `shared.module.css` for reused buttons, `Sections.module.css` for section layout and headings.
- `src/components/icons.generated.ts` — generated. Edit `scripts/gen-icons.py` and rerun instead.

## Conventions

Interactive elements are real buttons and links, reachable by Tab, with a visible focus ring.

Overlays stay mounted and toggle an `open` class the way the reference does, so transitions run in both
directions; `aria-hidden` follows the same state.

Motion uses the `--ease-*` and `--t-*` tokens and respects `prefers-reduced-motion`.

Before calling a task done: `npm run verify`, then the `fidelity-reviewer`, `a11y-auditor` and
`code-structure-reviewer` agents, then fix what they find.
