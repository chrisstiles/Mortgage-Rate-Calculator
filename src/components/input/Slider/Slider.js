import React, { useState } from 'react';
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
  console.log(min, max)

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.dragging]: isDragging
      })}
    >
      {label &&
        <label className={styles.label}>
          {label}
        </label>
      }
      <ReactSlider
        value={value}
        defaultValue={[min, max]}
        thumbClassName="sliderThumb"
        trackClassName="sliderTrack"
        minDistance={minDistance}
        step={step}
        onBeforeChange={() => setIsDragging(true)}
        onAfterChange={() => setIsDragging(false)}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className={styles.text}>
              {state.valueNow}
            </div>
          </div>
        )}
      />
    </div>
  );
}