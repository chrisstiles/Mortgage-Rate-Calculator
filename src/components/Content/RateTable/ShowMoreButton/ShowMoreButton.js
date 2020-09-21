import React, { memo } from 'react';
import { Button } from '@input';
import styles from './ShowMoreButton.module.scss';

export default memo(function ShowMoreButton({
  showMoreClicked,
  additioanProductsLoading,
  isLoading,
  setShowMoreClicked
}) {
  if (showMoreClicked && !additioanProductsLoading) {
    return null;
  }

  const isLoadingAdditional =
    showMoreClicked && additioanProductsLoading;

  return (
    <div className={styles.wrapper}>
      <Button
        disabled={isLoading || isLoadingAdditional}
        theme="outline"
        onClick={() => setShowMoreClicked(true)}
      >
        {isLoadingAdditional ? 'Loading...' : 'Load more rates'}
      </Button>
    </div>
  );
},
shouldPreventRender);

function shouldPreventRender(prevProps, nextProps) {
  return prevProps.preventRender && nextProps.preventRender;
}
