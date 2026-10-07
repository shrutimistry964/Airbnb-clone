import { listing, ui } from '../data/listing';
import { Icon } from './Icon';
import s from './BookingCard.module.css';
import btn from './shared.module.css';

interface Props { onReserve: () => void }

export function BookingCard({ onReserve }: Props) {
  return (
    <aside className={s.aside}>
      <div className={s.sticky} id="bookingSticky">
        <div className={s.promo}>
          <img className={s.promoIcon} src="/assets/images/ui/discount.svg" alt="" aria-hidden="true" />
          <div className={s.promoText}>{ui.booking.promo}<br /><a href="#">{ui.booking.promoTerms}</a></div>
          <button className={s.claim} type="button">{ui.booking.claim}</button>
        </div>
        <div className={s.card}>
          <div className={s.priceRow}>
            <span className={s.price}>{listing.price}</span>
            <span className={s.qualifier}>{listing.priceQualifier}</span>
          </div>
          <div className={s.fields}>
            <div className={s.dates}>
              <div className={s.field}><div className={s.fieldLabel}>{ui.booking.checkIn}</div><div className={s.fieldValue}>{listing.checkIn}</div></div>
              <div className={s.field}><div className={s.fieldLabel}>{ui.booking.checkOut}</div><div className={s.fieldValue}>{listing.checkOut}</div></div>
            </div>
            <div className={s.guests}>
              <div><div className={s.fieldLabel}>{ui.booking.guests}</div><div className={s.fieldValue}>{listing.guests}</div></div>
              <span className={s.chevron}><Icon name="chevronDown" /></span>
            </div>
          </div>
          <div className={s.cancellation}>{ui.booking.freeCancellation} <b>{listing.freeCancellationBefore}</b></div>
          <button className={`${btn.reserve} ${btn.reserveFull}`} type="button" id="reserveBtn" onClick={onReserve}>{ui.booking.reserve}</button>
          <div className={s.noCharge}>{ui.booking.noCharge}</div>
        </div>
        <div className={s.report}>
          <span className={s.reportIcon}><Icon name="flag" /></span>
          <a href="#">{ui.booking.report}</a>
        </div>
      </div>
    </aside>
  );
}
