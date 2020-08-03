import React, { memo } from 'react';
import styles from './Product.module.scss';
import { colors } from '@config';

export default memo(function Product({ term, type, isLoading }) {
  if (!term) {
    return null;
  }

  const { main, text } = isLoading ? colors['15'] : colors[term] ?? colors.default;
  term = [String(term)];
  const isAdjustable = type.match(/adjustable/i);
  // if (isAdjustable === undefined) {
  //   // isAdjustable = term[0].includes('/');
  // }

  if (isAdjustable) {
    const termArr = term[0].split('/');
    term = [termArr[0], <span key="slash">/</span>, termArr[1]];
  }

  const termText = [...term, isAdjustable ? '' : ' Year'];
  const typeText = [isAdjustable ? 'Adjustable' : 'Fixed', 'Rate Mortgage'].join(' ');

  return (
    <div className={styles.wrapper} style={{ color: main }}>
      <div className={styles.term} style={{ backgroundColor: main }}>
        {termText}
      </div>

      <div className={styles.type} style={{ color: main }}>
        <span style={{ color: text }}>{typeText}</span>
      </div>
    </div>
  );
});
