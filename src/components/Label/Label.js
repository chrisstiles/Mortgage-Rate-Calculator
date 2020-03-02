import React from 'react';
import styles from './Label.module.scss';
import classNames from 'classnames';

export default function Label({ children, className, ...restProps }) {
  return (
    <label
      className={classNames(styles.label, className)}
      {...restProps}
    >
      {children}
    </label>
  );
}