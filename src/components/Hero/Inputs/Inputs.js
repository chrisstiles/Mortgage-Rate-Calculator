import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import Controls from './Controls';
import MobileInputs from './MobileInputs';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';
import useWindowSize from '@hooks/useWindowSize';
import classNames from 'classnames';

export default memo(function Inputs({
  state,
  loanType,
  controlsOpen,
  controlsHeight,
  setControlsHeight,
  errors,
  isMobile,
  updateErrors,
  setState,
  setControlsOpen
}) {
  const ref = useRef(null);
  const handleResize = useCallback(({ height }) => {
    setControlsHeight(height);
  }, [setControlsHeight]);

  useResizeObserver(ref, handleResize);

  const [offset, setOffset] = useState(getOffset());
  const resizeTimer = useRef(null);

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    clearTimeout(resizeTimer.current);

    resizeTimer.current = setTimeout(() => {
      setOffset(getOffset());
    }, 50);
  }, [windowWidth]);

  const controls = (
    <Controls
      state={state}
      loanType={loanType}
      errors={errors}
      updateErrors={updateErrors}
      controlsOpen={controlsOpen}
      onChange={setState}
    />
  );

  if (isMobile) {
    return (
      <MobileInputs
        ref={ref}
        controlsOpen={controlsOpen}
        setControlsOpen={setControlsOpen}
      >
        {controls}
      </MobileInputs>
    );
  }

  return (
    <div
      className={classNames(styles.inputWrapper, {
        [styles.open]: controlsOpen,
        [styles.hasError]: !!errors?.length
      })}
      style={{ marginBottom: controlsHeight + offset }}
    >
      <div
        ref={ref}
        className={styles.inputs}
      >
        <Outline />
        <div className={styles.inner}>
          <Row>{controls}</Row>
        </div>
      </div>
    </div>
  );
});

function Row({ children }) {
  return (
    <div className={styles.row}>
      {children}
    </div>
  );
}

function Outline() {
  return (
    <div className={styles.outline}>
      <div className={styles.top}>
        <span>Loan Assumptions</span>
      </div>
    </div>
  );
}

function getOffset() {
  return window.innerWidth > 1050 ? 100 : 90;
}