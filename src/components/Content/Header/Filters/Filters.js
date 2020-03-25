import React, { memo } from 'react';
import styles from './filters.module.scss';
import { Button, Slider } from '@input';
import ProductTypes from './ProductTypes';
import { ReactComponent as Reset } from './reset.svg';

export default memo(function Filters({
  data,
  filterState,
  filtersOpen,
  setFilterState,
  setFiltersOpen,
  resetFilters
}) {
  return !filtersOpen ? null : (
    <div className={styles.wrapper}>
      <div className={styles.shadow} />
      
      <div className={styles.buttons}>
        <Button
          theme="minimal"
          fontSize={14}
          className={styles.reset}
          onClick={resetFilters}
        >
          <Reset /> Reset
        </Button>

        <Button
          theme="minimal"
          className={styles.close}
          onClick={() => setFiltersOpen(false)}
          closeTooltipText="Close filters"
          isClose
        />
      </div>

      <ProductTypes
        data={data}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      
      <Slider
        label="Interest Rate"
      />
    </div>
  )
});