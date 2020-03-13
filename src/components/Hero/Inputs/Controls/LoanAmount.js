import React from 'react';
import { Text } from '@input';
import { formatCurrency } from '@helpers';
import config from '@config';
import { keys } from '@enums';

function LoanAmount(props) {
  return (
    <Text
      label="Loan Amount"
      placeholder="Loan Amount"
      name={keys.LOAN_AMOUNT}
      maxWidth={180}
      hasError={props.hasError}
      isCurrency
      {...props}
    />
  );
}

function validate(num, state) {
  const { minLoanAmount = 0, maxLoanAmount } = config;
  num = parseFloat(num);

  if (isNaN(num)) {
    return 'Please enter a valid loan amount';
  }

  if (num < minLoanAmount) {
    return `Please enter a loan amount of at least ${formatCurrency(minLoanAmount)}`;
  }

  if (num > maxLoanAmount) {
    return `Please enter a loan amount of ${formatCurrency(maxLoanAmount)} or less`;
  }

  if (num >= parseFloat(state[keys.HOME_VALUE])) {
    const name = state.loanType === 'purchase' ? 'purchase price' : 'home value';
    return `Loan amount must be lower than ${name}`;
  }
}

export default {
  Component: LoanAmount,
  validate: {
    fn: validate,
    dependencies: keys.HOME_VALUE
  }
};