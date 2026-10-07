import { listing, ui } from '../data/listing';
import { Icon } from './Icon';
import s from './MeetHost.module.css';
import sec from './Sections.module.css';

export function MeetHost() {
  const host = listing.host;
  return (
    <section className={sec.section}>
      <h2 className={sec.title}>{ui.host.title}</h2>
      <div className={s.grid}>
        <div>
          <div className={s.card}>
            <div className={s.identity}>
              <div className={s.avatarWrap}>
                <img src={host.avatar} alt="" />
                <span className={s.verified}><Icon name="checkCircle" /></span>
              </div>
              <div className={s.name}>{host.name}</div>
              <div className={s.role}>{ui.host.role}</div>
            </div>
            <div className={s.stats}>
              <div className={s.stat}><div className={s.statValue}>{host.reviews}</div><div className={s.statLabel}>{ui.host.reviewsLabel}</div></div>
              <div className={s.stat}><div className={s.statValue}>{host.rating}</div><div className={s.statLabel}>{ui.host.ratingLabel}</div></div>
              <div className={s.stat}><div className={s.statValue}>{host.years}</div><div className={s.statLabel}>{ui.host.yearsLabel}</div></div>
            </div>
          </div>
          <div className={s.facts}>
            {host.facts.map((f) => (
              <div className={s.fact} key={f.text}><span className={s.factIcon}><Icon name={f.icon} /></span>{f.text}</div>
            ))}
          </div>
        </div>
        <div>
          <div className={s.subTitle}>{ui.host.coHosts}</div>
          <div className={s.cohosts}>
            {listing.cohosts.map((c) => (
              <div className={s.cohost} key={c.name}>
                {c.avatar
                  ? <img src={c.avatar} alt="" />
                  : <div className={s.initial} style={{ background: c.initial?.bg, color: c.initial?.color }}>{c.initial?.letter}</div>}
                <span>{c.name}</span>
              </div>
            ))}
          </div>
          <div className={s.subTitle}>{ui.host.details}</div>
          <div className={s.details}>{host.responseRate}<br />{host.responseTime}</div>
          <button className={s.message} type="button">{ui.host.message}</button>
          <div className={s.warning}>
            <span className={s.warningIcon}><Icon name="shield" /></span>
            <span>{listing.paymentWarning}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
