import React, { useCallback, memo } from 'react';
import { Text } from '@input';
import config, { formFields } from '@config';
import { field } from '@enums';
import { formatCurrency, isInFootprint } from '@helpers';
import { cache } from '@app';

export default memo(function ControlComponents({ state }) {
  const handleChange = useCallback((value, name) => {
    const errorMessage = controls[name].validate(value);
    console.log(errorMessage);
  }, []);

  return formFields.map(name => {
    const Component = controls[name].Component;

    if (!Component) {
      return null;
    }
    
    return (
      <Component
        value={state[name]}
        name={name}
        key={name}
        onChange={handleChange}
      />
    );
  });
});

// Object includes keys for each potential form field along
// with a validation function. When the field's value changes
// it will be passed to this function. It should return
// a string with an error message if it is invalid.
const controls = {
  // Loan Amount
  [field.LOAN_AMOUNT]: {
    Component(props) {
      return (
        <Text
          label="Loan Amount"
          placeholder="Enter a loan amount"
          isCurrency
          {...props}
        />
      );
    },
    validate(num) {
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
    }
  },

  // Zip Code
  [field.ZIP_CODE]: {
    Component(props) {
      return (
        <Text
          label="Zip Code"
          placeholder="Zip Code"
          format="#####"
          {...props}
        />
      );
    },
    validate(zipCode) {
      if (!zipCode?.match(/^\d{5}$/)) {
        return 'Please enter a valid zip code';
      }

      if (!isInFootprint(zipCode)) {
        const zipCodes = cache.get('zipCodes', {});
        const [city, state] = zipCodes[zipCode] ?? [];

        if (city && state) {
          return `We don't currently lend in ${city}, ${state}`;
        }

        return 'Zip code not found';
      }
    }
  }
};