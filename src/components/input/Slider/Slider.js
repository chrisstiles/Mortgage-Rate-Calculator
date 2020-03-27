import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Text } from '@input';
import Tooltip from '@components/Tooltip';
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
  inputWidth = 70,
  transformValue,
  isCurrency,
  isPercent,
  onAfterChange
}) {
  const [currentValue, setCurrentValue] = useState([
    value[0] ?? min,
    value[1] ?? max
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const prevRef = useRef({});

  useEffect(() => {
    prevRef.current.min = value[0] ?? min;
    prevRef.current.max = value[1] ?? max;
  }, [value, min, max]);

  const handleChange = useCallback(value => {
    setCurrentValue(value);
  }, []);

  // Only change min or max value if the user has changed it
  const handleAfterChange = useCallback(sliderValue => {
    const [min, max] = sliderValue;
    const newValue = [
      min === prevRef.current.min ? value[0] : sliderValue[0],
      max === prevRef.current.max ? value[1] : sliderValue[1]
    ];

    if (onAfterChange) {
      onAfterChange(newValue, name);
    }

    setIsDragging(false);
  }, [setIsDragging, value, name, onAfterChange]);

  const textProps = {
    isCurrency,
    size: 'small',
    width: inputWidth,
    inlineLabel: true
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
        {label &&
          <label className={styles.label}>
            {label}
          </label>
        }
        <div className={styles.inputs}>
          <Text
            value={getValue(currentValue[0] ?? min, isPercent)}
            label="Max:"
            {...textProps}
          />

          <Text
            value={getValue(currentValue[1] ?? max, isPercent)}
            label="Min:"
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
          const value = transformValue ? transformValue(state.valueNow) : state.valueNow;

          return (
            <div {...props}>
              <Tooltip
                text={value}
                offset={0}
              >
                <div className={styles.value} />
              </Tooltip>
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

  return value;
}