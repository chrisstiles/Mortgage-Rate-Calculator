import React, { memo } from 'react';
import { Button } from '@input';
import styles from './ControlButtons.module.scss';
import classNames from 'classnames';
import { compareObjects } from '@helpers';
import { keys } from '@enums';

export default memo(function ControlButtons({
  className,
  state,
  prevState,
  hasErrors,
  refreshData,
  setState,
  setControlsOpen
}) {
  const canRefresh =
    !compareObjects(
      state,
      prevState,
      Object.keys(state).filter(k => k !== keys.LOAN_TYPE)
    ) && !hasErrors;

  const handleResetClick = () => {
    setState(prevState);
    setControlsOpen(false);
  };

  const handleRefreshClick = () => {
    if (canRefresh) {
      refreshData();
    }
  };

  return (
    <div className={classNames(styles.wrapper, className)}>
      <Button
        className={styles.reset}
        theme="minimal"
        icon="reset"
        fontSize={13}
        onClick={handleResetClick}
      >
        Reset loan assumptions
      </Button>
      <Button
        fontSize={15}
        className={classNames(styles.refresh, {
          [styles.disabled]: !canRefresh
        })}
        onClick={handleRefreshClick}
      >
        Refresh Rates
      </Button>
    </div>
  );
});
