import { listing, ratings, reviews, ui } from '../data/listing';
import { Icon } from './Icon';
import { ReviewCard } from './ReviewCard';
import s from './Reviews.module.css';
import sec from './Sections.module.css';
import btn from './shared.module.css';

export function Reviews() {
  return (
    <section className={sec.section} id="reviews">
      <div className={s.hero}>
        <div className={s.laurels}>
          <img src="/assets/images/ui/laurel-left.png" alt="" />
          <div className={s.bigScore}>{ratings.overall}</div>
          <img src="/assets/images/ui/laurel-right.png" alt="" />
        </div>
        <div className={s.favTitle}>{ui.reviews.favourite}</div>
        <div className={s.favBlurb}>{ui.reviews.favouriteBlurb}</div>
        <button className={s.howLink} type="button">{ui.reviews.howItWorks}</button>
      </div>

      <div className={s.breakdown}>
        <div className={s.col}>
          <div className={s.colTitle}>{ui.reviews.overall}</div>
          <div className={s.bars}>
            {ratings.distribution.map((pct, i) => (
              <div className={s.barRow} key={i}>
                <span className={s.barLabel}>{5 - i}</span>
                <div className={s.track}><div className={s.fill} style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        {ratings.categories.map((c) => (
          <div className={s.col} key={c.label}>
            <div className={s.colTitle}>{c.label}</div>
            <div className={s.colValue}>{c.value}</div>
            <div className={s.colIcon}><Icon name={c.icon} /></div>
          </div>
        ))}
      </div>

      <div className={s.chips}>
        {ratings.chips.map((c) => (
          <button className={s.chip} type="button" key={c.label}>
            <img className={s.chipIcon} src={c.icon} alt="" aria-hidden="true" />{c.label} <span className={s.chipCount}>{c.count}</span>
          </button>
        ))}
      </div>

      <div className={s.list}>
        {reviews.map((r) => <ReviewCard key={r.name} review={r} />)}
      </div>
      <button className={btn.outlineBtn} type="button">{ui.reviews.showAll(listing.reviewCount)}</button>
    </section>
  );
}
