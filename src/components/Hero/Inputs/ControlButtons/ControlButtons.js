import React, { memo } from 'react';
import { Button } from '@input';
import styles from './ControlButtons.module.scss';
import classNames from 'classnames';
import { darkHeroStyle } from '@config';

export default memo(function ControlButtons({
  className,
  canRefresh,
  isLoading,
  refresh,
  reset
}) {
  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.dark]: darkHeroStyle
      })}
    >
      <Button
        className={classNames(styles.reset, {
          [styles.disabled]: isLoading
        })}
        theme="minimal"
        icon="reset"
        fontSize={13}
        onClick={reset}
      >
        Reset loan assumptions
      </Button>
      <Button
        fontSize={15}
        className={classNames(styles.refresh, {
          [styles.disabled]: !canRefresh
        })}
        onClick={refresh}
      >
        Refresh Rates
      </Button>
    </div>
  );
});
