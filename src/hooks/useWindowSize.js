import { useState, useEffect, useRef } from 'react';
import { call } from '@helpers';

export default function useWindowSize(callback, shouldReturnValues = true) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const prevSize = useRef({ ...size });

  useEffect(() => {
    const handler = e => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (
        prevSize.current.width !== width ||
        prevSize.current.height !== height
      ) {
        const newSize = { width, height };
        prevSize.current = newSize;
        call(callback, newSize);

        if (shouldReturnValues) {
          setSize(newSize);
        }
      }
    };

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, [shouldReturnValues, callback]);

  return shouldReturnValues ? size : null;
}