import React, { useRef, memo } from 'react';
import Controls from './Controls';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';
import classNames from 'classnames';

export default memo(function Inputs({
  state,
  controlsOpen,
  controlsHeight,
  setControlsHeight,
  errors,
  updateErrors,
  setState
}) {
  const ref = useRef(null);
  useResizeObserver(ref, ({ height }) => setControlsHeight(height));

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
              state={state}
              errors={errors}
              updateErrors={updateErrors}
              controlsOpen={controlsOpen}
              onChange={setState}
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