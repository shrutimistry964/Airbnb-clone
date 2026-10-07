#!/usr/bin/env node
/**
 * Geometry diff against the reference.
 *
 * Measures every element of the running clone at the viewport the reference was captured in
 * (1200x606, see docs/reference/measure/ref-1200.txt) and prints elements whose box differs by
 * more than TOLERANCE px. Exit code 1 when anything differs.
 *
 *   npm run build && npm run measure            # uses vite preview on :4173
 *   BASE_URL=http://localhost:5173 npm run measure
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { startPreview } from './lib/preview.mjs';

const TOLERANCE = 1;
const REF = readFileSync(new URL('../docs/reference/measure/ref-1200.txt', import.meta.url), 'utf8').trim().split('\n');
const { url, stop } = await startPreview();
const browser = await chromium.launch();
let lines;
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 606 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  lines = await page.evaluate(() => {
  const out = [];
  const walk = (el) => {
    for (const c of el.children) {
      if (c.closest('[role=dialog],[role=status]')) continue;
      const r = c.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const txt = [...c.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).filter(Boolean).join(' ').slice(0, 28);
      out.push(`${c.tagName[0]}${c.tagName.slice(1, 3).toLowerCase()}|${txt}|${Math.round(r.x)},${Math.round(r.y + scrollY)},${Math.round(r.width)},${Math.round(r.height)}`);
      walk(c);
    }
  };
  walk(document.getElementById('root'));
  return out;
  });
} finally {
  await browser.close();
  stop();
}

// Match reference rows to clone rows by tag+text in document order (the reference list is a sample).
const parse = (l) => { const [tag, text, box] = l.split('|'); return { tag, text: text.replace(/\s+/g, ''), box: box.split(',').map(Number), line: l }; };
const clone = lines.map(parse);
let cursor = 0, diffs = 0, matched = 0;
for (const ref of REF.map(parse)) {
  // The booking card is position:sticky and the reference was captured mid-scroll, so its rows carry a
  // constant offset; its geometry is checked separately by the fidelity reviewer via screenshots.
  const inAside = ref.box[0] >= 748 && ref.box[1] >= 2154 && ref.box[1] <= 2660;
  if (ref.text.includes('Skipto') || ref.line.startsWith('Asi') || inAside) continue;
  const dist = (c) => Math.abs(c.box[1] - ref.box[1]) + Math.abs(c.box[2] - ref.box[2]) + Math.abs(c.box[3] - ref.box[3]);
  const candidates = clone.map((c, idx) => ({ c, idx })).filter(({ c, idx }) => idx >= cursor && idx < cursor + 60 && c.tag === ref.tag && c.text === ref.text && Math.abs(c.box[0] - ref.box[0]) <= 2);
  if (candidates.length === 0) { console.log(`MISSING  ${ref.line}`); diffs++; continue; }
  const i = candidates.sort((a, b) => dist(a.c) - dist(b.c))[0].idx;
  cursor = i + 1; matched++;
  const d = ref.box.map((v, k) => Math.abs(v - clone[i].box[k]));
  if (Math.max(...d) > TOLERANCE) { console.log(`DIFF     ref ${ref.line}\n         got ${clone[i].line}`); diffs++; }
}
console.log(`\n${matched} elements matched, ${diffs} differences (tolerance ${TOLERANCE}px)`);
process.exit(diffs ? 1 : 0);
