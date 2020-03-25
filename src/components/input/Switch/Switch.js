import React, { memo } from 'react';
import styles from './Switch.module.scss';
import ReactSwitch from 'react-switch';
import { teal } from '@styles/colors.scss';
import classNames from 'classnames';

export default memo(function Switch({
  value,
  name,
  label,
  checkedText = 'On',
  uncheckedText = 'Off',
  onChange = () => {},
  className,
  style = {},
  height = 22,
  ...restProps
}) {
  const boxShadowColor = value ? 'rgba(17, 65, 66, .2)' : 'rgba(0, 0, 0, .2)';
  
  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={style}
    >
      {label &&
        <label
          className={styles.label}
          onClick={() => onChange(value, name)}
        >
          {label}
        </label>
      }
      <ReactSwitch
        checked={!!value}
        checkedIcon={<SwitchText text={checkedText} />}
        uncheckedIcon={<SwitchText text={uncheckedText} />}
        onColor={teal}
        offColor="#949494"
        height={height}
        handleDiameter={height - 10}
        activeBoxShadow={`0 0 0 8px ${boxShadowColor}`}
        onChange={checked => onChange(!checked, name)}
        {...restProps}
      />
    </div>
  );
});

function SwitchText({ text }) {
  if (!text) {
    return false;
  }

  return (
    <span className={styles.text}>
      {text}
    </span>
  );
}