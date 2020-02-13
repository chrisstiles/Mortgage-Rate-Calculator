import React, { useState, memo, useEffect } from 'react';
import styles from './Content.module.scss';
import classNames from 'classnames';

export default memo(function ContentWrapper({ controlsOpen, controlsHeight }) {
  const offset = controlsHeight ? -controlsHeight : 0;
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setHasInitialized(true), 100);
  }, []);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.shifted]: controlsOpen,
        [styles.noAnimation]: !hasInitialized
      })}
      style={{
        transform: `translateY(${offset}px)`
      }}
    >
      <div
        className={styles.angle}
        style={{ height: controlsHeight + 100 }}
      />
      <Content />
    </div>
  );
});

const Content = memo(() => {
  return (
    <div className={styles.content}>
      Content here
    </div>
  );
});