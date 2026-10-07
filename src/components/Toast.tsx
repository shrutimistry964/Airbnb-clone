import s from './Toast.module.css';

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return <div className={`${s.toast} ${visible ? s.shown : ''}`} role="status" aria-live="polite">{message}</div>;
}
