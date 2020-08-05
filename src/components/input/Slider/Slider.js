import React, { useState, useCallback, useEffect } from 'react';
import { Text } from '@input';
import Tooltip from '@components/Tooltip';
import useEvent from '@hooks/useEvent';
import styles from './Slider.module.scss';
import ReactSlider from 'react-slider';
import classNames from 'classnames';
import { minDecimals } from '@config';

export default function Slider({
  value,
  name,
  className,
  label,
  min = 0,
  max = 100,
  minDistance = 10,
  step = 1,
  inputWidth = 72,
  transformValue,
  isCurrency,
  isPercent,
  onAfterChange
}) {
  const [currentThumb, setCurrentThumb] = useState(null);
  const [currentValue, setCurrentValue] = useState([
    value[0] ?? min,
    value[1] ?? max
  ]);

  const [isDragging, setIsDragging] = useState(false);
  useEvent('mouseup', window, () => {
    setIsDragging(false);
    setCurrentThumb(null);
  });

  const [textValue, setTextValue] = useState({
    min: getValue(currentValue[0], isPercent),
    max: getValue(currentValue[1], isPercent)
  });

  const getValueWithinDistance = useCallback(
    (num, name) => {
      const isMin = name === 'min';
      const value = currentValue.slice();

      if (isMin) {
        if (num < min) {
          num = min;
        } else if (num > currentValue[1] - minDistance) {
          num = currentValue[1] - minDistance;
        }
      } else {
        if (num > max) {
          num = max;
        } else if (num < currentValue[0] + minDistance) {
          num = currentValue[0] + minDistance;
        }
      }

      value[isMin ? 0 : 1] = num;

      return value;
    },
    [currentValue, max, min, minDistance]
  );

  const handleTextChange = useCallback(
    (value, name) => {
      setTextValue(prevValue => ({
        ...prevValue,
        [name]: value
      }));

      const _value = parseFloat(value);

      if (!isNaN(_value)) {
        setCurrentValue(getValueWithinDistance(_value, name));
      }
    },
    [getValueWithinDistance]
  );

  const handleTextBlur = useCallback(() => {
    if (onAfterChange) {
      onAfterChange(currentValue, name);
    }

    setIsDragging(false);
  }, [currentValue, onAfterChange, name]);

  useEffect(() => {
    setCurrentValue(value.slice());
    setTextValue({
      min: getValue(value[0], isPercent),
      max: getValue(value[1], isPercent)
    });
  }, [value, isPercent]);

  const handleChange = useCallback(
    value => {
      setCurrentValue(value.slice());
      setTextValue({
        min: getValue(value[0], isPercent),
        max: getValue(value[1], isPercent)
      });
    },
    [isPercent]
  );

  // Only change min or max value if the user has changed it
  const handleAfterChange = useCallback(
    sliderValue => {
      if (onAfterChange) {
        onAfterChange(sliderValue, name);
      }

      setIsDragging(false);
      setCurrentThumb(null);
    },
    [setIsDragging, name, onAfterChange]
  );

  const textProps = {
    isCurrency,
    size: 'small',
    width: inputWidth,
    inlineLabel: true,
    onChange: handleTextChange,
    onBlur: handleTextBlur
  };

  if (isPercent) {
    textProps.icon = '%';
    textProps.iconPosition = 'right';
  }

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.dragging]: isDragging
      })}
    >
      <div className={styles.top}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputs}>
          <Text
            value={textValue.min}
            label="Min:"
            name="min"
            {...textProps}
          />
          <Text
            value={textValue.max}
            label="Max:"
            name="max"
            {...textProps}
          />
        </div>
      </div>
      <ReactSlider
        value={currentValue}
        thumbClassName="sliderThumb"
        trackClassName="sliderTrack"
        minDistance={minDistance}
        step={step}
        min={min}
        max={max}
        onBeforeChange={() => setIsDragging(true)}
        onChange={handleChange}
        onAfterChange={handleAfterChange}
        renderThumb={(props, state) => {
          const value = transformValue
            ? transformValue(state.valueNow)
            : state.valueNow;

          return (
            <div {...props}>
              <div
                onMouseDown={() => {
                  setCurrentThumb(state.index);
                }}
              >
                <Tooltip
                  text={value}
                  offset={0}
                  forceVisible={currentThumb === state.index}
                >
                  <div className={styles.value} />
                </Tooltip>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

function getValue(value, isPercent) {
  if (isPercent) {
    return Number(value).toFixed(minDecimals);
  }

  return parseInt(value);
}
