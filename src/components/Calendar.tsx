import { calendar, listing, ui } from '../data/listing';
import { Icon } from './Icon';
import s from './Calendar.module.css';

/** Two-month availability calendar. Static in the reference (dates are display-only). */
export function Calendar() {
  return (
    <div>
      <div>
        <div className={s.heading}>{listing.nights}</div>
        <div className={s.range}>{listing.dateRange}</div>
      </div>
      <div className={s.months}>
        <div className={s.arrows}>
          <button type="button" aria-label="Previous month"><span className={s.arrowIcon}><Icon name="chevronLeft" /></span></button>
          <button type="button" aria-label="Next month"><span className={s.arrowIcon}><Icon name="chevronRight" /></span></button>
        </div>
        {calendar.months.map((m) => (
          <div key={m.title}>
            <div className={s.monthTitle}>{m.title}</div>
            <div className={s.weekdays}>{calendar.weekdays.map((d, i) => <span key={i}>{d}</span>)}</div>
            <div className={s.days}>
              {Array.from({ length: m.leadingBlanks }, (_, i) => <div key={`b${i}`} className={`${s.day} ${s.blank}`} />)}
              {Array.from({ length: m.days }, (_, i) => i + 1).map((d) => {
                const cls = [s.day];
                if (m.disabled.includes(d)) cls.push(s.disabled);
                if ('checkIn' in m && m.checkIn === d) cls.push(s.checkIn);
                else if ('checkOut' in m && m.checkOut === d) cls.push(s.checkOut);
                else if ('checkIn' in m && m.checkIn && m.checkOut && d > m.checkIn && d < m.checkOut) cls.push(s.inRange);
                return <div key={d} className={cls.join(' ')}>{d}</div>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className={s.footer}>
        <span className={s.keyboard} aria-hidden="true"><Icon name="keyboard" /></span>
        <button className={s.clear} type="button">{ui.clearDates}</button>
      </div>
    </div>
  );
}
