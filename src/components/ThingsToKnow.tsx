import { listing, ui } from '../data/listing';
import { Icon } from './Icon';
import s from './ThingsToKnow.module.css';
import sec from './Sections.module.css';

export function ThingsToKnow() {
  return (
    <section className={sec.section}>
      <h2 className={sec.title}>{ui.thingsToKnow.title}</h2>
      <div className={s.grid}>
        {listing.thingsToKnow.map((t) => (
          <div className={s.col} key={t.title}>
            <div className={s.icon}><Icon name={t.icon} /></div>
            <div className={s.title}>{t.title}</div>
            {t.lines.map((line) => <p key={line}>{line}</p>)}
            <a className={s.link} href="#">{ui.thingsToKnow.learnMore}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
