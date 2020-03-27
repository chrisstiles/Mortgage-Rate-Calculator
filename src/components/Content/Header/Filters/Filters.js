import React, { memo } from 'react';
import styles from './filters.module.scss';
import { Button, Slider } from '@input';
import ProductTypes from './ProductTypes';
import RateSliders from './RateSliders';
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

      <div className={styles.top}>
        <div className={styles.title}>Edit Filters</div>

        <div className={styles.buttons}>
          <Button
            theme="minimal"
            fontSize={13}
            className={styles.reset}
            contentStyle={{ paddingLeft: 10, paddingRight: 10 }}
            onClick={resetFilters}
          >
            <Reset /> Reset
        </Button>

          <Button
            theme="minimal"
            className={styles.closeWrapper}
            contentClassName={styles.close}
            onClick={() => setFiltersOpen(false)}
            closeTooltipText="Close filters"
            isClose
          />
        </div>
      </div>

      <div className={styles.content}>
        <ProductTypes
          data={data}
          filterState={filterState}
          setFilterState={setFilterState}
        />

        <div className={styles.column}>
          <RateSliders
            data={data}
            filterState={filterState}
            setFilterState={setFilterState}
          />
        </div>
      </div>
    </div>
  )
});