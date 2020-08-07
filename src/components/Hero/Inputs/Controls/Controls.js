import React, { useState, useCallback, memo, useEffect } from 'react';
import { formFields } from '@config';
import { field } from '@enums';
import ZipCode from './ZipCode';
import HomeValue from './HomeValue';
import LoanAmount from './LoanAmount';
import CreditScore from './CreditScore';
import PropertyType from './PropertyType';
import OccupancyType from './OccupancyType';
import usePrevious from '@hooks/usePrevious';
import { isFunction } from 'lodash';

export default memo(function ControlComponents({
  state,
  // prevState,
  loanType,
  errors,
  canValidate,
  controlsOpen,
  onChange,
  theme,
  updateErrors,
  setCanValidate,
  setCurrentInput,
  refresh
}) {
  const validate = useCallback(
    (value, name, currentState = state) => {
      const { validate } = controls[name];
      const fn = isFunction(validate) ? validate : validate.fn;
      const dependencies = validate.dependencies;
      const _state = { ...currentState, loanType };

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
    },
    [updateErrors, loanType, state]
  );

  const prevState = usePrevious(state);

  useEffect(() => {
    if (state && prevState) {
      Object.keys(controls).forEach(key => {
        if (state[key] !== prevState[key]) {
          validate(state[key], key, state);
        }
      });
    }
  }, [state, prevState, validate]);

  const handleFocus = useCallback(
    (_value, name) => {
      setCurrentInput(name);
    },
    [setCurrentInput]
  );

  const handleBlur = useCallback(
    (_value, name) => {
      if (!canValidate.includes(name)) {
        setCanValidate([...canValidate, name]);
      }
    },
    [canValidate, setCanValidate]
  );

  const handleChange = useCallback(
    (value, name) => {
      onChange(value, name);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter') {
        refresh();
      }
    },
    [refresh]
  );

  const tabIndex = controlsOpen ? 0 : -1;

  useEffect(() => {
    if (!controlsOpen) {
      setCanValidate([]);
    }
  }, [controlsOpen, setCanValidate]);

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
      hasError: !!errors.find(e => e.name === name),
      value: state[name],
      key: name,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
      onKeyDown: handleKeyDown
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
