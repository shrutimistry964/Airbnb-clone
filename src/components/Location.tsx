import { listing, ui } from '../data/listing';
import { Icon } from './Icon';
import s from './Location.module.css';
import sec from './Sections.module.css';
import btn from './shared.module.css';

export function Location() {
  const loc = listing.location;
  return (
    <section className={sec.section} id="location">
      <h2 className={sec.title}>{ui.location.title}</h2>
      <div className={s.place}>{loc.place}</div>
      <div className={s.map}>
        <div className={s.tiles} />
        <button className={s.search} type="button" aria-label="Search"><span className={s.searchIcon}><Icon name="search" /></span></button>
        <div className={s.zoom}>
          <button type="button" aria-label="Zoom in"><span className={s.zoomIcon}><Icon name="plus" /></span></button>
          <button type="button" aria-label="Zoom out"><span className={s.zoomIcon}><Icon name="minus" /></span></button>
        </div>
        <div className={s.pin}><Icon name="house" /></div>
      </div>
      <div className={s.note}>{loc.note}</div>
      <div className={s.subTitle}>{loc.highlightsTitle}</div>
      <div className={s.body}>{loc.highlights}</div>
      <button className={`${btn.showMore} ${s.more}`} type="button">{ui.showMore} <span className={btn.chevron}><Icon name="chevronRight" /></span></button>
    </section>
  );
}
