import { useCallback, useEffect, useState } from 'react';
import { allPhotos } from '../data/listing';

/**
 * Overlay state mirrored into the URL and history stack, like the reference:
 *   tour      → ?modal=PHOTO_TOUR_SCROLLABLE            (pushState)
 *   lightbox  → …&modalItem=1000+index                  (pushState; ←/→ use replaceState)
 * Closing calls history.back(), and the browser Back button closes the top-most overlay.
 */
export interface OverlayState { tour: boolean; lightbox: number | null }
type Level = { level: 'base' } | { level: 'tour' } | { level: 'lightbox'; idx: number };

const MODAL = 'PHOTO_TOUR_SCROLLABLE';
const ITEM_BASE = 1000;

function fromUrl(): Level {
  const q = new URLSearchParams(window.location.search);
  if (q.get('modal') !== MODAL) return { level: 'base' };
  const idx = Number(q.get('modalItem')) - ITEM_BASE;
  return Number.isInteger(idx) && idx >= 0 && idx < allPhotos.length ? { level: 'lightbox', idx } : { level: 'tour' };
}
function toUrl(l: Level) {
  if (l.level === 'base') return window.location.pathname;
  const item = l.level === 'lightbox' ? `&modalItem=${ITEM_BASE + l.idx}` : '';
  return `${window.location.pathname}?modal=${MODAL}${item}`;
}
function toState(l: Level): OverlayState {
  return { tour: l.level !== 'base', lightbox: l.level === 'lightbox' ? l.idx : null };
}
function currentLevel(): Level | null {
  return (window.history.state as Level | null)?.level ? (window.history.state as Level) : null;
}
function push(l: Level) { window.history.pushState(l, '', toUrl(l)); }

export function useOverlayHistory() {
  const [state, setState] = useState<OverlayState>({ tour: false, lightbox: null });
  const [initialRoom, setInitialRoom] = useState<string | null>(null);

  useEffect(() => {
    // Already seeded (StrictMode re-run, bfcache restore): just adopt the entry's state.
    const seeded = currentLevel();
    const initial = seeded ?? fromUrl();
    // Deep links open the overlay directly; make sure a "base" entry sits underneath so Back closes it.
    if (!seeded) {
      window.history.replaceState({ level: 'base' } satisfies Level, '', window.location.pathname);
      if (initial.level === 'lightbox') push({ level: 'tour' });
      if (initial.level !== 'base') push(initial);
    }
    setState(toState(initial));
    const onPop = (e: PopStateEvent) => setState(toState((e.state as Level | null) ?? { level: 'base' }));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openTour = useCallback((roomId: string | null = null) => {
    setInitialRoom(roomId);
    const l: Level = { level: 'tour' };
    push(l); setState(toState(l));
  }, []);
  const openLightbox = useCallback((idx: number) => {
    const l: Level = { level: 'lightbox', idx };
    push(l); setState(toState(l));
  }, []);
  const setLightboxIndex = useCallback((idx: number) => {
    const l: Level = { level: 'lightbox', idx };
    window.history.replaceState(l, '', toUrl(l));
    setState(toState(l));
  }, []);
  const back = useCallback(() => window.history.back(), []);

  return { state, initialRoom, openTour, openLightbox, setLightboxIndex, close: back };
}
