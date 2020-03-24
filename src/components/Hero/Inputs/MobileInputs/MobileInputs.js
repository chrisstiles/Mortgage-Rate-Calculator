import React, { useEffect, useRef, memo } from 'react';
import ReactDOM from 'react-dom';
import styles from './MobileInputs.module.scss';
import useWindowSize from '@hooks/useWindowSize';
import useEvent from '@hooks/useEvent';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import classNames from 'classnames';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

const MobileInputs = memo(React.forwardRef(({
  controlsOpen,
  children,
  setControlsOpen,
}, ref) => {
  const closingRef = useRef(false);
  const { height: windowHeight } = useWindowSize();
  const [{ y }, set] = useSpring(() => ({
    y: windowHeight,
    config: {
      mass: 0.2,
      friction: 10,
      tension: 140
    }
  }));

  useEffect(() => {
    if (controlsOpen) {
      set({ y: 0 })
    } else {
      set({ y: windowHeight })
    }

    closingRef.current = false;
  }, [controlsOpen, windowHeight, set]);

  const prevY = useRef(windowHeight);
  const bind = useDrag(({ last, down, velocity, movement: [mx, my] }) => {
    const y = down ? my : 0;

    if (!closingRef.current) {
      if (last && prevY.current >= windowHeight / 3) {
        closingRef.current = true;
        prevY.current = windowHeight;
        set({ y: windowHeight });
        setControlsOpen(false);
      } else {
        prevY.current = y;
        set({ y });
      }
    }
  }, { axis: 'y' });

  useEvent('keydown', e => {
    if (e.key === 'Escape') {
      setControlsOpen(false);
    }
  });

  return ReactDOM.createPortal(
      <div
        ref={ref}
        className={classNames(styles.wrapper, {
          [styles.open]: controlsOpen
        })}
      >
      <animated.div
        className={styles.bg}
        style={{ opacity: y.to([0, windowHeight], [1, 0], 'clamp') }}
        onClick={() => setControlsOpen(false)}
      />
      <RemoveScroll enabled={controlsOpen}>
        <animated.div
          className={styles.contentWrapper}
          style={{ y }}
        >
          <div
            {...bind()}
            className={styles.handle}
          />
          <div className={styles.content}>
            <FocusLock disabled={!controlsOpen}>
              {children}
            </FocusLock>
          </div>
        </animated.div>
      </RemoveScroll>
    </div>, document.body);
}));

export default MobileInputs;