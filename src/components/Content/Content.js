import React, { useState, memo, useEffect } from 'react';
import Header from './Header';
import RateTable from './RateTable';
import styles from './Content.module.scss';
import classNames from 'classnames';

export default memo(function ContentWrapper({
  controlsOpen,
  controlsHeight,
  loanType
}) {
  const shiftY = controlsHeight ?? 0;
  const translateY = controlsOpen ? shiftY : 0;
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setHasInitialized(true), 100);
  }, []);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.noAnimation]: !hasInitialized
      })}
      style={{
        transform: `translateY(${translateY}px)`,
        marginTop: -shiftY
      }}
    >
      <div
        className={styles.angle}
        style={{ height: controlsHeight + 150 }}
      />
      <Content
        loanType={loanType}
        shiftY={-shiftY}
        controlsOpen={controlsOpen}
      />
    </div>
  );
});

const Content = memo(({ loanType, shiftY, controlsOpen }) => {
  return (
    <div className={styles.content}>
      <Header loanType={loanType} />
      <RateTable
        shiftY={controlsOpen ? shiftY : 0}
      />
    </div>
  );
});