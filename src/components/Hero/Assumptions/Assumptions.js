import React, { useState, useEffect, memo } from 'react';
import AssumptionsText from './AssumptionsText';
import { Label } from '@input';
import Tooltip from '@components/Tooltip';
import styles from './Assumptions.module.scss';
import classNames from 'classnames';
import { displayPulse, hidePulseAfterFirstVisit, pulseCount } from '@config';

export default memo(function Assumptions({
  state,
  isLoading,
  hasInitialLocation,
  zipCodes,
  errors = [],
  controlsOpen,
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

  const [canShowTooltip, setCanShowTooltip] = useState(false);

  useEffect(() => {
    setCanShowTooltip(canShow => !canShow);
  }, [controlsOpen]);

  const handleMouseLeave = () => {
    if (!canShowTooltip) {
      setCanShowTooltip(true);
    }
  };

  let tooltipText;

  if (!controlsOpen) {
    tooltipText = 'Edit your loan\'s details';
  } else if (errors?.length) {
    tooltipText = 'Fix the errors before saving loan assumptions';
  } else {
    tooltipText = 'Save loan assumptions';
  }

  return (
    <Tooltip
      text={tooltipText}
      className={classNames(styles.wrapper, {
        [styles.open]: controlsOpen,
        [styles.hasError]: errors.length
      })}
      forceHidden={!canShowTooltip}
      onMouseLeave={handleMouseLeave}
    >
      <Label>Get personalized rates by letting us know a little about your loan.</Label>
      <button
        className={styles.button}
        onClick={handleClick}
      >
        <AssumptionsText
          state={state}
          errors={errors}
          isLoading={isLoading}
          zipCodes={zipCodes}
          controlsOpen={controlsOpen}
          hasInitialLocation={hasInitialLocation}
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
});