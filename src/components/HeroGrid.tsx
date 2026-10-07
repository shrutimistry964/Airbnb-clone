import { heroPhotos, ui, type Photo } from '../data/listing';
import { Icon } from './Icon';
import s from './HeroGrid.module.css';

interface Props { onOpenPhoto: (photo: Photo) => void; onShowAll: () => void }

export function HeroGrid({ onOpenPhoto, onShowAll }: Props) {
  return (
    <section className={s.wrap} aria-label={ui.photosLabel}>
      <div className={s.grid} id="heroGrid">
        {heroPhotos.map((photo, i) => (
          <button key={photo.idx} className={`${s.tile} focus-tile`} type="button" aria-label={ui.imageLabel(i + 1)}
            onClick={() => onOpenPhoto(photo)}>
            <img src={photo.src} alt="" decoding="async" loading={i === 0 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>
      <button className={s.showAll} type="button" id="showAllPhotos" onClick={onShowAll}>
        <span className={s.showAllIcon}><Icon name="grid" /></span> {ui.showAllPhotos}
      </button>
    </section>
  );
}
