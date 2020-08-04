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
  // Data is set to null on initial load
  if (data === null) {
    return <Message message={messages.initialLoad} />;
  }

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
    <Message
      message={message}
      buttonText={buttonText}
      onButtonClick={handleButtonClick}
    />
  );
}

function Message({ message, buttonText, onButtonClick }) {
  return (
    <div className={styles.messageWrapper}>
      <div className={styles.messageText}>{message}</div>
      {buttonText && onButtonClick && (
        <Button theme="outline" fontSize={12} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
