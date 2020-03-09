import React, { memo } from 'react';
import Product from './Product';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import { minDecimals, maxDecimals } from '@config';

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

function Header() {
  return (
    <div className={styles.header}>
      <Cell>Product Type</Cell>
      <Cell>
        <div className={styles.rate}>
          Interest Rate <Divider /> APR
        </div>
      </Cell>
      <Cell>Closing Costs</Cell>
      <Cell>Monthly Payments</Cell>
    </div>
  );
}

function Row() {
  return (
    <div className={styles.row}>
      <Cell>
        <Product term="30" />
      </Cell>
      <Cell>
        <Rate
          rate={4}
          apr={4.5}
        />
      </Cell>
      <Cell>Cell</Cell>
      <Cell>Cell</Cell>
    </div>
  );
}

function Cell({ children, className, ...restProps }) {
  return (
    <div
      className={classNames(styles.cell, className)}
      {...restProps}
    >
      {children}
    </div>
  );
}

function Rate({ rate, apr }) {
  return (
    <div className={styles.rate}>
      {formatRate(rate)} <Divider /> {formatRate(apr)}
    </div>
  );
}

function formatRate(num) {
  num = Number(num).toLocaleString('en-US', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals
  });

  return `${num}%`;
}

function Divider() {
  return <span className={styles.divider} />
}