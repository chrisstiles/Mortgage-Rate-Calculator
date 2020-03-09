import React, { memo } from 'react';
import { Home, Arrow } from '../icons';
import styles from './Assumptions.module.scss';
import classNames from 'classnames';
import Spinner from 'react-md-spinner';
import { defaults } from '@config';
import { formatCurrency } from '@helpers';

export default memo(function AssumptionsText({
  state,
  isLoading: _isLoading,
  hasInitialLocation,
  zipCodes = {},
  errors
}) {
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
        {hasInitialLocation && getLoanText(state, zipCodes)}
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
}, zipCodes) {
  const parts = [];
  const isPurchase = loanType === 'purchase';

  // Loan type
  parts.push(isPurchase ? 'Purchasing a' : 'Refinancing a');

  // Loan amount
  parts.push(formatCurrency(loanAmount));
  parts.push(isPurchase ? 'home' : 'loan');

  // Location
  zipCodes = zipCodes ?? {};
  const [city, state] = zipCodes[zipCode] ?? [defaults.city, defaults.state];
  parts.push(`in ${city}, ${state}.`);

  // Placeholder
  parts.push('Excellent credit score with 20% down.');

  return parts.join(' ');
}