import React, { memo } from 'react';
import { Home, Arrow } from '../icons';
import styles from './Assumptions.module.scss';
import classNames from 'classnames';
import Spinner from 'react-md-spinner';

export default memo(function AssumptionsText({
  state,
  zipCodes,
  isLoading: _isLoading,
  errors
}) {
  const isLoading = _isLoading || !zipCodes;
  let icon;

  if (errors) {
    icon = 'Error:';
  } else if (isLoading) {
    icon = (
      <Spinner
        size={16}
        singleColor="#383838"
      />
    );
  } else {
    icon = <Home />;
  }

  return (
    <div
      className={styles.content}
      tabIndex="-1"
    >
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.text}>
        Purchasing a $500,000 home in Livermore, CA. Excellent credit score with 20% down.
      </div>
      <div className={styles.arrowWrapper}>
        <div className={classNames(styles.arrow, styles.down)}>
          <Arrow />
        </div>
        <div className={classNames(styles.arrow, styles.up)}>
          <Arrow />
        </div>
      </div>
    </div>
  );
});