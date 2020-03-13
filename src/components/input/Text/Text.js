import React, { useState, useMemo, useCallback, useRef, memo, useEffect } from 'react';
import { Field } from '@input';
import classNames from 'classnames';
import styles from './Text.module.scss';
import NumberFormat from 'react-number-format';

export default memo(function Text({
  value,
  name,
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
  maxWidth,
  validate,
  loanType,
  hasError,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ...restProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isNumber = isCurrency || format;

  const valueRef = useRef('');
  useEffect(() => { valueRef.current = value; });

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus(valueRef.current, name);
  }, [onFocus, name]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur(valueRef.current, name);
  }, [onBlur, name]);

  const handleChange = useCallback(value => {
    onChange(value, name);
  }, [onChange, name]);

  const [props, icon] = useMemo(() => {
    const props = {
      value,
      type,
      validate,
      className: classNames(styles.input, className),
      style: { ...style, paddingLeft: insetLeft },
      onFocus: handleFocus,
      onBlur: handleBlur,
    };

    if (isNumber) {
      props.format = format;
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

      const insetLeft = props.insetLeft ?? 32;
      props.style = { ...props.style, paddingLeft: insetLeft };
    }

    return [props, icon];
  }, [
    value,
    format,
    isCurrency,
    _icon,
    className,
    insetLeft,
    style,
    type,
    isNumber,
    handleFocus,
    handleBlur,
    handleChange,
    validate
  ]);
 
  return (
    <Field
      label={label}
      className={fieldClassName}
      style={fieldStyle}
      maxWidth={maxWidth}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.focus]: isFocused,
          [styles.hasIcon]: icon,
          [styles.hasError]: hasError
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