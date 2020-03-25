import React from 'react';
import { Button } from '@input';
import styles from './RateTable.module.scss';
import { messages } from '@config';

export default function NoDataMessage({
  isLoading,
  data,
  filteredData,
  resetFilters,
  setControlsOpen
}) {
  if (isLoading || filteredData?.length) {
    return null;
  }

  const noData = !data?.length;
  const message = noData ? messages.noData : messages.noFilteredData;
  const buttonText = noData ? 'Edit Loan Details' : 'Reset Filters';

  const handleButtonClick = () => {
    if (noData) {
      setControlsOpen(true);
    } else {
      resetFilters();
    }
  };

  return (
    <div className={styles.messageWrapper}>
      <div className={styles.messageText}>
        {message}
      </div>
      <Button
        theme="outline"
        fontSize={12}
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}