import React, { useMemo, useCallback, memo } from 'react';
import { Switch } from '@input';
import styles from './filters.module.scss';
import ProductFilter from './ProductFilter';

export default memo(function ProductTypes({
  data,
  filterState,
  setFilterState
}) {
  const handleProductClick = useCallback(
    (value, name) => {
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
    },
    [setFilterState]
  );

  const [fixedComponents, adjustableComponents] = useMemo(() => {
    if (!data?.length) {
      return [null, null];
    }

    const fixed = [];
    const adjustable = [];

    data.forEach(product => {
      if (
        product.isFixed &&
        !fixed.find(p => p.term === product.term)
      ) {
        fixed.push(product);
      } else if (
        product.isAdjustable &&
        !adjustable.find(p => p.term === product.term)
      ) {
        adjustable.push(product);
      }
    });

    const createComponents = products => {
      return products
        .sort((a, b) => parseInt(b.term) - parseInt(a.term))
        .map(({ term, type, isAdjustable }) => {
          const isActive = !filterState.products?.includes(term);
          const isDisabled = !!filterState[type];

          return (
            <ProductFilter
              key={term}
              term={term}
              isAdjustable={isAdjustable}
              isActive={isActive}
              isDisabled={isDisabled}
              onClick={handleProductClick}
            />
          );
        });
    };

    return [createComponents(fixed), createComponents(adjustable)];
  }, [data, filterState, handleProductClick]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});
