import React from 'react';
import styles from './Header.module.scss';

export default function Header({ loanType }) {
  return (
    <div className={styles.wrapper}>
      {loanType} mortgage rates
    </div>
  );
}