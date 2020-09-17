import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import Tooltip from '@components/Tooltip';
import { Reset } from './icons';

const icons = {
  reset: Reset
};

export default function Button({
  children,
  className,
  href,
  showArrow: _showArrow,
  theme = 'primary',
  style = {},
  contentStyle = {},
  contentClassName,
  icon,
  iconClassName,
  color,
  fontSize,
  isClose,
  closeTooltipText = 'Close',
  disabled,
  ...restProps
}) {
  const showArrow = theme === 'primary' && (_showArrow || !!href);
  const props = {
    ...restProps,
    style: { ...style, color, fontSize },
    className: classNames(styles.button, {
      [className]: className && (!isClose || !closeTooltipText),
      [styles.arrow]: showArrow,
      [styles[theme]]: theme,
      [styles.close]: isClose,
      [styles.disabled]: disabled
    })
  };

  const Icon = icons[icon];

  const content = (
    <div
      className={classNames(styles.content, contentClassName)}
      style={contentStyle}
      tabIndex="-1"
    >
      {Icon && (
        <Icon className={classNames(styles.icon, iconClassName)} />
      )}
      {children}
    </div>
  );

  const component = (
    <React.Fragment>
      {href ? (
        <a href={href} {...props}>
          {content}
        </a>
      ) : (
        <button {...props}>{content}</button>
      )}
    </React.Fragment>
  );

  if (isClose && closeTooltipText) {
    return (
      <Tooltip text={closeTooltipText} className={className}>
        {component}
      </Tooltip>
    );
  }

  return component;
}
