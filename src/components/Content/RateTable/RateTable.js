import React, { memo } from 'react';
import styles from './RateTable.module.scss';
import classNames from 'classnames';

export default memo(function RateTable() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Row />
      <Row />
      <Row />
      <Row />
    </div>
  );
});

const Header = memo(() => {
  return (
    <div className={styles.header}>
      <Cell>Product Type</Cell>
      <Cell>Interest Rate <Divider /> APR</Cell>
      <Cell>Closing Costs</Cell>
      <Cell>Monthly Payments</Cell>
    </div>
  );
});

const Row = memo(() => {
  return (
    <div className={styles.row}>
      <Cell>Cell</Cell>
      <Cell>4.50%</Cell>
      <Cell>Cell</Cell>
      <Cell>Cell</Cell>
    </div>
  );
});

const Cell = memo(({ children, className, ...restProps }) => {
  return (
    <div
      className={classNames(styles.cell, className)}
      {...restProps}
    >
      {children}
    </div>
  );
});

function Divider() {
  return <span className={styles.divider}>/</span>
}