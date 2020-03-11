import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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
  const [canShowTooltip, setCanShowTooltip] = useState(true);
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
    setCanShowTooltip(false);
    setControlsOpen(!controlsOpen);
  };

  const pulseProps = {
    className: styles.pulse,
    style: { animationIterationCount: pulseCount }
  };

  const [tooltipText, setTooltipText] = useState(() => getTooltipText(controlsOpen, errors));
  const controlsOpenRef = useRef(controlsOpen);
  const errorsRef = useRef(errors);
  const updateTooltip = useCallback(() => {
    const text = getTooltipText(controlsOpenRef.current, errorsRef.current);
    setTooltipText(text);
  }, []);

  useEffect(() => {
    controlsOpenRef.current = controlsOpen;
    errorsRef.current = errors;
  });

  useEffect(() => {
    setTimeout(updateTooltip, 500)
  }, [controlsOpen, errors, updateTooltip]);

  const handleMouseLeave = () => {
    if (!canShowTooltip) {
      setCanShowTooltip(true);
    }
  };

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

function getTooltipText(controlsOpen, errors) {
  if (!controlsOpen) {
    return 'Edit your loan\'s details';
  } else if (errors?.length) {
    return 'Please fix the errors to save loan assumptions';
  }

  return 'Save loan assumptions';
}