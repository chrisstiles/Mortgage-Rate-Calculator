import React, { memo } from 'react';
import styles from './ProductFilter.module.scss';
import { colors } from '@config';
import classNames from 'classnames';

export default memo(function ProductFilter({
  term,
  type,
  isActive = true,
  isDisabled,
  onClick = () => {}
}) {
  const handleClick = () => {
    if (!isDisabled) {
      onClick(!isActive, String(term));
    }
  };

  const typeText = type === 'adjustable' ? 'ARM' : 'Year Fixed';

  return (
    <button
      className={classNames(styles.wrapper, {
        [styles.disabled]: isDisabled || !isActive
      })}
      onClick={handleClick}
    >
      <div
        className={styles.circle}
        style={{ backgroundColor: colors[term]?.main ?? colors.default.main }}
      />
      <div className={styles.text}>
        {term} {typeText}
      </div>
    </button>
  );
});