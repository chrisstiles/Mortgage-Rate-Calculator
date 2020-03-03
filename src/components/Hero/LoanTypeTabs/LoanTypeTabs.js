import React, { useState } from 'react';
import styles from './LoanTypeTabs.module.scss';
import { Purchase, Refinance } from '../icons';
import Label from '@components/Label';
import classNames from 'classnames';
import config from '@config';

export default function LoanTypeTabs({
  loanType,
  setLoanType
}) {
  const purchaseIsActive = loanType === 'purchase';
  const [firstTab] = useState(() => {
    const { defaultLoanType = 'refinance', displayDefaultTabFirst = true } = config;

    if (displayDefaultTabFirst) {
      return defaultLoanType;
    }

    return 'purchase';
  });

  const purchase = (
    <Tab
      loanType="purchase"
      isActive={purchaseIsActive}
      setLoanType={setLoanType}
      key="purchase"
    >
      <Purchase className={styles.purchaseIcon} /> Purchase
    </Tab>
  );

  const refinance = (
    <Tab
      loanType="refinance"
      isActive={!purchaseIsActive}
      setLoanType={setLoanType}
      key="refinance"
    >
      <Refinance /> Refinance
    </Tab>
  );

  const tabs = [purchase];

  if (firstTab === 'purchase') {
    tabs.push(refinance);
  } else {
    tabs.unshift(refinance);
  }

  return (
    <div className={styles.wrapper}>
      <Label>What type of loan are you looking for?</Label>
      <div className={styles.tabWrapper}>
        {tabs}
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