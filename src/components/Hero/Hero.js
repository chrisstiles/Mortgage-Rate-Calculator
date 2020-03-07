import React, { memo } from 'react';
import Inputs from './Inputs';
import LoanTypeTabs from './LoanTypeTabs';
import Assumptions from './Assumptions';
import styles from './Hero.module.scss';
import { Button } from '@input';
import { Phone } from './icons';

export default memo(function Hero({
  state,
  isLoading,
  controlsOpen,
  controlsHeight,
  zipCodes,
  setState,
  setControlsOpen,
  setControlsHeight
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        <div className={styles.controlsWrapper}>
          <LoanTypeTabs
            loanType={state.loanType}
            setState={setState}
          />
          <Assumptions
            state={state}
            isLoading={isLoading}
            controlsOpen={controlsOpen}
            zipCodes={zipCodes}
            setControlsOpen={setControlsOpen}
          />
        </div>
        <Inputs
          state={state}
          controlsOpen={controlsOpen}
          controlsHeight={controlsHeight}
          setControlsHeight={setControlsHeight}
        />
      </div>
      <Angles />
    </div>
  );
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

function Angles() {
  return (
    <div className={styles.angleWrapper}>
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}