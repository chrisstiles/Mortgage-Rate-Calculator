import { useState, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useResizeObserver(ref, callback, shouldReturnValues = true) {
  const [size, setSize] = useState({
    width: ref.current?.offsetWidth,
    height: ref.current?.offsetHeight
  });

  const prevSize = useRef({ ...size });

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (!entries?.length) {
        return;
      }

      const entry = entries[0];
      const { offsetWidth: width, offsetHeight: height } = entry.target;

      if (
        prevSize.current.width !== width ||
        prevSize.current.height !== height
      ) {
        const newSize = { width, height };
        prevSize.current = newSize;

        if (callback) {
          callback(newSize, entry);
        }

        if (shouldReturnValues) {
          setSize(newSize);
        }
      }
    });

    const el = ref.current;
    observer.observe(el);

    return () => observer.unobserve(el);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReturnValues, callback, ref.current]);

  return shouldReturnValues ? size : null;
}