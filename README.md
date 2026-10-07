# Listing page clone

A desktop clone of the listing page at https://airbnb-clone-umber-two.vercel.app, including its two
overlay views — the Photo Tour and the Lightbox.

Live: https://stay-clone-indol.vercel.app

Built with Vite, React 18, TypeScript and CSS Modules. There's no backend. Content is a typed data
module, "Save" persists to localStorage, and the overlays keep their state in the URL the same way
the reference does (`?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1004`).

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check and build into dist/
npm run verify    # build, then the geometry diff and the keyboard/focus tests
```

Deploying is `npx vercel` from this directory, or importing the folder in the Vercel dashboard with
the Vite preset. Nothing needs configuring.

## Matching the reference

The reference sits behind bot detection, so scraping it was out. It was opened in an ordinary browser
instead and captured from there: the full stylesheet, the DOM, all 72 inline SVG icons, the variable
font, every photo, and the bounding box of every element on the page. That capture is in
`docs/reference/`, and the build is derived from it rather than from guesswork:

- every rule in `src/components/*.module.css` corresponds to a rule in `docs/reference/styles.css`;
- icons are generated from the captured SVGs by `scripts/gen-icons.py`, so the paths are identical;
- `npm run measure` renders the clone headlessly at the viewport the reference was captured in and
  diffs ~350 bounding boxes against `docs/reference/measure/ref-1200.txt`. It currently reports no
  differences. The Photo Tour and Lightbox were measured the same way and also match.

Behaviour was harder — the reference's JavaScript is minified past reading, so interactions, timings
and easings were observed by driving the live page and are written up in `docs/reference/BEHAVIOUR.md`.

## What's built

The listing page has the header and search pill, the title row with Share and Save, the five-tile hero
grid, and a two-column body: guest-favourite badge, host row, highlights, a clamped description,
"Where you'll sleep", the amenities grid and its full dialog, a two-month calendar, and a sticky
booking card. Below that run reviews (laurels, the rating breakdown, chips, clamped review text), the
location map, Meet your host, Things to know, and a paged "More stays nearby" carousel. A section nav
slides in once the hero scrolls away and tracks whichever section you're in.

The Photo Tour is a full-screen overlay that slides up. "Show all photos" opens it at the top; a hero
tile opens it positioned at that photo's room. Room thumbnails scroll to their section.

The Lightbox fades in over the tour. Arrow keys and the prev/next buttons move through 43 photos and
disable at either end — the reference doesn't wrap, so neither does this. The room name and an "n of 43"
counter sit in the bar, and `modalItem` tracks the current photo in the URL.

Overlays push history, so the browser Back button closes them in the right order and a pasted URL opens
straight to the right photo.

### Accessibility

One hook, `useOverlay`, gives every overlay its scroll lock, focus trap, Escape handling and focus
restoration, so the behaviour can't drift between them. Dialogs are labelled and mirror their state in
`aria-hidden`, the photo counter is announced, focus rings appear for keyboard users only, and
`prefers-reduced-motion` is honoured. `npm run a11y` covers the tour → lightbox → dialog flows in 19
checks.

### Where this deviates from the reference

A few things in the reference are inert or unreachable by keyboard. Those are improved rather than
copied, and each one is listed in `docs/reference/BEHAVIOUR.md`: the section-nav links actually scroll,
focus moves into overlays and returns to the opener, the tour's Share and Save mirror the page's, and
an out-of-range `modalItem` falls back to the tour instead of rendering an empty frame. Nothing visual
differs.

## Layout

```
src/data/listing.ts      all content and copy
src/styles/tokens.css    colours, type, shadows, easing, durations
src/hooks/               overlay behaviour, URL/history, scroll spy, toast, saved state
src/components/          one component + one CSS module each
scripts/                 icon generation, geometry diff, a11y tests
docs/reference/          the captured reference and the behaviour notes
docs/architecture.png    production architecture diagram
```

`CLAUDE.md` holds the working conventions, `.claude/` the review agents and the fidelity workflow, and
`PROMPTS.md` the notes on how the build was driven.

## Notes

Desktop only, at 1128px and up, per the brief.

The logo, the Airbnb Cereal font and the photographs belong to Airbnb and the listing's host. They're
reproduced here only because the brief asks for an exact visual match, and shouldn't be reused.
