import Button from '@components/Button';
import React from 'react';
import classNames from 'classnames';
import styles from './LoanTypeTabs.module.scss';

export default function LoanTypeTabs({
  loanType,
  setLoanType
}) {
  const purchaseIsActive = loanType === 'purchase';

  return (
    <div className={styles.wrapper}>
      <Tab
        loanType="purchase"
        isActive={purchaseIsActive}
        setLoanType={setLoanType}
      >
        Purchase
      </Tab>
      <Tab
        loanType="refinance"
        isActive={!purchaseIsActive}
        setLoanType={setLoanType}
      >
        Refinance
      </Tab>
    </div>
  );
}

function Tab({
  className,
  loanType,
  isActive,
  children,
  setLoanType
}) {
  return (
    <button
      className={classNames(styles.tab, className, {
        [styles.active]: isActive
      })}
      onClick={() => setLoanType(loanType)}
    >
      <div
        className={styles.content}
        tabIndex="-1"
      >
        {children}
      </div>
    </button>
  );
}