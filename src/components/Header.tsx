import { ui } from '../data/listing';
import { Icon } from './Icon';
import s from './Header.module.css';

export function Header() {
  return (
    <header className={s.header} id="siteHeader">
      <div className={s.inner}>
        <a className={s.logo} href="#" aria-label={ui.header.logo}>
          <span className={s.logoMark}><Icon name="logo" /></span>
        </a>
        <div className={s.search} role="search">
          <button className={s.pill} type="button">
            <img className={s.house} src="/assets/images/ui/searchbar-house.png" alt="" aria-hidden="true" />{ui.header.where}
          </button>
          <span className={s.divider} />
          <button className={s.pill} type="button">{ui.header.when}</button>
          <span className={s.divider} />
          <button className={`${s.pill} ${s.pillMuted}`} type="button">{ui.header.who}</button>
          <button className={s.searchBtn} type="button" aria-label={ui.header.search} />
        </div>
        <nav className={s.nav}>
          <a className={s.host} href="#">{ui.header.becomeHost}</a>
          <button className={s.round} type="button" aria-label={ui.header.language}><span><Icon name="globe" /></span></button>
          <button className={s.round} type="button" aria-label={ui.header.menu}><span><Icon name="menu" /></span></button>
        </nav>
      </div>
    </header>
  );
}
