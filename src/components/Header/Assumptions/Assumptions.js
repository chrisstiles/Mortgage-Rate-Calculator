import React, { useState } from 'react';
import Label from '@components/Label';
import { Home, Arrow } from '../icons';
import styles from './Assumptions.module.scss';
import { displayPulse, hidePulseAfterFirstVisit, pulseCount } from '@config';

export default function Assumptions({ controlsOpen, setControlsOpen }) {
  const [pulseIsVisible, setPulseIsVisible] = useState(() => {
    if (!displayPulse) {
      return false;
    }

    if (!hidePulseAfterFirstVisit) {
      return true;
    }

    const hasVisited = !!localStorage.getItem('hasVisited');
    localStorage.setItem('hasVisited', true);

    return !hasVisited;
  });

  const handleClick = () => {
    setPulseIsVisible(false);
    setControlsOpen(!controlsOpen);
  };

  const pulseProps = {
    className: styles.pulse,
    style: { animationIterationCount: pulseCount }
  };

  return (
    <div className={styles.wrapper}>
      <Label>Get personalized rates by letting us know a little about your loan.</Label>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        <div className={styles.home}>
          <Home />
          {pulseIsVisible && !controlsOpen &&
            <div className={styles.pulseWrapper}>
              <div {...pulseProps} />
              {/* <div {...pulseProps} /> */}
            </div>
          }
        </div>
        <div className={styles.text}>
          Purchasing a $500,000 home in Livermore, CA. Excellent credit score with 20% down.
        </div>
        <div className={styles.arrow}>
          <Arrow />
        </div>
      </button>
    </div>
  );
}