# How this was built

Notes on the process, kept because the brief asks for them.

## First attempt — from screenshots

The first pass was driven from the three screenshots in the brief. It produced the right shape — the
scaffold, a data module, the overlay hook, the component split — but everything the screenshots didn't
show (the header, booking card, reviews, footer, the type scale, every timing) was an estimate, and
those were left marked in the source rather than passed off as known.

## Second attempt — from the reference itself

The reference turned out to be behind Vercel's bot detection: curl, headless browsers and even its
static assets all get refused. Rather than trying to defeat that, the page was opened in an ordinary
signed-in browser and read from there.

What came out of it:

- the complete stylesheet, the DOM and all 72 inline SVG icons;
- the font and all 72 photographs, collected in-page and downloaded in one archive;
- the bounding box of every element, which became `docs/reference/measure/ref-1200.txt`;
- the behaviour: scroll thresholds, what each button actually does, the URL and history scheme behind
  the overlays, key handling, focus, and the transition timings. Written up in `BEHAVIOUR.md`.

The clone was then rebuilt against that capture — the stylesheet ported rule by rule into semantic CSS
modules, icons generated from the captured SVGs, content extracted into `src/data/listing.ts`, and the
overlays wired to history. Two scripts keep it honest: `npm run measure` diffs the rendered geometry
against the capture, and `npm run a11y` walks the keyboard and focus paths.

Three review passes followed — one on visual fidelity against the captured stylesheet, one on keyboard
and focus behaviour, one on code structure. Their definitions are in `.claude/agents/`. The fixes that
came out of them were mostly structural: replacing a per-frame scroll listener with IntersectionObservers,
validating `modalItem` from the URL, making the history seeding idempotent, moving the last hard-coded
copy into the data module, and consolidating the TypeScript config.

One suggestion was deliberately not taken. Two glyphs — the star in the sticky nav and the header's
magnifier — are drawn by the reference as a CSS mask and a background image, with paths that differ from
its inline icons. Swapping them for the shared `Icon` component would have been tidier and slightly less
faithful, so they stayed as they are, with a comment saying why.
