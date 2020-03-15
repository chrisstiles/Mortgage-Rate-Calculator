import React from 'react';
import { PaymentBadge, NCC } from './icons';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import { formatCurrency } from '@helpers';
import { highlightLowestPayment, showBadges } from '@config';

export default function Currency({ amount, isMinPayment, isClosingCosts }) {
  const isNCCBadge = isClosingCosts && showBadges && parseFloat(amount) === 0;
  const text = isNCCBadge ? <NCC className={styles.ncc} /> : formatCurrency(amount);

  return (
    <div
      className={classNames(styles.item, {
        [styles.highlight]: isMinPayment && highlightLowestPayment
      })}
    >
      {text}
      {isMinPayment && showBadges && !isClosingCosts &&
        <PaymentBadge className={styles.badge} />
      }
    </div>
  );
}