import React from 'react';
import styles from './CTA.module.scss';

export default function CTA({ children }) {
  return (
    <div className={styles.wrapper}>
      <h2>Get started</h2>
      {children}
    </div>
  );
}
