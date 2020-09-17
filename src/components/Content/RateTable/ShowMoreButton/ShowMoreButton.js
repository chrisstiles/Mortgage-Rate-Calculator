import React, { memo } from 'react';
import { Button } from '@input';
import styles from './ShowMoreButton.module.scss';

export default memo(function ShowMoreButton({
  showMoreClicked,
  additioanProductsLoading,
  setShowMoreClicked
}) {
  if (showMoreClicked && !additioanProductsLoading) {
    return null;
  }

  const isLoading = showMoreClicked && additioanProductsLoading;

  return (
    <div className={styles.wrapper}>
      <Button
        disabled={isLoading}
        theme="outline"
        onClick={() => setShowMoreClicked(true)}
      >
        {isLoading ? 'Loading...' : 'Load more rates'}
      </Button>
    </div>
  );
},
shouldPreventRender);

function shouldPreventRender(_, nextProps) {
  return nextProps.isLoading;
}
