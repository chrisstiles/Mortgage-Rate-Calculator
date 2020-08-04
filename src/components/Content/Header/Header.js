import React, { useState, useEffect } from 'react';
import { Rate, Chat, Filter, Bell } from './icons';
import Filters from './Filters';
import { Button } from '@input';
import styles from './Header.module.scss';
import { upperFirst } from 'lodash';
import classNames from 'classnames';
import { format } from 'fecha';

export default function Header({
  data,
  loanType,
  isLoading,
  effectiveDate,
  filterState,
  setFilterState,
  resetFilters
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!data?.length) {
      setFiltersOpen(false);
    }
  }, [data]);

  return (
    <React.Fragment>
      <div className={styles.wrapper}>
        <Top loanType={loanType} effectiveDate={effectiveDate} />
        <Middle
          isLoading={isLoading}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
        />
      </div>
      <Filters
        data={data}
        filtersOpen={filtersOpen}
        filterState={filterState}
        setFilterState={setFilterState}
        setFiltersOpen={setFiltersOpen}
        resetFilters={resetFilters}
      />
    </React.Fragment>
  );
}

function Top({ loanType, effectiveDate }) {
  const dateString = effectiveDate
    ? format(effectiveDate, 'MMMM Do, YYYY')
    : null;
  const timeString = effectiveDate
    ? format(effectiveDate, 'h:mm A')
    : null;

  return (
    <div className={styles.top}>
      <Rate className={styles.rateIcon} />
      <div className={styles.info}>
        <div className={styles.title}>
          {upperFirst(loanType)} Mortgage Rates
        </div>
        {dateString && timeString && (
          <div
            className={classNames(styles.subtitle, {
              [styles.hidden]: !effectiveDate
            })}
          >
            Effective as of {dateString} at {timeString}
          </div>
        )}
      </div>
      <div className={styles.chat}>
        <Chat className={styles.chatIcon} />
        <div>
          <div className={styles.title}>Have questions?</div>
          <div className={styles.subtitle}>
            Chat with a helpful loan officer
          </div>
        </div>
      </div>
    </div>
  );
}

function Middle({ isLoading, filtersOpen, setFiltersOpen }) {
  return (
    <div
      className={classNames(styles.middle, {
        [styles.loading]: isLoading
      })}
    >
      <Button
        theme="minimal"
        fontSize={16}
        className={classNames(styles.filterButton, {
          [styles.active]: filtersOpen
        })}
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        <Filter />
        Filter Rates and Products
      </Button>

      <Button theme="outline" fontSize={13}>
        <Bell />
        Sign Up For Rate Alerts
      </Button>
    </div>
  );
}
