import React, { memo } from 'react';
import styles from './Product.module.scss';
import { colors } from '@config';

export default memo(function Product({ product, isLoading }) {
  const { main, text } = isLoading
    ? colors['15']
    : colors[product.term] ?? colors.default;
  let term = [product.term];

  if (product.isAdjustable && product.term) {
    const termArr = term[0].split('/');
    term = [termArr[0], <span key="slash">/</span>, termArr[1]];
  }

  const termText = [...term, product.isAdjustable ? '' : ' Year'];
  const typeText = [
    product.isAdjustable ? 'Adjustable' : 'Fixed',
    'Rate Mortgage'
  ].join(' ');

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
