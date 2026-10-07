import { useEffect } from 'react';

/** Marks <body> after keyboard use so focus rings show for keyboard users only, as the reference does. */
export function useKeyboardModality() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Tab' || e.key.startsWith('Arrow')) document.body.classList.add('kbd'); };
    const onPointer = () => document.body.classList.remove('kbd');
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onPointer); };
  }, []);
}
