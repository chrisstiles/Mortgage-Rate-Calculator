import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

export default function Button({
  children,
  className,
  href,
  showArrow: _showArrow,
  theme = 'primary',
  style = {},
  fontSize,
  ...restProps
}) {
  const showArrow = theme === 'primary' && (_showArrow || !!href);
  const props = {
    ...restProps,
    style: { ...style, fontSize },
    className: classNames(styles.button, className, {
      [styles.arrow]: showArrow,
      [styles[theme]]: theme
    })
  };

  return (
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
}