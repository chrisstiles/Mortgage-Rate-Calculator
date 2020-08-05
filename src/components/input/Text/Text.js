import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  memo,
  useEffect
} from 'react';
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
  allowNegative,
  theme = 'light',
  size,
  icon: _icon,
  iconPosition = 'left',
  iconStyle = {},
  iconLeft,
  iconPadding,
  iconClassName,
  style = {},
  fieldStyle,
  width,
  maxWidth,
  validate,
  loanType,
  inlineLabel,
  hasError,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isNumber = isCurrency || format;

  const valueRef = useRef('');
  useEffect(() => {
    valueRef.current = value;
  });

  const handleFocus = useCallback(() => {
    setIsFocused(true);

    if (onFocus) {
      onFocus(valueRef.current, name);
    }
  }, [onFocus, name]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    if (onBlur) {
      onBlur(valueRef.current, name);
    }
  }, [onBlur, name]);

  const handleChange = useCallback(
    value => {
      if (onChange) {
        onChange(value, name);
      }
    },
    [onChange, name]
  );

  const [props, icon] = useMemo(() => {
    const paddingProperty =
      iconPosition === 'right' ? 'paddingRight' : 'paddingLeft';
    const props = {
      value,
      type,
      validate,
      className: classNames(styles.input, className),
      style: { ...style, [paddingProperty]: iconPadding },
      onFocus: handleFocus,
      onBlur: handleBlur
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
      props.allowNegative = allowNegative;
      props.decimalSeparator = false;

      const padding =
        props.iconPadding ?? (size === 'small' ? 20 : 30);
      props.style = { ...props.style, [paddingProperty]: padding };
    }

    return [props, icon];
  }, [
    value,
    format,
    isCurrency,
    allowNegative,
    size,
    _icon,
    iconPosition,
    className,
    iconPadding,
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
      theme={theme}
      size={size}
      inlineLabel={inlineLabel}
      maxWidth={maxWidth}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.dark]: theme === 'dark',
          [styles.small]: size === 'small',
          [styles.leftIcon]: icon && iconPosition !== 'right',
          [styles.rightIcon]: icon && iconPosition === 'right',
          [styles.focus]: isFocused,
          [styles.hasError]: hasError
        })}
        style={{ width }}
      >
        {icon && (
          <div
            className={classNames(styles.icon, iconClassName)}
            style={{ ...iconStyle, left: iconLeft }}
          >
            {icon}
          </div>
        )}
        <React.Fragment>
          {isNumber ? (
            <NumberFormat {...{ ...props, ...restProps }} />
          ) : (
            <input {...{ ...props, ...restProps }} />
          )}
        </React.Fragment>
      </div>
    </Field>
  );
});
