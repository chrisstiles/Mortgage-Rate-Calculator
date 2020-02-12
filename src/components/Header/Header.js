import React, { memo } from 'react';
import styles from './Header.module.scss';
import Button from '@components/Button';

export default memo(function Header({ setControlsOpen }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        <Button
          onClick={() => {
            setControlsOpen(isOpen => !isOpen);
          }}
        >
          Toggle Controls
        </Button>
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