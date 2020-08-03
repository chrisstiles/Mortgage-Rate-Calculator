import React, { useMemo, useCallback, memo } from 'react';
import { Switch } from '@input';
import styles from './filters.module.scss';
import ProductFilter from './ProductFilter';
import { isFixedRate, isAdjustableRate } from '@helpers';

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
      const type = product.type.toLowerCase();
      const term = product.term;

      if (isFixedRate(type) && !fixed.find(p => p.term === term)) {
        fixed.push(product);
      } else if (
        isAdjustableRate(type) &&
        !adjustable.find(p => p.term === term)
      ) {
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
