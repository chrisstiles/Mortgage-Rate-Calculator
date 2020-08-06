import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo
} from 'react';
import Inputs from './Inputs';
import LoanTypeTabs from './LoanTypeTabs';
import Assumptions from './Assumptions';
import styles from './Hero.module.scss';
import { Button } from '@input';
import useWindowSize from '@hooks/useWindowSize';
import { Phone } from './icons';
import { getState } from '@helpers';
import { keys } from '@enums';
import { mobileSize } from '@config';

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
  const [currentState, _setCurrentState] = useState(() => ({
    ...state
  }));
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

  const refreshData = useCallback(() => {
    const newState = { ...currentState, loanType: state.loanType };
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

    setState(newState);
  }, [
    state,
    currentState,
    errors,
    setCurrentState,
    setState,
    setControlsOpen
  ]);

  const handleAssumptionsClick = useCallback(() => {
    if (!controlsOpen) {
      setControlsOpen(true);
      return;
    }

    refreshData();
  }, [controlsOpen, setControlsOpen, refreshData]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialLocation && !hasInitialized.current) {
      setCurrentState(state.zipCode, keys.ZIP_CODE);
      hasInitialized.current = true;
    }
  }, [hasInitialLocation, setCurrentState, state.zipCode]);

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= mobileSize;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Top />
        <div className={styles.controlsWrapper}>
          <LoanTypeTabs
            loanType={state.loanType}
            isLoading={isLoading}
            setState={setState}
          />
          <Assumptions
            state={currentState}
            loanType={state.loanType}
            errors={errors}
            isLoading={isLoading}
            hasInitialLocation={hasInitialLocation}
            controlsOpen={controlsOpen}
            zipCodes={zipCodes}
            isMobile={isMobile}
            onClick={handleAssumptionsClick}
          />
        </div>
        <Inputs
          state={currentState}
          prevState={state}
          loanType={state.loanType}
          controlsOpen={controlsOpen}
          controlsHeight={controlsHeight}
          errors={errors}
          isMobile={isMobile}
          setControlsHeight={setControlsHeight}
          updateErrors={updateErrors}
          setState={setCurrentState}
          refreshData={refreshData}
          setControlsOpen={setControlsOpen}
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
          className={styles.applyButton}
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
