import React, { useState } from 'react';
import { Field } from '@input';
import classNames from 'classnames';
import styles from './Text.module.scss';
import MaskedInput from 'react-text-mask';

export default function Text({
  className,
  fieldClassName,
  label,
  type = 'text',
  icon,
  iconStyle = {},
  iconLeft,
  insetLeft,
  iconClassName,
  mask = false,
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
        <MaskedInput
          type="text"
          mask={mask}
          guide={false}
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