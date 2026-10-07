import { useEffect, useRef } from 'react';
import { allPhotos, roomOfPhoto, ui } from '../data/listing';
import { useOverlay } from '../hooks/useOverlay';
import { Icon } from './Icon';
import s from './Lightbox.module.css';
import btn from './shared.module.css';

interface Props {
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ index, onClose, onIndexChange }: Props) {
  const open = index !== null;
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useOverlay(open, root, onClose, closeBtn);

  const total = allPhotos.length;
  const photo = index === null ? null : allPhotos[index];
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < total - 1;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && index < total - 1) onIndexChange(index + 1);
      else if (e.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1);
    };
    document.addEventListener('keydown', onKey);
    // Warm the neighbours so ←/→ swaps are instant.
    [index - 1, index + 1].forEach((i) => { if (allPhotos[i]) new Image().src = allPhotos[i].src; });
    return () => document.removeEventListener('keydown', onKey);
  }, [index, total, onIndexChange]);

  return (
    <div ref={root} className={`${s.lightbox} ${open ? s.open : ''}`} role="dialog" aria-modal="true" aria-label={ui.lightbox.title} aria-hidden={!open}>
      <header className={s.bar}>
        <button className={`${btn.iconBtn} ${s.grid}`} type="button" aria-label={ui.lightbox.backToTour} onClick={onClose}><span><Icon name="grid" /></span></button>
        <div className={s.title}>{photo ? roomOfPhoto(photo.idx).name : ''}</div>
        <div className={s.right}>
          <span className={s.counter} aria-live="polite">{index !== null ? ui.lightbox.counter(index + 1, total) : ''}</span>
          <button ref={closeBtn} className={btn.iconBtn} type="button" aria-label={ui.lightbox.close} onClick={onClose}><span><Icon name="close" /></span></button>
        </div>
      </header>
      <button className={`${btn.iconBtn} ${s.arrow} ${s.prev}`} type="button" aria-label={ui.lightbox.prev} disabled={!hasPrev}
        onClick={() => hasPrev && onIndexChange(index - 1)}><span><Icon name="prev" /></span></button>
      <div className={s.stage}>
        {photo && <img src={photo.src} alt={photo.room} />}
      </div>
      <button className={`${btn.iconBtn} ${s.arrow} ${s.next}`} type="button" aria-label={ui.lightbox.next} disabled={!hasNext}
        onClick={() => hasNext && onIndexChange(index + 1)}><span><Icon name="next" /></span></button>
    </div>
  );
}
