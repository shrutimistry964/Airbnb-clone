import { ui } from '../data/listing';
import { Icon } from './Icon';
import s from './TitleBar.module.css';

interface Props { title: string; saved: boolean; onToggleSave: () => void; onShare: () => void }

export function TitleBar({ title, saved, onToggleSave, onShare }: Props) {
  return (
    <section className={s.bar} id="photos">
      <h1 className={s.title}>{title}</h1>
      <div className={s.actions}>
        <button className={s.action} type="button" onClick={onShare}>
          <span className={s.icon}><Icon name="share" /></span><span className={s.label}>{ui.share}</span>
        </button>
        <button className={`${s.action} ${saved ? s.saved : ''}`} type="button" onClick={onToggleSave} aria-pressed={saved}>
          <span className={s.icon}><Icon name={saved ? 'heartFilled' : 'heart'} /></span><span className={s.label}>{saved ? ui.saved : ui.save}</span>
        </button>
      </div>
    </section>
  );
}
