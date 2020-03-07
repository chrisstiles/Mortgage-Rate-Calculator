import React, { memo } from 'react';
import { Home, Arrow } from '../icons';
import styles from './Assumptions.module.scss';
import classNames from 'classnames';
import Spinner from 'react-md-spinner';
import { cache } from '@app';
import { defaults } from '@config';
import { hasIn } from 'lodash';

export default memo(function AssumptionsText({
  state,
  isLoading: _isLoading,
  hasInitialLocation,
  errors
}) {
  const zipCodes = cache.get('zipCodes');
  const isLoading = _isLoading || !zipCodes || !hasInitialLocation;
  let icon;

  if (errors) {
    icon = 'Error:';
  } else if (isLoading) {
    icon = (
      <Spinner
        size={16}
        singleColor="#383838"
      />
    );
  } else {
    icon = <Home />;
  }

  return (
    <div
      className={styles.content}
      tabIndex="-1"
    >
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.text}>
        {hasInitialLocation && getLoanText(state)}
      </div>
      <div className={styles.arrowWrapper}>
        <div className={classNames(styles.arrow, styles.down)}>
          <Arrow />
        </div>
        <div className={classNames(styles.arrow, styles.up)}>
          <Arrow />
        </div>
      </div>
    </div>
  );
});

function getLoanText({
  loanType,
  loanAmount,
  zipCode
}) {
  const parts = [];

  // Loan type
  parts.push(loanType === 'purchase' ? 'Purchasing a' : 'Refinancing a');

  // Location
  const zipCodes = cache.get('zipCodes', {});
  const [city, state] = zipCodes[zipCode] ?? [defaults.city, defaults.state];
  parts.push(`home in ${city}, ${state}.`);

  // Placeholder
  parts.push('Excellent credit score with 20% down.');

  return parts.join(' ');
}