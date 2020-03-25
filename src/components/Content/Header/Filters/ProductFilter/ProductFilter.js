import React, { memo } from 'react';
import { colors } from '@config';

export default memo(function ProductFilter({
  term,
  isActive = true,
  isDisabled,
  onClick = () => {}
}) {
  const handleClick = () => {
    if (!isDisabled) {
      onClick(!isActive, String(term));
    }
  };

  return (
    <div
      style={{
        color: '#fff',
        backgroundColor: colors[term]?.main ?? colors.default.main,
        opacity: isActive && !isDisabled ? null : .5,
        filter: isActive && !isDisabled ? null : 'grayscale(30%)',
        pointerEvents: !isDisabled ? null : 'none',
        cursor: 'pointer',
        padding: '3px 8px',
        marginBottom: 10,
        borderRadius: 3,
        width: 80
      }}
      onClick={handleClick}
    >
      {term}
    </div>
  );
});