import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

export default function Button({
  children,
  className,
  href,
  showArrow: _showArrow,
  ...restProps
}) {
  const showArrow = _showArrow ?? !!href;
  const props = {
    ...restProps,
    className: classNames(
      styles.button,
      className,
      { [styles.arrow]: showArrow }
    )
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