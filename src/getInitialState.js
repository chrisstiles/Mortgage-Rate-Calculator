import { defaults, footprint } from '@config';
import { isString, isFunction, isRegExp } from 'lodash';
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
    parameter: 'loanType',
    validate: /^(purchase|refinance)$/i,
    transform: t => t.toLowerCase()
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
    const {
      defaultValue = null,
      parameter,
      validate,
      transform = v => v
    } = state[key];

    const value = query[parameter] ?? cachedState[key] ?? defaultValue;

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