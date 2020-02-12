import React from 'react';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        {(new Date().toISOString())}
      </div>
    </div>
  )
}

function Top() {
  return (
    <div className={styles.top}>
      <h1>Today's Mortgage Rates</h1>
    </div>
  );
}