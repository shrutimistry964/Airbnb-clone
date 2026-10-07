import { useCallback, useEffect, useState } from 'react';
import { listing, roomOfPhoto, sectionNav, toasts, ui, type Photo } from './data/listing';
import { useKeyboardModality } from './hooks/useKeyboardModality';
import { useOverlayHistory } from './hooks/useOverlayHistory';
import { useSaved } from './hooks/useSaved';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useToast } from './hooks/useToast';
import { AmenitiesModal } from './components/AmenitiesModal';
import { BookingCard } from './components/BookingCard';
import { Header } from './components/Header';
import { HeroGrid } from './components/HeroGrid';
import { Lightbox } from './components/Lightbox';
import { Location } from './components/Location';
import { MeetHost } from './components/MeetHost';
import { Overview } from './components/Overview';
import { PhotoTour } from './components/PhotoTour';
import { Reviews } from './components/Reviews';
import { SimilarStays } from './components/SimilarStays';
import { StickyNav } from './components/StickyNav';
import { ThingsToKnow } from './components/ThingsToKnow';
import { TitleBar } from './components/TitleBar';
import { Toast } from './components/Toast';
import sec from './components/Sections.module.css';
import s from './App.module.css';

const SECTION_IDS = sectionNav.map((n) => n.id);

export function App() {
  useKeyboardModality();
  const { saved, toggle } = useSaved();
  const { message, visible, show } = useToast();
  const { state, initialRoom, openTour, openLightbox, setLightboxIndex, close } = useOverlayHistory();
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const { visible: navVisible, active } = useScrollSpy('heroGrid', SECTION_IDS);

  useEffect(() => { document.title = listing.pageTitle; }, []);

  const toggleSave = useCallback(() => {
    show(saved ? toasts.removed : toasts.saved);
    toggle();
  }, [saved, toggle, show]);
  const share = useCallback(() => show(toasts.share), [show]);
  const reserve = useCallback(() => show(toasts.reserve), [show]);
  const openFromHero = useCallback((photo: Photo) => openTour(roomOfPhoto(photo.idx).id), [openTour]);
  const openPhoto = useCallback((photo: Photo) => openLightbox(photo.idx), [openLightbox]);

  return (
    <>
      <a className="skip-link" href="#main">{ui.skipToContent}</a>
      <Header />
      <StickyNav visible={navVisible} active={active} onReserve={reserve} />
      <main id="main">
        <div className="container">
          <TitleBar title={listing.title} saved={saved} onToggleSave={toggleSave} onShare={share} />
          <HeroGrid onOpenPhoto={openFromHero} onShowAll={() => openTour(null)} />
          <div className={s.columns}>
            <div className={s.left}><Overview onShowAmenities={() => setAmenitiesOpen(true)} /></div>
            <BookingCard onReserve={reserve} />
          </div>
          <div className={sec.wide}>
            <Reviews />
            <Location />
            <MeetHost />
            <ThingsToKnow />
            <SimilarStays />
          </div>
        </div>
      </main>

      <PhotoTour open={state.tour} initialRoom={initialRoom} saved={saved} onToggleSave={toggleSave} onShare={share}
        onClose={close} onOpenPhoto={openPhoto} />
      <Lightbox index={state.lightbox} onClose={close} onIndexChange={setLightboxIndex} />
      <AmenitiesModal open={amenitiesOpen} onClose={() => setAmenitiesOpen(false)} />
      <Toast message={message} visible={visible} />
    </>
  );
}
