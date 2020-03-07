import React, { useState, useEffect } from 'react';
import AssumptionsText from './AssumptionsText';
import { Label } from '@input';
import Tooltip from '@components/Tooltip';
import styles from './Assumptions.module.scss';
import { displayPulse, hidePulseAfterFirstVisit, pulseCount } from '@config';
import classNames from 'classnames';

export default function Assumptions({
  state,
  isLoading,
  controlsOpen,
  zipCodes,
  setControlsOpen
}) {
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

  const [canShowTooltip, setCanShowTooltip] = useState(true);

  useEffect(() => {
    if (controlsOpen) {
      setCanShowTooltip(false);
    }
  }, [controlsOpen]);

  const handleMouseLeave = () => {
    if (!controlsOpen && !canShowTooltip) {
      setCanShowTooltip(true);
    }
  };

  return (
    <Tooltip
      text="Edit this loan's details"
      className={classNames(styles.wrapper, {
        [styles.open]: controlsOpen
      })}
      forceHidden={controlsOpen || !canShowTooltip}
      onMouseLeave={handleMouseLeave}
    >
      <Label>Get personalized rates by letting us know a little about your loan.</Label>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        <AssumptionsText
          state={state}
          isLoading={isLoading}
          zipCodes={zipCodes}
        />
        {pulseIsVisible && !controlsOpen &&
          <div className={styles.pulseWrapper}>
            <div {...pulseProps} />
          </div>
        }
      </button>

      <div className={styles.line} />
    </Tooltip>
  );
}