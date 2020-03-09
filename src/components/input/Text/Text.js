import React, { useState } from 'react';
import { Field } from '@input';
import classNames from 'classnames';
import styles from './Text.module.scss';

export default function Text({
  className,
  fieldClassName,
  label,
  icon,
  iconStyle = {},
  iconLeft,
  insetLeft,
  iconClassName,
  style = {},
  fieldStyle,
  ...restProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <Field
      label={label}
      className={fieldClassName}
      style={fieldStyle}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.focus]: isFocused,
          [styles.hasIcon]: icon
        })}
      >
        {icon &&
          <div
            className={classNames(styles.icon, iconClassName)}
            style={{ ...iconStyle, left: iconLeft }}
          >
            {icon}
          </div>
        }
        <input
          type="text"
          className={classNames(styles.input, className)}
          style={{ ...style, paddingLeft: insetLeft }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...restProps}
        />
      </div>
    </Field>
  );
}