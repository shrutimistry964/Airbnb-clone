#!/usr/bin/env node
/**
 * Keyboard / focus-management smoke test for the three views.
 *   npm run build && npm run a11y     (or BASE_URL=http://localhost:5173 npm run a11y)
 */
import { chromium } from 'playwright';
import { startPreview } from './lib/preview.mjs';

const failures = [];
const { url, stop } = await startPreview();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
try {
await page.goto(url, { waitUntil: 'networkidle' });

const expect = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`); if (!ok) failures.push(name); };
const active = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim() || document.activeElement?.tagName);
const search = () => page.evaluate(() => location.search);

await page.getByRole('button', { name: 'Show all photos' }).click();
await page.waitForTimeout(400);
expect('tour opens with focus on Back', (await active()) === 'Back', await active());
expect('tour URL', (await search()) === '?modal=PHOTO_TOUR_SCROLLABLE', await search());
expect('tour dialog exposed', await page.locator('[role=dialog][aria-label="Photo tour"][aria-hidden="false"]').count() === 1);
expect('body scroll locked', await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'));

await page.locator('[aria-label="Photo tour"] button[data-idx="4"]').click();
await page.waitForTimeout(400);
expect('lightbox focus on Close', (await active()) === 'Close', await active());
expect('lightbox URL', (await search()) === '?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1004', await search());
const counter = page.locator('[aria-label="Photo viewer"] [aria-live]');
await page.keyboard.press('ArrowRight');
expect('ArrowRight advances counter', (await counter.textContent()) === '6 of 43', await counter.textContent());
await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft');
expect('ArrowLeft goes back', (await counter.textContent()) === '4 of 43', await counter.textContent());
for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft');
expect('no wrap-around at first photo', (await counter.textContent()) === '1 of 43' && await page.locator('[aria-label="Photo viewer"] [aria-label=Previous]').isDisabled());

// Focus trap: Tab from the last control wraps to the first inside the lightbox.
await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
expect('Tab stays inside lightbox', await page.evaluate(() => !!document.activeElement.closest('[aria-label="Photo viewer"]')), await active());

await page.keyboard.press('Escape');
await page.waitForTimeout(400);
expect('Esc closes only the lightbox', await page.locator('[aria-label="Photo viewer"][aria-hidden="true"]').count() === 1 && await page.locator('[aria-label="Photo tour"][aria-hidden="false"]').count() === 1);
expect('focus returns to the opening photo', await page.evaluate(() => document.activeElement?.dataset.idx === '4'), await active());
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
expect('Esc closes the tour', await page.locator('[aria-label="Photo tour"][aria-hidden="true"]').count() === 1);
expect('focus returns to "Show all photos"', (await active()) === 'Show all photos', await active());
expect('URL restored', (await search()) === '', await search());
expect('scroll unlocked', await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'));

await page.getByRole('button', { name: /Show all 50 amenities/ }).click();
await page.waitForTimeout(300);
expect('amenities dialog focus on Close', (await active()) === 'Close', await active());
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
expect('amenities dialog Esc returns focus', (await active()) === 'Show all 50 amenities', await active());

// Keyboard-only focus ring: visible after Tab, hidden after pointer use.
await page.keyboard.press('Tab');
expect('focus ring appears after keyboard use', await page.evaluate(() => document.body.classList.contains('kbd') && getComputedStyle(document.activeElement).outlineStyle === 'solid'));

} finally {
  await browser.close();
  stop();
}
console.log(`\n${failures.length ? failures.length + ' failing' : 'All checks passed'}`);
process.exit(failures.length ? 1 : 0);
