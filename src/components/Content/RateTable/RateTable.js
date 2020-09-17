import React, { useState, useCallback, memo, useMemo } from 'react';
import { Header } from './TableElements';
import ProductRow from './ProductRow';
import NoDataMessage from './NoDataMessage';
import ShowMoreButton from './ShowMoreButton';
import styles from './RateTable.module.scss';
import usePrevious from '@hooks/usePrevious';
import { orderBy, findKey } from 'lodash';
import config from '@config';
import { sort, keys } from '@enums';
import { cache } from '@app';
import classNames from 'classnames';
import { isNumber } from 'lodash';

export default memo(function RateTable({
  data: _data,
  showMoreClicked: _showMoreClicked,
  additioanProductsLoading: _additionalProductsLoading,
  loanType: _loanType,
  shiftY,
  isLoading,
  filterState,
  resetFilters,
  setControlsOpen,
  setShowMoreClicked
}) {
  // If loading is triggered by switching loan,
  // type we display the previous loan type's
  // data until loading is finished.
  const prevLoanType = usePrevious(_loanType);
  const prevData = usePrevious(_data);
  const prevShowMoreClicked = usePrevious(_showMoreClicked);
  const prevAdditionalProductsLoading = usePrevious(
    _additionalProductsLoading
  );
  const [
    data,
    loanType,
    showMoreClicked,
    additioanProductsLoading
  ] = useMemo(() => {
    if (!isLoading || loanType === prevLoanType) {
      return [
        _data,
        _loanType,
        _showMoreClicked[_loanType],
        _additionalProductsLoading
      ];
    }

    return [
      prevData,
      prevLoanType,
      _showMoreClicked[prevLoanType],
      prevAdditionalProductsLoading
    ];
  }, [
    isLoading,
    prevLoanType,
    prevData,
    // prevShowMoreClicked,
    prevAdditionalProductsLoading,
    _data,
    _loanType,
    _showMoreClicked,
    _additionalProductsLoading
  ]);

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

      if (prevState.key === newState.key) {
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
    const filteredData = data.filter(
      ({ type, term, rate, closingCosts, payment }) => {
        const f = filterState;
        // Product type
        if (f[type] || f.products?.includes(term)) {
          return false;
        }

        if (
          // Rate
          (isNumber(f.rate.min) && f.rate.min > rate) ||
          (isNumber(f.rate.max) && f.rate.max < rate) ||
          // Closing costs
          (isNumber(f.closingCosts.min) &&
            f.closingCosts.min > closingCosts) ||
          (isNumber(f.closingCosts.max) &&
            f.closingCosts.max < closingCosts) ||
          // Monthly payment
          (isNumber(f.payment.min) && f.payment.min > payment) ||
          (isNumber(f.payment.max) && f.payment.max < payment)
        ) {
          return false;
        }

        return true;
      }
    );

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

      if (
        rate < minRate.rate ||
        (rate === minRate.rate && apr < minRate.apr)
      ) {
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
      <ProductRow key={index} item={item} isLoading={isLoading} />
    ));
  }, [filteredRows, isLoading]);

  const hasData = !!filteredRows?.length;

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
          hasData={hasData}
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
      {hasData && (
        <React.Fragment>
          <ShowMoreButton
            isLoading={isLoading}
            showMoreClicked={showMoreClicked}
            additioanProductsLoading={additioanProductsLoading}
            setShowMoreClicked={setShowMoreClicked}
          />
          <div className={styles.disclosure}>
            <p>
              * Estimated monthly payments shown include principal and
              interest but do not include amounts for taxes and
              insurance premiums, actual payment obligations will be
              greater.
            </p>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

export function findSortKey(by) {
  return findKey(
    sort.by,
    v => JSON.stringify(v) === JSON.stringify(by)
  );
}
