import React, { useState } from 'react';
import styles from './Slider.module.scss';
import ReactSlider from 'react-slider';
import classNames from 'classnames';

export default function Slider({
  className,
  label
}) {
  const [isDragging, setIsDragging] = useState(false);

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
        defaultValue={[0, 100]}
        thumbClassName="sliderThumb"
        trackClassName="sliderTrack"
        minDistance={10}
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