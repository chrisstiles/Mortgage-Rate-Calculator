import React from 'react';
import { Text } from '@input';
import { keys } from '@enums';
import { upperFirst } from 'lodash';

function HomeValue(props) {
  const text =
    props.loanType === 'purchase' ? 'Purchase Price' : 'Home Value';

  return (
    <Text
      label={text}
      placeholder={text}
      name={keys.HOME_VALUE}
      maxWidth={140}
      isCurrency
      {...props}
    />
  );
}

function validate(num, state) {
  const name =
    state.loanType === 'purchase' ? 'purchase price' : 'home value';
  num = parseFloat(num);

  if (isNaN(num)) {
    return `Please enter a valid ${name}`;
  }

  if (num < parseFloat(state[keys.LOAN_AMOUNT])) {
    return `${upperFirst(name)} must be greater than loan amount`;
  }
}

export default {
  Component: HomeValue,
  validate: {
    fn: validate,
    dependencies: keys.LOAN_AMOUNT
  }
};
