import React, { memo } from 'react';
import { Home, Arrow, Error, Gear } from '../icons';
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
  const hasError = !!errors?.length;

  return (
    <div
      className={styles.content}
      tabIndex="-1"
    >
      {isLoading ?
        <BoxText
          icon={
            <Spinner
              size={16}
              singleColor="#383838"
            />
          }
        />
      :
        <React.Fragment>
          <BoxText
            icon={<Home className={styles.home} />}
            text={getLoanText(state, zipCodes)}
            isVisible={!controlsOpen && !hasError}
            transitionDirection="down"
          />

          <BoxText
            icon={<Gear className={styles.gear} />}
            text="Enter your loan information into the box below."
            isVisible={controlsOpen && !hasError}
            transitionDirection="up"
          />

          <BoxText
            icon={<Error className={styles.gear} />}
            text={errors[0]?.error}
            isVisible={hasError}
          />
        </React.Fragment>
      }
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

const BoxText = memo(({
  icon,
  text,
  isVisible = true,
  transitionDirection = 'down'
}) => {
  const translateAmount = 10;
  const translate = transitionDirection === 'down' ? translateAmount : -translateAmount;

  return (
    <div
      className={classNames(styles.textWrapper, {
        [styles.visible]: isVisible
      })}
      style={{
        transform: `translateY(${translate}px)`
      }}
    >
      <div className={styles.icon}>
        {icon}
      </div>

      {text &&
        <div className={styles.text}>
          {text}
        </div>
      }
    </div>
  );
});

function getLoanText({ loanType, loanAmount, zipCode }, zipCodes) {
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

  return (
    <React.Fragment>
      <span className={styles.title}>Your Loan:</span>
      {` ${parts.join(' ')}`}
    </React.Fragment>
  )
}