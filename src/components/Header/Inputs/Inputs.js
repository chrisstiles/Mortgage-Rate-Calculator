import React, { memo, useRef } from 'react';
import Text from '@components/Text';
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
        <Row>
          <Text defaultValue="Test" />
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
  );
});

function Row({ children }) {
  return (
    <div className={styles.row}>
      {children}
    </div>
  );
}