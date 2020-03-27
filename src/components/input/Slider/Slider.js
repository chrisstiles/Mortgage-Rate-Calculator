import React, { useState } from 'react';
import { Text } from '@input';
import styles from './Slider.module.scss';
import ReactSlider from 'react-slider';
import classNames from 'classnames';

export default function Slider({
  value,
  className,
  label,
  min = 0,
  max = 100,
  minDistance = 10,
  step = 1
}) {
  const [isDragging, setIsDragging] = useState(false);

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
            defaultValue="30"
            placeholder="Testing"
            size="small"
            isCurrency
            label="Max:"
            width={70}
            inlineLabel
          />

          <Text
            defaultValue="30"
            placeholder="Testing"
            size="small"
            isCurrency
            label="Min:"
            width={70}
            inlineLabel
          />
        </div>
      </div>
      <ReactSlider
        value={value}
        defaultValue={[min, max]}
        thumbClassName="sliderThumb"
        trackClassName="sliderTrack"
        minDistance={minDistance}
        step={step}
        min={min}
        max={max}
        onBeforeChange={() => setIsDragging(true)}
        onAfterChange={() => setIsDragging(false)}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className={styles.text}>
              {/* {state.valueNow} */}
            </div>
          </div>
        )}
      />
    </div>
  );
}