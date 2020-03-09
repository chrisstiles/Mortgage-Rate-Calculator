import React from 'react';
import { PaymentBadge } from './icons';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import { formatCurrency } from '@helpers';
import { highlightLowestPayment, showBadges } from '@config';

export default function Currency({ amount, isMinPayment }) {
  return (
    <div
      className={classNames(styles.item, {
        [styles.highlight]: isMinPayment && highlightLowestPayment
      })}
    >
      {formatCurrency(amount)}
      {isMinPayment && showBadges &&
        <PaymentBadge className={styles.badge} />
      }
    </div>
  );
}