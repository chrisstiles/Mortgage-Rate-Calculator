import { useEffect, useRef, useCallback } from 'react';

export default function useClickOutside(ref, callback, requireMouseUp) {
  const originalTarget = useRef(null);

  useEffect(() => {
    return () => {
      originalTarget.current = null;
    }
  }, []);

  const handler = useCallback(e => {
    const target = requireMouseUp && originalTarget.current ? originalTarget.current : e.target;

    if (callback && ref.current && !ref.current.contains(target)) {
      callback(e);
    }
  }, [ref, requireMouseUp, callback]);

  useEffect(() => {
    const setOriginalTarget = e => {
      originalTarget.current = e.target;
    }

    const type = requireMouseUp ? 'click' : 'mousedown';

    document.addEventListener('mousedown', setOriginalTarget);
    document.addEventListener(type, handler);

    return () => {
      document.removeEventListener('mousedown', setOriginalTarget);
      document.removeEventListener(type, handler);
    }
  }, [ref, handler, requireMouseUp]);
}