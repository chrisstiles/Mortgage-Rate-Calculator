import React, { memo } from 'react';
import { colors } from '@config';

export default memo(function ProductFilter({ term, isActive = true }) {
  return (
    <div
      style={{
        color: '#fff',
        backgroundColor: colors[term]?.main ?? colors.default.main,
        opacity: isActive ? null : .5,
        filter: isActive ? null : 'grayscale(30%)',
        padding: '3px 8px',
        marginBottom: 10,
        borderRadius: 3,
        width: 80
      }}
    >
      {term}
    </div>
  );
});