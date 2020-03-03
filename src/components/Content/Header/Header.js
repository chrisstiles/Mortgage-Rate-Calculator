import React from 'react';
import { Rate, Chat } from './icons';
import styles from './Header.module.scss';
import { upperFirst } from 'lodash';

export default function Header({ loanType }) {
  return (
    <div className={styles.wrapper}>
      <Top loanType={loanType} />
    </div>
  );
}

function Top({ loanType }) {
  return (
    <div className={styles.top}>
      <Rate className={styles.rateIcon} />
      <div className={styles.info}>
        <div className={styles.title}>
          {upperFirst(loanType)} Mortgage Rates
        </div>
        <div className={styles.subtitle}>
          Effective as of February 4, 2019 at 3:50 PM
        </div>
      </div>
      <div className={styles.chat}>
        <Chat className={styles.chatIcon} />
        <div>
          <div className={styles.title}>
            Have questions?
          </div>
          <div className={styles.subtitle}>
            Chat with a helpful loan officer
          </div>
        </div>
      </div>
    </div>
  );
}