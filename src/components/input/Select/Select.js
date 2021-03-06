import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo
} from 'react';
import { createPortal } from 'react-dom';
import { Field } from '@input';
import { ReactComponent as Arrow } from './arrow.svg';
import useClickOutside from '@hooks/useClickOutside';
import useEscapeKey from '@hooks/useEscapeKey';
import useEvent from '@hooks/useEvent';
import styles from './Select.module.scss';
import classNames from 'classnames';

export default function Select({
  options = [],
  value,
  name,
  label,
  placeholder,
  maxWidth,
  theme = 'light',
  fieldClassName,
  fieldStyle,
  tabIndex = 0,
  hasError,
  onChange,
  onFocus,
  onBlur,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const [rect, setRect] = useState(null);
  const initialFocusedIndex = useRef(null);
  const valueRef = useRef('');
  useEffect(() => { valueRef.current = value; });

  const open = useCallback(() => {
    let { left, top, width } = ref.current.getBoundingClientRect();

    left += window.pageXOffset;
    top += window.pageYOffset;

    setRect(prevRect => {
      if (
        prevRect?.left === left &&
        prevRect?.top === top &&
        prevRect?.width === width
      ) {
        return prevRect;
      }

      return { left, top, width };
    });

    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    initialFocusedIndex.current = null;
    setIsOpen(false);
    
    if (onBlur) {
      onBlur(valueRef.current, name);
    }
  }, [name, onBlur]);

  useEscapeKey(close);
  useEvent('visibilitychange', close);
  useEvent('blur', window, () => {
    ref.current.blur();
    close();
  });

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Tab') {
      close();
    }

    if (!isOpen) {
      const isUp = ['ArrowUp', 'Up'].includes(e.key);
      const isDown = !isUp && ['ArrowDown', 'Down'].includes(e.key);

      if (isUp || isDown) {
        e.preventDefault();
        const index = isUp ? options.length - 1 : 0;
        initialFocusedIndex.current = index;
        open();
      }
    }
  }, [isOpen, options, open, close]);

  const handleChange = useCallback(value => {
    valueRef.current = value;
    onChange(value, name);
    close(value);
  }, [name, onChange, close]);

  const valueLabel = options.find(v => v.value === value)?.label;

  return (
    <Field
      label={label}
      className={fieldClassName}
      style={fieldStyle}
      theme={theme}
      maxWidth={maxWidth}
    >
      <div
        ref={ref}
        className={classNames(styles.wrapper, {
          [styles.dark]: theme === 'dark',
          [styles.focus]: isOpen,
          [styles.hasError]: hasError
        })}
        tabIndex={tabIndex}
        onMouseDown={open}
        onFocus={() => {
          if (!isOpen) {
            open();
          }
        }}
        onBlur={() => onBlur(valueRef.current, name)}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.text}>
          {valueLabel ? valueLabel :
            <React.Fragment>
              {placeholder &&
                <div className={styles.placeholder}>
                  {placeholder}
                </div>
              }
            </React.Fragment>
          }
        </div>

        <div className={styles.arrowWrapper}>
          <Arrow className={styles.arrow} />
        </div>
      </div>
      {isOpen &&
        <OptionsWrapper
          inputRect={rect}
          options={options}
          value={value}
          initialFocusedIndex={initialFocusedIndex.current}
          close={close}
          onChange={handleChange}
        />
      }
    </Field>
  );
}

function OptionsWrapper({
  inputRect,
  options = [],
  value: currentValue,
  initialFocusedIndex = null,
  close,
  onChange
}) {
  const [focusedIndex, setFocusedIndex] = useState(initialFocusedIndex);
  const ref = useRef(null);
  const { left, top, width } = inputRect;
  useClickOutside(ref, () => close(currentValue));

  const handleKeyDown = useCallback(e => {
    // Select on enter key
    if (e.key === 'Enter' && focusedIndex !== null) {
      onChange(options[focusedIndex].value);
      return;
    }

    // Keyboard navigation with up and down arrows
    const isUp = ['ArrowUp', 'Up'].includes(e.key);
    const isDown = !isUp && ['ArrowDown', 'Down'].includes(e.key);
    
    if (isUp || isDown) {
      e.preventDefault();
      setFocusedIndex(index => {
        if (index === null) {
          return isUp ? options.length - 1 : 0;
        }

        index = isUp ? index - 1 : index + 1;

        if (index >= options.length) {
          index = 0;
        } else if (index < 0) {
          index = options.length - 1;
        }

        return index;
      });

      return;
    }

    // Close on tab out
    if (e.key === 'Tab') {
      close();
    }
  }, [options, focusedIndex, close, onChange]);

  useEvent('keydown', handleKeyDown);

  const optionComponents = useMemo(() => {
    return options.map(({ value, label, info }, index) => (
      <Option
        key={value}
        label={label}
        value={value}
        info={info}
        isCurrent={value === currentValue}
        isFocused={focusedIndex === index}
        onChange={onChange}
      />
    ));
  }, [options, currentValue, focusedIndex, onChange]);

  return createPortal(
    <div
      ref={ref}
      className={styles.optionsWrapper}
      style={{
        left,
        top, 
        minWidth: width,
        maxWidth: width + 30
      }}
    >
      {optionComponents}
    </div>,
    document.body
  );
}

const Option = memo(({
  label,
  value,
  info,
  isCurrent,
  isFocused,
  onChange
}) => {
  return (
    <div
      className={classNames(styles.option, {
        [styles.current]: isCurrent,
        [styles.focus]: isFocused
      })}
      onClick={() => onChange(value)}
    >
      <span>{label}</span>
      {info &&
        <span className={styles.info}>
          {info}
        </span>
      }
    </div>
  );
});