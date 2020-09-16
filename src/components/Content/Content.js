import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  memo
} from 'react';
import Header from './Header';
import RateTable from './RateTable';
import CTA from './CTA';
import Disclosures from './Disclosures';
import LoadingBar from './LoadingBar';
import { Button } from '@input';
import styles from './Content.module.scss';
import getInitialFilterState, {
  defaultFilters
} from '@utils/getInitialFilterState';
import classNames from 'classnames';
import { cache } from '@app';
import { keys } from '@enums';
import { getState } from '@helpers';

export default memo(function ContentWrapper({
  data,
  isLoading,
  controlsHeight,
  effectiveDate,
  loanType,
  setControlsOpen
}) {
  const [filterState, _setFilterState] = useState(() => {
    return getInitialFilterState();
  });

  const setFilterState = useCallback((value, name) => {
    _setFilterState(state => {
      const newState = getState(state, value, name);
      cache.set(keys.FILTER_STATE, newState);
      return newState;
    });
  }, []);

  const resetFilters = useCallback(() => {
    _setFilterState(JSON.parse(JSON.stringify(defaultFilters)));
    cache.set(keys.FILTER_STATE, defaultFilters);
  }, []);

  const shiftY = controlsHeight ?? 0;
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    setTimeout(() => setHasInitialized(true), 100);
  }, []);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.noAnimation]: !hasInitialized
      })}
      style={{
        transform: `translateY(${shiftY}px)`,
        marginTop: -shiftY
      }}
    >
      <div
        className={styles.angle}
        style={{ height: controlsHeight + 150 }}
      />
      <Content
        data={data}
        loanType={loanType}
        shiftY={-shiftY}
        effectiveDate={effectiveDate}
        isLoading={isLoading}
        filterState={filterState}
        setFilterState={setFilterState}
        setControlsOpen={setControlsOpen}
        resetFilters={resetFilters}
      />
      <Disclosures />
    </div>
  );
});

const Content = memo(
  ({
    data: _data,
    loanType,
    shiftY,
    isLoading,
    effectiveDate,
    filterState,
    setFilterState,
    setControlsOpen,
    resetFilters
  }) => {
    const [showMoreClicked, setShowMoreClicked] = useState(false);
    const data = useMemo(() => {
      if (!_data?.first) {
        return null;
      }

      return !showMoreClicked
        ? _data.first
        : Object.values(_data)
            .filter(x => x)
            .flat();
    }, [_data, showMoreClicked]);

    useEffect(() => {
      if (isLoading) {
        setShowMoreClicked(false);
      }
    }, [isLoading]);

    return (
      <div
        className={classNames(styles.content, {
          [styles.loading]: isLoading
        })}
      >
        {isLoading && <LoadingBar />}
        <Header
          data={data}
          loanType={loanType}
          isLoading={isLoading}
          effectiveDate={effectiveDate}
          filterState={filterState}
          setFilterState={setFilterState}
          resetFilters={resetFilters}
        />
        <RateTable
          data={data}
          shiftY={shiftY}
          isLoading={isLoading}
          filterState={filterState}
          setControlsOpen={setControlsOpen}
          resetFilters={resetFilters}
        />
        {!isLoading && (
          <CTA>
            {showMoreClicked ? (
              <React.Fragment>
                {!_data[loanType]?.second ? 'Loading...' : null}
              </React.Fragment>
            ) : (
              <Button
                theme="outline"
                onClick={() => setShowMoreClicked(true)}
              >
                Show more products
              </Button>
            )}
          </CTA>
        )}
      </div>
    );
  }
);
