import React from 'react';
import styles from './Product.module.scss';

export default function Product({ term, isAdjustable }) {
  if (!term) {
    return null;
  }

  term = String(term);

  if (isAdjustable === undefined) {
    isAdjustable = term.includes('/');
  }

  const termText = [term, isAdjustable ? '' : 'Year'].join(' ').trim();
  const typeText = [isAdjustable ? 'Adjustable' : 'Fixed', 'Rate Mortgage'].join(' ');
  const { main, text } = colors[term] ?? colors.default;

  return (
    <div 
      className={styles.wrapper}
      style={{ color: main }}
    >
      <div
        className={styles.term}
        style={{ backgroundColor: main }}
      >
        {termText}
      </div>

      <div
        className={styles.type}
        style={{ color: main }}
      >
        <span style={{ color: text }}>
          {typeText}
        </span>
      </div>
    </div>
  );
}

const colors = {
  '10': { main: '#92C2DA', text: '#47788E' },
  '15': { main: '#116A7F', text: '#006076' },
  '30': { main: '#E36F2B', text: '#99491A' },
  '5/1': { main: '#219D9F', text: '#007173' },
  '7/1': { main: '#F0B023', text: '#9F6F00' },
  default: { main: '#a9a9a9', text: '#8c8c8c' }
};