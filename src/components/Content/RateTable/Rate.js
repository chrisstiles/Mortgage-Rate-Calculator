import React from 'react';
import styles from './RateTable.module.scss';
import { RateBadge } from './icons';
import classNames from 'classnames';
import {
  minDecimals,
  maxDecimals,
  highlightLowestRate,
  showBadges
} from '@config';

export default function Rate({ rate, apr, isMinRate }) {
  return (
    <div
      className={classNames(styles.item, {
        [styles.highlight]: isMinRate && highlightLowestRate
      })}
    >
      {formatRate(rate)} <Divider /> {formatRate(apr)}
      {isMinRate && showBadges &&
        <RateBadge className={styles.badge} />
      }
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

export function Divider() {
  return <span className={styles.divider} />
}