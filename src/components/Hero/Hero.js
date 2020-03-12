import React, { useState, useCallback, memo } from 'react';
import Inputs from './Inputs';
import LoanTypeTabs from './LoanTypeTabs';
import Assumptions from './Assumptions';
import styles from './Hero.module.scss';
import { Button } from '@input';
import { Phone } from './icons';
import { getState } from '@helpers';
import { keys } from '@enums';

export default memo(function Hero({
  state,
  isLoading,
  hasInitialLocation,
  controlsOpen,
  controlsHeight,
  zipCodes,
  setState,
  setControlsOpen,
  setControlsHeight
}) {
  const [currentState, _setCurrentState] = useState(() => ({ ...state }));
  const setCurrentState = useCallback((value, name) => {
    _setCurrentState(state => getState(state, value, name));
  }, []);

  const [errors, setErrors] = useState([]);
  const updateErrors = useCallback((error, name) => {
    setErrors(errors => {
      if (!errors.length && !error) {
        return errors;
      }

      const newErrors = errors.slice().filter(e => e.name !== name);

      if (error) {
        newErrors.push({ name, error });
      }
      
      return newErrors;
    });
  }, []);

  const handleAssumptionsClick = useCallback(() => {
    if (!controlsOpen) {
      setControlsOpen(true);
      return;
    }

    const newState = { ...currentState };
    const hasErrors = errors?.length;

    if (hasErrors) {
      errors.forEach(({ name }) => {
        newState[name] = state[name];
        
        if (name === keys.ZIP_CODE) {
          newState.city = state.city;
        }
      });
    }

    setControlsOpen(false);
    setErrors([]);

    if (hasErrors) {
      setCurrentState(newState);
    }

    setState(({ loanType }) => ({ ...newState, loanType }));
  }, [
    state,
    currentState,
    errors,
    controlsOpen,
    setCurrentState,
    setControlsOpen,
    setState
  ]);

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
            state={currentState}
            errors={errors}
            isLoading={isLoading}
            hasInitialLocation={hasInitialLocation}
            controlsOpen={controlsOpen}
            zipCodes={zipCodes}
            onClick={handleAssumptionsClick}
          />
        </div>
        <Inputs
          state={currentState}
          controlsOpen={controlsOpen}
          controlsHeight={controlsHeight}
          errors={errors}
          setControlsHeight={setControlsHeight}
          updateErrors={updateErrors}
          setState={setCurrentState}
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