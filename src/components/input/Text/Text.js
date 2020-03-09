import React, { useState, useMemo, memo } from 'react';
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
  icon: _icon,
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

  const [props, icon] = useMemo(() => {
    const props = {
      type,
      className: classNames(styles.input, className),
      style: { ...style, paddingLeft: insetLeft },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    };

    let icon = _icon;

    if (isCurrency) {
      icon = icon === undefined ? '$' : icon;
      props.thousandSeparator = true;
      props.allowNegative = false;
      props.decimalSeparator = false;

      const insetLeft = props.insetLeft ?? 35;
      props.style = { ...props.style, paddingLeft: insetLeft };
    }

    return [props, icon];
  }, [isCurrency, _icon, className, insetLeft, style, type]);

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
        <Component {...{ ...props, ...restProps }} />
      </div>
    </Field>
  );
});