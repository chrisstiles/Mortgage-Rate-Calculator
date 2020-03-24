/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { isFunction } from 'lodash';

export default function useEvent(type, elementOrCallback, callback, deps = []) {
  const hasElement = !isFunction(elementOrCallback);
  const callbackRef = useRef(hasElement ? callback : elementOrCallback);

  useEffect(() => {
    callbackRef.current = hasElement ? callback : elementOrCallback;
  });

  const element = useRef(null);

  useEffect(() => {
    element.current = hasElement ? elementOrCallback : document;
  }, [hasElement]);

  useEffect(() => {
    const handler = e => {
      callbackRef.current(e);
    };

    const el = element.current;
    el.addEventListener(type, handler);

    return () => {
      el.removeEventListener(type, handler);
    }
  }, [type, element, ...deps]);
}