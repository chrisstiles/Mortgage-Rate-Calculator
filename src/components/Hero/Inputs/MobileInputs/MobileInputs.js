import React, { useEffect, useRef, memo } from 'react';
import ReactDOM from 'react-dom';
import styles from './MobileInputs.module.scss';
import useWindowSize from '@hooks/useWindowSize';
import useEvent from '@hooks/useEvent';
import { Button } from '@input';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import classNames from 'classnames';
import { useSpring, animated } from 'react-spring/web.cjs.js';
import { useDrag } from 'react-use-gesture';

const config = {
  mass: 0.2,
  friction: 10,
  tension: 140
}

// IE will not play nicely with React Spring
const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

const MobileInputsWrapper = React.forwardRef((props, ref) => {
  if (isIE11) {
    return <MobileInputsFallback ref={ref} {...props} />;
  } else {
    return <MobileInputs ref={ref} {...props} />
  }
});

export default MobileInputsWrapper;

const MobileInputs = memo(React.forwardRef(({
  controlsOpen,
  children,
  setControlsOpen,
}, ref) => {
  const closingRef = useRef(false);
  const { height: windowHeight } = useWindowSize();
  const [{ y }, set] = useSpring(() => ({ y: windowHeight, config }));

  useEffect(() => {
    if (controlsOpen) {
      set({ y: 0, config })
    } else {
      set({ y: windowHeight, config })
    }

    closingRef.current = false;
  }, [controlsOpen, windowHeight, set]);

  const prevY = useRef(windowHeight);
  const bind = useDrag(({ last, down, vxvy: [, vy], movement: [mx, my] }) => {
    const y = down ? my : 0;

    if (!closingRef.current) {
      if (last && prevY.current >= windowHeight / 3) {
        closingRef.current = true;
        prevY.current = windowHeight;
        set({ y: windowHeight, config: { ...config, velocity: vy } });
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
            <FocusLock
              disabled={!controlsOpen}
              autoFocus={false}
            >
              {children}
            </FocusLock>
          </div>
        </animated.div>
      </RemoveScroll>
    </div>, document.body
  );
}));

const MobileInputsFallback = memo(React.forwardRef(({
  controlsOpen,
  children,
  setControlsOpen,
}, ref) => {
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
      <RemoveScroll enabled={controlsOpen}>
        <div
          className={classNames(styles.content, styles.ie11)}
        >
          <FocusLock disabled={!controlsOpen}>
            <Button
              theme="minimal"
              className={styles.close}
              onClick={() => setControlsOpen(false)}
              closeTooltipText="Close"
              isClose
            />
            {children}
          </FocusLock>
        </div>
      </RemoveScroll>
    </div>, document.body
  );
}));