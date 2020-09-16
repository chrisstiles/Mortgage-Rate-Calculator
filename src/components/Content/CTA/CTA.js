import React from 'react';
import styles from './CTA.module.scss';

export default function CTA({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}
