import { useEffect, useRef, useState } from 'react';
import { similarStays, ui } from '../data/listing';
import { Icon } from './Icon';
import s from './SimilarStays.module.css';
import sec from './Sections.module.css';

const PER_PAGE = 5;

export function SimilarStays() {
  const track = useRef<HTMLDivElement>(null);
  const pages = Math.ceil(similarStays.length / PER_PAGE);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setPage(max <= 0 ? 0 : Math.min(pages - 1, Math.round((el.scrollLeft / max) * (pages - 1))));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pages]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(max, (page + dir) * el.clientWidth));
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <section className={sec.section}>
      <div className={s.head}>
        <h2 className={`${sec.title} ${sec.titleTight}`}>{ui.similar.title}</h2>
        <div className={s.controls}>
          <span className={s.counter} aria-live="polite">{page + 1} / {pages}</span>
          <button className={s.arrow} type="button" aria-label={ui.similar.prev} disabled={page === 0} onClick={() => go(-1)}>
            <span className={s.arrowIcon}><Icon name="chevronLeft" /></span>
          </button>
          <button className={s.arrow} type="button" aria-label={ui.similar.next} disabled={page === pages - 1} onClick={() => go(1)}>
            <span className={s.arrowIcon}><Icon name="chevronRight" /></span>
          </button>
        </div>
      </div>
      <div className={s.track} ref={track}>
        {similarStays.map((stay, i) => (
          <div className={s.card} key={`${stay.title}-${i}`}>
            <img src={stay.img} alt="" loading="lazy" />
            <div className={s.title}>{stay.title}</div>
            <div className={s.price}>{stay.price} &nbsp; <span className={s.star}><Icon name="star" /></span> {stay.rating}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
