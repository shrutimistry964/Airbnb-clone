import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

/**
 * Scroll lock, focus trap, Escape and focus restore for every modal surface. The lock is ref-counted
 * so the lightbox stacking on the photo tour behaves, and only the top-most overlay answers Escape.
 *
 * The reference leaves focus on the opener; we move it into the overlay for keyboard users and put it
 * back on close. Everything else — timing, classes, DOM — matches.
 */
export function useOverlay(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const node = containerRef.current;
    const opener = document.activeElement as HTMLElement | null;
    lockCount += 1;
    const depth = lockCount;
    document.body.classList.add('scroll-locked');

    // rAF here stalls in a backgrounded tab and focus never lands; a macrotask keeps this off the
    // commit path without waiting on a paint.
    const timer = window.setTimeout(() => {
      const target = initialFocusRef?.current ?? node?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus({ preventScroll: true });
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (depth !== lockCount || !node) return;
      if (e.key === 'Escape') { e.preventDefault(); onCloseRef.current(); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !node.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !node.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      lockCount -= 1;
      if (lockCount === 0) document.body.classList.remove('scroll-locked');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, containerRef, initialFocusRef]);
}
