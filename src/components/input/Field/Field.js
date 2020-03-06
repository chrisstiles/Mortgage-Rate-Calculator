import React from 'react';
import { Label } from '@input';
import styles from './Field.module.scss';
import classNames from 'classnames';

export default function Field({
  label,
  className,
  children,
  ...restProps
}) {
  return (
    <div
      className={classNames(styles.wrapper, className)}
      {...restProps}
    >
      {label &&
        <Label>{label}</Label>
      }
      {children}
    </div>
  );
}