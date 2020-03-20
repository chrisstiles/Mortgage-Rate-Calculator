import React, { useState, memo, useEffect } from 'react';
import Header from './Header';
import RateTable from './RateTable';
import LoadingBar from './LoadingBar';
import styles from './Content.module.scss';
import classNames from 'classnames';
import sampleData from './RateTable/sample-data.json';

export default memo(function ContentWrapper({
  isLoading,
  controlsHeight,
  effectiveDate,
  loanType
}) {
  const shiftY = controlsHeight ?? 0;
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
        transform: `translateY(${shiftY}px)`,
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
        effectiveDate={effectiveDate}
        isLoading={isLoading}
      />
    </div>
  );
});

const Content = memo(({ loanType, shiftY, isLoading, effectiveDate }) => {
  return (
    <div
      className={classNames(styles.content, {
        [styles.loading]: isLoading
      })}
    >
      {isLoading && <LoadingBar />}
      <Header
        data={sampleData}
        loanType={loanType}
        isLoading={isLoading}
        effectiveDate={effectiveDate}
      />
      <RateTable
        data={sampleData}
        shiftY={shiftY}
        isLoading={isLoading}
      />
    </div>
  );
});