import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_MS = 2500;

export function useToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((text: string) => {
    setMessage(text); setVisible(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(false), TOAST_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { message, visible, show };
}
