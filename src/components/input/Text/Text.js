import React, { useState, useMemo, useCallback, memo } from 'react';
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
  maxValue,
  minValue,
  icon: _icon,
  iconStyle = {},
  iconLeft,
  insetLeft,
  iconClassName,
  style = {},
  fieldStyle,
  onChange = () => {},
  ...restProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isNumber = isCurrency || format;

  const handleChange = useCallback(value => {
    onChange(value);
    console.log(value)
  }, [onChange]);

  const [props, icon] = useMemo(() => {
    const props = {
      type,
      className: classNames(styles.input, className),
      style: { ...style, paddingLeft: insetLeft },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    };

    if (isNumber) {
      props.onValueChange = ({ value }) => handleChange(value);
    } else {
      props.onChange = e => handleChange(e.target.value);
    }

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
  }, [
    isCurrency,
    _icon,
    className,
    insetLeft,
    style,
    type,
    isNumber,
    handleChange
  ]);
 
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
        <React.Fragment>
          {isNumber ?
            <NumberFormat {...{ ...props, ...restProps }} />
          :
            <input {...{ ...props, ...restProps }} />
          }
        </React.Fragment>
      </div>
    </Field>
  );
});

// function limit(val, min, max) {
//   if (val.length === 1 && val[0] > max[0]) {
//     val = '0' + val;
//   }

//   if (val.length === 2) {
//     if (Number(val) === 0) {
//       val = '01';

//       //this can happen when user paste number
//     } else if (val > max) {
//       val = max;
//     }
//   }

//   return val;
// }