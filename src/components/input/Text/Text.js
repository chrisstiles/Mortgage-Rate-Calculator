import React, { useState, memo } from 'react';
import { Field } from '@input';
import classNames from 'classnames';
import styles from './Text.module.scss';
import NumberFormat from 'react-number-format';

export default memo(function Text({
  className,
  fieldClassName,
  label,
  type = 'text',
  format,
  isCurrency,
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
  const isNumber = isCurrency || format;
  const props = {
    type,
    className: classNames(styles.input, className),
    style: { ...style, paddingLeft: insetLeft },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    ...restProps
  };

  if (isCurrency) {
    icon = icon === undefined ? '$' : icon;
    props.thousandSeparator = true;
    props.allowNegative = false;
    props.decimalSeparator = false;
  }

  const Component = isNumber ? NumberFormat : p => {
    return <input {...p} />
  };
 
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
        <Component {...props} />
      </div>
    </Field>
  );
});