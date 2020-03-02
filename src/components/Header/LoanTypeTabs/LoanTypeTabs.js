import React from 'react';
import styles from './LoanTypeTabs.module.scss';
import { Purchase, Refinance } from '../icons';
import Label from '@components/Label';
import classNames from 'classnames';

export default function LoanTypeTabs({
  loanType,
  setLoanType
}) {
  const purchaseIsActive = loanType === 'purchase';

  return (
    <div className={styles.wrapper}>
      <Label>What type of loan are you looking for?</Label>
      <div className={styles.tabWrapper}>
        <Tab
          loanType="purchase"
          isActive={purchaseIsActive}
          setLoanType={setLoanType}
        >
          <Purchase className={styles.purchaseIcon} />
          Purchase
        </Tab>
        <Tab
          loanType="refinance"
          isActive={!purchaseIsActive}
          setLoanType={setLoanType}
        >
          <Refinance />
          Refinance
        </Tab>
      </div>
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