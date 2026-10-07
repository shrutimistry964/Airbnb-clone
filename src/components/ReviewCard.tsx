import { useState } from 'react';
import { CLAMP_THRESHOLD, ui, type Review } from '../data/listing';
import { Icon } from './Icon';
import s from './ReviewCard.module.css';

export function ReviewCard({ review }: { review: Review }) {
  const clampable = review.text.length > CLAMP_THRESHOLD;
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className={s.head}>
        {review.avatar
          ? <img className={s.avatar} src={review.avatar} alt="" />
          : <div className={s.initial} style={{ background: review.initial?.bg, color: review.initial?.color }}>{review.initial?.letter}</div>}
        <div>
          <div className={s.name}>{review.name}</div>
          <div className={s.tenure}>{review.tenure}</div>
        </div>
      </div>
      <div className={s.meta}>
        <span className={s.stars} aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }, (_, i) => <span key={i}><Icon name="star" /></span>)}
        </span>
        <span>·</span>
        <span>{review.date}</span>
      </div>
      <div className={`${s.text} ${clampable && !expanded ? s.clamped : ''}`}>{review.text}</div>
      {clampable && (
        <button className={s.more} type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
          {expanded ? ui.showLess : ui.showMore}
        </button>
      )}
    </div>
  );
}
