import React from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';

export default function Text({ className, ...restProps }) {
  return (
    <input
      type="text"
      className={classNames(styles.input, className)}
      {...restProps}
    />
  );
}