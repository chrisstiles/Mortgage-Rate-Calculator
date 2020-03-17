import React from 'react';
import styles from './filters.module.scss';
import { Button } from '@input';

export default function Filters({ setFiltersOpen }) {
  return (
    <div className={styles.wrapper}>
      <Button
        theme="minimal"
        className={styles.close}
        onClick={() => setFiltersOpen(false)}
      >
        Close Filters
      </Button>
      Filters will go here
    </div>
  )
}