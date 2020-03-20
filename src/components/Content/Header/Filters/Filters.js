import React, { useState, useMemo, memo } from 'react';
import styles from './filters.module.scss';
import { Button } from '@input';
import getInitialFilterState from './getInitialFilterState';
import ProductFilter from './ProductFilter';

export default memo(function Filters({ data, filtersOpen, setFiltersOpen }) {
  const [filterState, setFilterState] = useState(() => {
    return getInitialFilterState();
  });

  const [fixedComponents, adjustableComponents] = useMemo(() => {
    if (!data?.length) {
      return [null, null];
    }
    
    const fixed = [];
    const adjustable = [];

    data.forEach(({ type, term }) => {
      type = type.toLowerCase();
      
      if (type === 'fixed' && !fixed.includes(term)) {
        fixed.push(term);
      } else if (type === 'adjustable' && !adjustable.includes(term)) {
        adjustable.push(term);
      }
    });

    const createComponents = terms => {
      return terms
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(term => (
          <ProductFilter
            key={term}
            isActive={true}
            term={term}
          />
        ));
    }

    return [createComponents(fixed), createComponents(adjustable)];
  }, [data]);

  return !filtersOpen ? null : (
    <div className={styles.wrapper}>
      <Button
        theme="minimal"
        className={styles.close}
        onClick={() => setFiltersOpen(false)}
      >
        Close
      </Button>
      
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 15 }}>
          Fixed:<br /><br />
          {fixedComponents}
        </div>
        <div style={{ marginRight: 15 }}>
          Adjustable:<br /><br />
          {adjustableComponents}
        </div>
      </div>

    </div>
  )
});