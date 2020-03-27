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
  theme,
  size,
  inlineLabel,
  ...restProps
}) {
  return (
    <div
      className={classNames(
        'fieldWrapper',
        styles.wrapper,
        className,
        {
          [styles.dark]: theme === 'dark',
          [styles.inlineLabel]: inlineLabel,
          [styles.small]: size === 'small'
        }
      )}
      style={{ ...style, maxWidth }}
      {...restProps}
    >
      {label &&
        <Label className={styles.label}>{label}</Label>
      }
      {children}
    </div>
  );
}