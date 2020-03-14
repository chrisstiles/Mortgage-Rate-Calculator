import { defaults, urlParams, footprint, formFields } from '@config';
import querystring from 'querystring';
import { isString, isFunction, isRegExp, isBoolean, isPlainObject } from 'lodash';
import { cache } from '@app';
import { isInFootprint } from '@helpers';
import { keys, creditScoreRanges, propertyTypes } from './enums';

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

const isNum = n => !isNaN(n);

const state = {
  [keys.CITY]: {
    defaultValue: defaults.city,
    validate: isString,
    transform: c => c.trim()
  },
  [keys.CREDIT_SCORE]: {
    defaultValue: defaults.creditScore,
    validate: n => {
      return isNum(n) && !!Object.values(creditScoreRanges)
        .find(({ value }) => value === n);
    },
    transform: parseInt
  },
  [keys.HOME_VALUE]: {
    defaultValue: defaults.homeValue,
    validate: isNum,
    transform: parseInt
  },
  [keys.LOAN_TYPE]: {
    defaultValue: defaults.loanType,
    validate: urlParams.loanType,
    transform: t => t.toLowerCase()
  },
  [keys.LOAN_AMOUNT]: {
    defaultValue: defaults.loanAmount,
    parameter: 'loanSize',
    validate: isNum,
    transform: parseInt
  },
  [keys.PROPERTY_TYPE]: {
    defaultValue: defaults.propertyType,
    validate: v => {
      return Object.values(propertyTypes).find(({ value }) => value === v);
    }
  },
  [keys.USER_SET_LOCATION]: {
    defaultValue: false,
    validate: isBoolean
  },
  [keys.ZIP_CODE]: {
    defaultValue: defaults.zipCode,
    validate: /^\d{5}$/
  }
};

const query = querystring.parse(window.location.search.replace(/^\?/, ''));

// Make it easy to link to the calculator with URL 
// parameters without worrying about capitalization
function findParamKey(obj, key) {
  if (!obj || !key) {
    return null;
  }

  return obj[key] ? key : Object.keys(obj).find(p => p.toLowerCase() === key.toLowerCase());
}

export default function() {
  const cachedState = cache.get(keys.LOAN_STATE) ?? {};
  const zipCodes = cache.get(keys.ZIP_CODES);
  const formattedState = {};

  Object.keys(state).forEach(key => {
    let {
      defaultValue = null,
      parameter = key,
      validate,
      transform = v => v
    } = state[key];
    parameter = findParamKey(urlParams, parameter);
    const paramOptions = urlParams[parameter];
    let queryValue = query[findParamKey(query, parameter)]?.trim();

    if (isPlainObject(paramOptions)) {
      queryValue = paramOptions[findParamKey(paramOptions, queryValue)];
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

  if (!formFields.includes(keys.ZIP_CODE)) {
    formattedState.zipCode = defaults.zipCode;
    formattedState.city = defaults.city;
    formattedState.userSetLocation = true;
  } else {
    // We store the location of the user's IP address
    // to avoid having to load again if they refresh the page
    const currentLocation = cache.getSession(keys.CURRENT_LOCATION);

    if (currentLocation && !formattedState.userSetLocation) {
      formattedState.zipCode = currentLocation.zipCode;
      formattedState.city = currentLocation.city;
    } else {
      if (zipCodes && footprint) {
        const [city, state] = zipCodes[formattedState.zipCode] ?? [];

        if (city && state && isInFootprint(state)) {
          formattedState.city = city;
        } else {
          formattedState.zipCode = defaults.zipCode;
          formattedState.city = zipCodes[defaults.zipCode][0];
        }
      } else {
        formattedState.zipCode = defaults.zipCode;
        formattedState.city = defaults.city;
      }
    }
  }

  return formattedState;
};