import React, { useState } from 'react';
import { Field } from '@input';
import styles from './Select.module.scss';
import classNames from 'classnames';

export default function Select({
  options,
  value,
  label,
  maxWidth,
  fieldClassName,
  fieldStyle,
  tabIndex = 0,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Field
      label={label}
      className={fieldClassName}
      style={fieldStyle}
      maxWidth={maxWidth}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.focus]: isFocused
        })}
        tabIndex={tabIndex}
        onClick={() => setIsFocused(true)}
      >
        Excellent Credit
        <Options

        />
      </div>
      {/* <select>
        <option>Testing</option>
      </select> */}
    </Field>
  );
}

function Options() {
  return (
    <div>Test</div>
  );
}