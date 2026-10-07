import { useEffect, useRef } from 'react';
import { rooms, tourRows, ui, type Photo } from '../data/listing';
import { useOverlay } from '../hooks/useOverlay';
import { Icon } from './Icon';
import s from './PhotoTour.module.css';
import btn from './shared.module.css';

/** A room section rests this far below the tour's scroll area top, as on the reference. */
const ROOM_OFFSET = 24;

function scrollToRoom(scroller: HTMLElement, roomId: string, behavior: ScrollBehavior) {
  const room = document.getElementById(roomId);
  if (!room) return;
  const top = room.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - ROOM_OFFSET;
  scroller.scrollTo({ top, behavior });
}

interface Props {
  open: boolean;
  /** Room to scroll to when opening from a hero tile; null opens at the top. */
  initialRoom: string | null;
  saved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  onClose: () => void;
  onOpenPhoto: (photo: Photo) => void;
}

export function PhotoTour({ open, initialRoom, saved, onToggleSave, onShare, onClose, onOpenPhoto }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);
  useOverlay(open, root, onClose, backBtn);

  useEffect(() => {
    if (!open || !scroller.current) return;
    if (initialRoom) scrollToRoom(scroller.current, initialRoom, 'instant');
    else scroller.current.scrollTop = 0;
  }, [open, initialRoom]);

  const jumpTo = (roomId: string) => scroller.current && scrollToRoom(scroller.current, roomId, 'smooth');

  return (
    <div ref={root} className={`${s.tour} ${open ? s.open : ''}`} role="dialog" aria-modal="true" aria-label={ui.tour.title} aria-hidden={!open}>
      <header className={s.bar}>
        <button ref={backBtn} className={`${btn.iconBtn} ${s.back}`} type="button" aria-label={ui.tour.back} onClick={onClose}><span><Icon name="back" /></span></button>
        <h2 className={s.title}>{ui.tour.title}</h2>
        <div className={s.actions}>
          <button className={btn.iconBtn} type="button" aria-label={ui.share} onClick={onShare}><span><Icon name="share" /></span></button>
          <button className={`${btn.iconBtn} ${saved ? s.saved : ''}`} type="button" aria-label={saved ? ui.saved : ui.save} aria-pressed={saved} onClick={onToggleSave}>
            <span><Icon name={saved ? 'heartFilled' : 'heart'} /></span>
          </button>
        </div>
      </header>
      <div className={s.scroll} ref={scroller}>
        <div className={s.content}>
          <nav className={s.nav} aria-label={ui.tour.categories}>
            {rooms.map((room) => (
              <button key={room.id} className={`${s.thumb} focus-tile`} type="button" aria-label={room.name} onClick={() => jumpTo(room.id)}>
                <img loading="lazy" alt="" src={room.photos[0].src} />
                <span className={s.thumbLabel}>{room.name}</span>
              </button>
            ))}
          </nav>
          <div>
            {rooms.map((room) => (
              <section className={s.room} id={room.id} key={room.id}>
                <div className={s.roomHead}>
                  <div className={s.roomTitle}>{room.name}</div>
                  {room.amenities.length > 0 && <div className={s.roomAmenities}>{room.amenities.join(' · ')}</div>}
                </div>
                <div className={s.rows}>
                  {tourRows(room.photos).map((row) => (
                    <div className={`${s.row} ${row.length === 1 ? s.rowOne : s.rowTwo}`} key={row[0].idx}>
                      {row.map((photo) => (
                        <button key={photo.idx} className={`${s.photo} focus-tile`} type="button" data-idx={photo.idx}
                          aria-label={ui.imageLabel(photo.idx + 1)} onClick={() => onOpenPhoto(photo)}>
                          <img loading="lazy" alt={room.name} src={photo.src} />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
