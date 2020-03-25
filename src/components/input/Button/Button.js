import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import Tooltip from '@components/Tooltip';

export default function Button({
  children,
  className,
  href,
  showArrow: _showArrow,
  theme = 'primary',
  style = {},
  fontSize,
  isClose,
  closeTooltipText = 'Close',
  ...restProps
}) {
  const showArrow = theme === 'primary' && (_showArrow || !!href);
  const props = {
    ...restProps,
    style: { ...style, fontSize },
    className: classNames(styles.button, {
      [className]: !isClose || !closeTooltipText,
      [styles.arrow]: showArrow,
      [styles[theme]]: theme,
      [styles.close]: isClose
    })
  };

  const component = (
    <React.Fragment>
      {href ?
        <a href={href} {...props}>
          <div
            className={styles.content}
            tabIndex="-1"
          >
            {children}
          </div>
        </a>
      :
        <button {...props}>
          <div
            className={styles.content}
            tabIndex="-1"
          >
            {children}
          </div>
        </button>
      }
    </React.Fragment>
  );

  if (isClose && closeTooltipText) {
    return (
      <Tooltip
        text={closeTooltipText}
        className={className}
      >
        {component}
      </Tooltip>
    );
  }

  return component;
}