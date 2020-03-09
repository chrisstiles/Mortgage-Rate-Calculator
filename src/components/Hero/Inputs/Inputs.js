import React, { memo, useRef } from 'react';
import { Text } from '@input';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';
import classNames from 'classnames';

export default memo(function Inputs({
  state,
  controlsOpen,
  controlsHeight,
  setControlsHeight
}) {
  const ref = useRef(null);
  useResizeObserver(ref, ({ height }) => setControlsHeight(height));
  const tabIndex = controlsOpen ? 0 : -1;

  return (
    <div
      className={classNames(styles.inputWrapper, {
        [styles.open]: controlsOpen
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
            <Text
              label="Loan amount"
              tabIndex={tabIndex}
              defaultValue={state.loanAmount}
              placeholder="Enter a loan amount"
              isCurrency
            />
            <Text
              label="Loan amount"
              tabIndex={tabIndex}
              placeholder="This is a placeholder"
            />
            <Text
              label="Loan amount"
              tabIndex={tabIndex}
            />
          </Row>

          <Row>
            <Text
              label="Loan amount"
              tabIndex={tabIndex}
            />
            <Text
              label="Loan amount"
              tabIndex={tabIndex}
            />
            <Text
              label="Loan amount"
              tabIndex={tabIndex}
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