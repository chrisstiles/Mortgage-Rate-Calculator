import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo
} from 'react';
import Controls from './Controls';
import MobileInputs from './MobileInputs';
import ControlButtons from './ControlButtons';
import { Button } from '@input';
import styles from './Inputs.module.scss';
import useResizeObserver from '@hooks/useResizeObserver';
import useWindowSize from '@hooks/useWindowSize';
import classNames from 'classnames';
import { compareObjects } from '@helpers';
import { keys } from '@enums';
import { cache, api } from '@app';
import getInitialState from '@utils/getInitialState';

export default memo(function Inputs({
  state,
  prevState,
  loanType,
  controlsOpen,
  controlsHeight,
  setControlsHeight,
  canValidate,
  errors,
  visibleErrors,
  isMobile,
  isLoading,
  updateErrors,
  setCanValidate,
  setState,
  refreshData,
  setControlsOpen,
  setCurrentInput
}) {
  const ref = useRef(null);
  const handleResize = useCallback(
    ({ height }) => {
      setControlsHeight(height);
    },
    [setControlsHeight]
  );

  useResizeObserver(ref, handleResize);

  const [offset, setOffset] = useState(getOffset());
  const resizeTimer = useRef(null);
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    clearTimeout(resizeTimer.current);

    resizeTimer.current = setTimeout(() => {
      setOffset(getOffset());
    }, 50);
  }, [windowWidth]);

  const canRefresh = useMemo(
    () =>
      !compareObjects(
        state,
        prevState,
        Object.keys(state).filter(k => k !== keys.LOAN_TYPE)
      ) && !errors?.length,
    [state, prevState, errors]
  );

  const reset = useCallback(() => {
    if (!isLoading) {
      cache.set(keys.LOAN_STATE, null);
      const state = getInitialState(true);
      setState(state);
      setControlsOpen(false);
      api.fetchRates(state, true);
    }
  }, [isLoading, setState, setControlsOpen]);

  const refresh = useCallback(() => {
    if (canRefresh) {
      refreshData();
    }
  }, [canRefresh, refreshData]);

  const controls = (
    <Controls
      state={state}
      loanType={loanType}
      errors={visibleErrors}
      canValidate={canValidate}
      controlsOpen={controlsOpen}
      theme={isMobile ? 'light' : 'dark'}
      updateErrors={updateErrors}
      setCanValidate={setCanValidate}
      setCurrentInput={setCurrentInput}
      onChange={setState}
      refresh={refresh}
    />
  );

  if (isMobile) {
    return (
      <MobileInputs
        ref={ref}
        controlsOpen={controlsOpen}
        setControlsOpen={setControlsOpen}
      >
        {controls}
      </MobileInputs>
    );
  }

  return (
    <div
      className={classNames(styles.inputWrapper, {
        [styles.open]: controlsOpen,
        [styles.hasError]: !!visibleErrors?.length
      })}
      style={{ marginBottom: controlsHeight + offset }}
    >
      <div ref={ref} className={styles.inputs}>
        <Outline />
        <div className={styles.inner}>
          <div className={styles.top}>
            <Row>{controls}</Row>
            <Button
              theme="minimal"
              className={styles.close}
              color="#dcdcdc"
              onClick={reset}
              closeTooltipText="Cancel"
              isClose
            />
          </div>
          <ControlButtons
            className={classNames(styles.controlButtons, {
              open: controlsOpen
            })}
            canRefresh={canRefresh && !isLoading}
            isLoading={isLoading}
            refresh={refresh}
            reset={reset}
          />
        </div>
      </div>
    </div>
  );
});

function Row({ children }) {
  return <div className={styles.row}>{children}</div>;
}

function Outline() {
  return (
    <div className={styles.outline}>
      <div className={styles.top}>
        <span>Loan Assumptions</span>
      </div>
    </div>
  );
}

function getOffset() {
  return window.innerWidth > 1050 ? 100 : 90;
}
