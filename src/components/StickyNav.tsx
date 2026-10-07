import type { MouseEvent } from 'react';
import { listing, sectionNav, ui } from '../data/listing';
import s from './StickyNav.module.css';
import btn from './shared.module.css';

/** Sticky nav height + breathing room, so a section lands just below the bar. */
const SCROLL_OFFSET = 66;

interface Props { visible: boolean; active: string; onReserve: () => void }

export function StickyNav({ visible, active, onReserve }: Props) {
  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: 'smooth' });
  };
  return (
    <div className={`${s.bar} ${visible ? s.shown : ''}`} aria-hidden={!visible}>
      <div className={`container ${s.inner}`}>
        <nav className={s.links} aria-label={ui.sections}>
          {sectionNav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={active === item.id ? s.active : undefined}
              tabIndex={visible ? undefined : -1} onClick={(e) => jump(e, item.id)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.right}>
          <div className={s.price}>
            <div><span className={s.amount}>{listing.price}</span> <span className={s.qualifier}>{listing.priceQualifier}</span></div>
            <div className={s.rating}><span className={s.star} aria-hidden="true" /> {listing.rating} · <span>{listing.reviewCount} {ui.reviews.reviewsLabel.toLowerCase()}</span></div>
          </div>
          <button className={`${btn.reserve} ${btn.reserveSmall}`} type="button" tabIndex={visible ? undefined : -1} onClick={onReserve}>{ui.booking.reserve}</button>
        </div>
      </div>
    </div>
  );
}
