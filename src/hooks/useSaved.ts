import { useCallback, useState } from 'react';

const KEY = 'listing:saved';

export function useSaved() {
  const [saved, setSaved] = useState<boolean>(() => {
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  });
  const toggle = useCallback(() => setSaved((s) => {
    try { localStorage.setItem(KEY, s ? '0' : '1'); } catch { /* storage unavailable */ }
    return !s;
  }), []);
  return { saved, toggle };
}
