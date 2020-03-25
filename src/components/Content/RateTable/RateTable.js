import React, { useState, useCallback, memo, useMemo } from 'react';
import { Header, Row, Cell } from './TableElements';
import Product from './Product';
import Rate from './Rate';
import Currency from './Currency';
import NoDataMessage from './NoDataMessage';
import styles from './RateTable.module.scss';
import { orderBy, findKey } from 'lodash';
import config from '@config';
import { sort, keys } from '@enums';
import { cache } from '@app';
import classNames from 'classnames';

export default memo(function RateTable({
  data,
  shiftY,
  isLoading,
  filterState,
  resetFilters,
  setControlsOpen
}) {
  const [sortState, setSortState] = useState(() => {
    let { by, order, key } = cache.get(keys.SORT_STATE, {});

    if (!key || !sort.by[key]) {
      key = findSortKey(config.sortBy);
      by = config.sortBy;
    }

    if (!order || !sort.order[order.toUpperCase()]) {
      order = config.sortOrder;
    }
    
    return { by, order, key };
  });

  // Change sort when user clicks a column
  // Only change the order if the cell the user
  // clicked is already being used to sort rows
  const updateSort = useCallback(sortBy => {
    setSortState(prevState => {
      const newState = {
        by: sortBy,
        order: prevState.order,
        key: findSortKey(sortBy)
      };

      if (prevState.key === newState.key)  {
        const { ASC, DESC } = sort.order;
        newState.order = prevState.order === ASC ? DESC : ASC;
      }

      cache.set(keys.SORT_STATE, newState);
      return newState;
    });
  }, []);

  const filteredRows = useMemo(() => {
    if (!data?.length) {
      return null;
    }

    // Filter rows
    const filteredData = data.filter(({
      type,
      term
    }) => {
      // Product type
      if (filterState[type] || filterState.products?.includes(term)) {
        return false;
      }

      return true;
    });

    // No products found for these filters
    if (!filteredData.length) {
      return null;
    }

    const byArr = [sortState.by].flat();
    const orderArr = [sortState.order];

    if (Array.isArray(sortState.by)) {
      orderArr.push(sortState.order);
    }

    const rows = orderBy(filteredData, byArr, orderArr);

    // Find the minimum rates and payments to highlight
    // on rate table. If 2 products share the sample lowest
    // rate and APR or payment, we highlight both
    const minRate = {
      rate: parseFloat(rows[0].rate),
      apr: parseFloat(rows[0].apr),
      indexes: [0]
    };

    const minPayment = {
      amount: parseFloat(rows[0].payment),
      indexes: [0]
    };

    rows.forEach(({ rate, apr, payment }, index) => {
      delete rows[index].isMinPayment;
      delete rows[index].isMinRate;

      if (index === 1) {
        return;
      }

      rate = parseFloat(rate);
      apr = parseFloat(apr);
      payment = parseFloat(payment);

      if (rate < minRate.rate || (rate === minRate.rate && apr < minRate.apr)) {
        minRate.rate = rate;
        minRate.apr = apr;
        minRate.indexes = [index];
      } else if (rate === minRate.rate && apr === minRate.apr) {
        minRate.indexes.push(index);
      }

      if (payment < minPayment.amount) {
        minPayment.amount = payment;
        minPayment.indexes = [index];
      } else if (payment === minPayment.amount) {
        minPayment.indexes.push(index);
      }
    });

    minRate.indexes.forEach(i => {
      rows[i].isMinRate = true;
    });

    minPayment.indexes.forEach(i => {
      rows[i].isMinPayment = true;
    });

    return rows;
  }, [sortState, data, filterState]);

  const components = useMemo(() => {
    if (!filteredRows?.length) {
      return null;
    }

    return filteredRows.map((item, index) => (
      <Row key={index}>
        <Cell>
          <Product
            term={item.term}
            type={item.type}
            isLoading={isLoading}
          />
        </Cell>
        <Cell hasBadge={item.isMinRate}>
          <Rate
            rate={item.rate}
            apr={item.apr}
            isMinRate={item.isMinRate}
          />
        </Cell>
        <Cell>
          <Currency
            amount={item.closingCosts}
            isClosingCosts
          />
        </Cell>
        <Cell hasBadge={item.isMinPayment}>
          <Currency
            amount={item.payment}
            isMinPayment={item.isMinPayment}
          />
        </Cell>
      </Row>
    ));
  }, [filteredRows, isLoading]);

  return (
    <React.Fragment>
      <div
        className={classNames(styles.wrapper, {
          [styles.loading]: isLoading,
          [styles.disabled]: !isLoading && !filteredRows?.length
        })}
      >
        <Header
          shiftY={shiftY}
          sortState={sortState}
          hasData={!!filteredRows?.length}
          updateSort={updateSort}
        />
        {components}
      </div>
      <NoDataMessage
        isLoading={isLoading}
        data={data}
        filteredData={filteredRows}
        resetFilters={resetFilters}
        setControlsOpen={setControlsOpen}
      />
    </React.Fragment>
  );
});

export function findSortKey(by) {
  return findKey(sort.by, v => JSON.stringify(v) === JSON.stringify(by));
}