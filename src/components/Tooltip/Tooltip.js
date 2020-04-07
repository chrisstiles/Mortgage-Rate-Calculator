import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './Tooltip.module.scss';

export default memo(function Tooltip({
  className,
  children,
  text = '',
  forceHidden,
  forceVisible,
  offset,
  ...restProps
}) {
  return (
    <div className={classNames(styles.wrapper, className)} {...restProps}>
      {children}
      {text && (
        <div
          className={classNames(styles.tooltip, {
            [styles.hidden]: forceHidden,
            [styles.visible]: forceVisible
          })}
          style={{ marginTop: offset }}
        >
          {text}
        </div>
      )}
    </div>
  );
});
