import React from 'react';
import { Divider } from './Rate';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import { sort } from '@enums';

const columns = [
  {
    title: 'Product Type',
    name: sort.by.PRODUCT
  },
  {
    title: (
      <div className={styles.rate}>
        Interest Rate <Divider /> APR
      </div>
    ),
    name: sort.by.RATE
  },
  { title: 'Closing Costs', name: sort.by.CLOSING_COSTS },
  { title: 'Monthly Payments', name: sort.by.PAYMENT }
];

export function Header({ shiftY, sortState, updateSort }) {
  const cells = columns.map(({ title, name }, index) => (
    <HeaderCell
      key={index}
      shiftY={shiftY}
      name={name}
      sortState={sortState}
      updateSort={updateSort}
    >
      {title}
    </HeaderCell>
  ));

  return (
    <Row className={styles.header}>
      {cells}
    </Row>
  );
}

export function HeaderCell({
  shiftY,
  sortState,
  name,
  updateSort,
  ...restProps
}) {
  // console.log(sortState, name)

  return (
    <Cell
      style={{ top: shiftY - 1 }}
      onClick={() => updateSort(name)}
      {...restProps}
    />
  );
}

export function Row({ children, className = styles.row }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function Cell({ children, className, hasBadge, ...restProps }) {
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