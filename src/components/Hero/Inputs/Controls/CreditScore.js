import React from 'react';
import { Select } from '@input';
import { keys, creditScoreRanges } from '@enums';

const options = Object.values(creditScoreRanges);

function CreditScore(props) {
  return (
    <Select
      label="Credit Score"
      placeholder="Credit Score"
      name={keys.CREDIT_SCORE}
      maxWidth={160}
      options={options}
      {...props}
    />
  );
}

function validate(value) {
  if (isNaN(value)) {
    return 'Please select a credit score';
  }

  if (!options.find(o => value === o.value)) {
    return 'Invalid credit score';
  }
}

export default { Component: CreditScore, validate };