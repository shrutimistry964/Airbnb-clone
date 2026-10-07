import { useRef } from 'react';
import { amenityGroups, ui } from '../data/listing';
import { useOverlay } from '../hooks/useOverlay';
import { Icon } from './Icon';
import s from './AmenitiesModal.module.css';
import btn from './shared.module.css';

interface Props { open: boolean; onClose: () => void }

export function AmenitiesModal({ open, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useOverlay(open, dialog, onClose, closeBtn);
  return (
    <div className={`${s.backdrop} ${open ? s.open : ''}`} aria-hidden={!open} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialog} className={s.dialog} role="dialog" aria-modal="true" aria-label={ui.amenitiesTitle}>
        <div className={s.bar}>
          <button ref={closeBtn} className={`${btn.iconBtn} ${s.close}`} type="button" aria-label={ui.lightbox.close} onClick={onClose}><span><Icon name="close" /></span></button>
        </div>
        <div className={s.body}>
          <h2>{ui.amenitiesTitle}</h2>
          {amenityGroups.map((g) => (
            <div className={s.group} key={g.title}>
              <h3>{g.title}</h3>
              {g.items.map((a) => (
                <div className={`${s.item} ${a.unavailable ? s.unavailable : ''}`} key={a.label}>
                  <span className={s.icon}><Icon name={a.icon} /></span>
                  <span className={s.label}>{a.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
