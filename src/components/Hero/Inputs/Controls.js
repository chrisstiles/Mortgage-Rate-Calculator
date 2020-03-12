import React, { useState, useCallback, memo, useEffect } from 'react';
import { Text } from '@input';
import config, { formFields } from '@config';
import { field } from '@enums';
import { formatCurrency, isInFootprint } from '@helpers';
import { cache } from '@app';

export default memo(function ControlComponents({
  state,
  errors,
  controlsOpen,
  onChange,
  updateErrors
}) {
  const [canValidate, setCanValidate] = useState([]);

  const validate = useCallback((value, name) => {
    const fn = controls[name].validate;

    if (fn) {
      updateErrors(fn(value, state), name);
    }
  }, [updateErrors, state]);

  const handleBlur = useCallback((value, name) => {
    if (!canValidate.includes(name)) {
      setCanValidate([...canValidate, name]);
    }

    validate(value, name);
  }, [canValidate, validate]);

  const handleChange = useCallback((value, name) => {
    if (canValidate.includes(name)) {
      validate(value, name);
    }

    onChange(value, name);
  }, [onChange, canValidate, validate]);

  const tabIndex = controlsOpen ? null : -1;

  useEffect(() => {
    if (!controlsOpen) {
      setCanValidate([]);
    }
  }, [controlsOpen]);

  return formFields.map(name => {
    const Component = controls[name].Component;

    if (!Component) {
      return null;
    }

    const hasError = !!errors.find(e => e.name === name);
    
    return (
      <Component
        value={state[name]}
        name={name}
        key={name}
        hasError={hasError}
        tabIndex={tabIndex}
        loanType={state.loanType}
        onBlur={handleBlur}
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
          name="loanAmount"
          maxWidth={180}
          hasError={props.hasError}
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
          name="zipCode"
          format="#####"
          hasError={props.hasError}
          maxWidth={100}
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
  },

  // Home Value
  [field.HOME_VALUE]: {
    Component(props) {
      const text = props.loanType === 'purchase' ? 'Property Value' : 'Estimated Value';

      return (
        <Text
          label={text}
          placeholder={text}
          name="homeValue"
          hasError={props.hasError}
          maxWidth={180}
          isCurrency
          {...props}
        />
      );
    }
  }
};