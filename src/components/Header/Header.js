import React, { memo } from 'react';
import styles from './Header.module.scss';

export default memo(function Header({ setControlsOpen }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        <button
          onClick={() => {
            setControlsOpen(isOpen => !isOpen);
          }}
        >
          Toggle Controls
        </button>
      </div>
    </div>
  )
});

function Top() {
  return (
    <div className={styles.top}>
      <h1>Today's Mortgage Rates</h1>
    </div>
  );
}