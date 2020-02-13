import React, { memo, useRef, useCallback } from 'react';
import styles from './Header.module.scss';
import Button from '@components/Button';
import useResizeObserver from '@hooks/useResizeObserver';
import { Phone } from './icons';

export default memo(function Header({ setControlsOpen, setControlsHeight }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        <Button
          onClick={() => {
            setControlsOpen(isOpen => !isOpen);
          }}
          style={{ marginBottom: 50 }}
        >
          Toggle Controls
        </Button>
        <Inputs setControlsHeight={setControlsHeight}>
          Inputs will go here
        </Inputs>
      </div>
    </div>
  )
});

function Top() {
  return (
    <div className={styles.top}>
      <h1>Today's Mortgage Rates</h1>
      <div className={styles.cta}>
        <div className={styles.phone}>
          <Phone />
          (800) 359-2265
        </div>
        <Button
          href="//www.fremontbank.com/start-your-loan?loanType=MORTGAGE"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
}

function Inputs({ children, setControlsHeight }) {
  const ref = useRef(null);
  useResizeObserver(ref, ({ height }) => setControlsHeight(height));

  return (
    <div
      ref={ref}
      style={{
        height: 300,
        border: '2px dashed #fff',
        padding: 50,
      }}
    >
      {children}
    </div>
  );
}