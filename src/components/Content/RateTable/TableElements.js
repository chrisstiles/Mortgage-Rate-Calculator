import React from 'react';
import { Divider } from './Rate';
import { Arrow } from './icons';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import { sort } from '@enums';
import { findSortKey } from './RateTable';

const columns = [
  {
    title: 'Product Type',
    value: sort.by.PRODUCT
  },
  {
    title: (
      <div className={styles.rate}>
        <span>Interest Rate</span>
        <Divider />{' '}
        <span>
          APR<sup>1</sup>
        </span>
      </div>
    ),
    value: sort.by.RATE
  },
  {
    title: (
      <React.Fragment>
        Closing Costs<sup>3</sup>
      </React.Fragment>
    ),
    value: sort.by.CLOSING_COSTS
  },
  {
    title: (
      <React.Fragment>
        Monthly Payments<sup className={styles.asterisk}>*</sup>
      </React.Fragment>
    ),
    value: sort.by.PAYMENT
  }
];

export function Header({ shiftY, sortState, hasData, updateSort }) {
  const cells = columns.map(({ title, value }, index) => (
    <HeaderCell
      key={index}
      shiftY={shiftY}
      sortKey={findSortKey(value)}
      value={value}
      sortState={sortState}
      updateSort={updateSort}
      hasData={hasData}
      tabIndex={hasData ? 0 : -1}
    >
      {title}
    </HeaderCell>
  ));

  return <Row className={styles.header}>{cells}</Row>;
}

export function HeaderCell({
  shiftY,
  sortState,
  sortKey,
  value,
  updateSort,
  children,
  hasData,
  ...restProps
}) {
  const isCurrent = sortKey === sortState.key;
  const handleKeyPress = e => {
    if (e.key === 'Enter' && hasData) {
      updateSort(value);
    }
  };

  return (
    <Cell
      style={{ top: shiftY - 1 }}
      className={classNames({
        [styles.current]: isCurrent,
        [styles[sortState.order.toLowerCase()]]: isCurrent
      })}
      tabIndex="0"
      onClick={() => updateSort(value)}
      onKeyPress={handleKeyPress}
      {...restProps}
    >
      <div className={styles.headerText}>
        {children}
        {isCurrent && <Arrow />}
      </div>
    </Cell>
  );
}

export function Row({
  children,
  className = styles.row,
  ...restProps
}) {
  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
}

export function Cell({
  children,
  className,
  hasBadge,
  ...restProps
}) {
  return (
    <div
      className={classNames(styles.cell, className, {
        [styles.hasBadge]: hasBadge
      })}
      {...restProps}
    >
      {children}
    </div>
  );
}
