import React from 'react';
import { Row, Cell } from './TableElements';
import Product from './Product';
import Rate from './Rate';
import Currency from './Currency';

export default function ProductRow({ item, isLoading }) {
  return (
    <Row>
      <Cell>
        <Product product={item} isLoading={isLoading} />
      </Cell>
      <Cell hasBadge={item.isMinRate}>
        <Rate
          rate={item.rate}
          apr={item.apr}
          isMinRate={item.isMinRate}
        />
      </Cell>
      <Cell>
        <Currency amount={item.closingCosts} isClosingCosts />
      </Cell>
      <Cell hasBadge={item.isMinPayment}>
        <Currency
          amount={item.payment}
          isMinPayment={item.isMinPayment}
        />
      </Cell>
    </Row>
  );
}
