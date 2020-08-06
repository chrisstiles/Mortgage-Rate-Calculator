import React, { memo } from 'react';
import { Home, Arrow, Error, Gear } from '../icons';
import styles from './Assumptions.module.scss';
import classNames from 'classnames';
import Spinner from 'react-md-spinner';
import { upperFirst } from 'lodash';
import { defaults } from '@config';
import { formatCurrency, isVowel, formatPercent } from '@helpers';
import { creditScoreRanges } from '@enums';

export default memo(function AssumptionsText({
  state,
  loanType,
  isLoading: _isLoading,
  hasInitialLocation,
  zipCodes = {},
  errors = [],
  isMobile,
  controlsOpen
}) {
  const isLoading = _isLoading || !zipCodes || !hasInitialLocation;
  const hasError = !!errors?.length;

  return (
    <div className={styles.content} tabIndex="-1">
      {isLoading || !hasInitialLocation ? (
        <BoxText
          icon={
            <Spinner
              size={16}
              singleColor="#383838"
              duration={1200}
            />
          }
        />
      ) : (
        <React.Fragment>
          <BoxText
            icon={<Home className={styles.home} />}
            text={getLoanText({ ...state, loanType }, zipCodes)}
            isVisible={isMobile || (!controlsOpen && !hasError)}
            transitionDirection="down"
          />

          {!isMobile && (
            <React.Fragment>
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
          )}
        </React.Fragment>
      )}
      <div
        className={classNames(styles.arrowWrapper, {
          [styles.loading]: isLoading
        })}
      >
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

const BoxText = memo(
  ({
    icon,
    text,
    isVisible = true,
    transitionDirection = 'down'
  }) => {
    const translateAmount = 10;
    const translate =
      transitionDirection === 'down'
        ? translateAmount
        : -translateAmount;

    return (
      <div
        className={classNames(styles.textWrapper, {
          [styles.visible]: isVisible
        })}
        style={{
          transform: `translateY(${translate}px)`
        }}
      >
        <div className={styles.icon}>{icon}</div>

        {text && <div className={styles.text}>{text}</div>}
      </div>
    );
  }
);

function getLoanText(
  { loanType, loanAmount, homeValue, zipCode, creditScore },
  zipCodes
) {
  const parts = [];
  const isPurchase = loanType === 'purchase';

  // Loan type
  parts.push(isPurchase ? 'Purchasing a' : 'Refinancing a');

  // Loan amount
  if (loanAmount !== undefined) {
    parts.push(formatCurrency(homeValue, false));
  }

  parts.push(isPurchase ? 'home' : 'loan');

  // Location
  if (zipCode !== undefined) {
    zipCodes = zipCodes ?? {};
    const [city] = zipCodes[zipCode] ?? [defaults.city];
    parts.push(`in ${city}`);
  }

  // Credit score
  if (creditScore !== undefined) {
    const score = Object.values(creditScoreRanges).find(s => {
      return s.value === creditScore;
    });

    if (score?.label) {
      const a = isVowel(score.label) ? 'an' : 'a';
      parts.push(
        `with ${a} ${score.label.toLowerCase()} credit score`
      );
    }
  }

  // Down payment
  loanAmount = parseInt(loanAmount);
  homeValue = parseInt(homeValue);

  if (isPurchase && !isNaN(loanAmount) && !isNaN(homeValue)) {
    if (homeValue > loanAmount) {
      const percent = formatPercent(
        homeValue - loanAmount,
        homeValue
      );
      parts.push(`and ${percent} down`);
    }
  }

  const text = parts
    .join(' ')
    .replace(/\s\s+/g, ' ')
    .replace(' .', '.');

  return (
    <React.Fragment>
      <span className={styles.title}>Your Loan:</span>
      {` ${upperFirst(text)}.`}
    </React.Fragment>
  );
}
