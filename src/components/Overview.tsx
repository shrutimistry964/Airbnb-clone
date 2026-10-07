import { useState } from 'react';
import { listing, topAmenities, ui } from '../data/listing';
import { Calendar } from './Calendar';
import { Icon } from './Icon';
import sec from './Sections.module.css';
import s from './Overview.module.css';
import btn from './shared.module.css';

interface Props { onShowAmenities: () => void }

export function Overview({ onShowAmenities }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div id="contentLeft">
      <div className={s.summary}>
        <h2>{listing.subtitle}</h2>
        <div className={s.capacity}>{listing.capacity}</div>
      </div>

      <div className={s.favourite}>
        <div className={s.badge}>
          <span className={s.laurel}><Icon name="laurel" /></span>
          <span className={s.badgeText}>{listing.guestFavourite.label[0]}<br />{listing.guestFavourite.label[1]}</span>
          <span className={`${s.laurel} ${s.laurelRight}`}><Icon name="laurel" /></span>
        </div>
        <div className={s.blurb}>{listing.guestFavourite.blurb}</div>
        <div className={s.stats}>
          <div className={s.stat}>
            <div className={s.statValue}>{listing.rating}</div>
            <div className={btn.stars}>{[0, 1, 2, 3, 4].map((i) => <span key={i}><Icon name="star" /></span>)}</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.stat}>
            <div className={s.statValue}>{listing.reviewCount}</div>
            <div className={s.statLabel}>{ui.reviews.reviewsLabel}</div>
          </div>
        </div>
      </div>

      <div className={s.hostRow}>
        <img className={s.hostAvatar} src={listing.host.avatar} alt="" />
        <div>
          <div className={s.hostName}>{ui.hostedBy(listing.host.name)}</div>
          <div className={s.hostMeta}>{listing.host.tenure}</div>
        </div>
      </div>

      <div className={s.highlights}>
        {listing.highlights.map((h) => (
          <div className={s.highlight} key={h.title}>
            <div className={s.highlightIcon}><Icon name={h.icon} /></div>
            <div>
              <div className={s.highlightTitle}>{h.title}</div>
              <div className={s.highlightBody}>{h.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.description}>
        <div className={s.translated}><span>{listing.translationNote} <a href="#">{ui.showOriginal}</a></span></div>
        <p id="descText" className={expanded ? undefined : s.clamped}>{listing.description}</p>
        <button className={btn.showMore} type="button" aria-expanded={expanded} aria-controls="descText" onClick={() => setExpanded((v) => !v)}>
          {expanded ? ui.showLess : ui.showMore} <span className={btn.chevron}><Icon name="chevronRight" /></span>
        </button>
      </div>

      <div className={s.section}>
        <h2 className={sec.title}>{ui.sleepTitle}</h2>
        <div className={s.sleep}>
          {listing.sleep.map((item) => (
            <div key={item.title}>
              <img src={item.photo} alt="" />
              <div className={s.sleepTitle}>{item.title}</div>
              <div className={s.sleepSub}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.section} id="amenities">
        <h2 className={sec.title}>{ui.amenitiesTitle}</h2>
        <div className={s.amenities}>
          {topAmenities.map((a) => (
            <div className={`${s.amenity} ${a.unavailable ? s.unavailable : ''}`} key={a.label}>
              <span className={s.amenityIcon}><Icon name={a.icon} /></span>
              <span className={s.amenityLabel}>{a.label}</span>
            </div>
          ))}
        </div>
        <button className={btn.outlineBtn} type="button" onClick={onShowAmenities}>{ui.showAllAmenities(listing.amenityCount)}</button>
      </div>

      <div className={s.section}>
        <Calendar />
      </div>
    </div>
  );
}
