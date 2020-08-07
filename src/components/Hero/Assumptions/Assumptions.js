import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo
} from 'react';
import AssumptionsText from './AssumptionsText';
import { Label } from '@input';
import Tooltip from '@components/Tooltip';
import styles from './Assumptions.module.scss';
import classNames from 'classnames';
import { keys } from '@enums';
import { cache } from '@app';
import {
  displayPulse,
  hidePulseAfterFirstVisit,
  pulseCount
} from '@config';

export default memo(function Assumptions({
  state,
  loanType,
  isLoading,
  hasInitialLocation,
  zipCodes,
  errors = [],
  controlsOpen,
  isMobile,
  currentInput,
  onClick
}) {
  const [canShowTooltip, setCanShowTooltip] = useState(true);
  const [pulseIsVisible, setPulseIsVisible] = useState(() => {
    if (!displayPulse) {
      return false;
    }

    if (!hidePulseAfterFirstVisit) {
      return true;
    }

    const hasVisited = !!cache.get(keys.HAS_VISITED);
    cache.set(keys.HAS_VISITED, true);

    return !hasVisited;
  });

  const handleClick = () => {
    if (!isLoading) {
      setPulseIsVisible(false);
      setCanShowTooltip(false);
      setTimeout(() => onClick(), 0);
    }
  };

  const pulseProps = {
    className: styles.pulse,
    style: { animationIterationCount: pulseCount }
  };

  const [tooltipText, setTooltipText] = useState(() =>
    getTooltipText(controlsOpen, errors)
  );
  const controlsOpenRef = useRef(controlsOpen);
  const errorsRef = useRef(errors);
  const updateTooltip = useCallback(() => {
    const text = getTooltipText(
      controlsOpenRef.current,
      errorsRef.current
    );
    setTooltipText(text);
  }, []);

  useEffect(() => {
    controlsOpenRef.current = controlsOpen;
    errorsRef.current = errors;
  });

  useEffect(() => {
    setTimeout(updateTooltip, 300);
  }, [controlsOpen, errors, updateTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (!canShowTooltip) {
      setCanShowTooltip(true);
    }
  }, [canShowTooltip, setCanShowTooltip]);

  const handleKeyDown = useCallback(e => {
    // Ignore space bar clicks
    if (e.key === ' ') {
      e.preventDefault();
    }
  }, []);

  return (
    <Tooltip
      text={tooltipText}
      className={classNames(styles.wrapper, {
        [styles.open]: controlsOpen,
        [styles.hasError]: errors.length
      })}
      forceHidden={!canShowTooltip || isLoading || isMobile}
      onMouseLeave={handleMouseLeave}
    >
      <Label>
        Get personalized rates by letting us know a little about your
        loan.
      </Label>
      <button
        className={classNames(styles.button, {
          [styles.loading]: isLoading
        })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <AssumptionsText
          state={state}
          loanType={loanType}
          errors={errors}
          currentInput={currentInput}
          isLoading={isLoading}
          zipCodes={zipCodes}
          controlsOpen={controlsOpen}
          isMobile={isMobile}
          hasInitialLocation={hasInitialLocation}
        />
        {pulseIsVisible && !controlsOpen && !isLoading && (
          <div className={styles.pulseWrapper}>
            <div {...pulseProps} />
          </div>
        )}
      </button>

      <div className={styles.line} />
    </Tooltip>
  );
});

function getTooltipText(controlsOpen, errors) {
  if (!controlsOpen) {
    return "Edit your loan's details";
  } else if (errors?.length) {
    return 'Fields with errors will revert to default values';
  }

  return 'Save loan assumptions';
}
