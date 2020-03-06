import React, { useState } from 'react';
import Field from '@components/Field';
import classNames from 'classnames';
import styles from './Text.module.scss';

export default function Text({
  className,
  fieldClassName,
  label,
  icon,
  ...restProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <Field
      label={label}
      className={fieldClassName}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.focus]: isFocused
        })}
      >
        <div className={styles.icon}>$</div>
        <input
          type="text"
          className={classNames(styles.input, className)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...restProps}
        />
      </div>
    </Field>
  );
}