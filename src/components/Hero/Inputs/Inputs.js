import React, { useState, useCallback, useRef, memo } from 'react';
import Controls from './Controls';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';
import classNames from 'classnames';
import { getState } from '@helpers';

export default memo(function Inputs({
  state,
  controlsOpen,
  controlsHeight,
  setControlsHeight,
  errors,
  updateErrors
}) {
  const ref = useRef(null);
  useResizeObserver(ref, ({ height }) => setControlsHeight(height));
  const [currentState, _setCurrentState] = useState(() => ({ ...state }));

  const setCurrentState = useCallback((value, name) => {
    _setCurrentState(state => getState(state, value, name));
  }, []);

  return (
    <div
      className={classNames(styles.inputWrapper, {
        [styles.open]: controlsOpen,
        [styles.hasError]: !!errors?.length
      })}
      style={{ marginBottom: controlsHeight + 100 }}
    >
      <div
        ref={ref}
        className={styles.inputs}
      >
        <Outline />
        <div className={styles.inner}>
          <Row>
            <Controls
              state={currentState}
              errors={errors}
              updateErrors={updateErrors}
              controlsOpen={controlsOpen}
              onChange={setCurrentState}
            />
          </Row>
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