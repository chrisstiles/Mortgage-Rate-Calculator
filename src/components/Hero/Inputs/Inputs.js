import React, { memo, useRef } from 'react';
import { Text } from '@input';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';
import classNames from 'classnames';

export default memo(function Inputs({
  controlsOpen,
  controlsHeight,
  setControlsHeight
}) {
  const ref = useRef(null);
  useResizeObserver(ref, ({ height }) => setControlsHeight(height));

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
            <Text label="Loan amount" />
            <Text defaultValue="Test" />
            <Text defaultValue="Test" />
          </Row>

          <Row>
            <Text defaultValue="Test" />
            <Text defaultValue="Test" />
            <Text defaultValue="Test" />
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
        <span>Loan Details</span>
      </div>
    </div>
  );
}