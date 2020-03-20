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

    data.forEach(product => {
      const type = product.type.toLowerCase();
      const term = product.term.toLowerCase();
      
      if (type === 'fixed' && !fixed.find(p => p.term === term)) {
        fixed.push(product);
      } else if (type === 'adjustable' && !adjustable.find(p => p.term === term)) {
        adjustable.push(product);
      }
    });

    const createComponents = products => {
      return products
        .sort((a, b) => parseInt(a.term) - parseInt(b.term))
        .map(({ term, type }) => {
          const isActive = !filterState.products?.includes(term);
          const isDisabled = !!filterState[type];

          return (
            <ProductFilter
              key={term}
              isActive={isActive}
              isDisabled={isDisabled}
              term={term}
            />
          );
        });
    }

    return [createComponents(fixed), createComponents(adjustable)];
  }, [data, filterState]);

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