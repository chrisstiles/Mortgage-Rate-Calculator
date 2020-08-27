import React, { memo } from 'react';
import Tooltip from '@components/Tooltip';
import styles from './RateTable.module.scss';
import { RateBadge } from './icons';
import classNames from 'classnames';
import { highlightLowestRate, showBadges } from '@config';
import { formatPercent } from '@helpers';

export default memo(function Rate({ rate, apr, isMinRate }) {
  return (
    <div
      className={classNames(styles.item, {
        [styles.highlight]: isMinRate && highlightLowestRate
      })}
    >
      {formatPercent(rate, null, true)} <Divider />{' '}
      {formatPercent(apr, null, true)}
      {isMinRate && showBadges && (
        <div className={styles.badge}>
          <Tooltip text="Lowest rate">
            <RateBadge />
          </Tooltip>
        </div>
      )}
    </div>
  );
});

export function Divider() {
  return <span className={styles.divider} />;
}
