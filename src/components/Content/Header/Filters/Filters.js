import React, { useState, memo } from 'react';
import styles from './filters.module.scss';
import { Button } from '@input';
import getInitialFilterState from './getInitialFilterState';

export default memo(function Filters({ data, filtersOpen, setFiltersOpen }) {
  const [filterState, setFilterState] = useState(() => {
    return getInitialFilterState();
  });

  return !filtersOpen ? null : (
    <div className={styles.wrapper}>
      <Button
        theme="minimal"
        className={styles.close}
        onClick={() => setFiltersOpen(false)}
      >
        Close
      </Button>
      Filters will go here
    </div>
  )
});