import React, { useMemo, useCallback, memo } from 'react';
import styles from './filters.module.scss';
import { Button, Switch } from '@input';
import ProductFilter from './ProductFilter';
import { ReactComponent as Reset } from './reset.svg';

export default memo(function Filters({
  data,
  filterState,
  filtersOpen,
  setFilterState,
  setFiltersOpen,
  resetFilters
}) {
  const handleProductClick = useCallback((value, name) => {
    setFilterState(({ products: prevProducts = [], ...state }) => {
      if (!Array.isArray(prevProducts)) {
        prevProducts = [];
      }

      const products = prevProducts.filter(p => p !== name);
      
      if (!value) {
        products.push(name);
      }

      return { ...state, products };
    });
  }, [setFilterState]);

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
        .sort((a, b) => parseInt(b.term) - parseInt(a.term))
        .map(({ term, type }) => {
          const isActive = !filterState.products?.includes(term);
          const isDisabled = !!filterState[type];

          return (
            <ProductFilter
              key={term}
              isActive={isActive}
              isDisabled={isDisabled}
              term={term}
              type={type}
              onClick={handleProductClick}
            />
          );
        });
    }

    return [createComponents(fixed), createComponents(adjustable)];
  }, [data, filterState, handleProductClick]);

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
      
      <div className={styles.column}>
        <Switch
          value={!filterState.fixed}
          name="fixed"
          label="Fixed"
          className={styles.switch}
          onChange={setFilterState}
        />
        {fixedComponents}
      </div>
      <div className={styles.column}>
        <Switch
          value={!filterState.adjustable}
          name="adjustable"
          label="Adjustable"
          className={styles.switch}
          onChange={setFilterState}
        />
        {adjustableComponents}
      </div>

    </div>
  )
});