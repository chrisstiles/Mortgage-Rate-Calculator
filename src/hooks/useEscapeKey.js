import { useEffect } from 'react';

export default function useEscapeKey(callback, requireKeyUp) {
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        callback();
      }
    }

    const event = requireKeyUp ? 'keyup' : 'keydown';

    window.addEventListener(event, handler);

    return () => {
      window.removeEventListener(event, handler);
    }
  }, [callback, requireKeyUp]);
}