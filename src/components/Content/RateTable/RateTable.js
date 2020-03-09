import React, { memo, useMemo } from 'react';
import Product from './Product';
import Rate, { Divider } from './Rate';
import Currency from './Currency';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import sampleData from './sample-data.json';
import { orderBy } from 'lodash';

export default memo(function RateTable({ shiftY }) {
  const filteredRows = useMemo(() => {
    if (!sampleData?.length) {
      return null;
    }

    // TODO: Add ability to filter rows
    const rows = orderBy(sampleData, ['type', 'term'], ['desc', 'desc']);

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
  }, []);

  const components = useMemo(() => {
    if (!sampleData?.length) {
      return null;
    }

    return filteredRows.map((item, index) => (
      <Row key={index}>
        <Cell>
          <Product
            term={item.term}
            type={item.type}
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
          <Currency amount={item.closingCosts} />
        </Cell>
        <Cell hasBadge={item.isMinPayment}>
          <Currency
            amount={item.payment}
            isMinPayment={item.isMinPayment}
          />
        </Cell>
      </Row>
    ));
  }, [filteredRows]);

  return (
    <div className={styles.wrapper}>
      <Header shiftY={shiftY} />
      {components}
    </div>
  );
});

function Header({ shiftY }) {
  return (
    <Row className={styles.header}>
      <HeaderCell shiftY={shiftY}>
        Product Type
      </HeaderCell>
      <HeaderCell shiftY={shiftY}>
        <div className={styles.rate}>
          Interest Rate <Divider /> APR
        </div>
      </HeaderCell>
      <HeaderCell shiftY={shiftY}>
        Closing Costs
      </HeaderCell>
      <HeaderCell shiftY={shiftY}>
        Monthly Payments
      </HeaderCell>
    </Row>
  );
}

function HeaderCell({ shiftY, ...restProps }) {
  return (
    <Cell
      style={{ top: shiftY - 1 }}
      {...restProps}
    />
  );
}

function Row({ children, className = styles.row }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

function Cell({ children, className, hasBadge, ...restProps }) {
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