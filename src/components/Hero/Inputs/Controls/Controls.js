import React, { useState, useCallback, memo, useEffect } from 'react';
import { formFields } from '@config';
import { field } from '@enums';
import ZipCode from './ZipCode';
import HomeValue from './HomeValue';
import LoanAmount from './LoanAmount';
import CreditScore from './CreditScore';
import PropertyType from './PropertyType';
import OccupancyType from './OccupancyType';
import { isFunction } from 'lodash';

/*

Zip Code
Loan Type
Home Value
Loan Amount
Property Type
  Single Family - 1 unit
  Planned Unit Development (PUD)
  Condo (Default using 'Low-Rise Condo 1-4' for all condo property types)
  2-4 Unit (Default using 2 unit tracking code for best pricing results)
  Manufactured Home
Occupancy Type
  Owner Occupied
  Second Home
  Investment Property
Credit Score
Cash Out Amount

*/

export default memo(function ControlComponents({
  state,
  loanType,
  errors,
  controlsOpen,
  onChange,
  theme,
  updateErrors
}) {
  const [canValidate, setCanValidate] = useState([]);

  const validate = useCallback((value, name) => {
    const { validate } = controls[name];
    const fn = isFunction(validate) ? validate : validate.fn;
    const dependencies = validate.dependencies;
    const _state = { ...state, loanType };
    
    if (fn) {
      updateErrors(fn(value, _state), name);
    }
    
    if (dependencies) {
      [dependencies].flat().forEach(key => {
        const { validate } = controls[key];
        const fn = isFunction(validate) ? validate : validate.fn;
        
        if (fn) {
          updateErrors(fn(_state[key], _state), key);
        }
      });
    }
  }, [updateErrors, state, loanType]);

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

  const tabIndex = controlsOpen ? 0 : -1;

  useEffect(() => {
    if (!controlsOpen) {
      setCanValidate([]);
    }
  }, [controlsOpen]);

  return formFields.map(name => {
    const { Component, dependencies } = controls[name];

    if (!Component) {
      return null;
    }

    const props = {
      name,
      tabIndex,
      loanType,
      theme,
      value: state[name],
      key: name,
      hasError: !!errors.find(e => e.name === name),
      onBlur: handleBlur,
      onChange: handleChange
    };

    if (dependencies) {
      [dependencies].flat().forEach(key => {
        props[key] = state[key];
      });
    }

    return <Component {...props} />;
  });
});

// Object includes keys for each potential form field along
// with a validation function. When the field's value changes
// it will be passed to this function. It should return
// a string with an error message if it is invalid.
const controls = {
  [field.LOAN_AMOUNT]: LoanAmount,
  [field.ZIP_CODE]: ZipCode,
  [field.HOME_VALUE]: HomeValue,
  [field.CREDIT_SCORE]: CreditScore,
  [field.PROPERTY_TYPE]: PropertyType,
  [field.OCCUPANCY_TYPE]: OccupancyType
};