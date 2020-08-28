import React, { memo } from 'react';
import { PaymentBadge, NCC } from './icons';
import Tooltip from '@components/Tooltip';
import styles from './RateTable.module.scss';
import classNames from 'classnames';
import { formatCurrency } from '@helpers';
import {
  highlightLowestPayment,
  showBadges,
  showNCCIcon
} from '@config';

export default memo(function Currency({
  amount,
  isMinPayment,
  isClosingCosts
}) {
  const isNCCBadge =
    isClosingCosts && showNCCIcon && parseFloat(amount) === 0;
  const text = isNCCBadge ? (
    <NCC className={styles.ncc} />
  ) : (
    formatCurrency(amount)
  );

  return (
    <div
      className={classNames(styles.item, {
        [styles.highlight]: isMinPayment && highlightLowestPayment
      })}
    >
      {text}
      {isMinPayment && showBadges && !isClosingCosts && (
        <div className={styles.badge}>
          <Tooltip text="Lowest payment">
            <PaymentBadge />
          </Tooltip>
        </div>
      )}
    </div>
  );
});
