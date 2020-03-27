import React from 'react';
import styles from './RateTable.module.scss';
import { RateBadge } from './icons';
import classNames from 'classnames';
import { highlightLowestRate, showBadges } from '@config';
import { formatPercent } from '@helpers';

export default function Rate({ rate, apr, isMinRate }) {
  return (
    <div
      className={classNames(styles.item, {
        [styles.highlight]: isMinRate && highlightLowestRate
      })}
    >
      {formatPercent(rate, null, true)} <Divider /> {formatPercent(apr, null, true)}
      {isMinRate && showBadges &&
        <RateBadge className={styles.badge} />
      }
    </div>
  );
}

export function Divider() {
  return <span className={styles.divider} />
}