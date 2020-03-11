import React from 'react';
import { Label } from '@input';
import styles from './Field.module.scss';
import classNames from 'classnames';

export default function Field({
  label,
  className,
  children,
  maxWidth,
  style = {},
  ...restProps
}) {
  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={{ ...style, maxWidth }}
      {...restProps}
    >
      {label &&
        <Label>{label}</Label>
      }
      {children}
    </div>
  );
}