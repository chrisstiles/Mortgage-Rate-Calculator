import React, { memo } from 'react';
import Inputs from './Inputs';
import styles from './Header.module.scss';
import Button from '@components/Button';
import LoanTypeTabs from './LoanTypeTabs';
import { Phone } from './icons';

export default memo(function Header({
  loanType,
  controlsHeight,
  setLoanType,
  setControlsOpen,
  setControlsHeight
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        <div className={styles.controlsWrapper}>
          <LoanTypeTabs
            loanType={loanType}
            setLoanType={setLoanType}
          />
          <Button
            onClick={() => {
              setControlsOpen(isOpen => !isOpen);
            }}
          >
            Toggle Controls
        </Button>
        </div>
        <Inputs 
          controlsHeight={controlsHeight}
          setControlsHeight={setControlsHeight}
        >
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