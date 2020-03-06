import { defaults, urlParams, footprint } from '@config';
import { isString, isFunction, isRegExp, isPlainObject } from 'lodash';
import querystring from 'querystring';

// This object defines the shape of our shape object.

// When a user updates the loan assumptions, we cache
// those settings in their browser's local storage.
// That way the next time they visit the calculator
// it autopopulates the loan they're looking for.

// Passing a string to the parameter key will allow
// the value to be overwritten based on a query string
// parameter. This is useful for changing the initial
// application state based on where the user came from.
// For example, a jumbo loan would have a higher loan amount
// than the default for the calculator. A URL parameter value
// will override a cached value from local storage.

const state = {
  loanType: {
    defaultValue: defaults.loanType,
    validate: urlParams.loanType,
    transform: t => t.toLowerCase()
  },
  loanAmount: {
    defaultValue: defaults.loanAmount,
    parameter: 'loanSize',
    validate: n => !isNaN(n),
    transform: parseInt
  },
  zipCode: {
    defaultValue: defaults.zipCode,
    validate: /^\d{5}$/
  },
  city: {
    defaultValue: defaults.city,
    validate: isString,
    transform: c => c.trim()
  }
};

const query = querystring.parse(window.location.search.replace(/^\?/, ''));

export default function(zipCodes) {
  let cachedState;

  try {
    cachedState = JSON.parse(window.localStorage.getItem('loanState')) ?? {};
  } catch {
    cachedState = {};
  }

  const formattedState = {};

  Object.keys(state).forEach(key => {
    let {
      defaultValue = null,
      parameter = key,
      validate,
      transform = v => v
    } = state[key];
    const paramOptions = urlParams[parameter];
    let queryValue = query[parameter]?.trim();

    if (isPlainObject(paramOptions)) {
      queryValue = paramOptions[queryValue]
    }

    if (Array.isArray(validate)) {
      validate = new RegExp(`^(${paramOptions.join('|')})$`, 'i');
    }

    const value = queryValue ?? cachedState[key] ?? defaultValue;

    if (validate) {
      if (
        (isRegExp(validate) && !validate.test(value)) ||
        (isFunction(validate) && !validate(value))
      ) {
        formattedState[key] = defaultValue;
        return;
      }
    }

    formattedState[key] = transform(value);
  });

  if (zipCodes && footprint) {
    const [city, state] = zipCodes[formattedState.zipCode] ?? [];

    if (city && state && footprint?.includes(state)) {
      formattedState.city = city;
    } else {
      formattedState.zipCode = defaults.zipCode;
      formattedState.city = zipCodes[defaults.zipCode];
    }
  } else {
    formattedState.zipCode = defaults.zipCode;
    formattedState.city = defaults.city;
  }

  return formattedState;
};