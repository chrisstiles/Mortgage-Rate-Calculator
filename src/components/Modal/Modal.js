import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@input';
import styles from './Modal.module.scss';
import useEvent from '@hooks/useEvent';
import useClickOutside from '@hooks/useClickOutside';
// import { useSpring, animated } from 'react-spring/web.cjs.js';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';

export default function Modal({ children, isOpen, setIsOpen }) {
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));

  useEvent('keydown', e => {
    if (isOpen && e.key === 'Escape') {
      setIsOpen(false);
    }
  });

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <RemoveScroll className={styles.wrapper}>
      <div className={styles.content} ref={ref}>
        <FocusLock autoFocus={false}>
          <Button
            theme="minimal"
            className={styles.close}
            onClick={e => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            closeTooltipText="Close"
            isClose
          />
          {children}
        </FocusLock>
      </div>
    </RemoveScroll>,
    document.body
  );
}
