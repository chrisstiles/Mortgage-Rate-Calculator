import React, { useState, memo } from 'react';
import { Row, Cell } from './TableElements';
import Product from './Product';
import Rate from './Rate';
import Modal from '@modal';
import Currency from './Currency';

export default memo(function ProductRow({ item, isLoading }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpen = e => {
    if (e.type !== 'keyup' || e.key === 'Enter') {
      setModalIsOpen(true);
    }
  };

  return (
    <Row onClick={handleOpen} onKeyUp={handleOpen} tabIndex="0">
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
      <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
        Rate: {item.rate}
        <br />
        Closing costs: {item.closingCosts}
      </Modal>
    </Row>
  );
});
