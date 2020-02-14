import React from 'react';
import Button from '@components/Button';
import styles from './LoanTypeTabs.module.scss';
import classNames from 'classnames';

export default function LoanTypeTabs({
  loanType,
  setLoanType
}) {
  return (
    <div className={styles.wrapper}>
      <Button
        className={classNames(styles.button, {
          [styles.current]: loanType === 'purchase'
        })}
      >
        Purchase
      </Button>
      <Button
        className={classNames(styles.button, {
          [styles.current]: loanType === 'refinance'
        })}
      >
        Refinance
      </Button>
    </div>
  );
}