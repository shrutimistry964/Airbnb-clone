import { useEffect, useState } from 'react';

/** A section counts as "current" once its top has scrolled past this viewport offset. */
const ACTIVE_OFFSET = 100;

/**
 * Sticky section nav: `visible` once the hero's bottom edge clears the top of the viewport, `active` =
 * the last section past ACTIVE_OFFSET.
 *
 * The section observer's root is everything above the offset line, so a section intersects exactly
 * while its top is at or above it. That stays correct through big scroll jumps and scrolling back up,
 * which a "did it cross?" callback does not. Rebuilt on resize since the margin is in viewport px.
 */
export function useScrollSpy(heroId: string, sectionIds: readonly string[]) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const heroIo = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.bottom <= 0));
    if (hero) heroIo.observe(hero);

    const passed = new Map<string, boolean>();
    let lineIo: IntersectionObserver | undefined;
    const observeSections = () => {
      lineIo?.disconnect();
      lineIo = new IntersectionObserver((entries) => {
        entries.forEach((e) => passed.set(e.target.id, e.isIntersecting));
        setActive(sectionIds.filter((id) => passed.get(id)).at(-1) ?? sectionIds[0]);
      }, { rootMargin: `100000px 0px ${ACTIVE_OFFSET - window.innerHeight}px 0px` });
      sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) lineIo?.observe(el); });
    };
    observeSections();
    window.addEventListener('resize', observeSections);

    return () => { heroIo.disconnect(); lineIo?.disconnect(); window.removeEventListener('resize', observeSections); };
  }, [heroId, sectionIds]);

  return { visible, active };
}
