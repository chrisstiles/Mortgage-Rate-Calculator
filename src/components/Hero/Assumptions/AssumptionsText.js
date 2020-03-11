import React, { memo } from 'react';
import { Home, Arrow, Error } from '../icons';
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
  errors = [],
  controlsOpen
}) {
  const isLoading = _isLoading || !zipCodes || !hasInitialLocation;
  let icon;

  if (errors?.length) {
    icon = <Error />;
  } else if (isLoading) {
    icon = (
      <Spinner
        size={16}
        singleColor="#383838"
      />
    );
  } else {
    icon = <Home className={styles.home} />;
  }

  const text = getLoanText({ state, zipCodes, errors, controlsOpen });

  return (
    <div
      className={styles.content}
      tabIndex="-1"
    >
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.text}>
        {hasInitialLocation && text}
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
  state: loanState,
  zipCodes,
  errors = [],
  controlsOpen
}) {
  if (errors?.length) {
    return errors[0].error;
  }

  if (controlsOpen) {
    return 'Enter your loan information into the box below.';
  }

  const { loanType, loanAmount, zipCode } = loanState;
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