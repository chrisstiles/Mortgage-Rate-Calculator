import React, { useRef, memo } from 'react';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';

export default memo(function Inputs({
  children,
  controlsHeight,
  setControlsHeight
}) {
  const ref = useRef(null);
  useResizeObserver(ref, ({ height }) => setControlsHeight(height));

  return (
    <div
      className={styles.inputWrapper}
      style={{ marginBottom: controlsHeight + 100 }}
    >
      <div
        ref={ref}
        className={styles.inputs}
        style={{
          height: 300,
          border: '2px dashed #fff',
          padding: 50
        }}
      >
        {children}
      </div>
    </div>
  );
});