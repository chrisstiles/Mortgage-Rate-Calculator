import {
  isPlainObject,
  isFunction,
  isString,
  findKey,
  isEqual,
  isNumber,
  sortBy
} from 'lodash';
import { cache } from '@app';
import { footprint, minDecimals, maxDecimals } from '@config';
import states from '@utils/states';

export function getState(state, value, name) {
  if (!isPlainObject(state) || (!value && !name)) {
    return state;
  }

  if (isFunction(value)) {
    return value(state);
  }

  if (isPlainObject(value)) {
    return { ...state, ...value };
  }

  if (!name) {
    return state;
  }

  if (Array.isArray(value)) {
    return { ...state, [name]: [...value] };
  }

  return { ...state, [name]: value };
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function formatCurrency(num) {
  const isNegative = num < 0;
  num = Math.abs(Number(num)).toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });

  return isNegative ? `—$${num}` : `$${num}`;
}

export function formatPercent(num1, num2, addDecimals) {
  let num = !isNumber(num2) ? num1 : Math.round((num1 / num2) * 100);

  if (addDecimals) {
    num = Number(num).toLocaleString('en-US', {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals
    });
  }

  return `${num}%`;
}

export function getUSState(str) {
  if (!str) {
    return null;
  }

  str = str.toUpperCase();

  if (states[str]) {
    return { short: str, long: states[str] };
  }

  const state = findKey(states, s => s.toUpperCase() === str);

  if (!state) {
    return null;
  }

  return { short: state, long: states[state] };
}

export function getFootprint(type = 'short') {
  const states = (footprint ?? ['CA'])
    .map(s => {
      const state = getUSState(s);
      return state ? state[type] : null;
    })
    .filter(s => s);

  return states.length ? states : ['CA'];
}

export function isInFootprint(zipCodeOrState) {
  if (!zipCodeOrState) {
    return false;
  }

  zipCodeOrState = String(zipCodeOrState);
  const states = getFootprint();
  let state;

  if (isNaN(zipCodeOrState)) {
    state = zipCodeOrState;
  } else {
    const zipCodes = cache.get('zipCodes', {});
    state = (zipCodes[zipCodeOrState] ?? [])[1];
  }

  return !!(
    state && states.find(s => s.toLowerCase() === state.toLowerCase())
  );
}

export function mapObject(obj, fn) {
  return Object.keys(obj).map(k => fn(obj[k], k));
}

export function isVowel(letter) {
  if (!isString(letter)) {
    return false;
  }

  return ['a', 'e', 'i', 'o', 'u'].includes(letter[0].toLowerCase());
}

export function objectWithoutKey(object, key) {
  const { [key]: deletedKey, ...otherKeys } = object;
  return otherKeys;
}

export function compareObjects(a, b, keys) {
  if ((!a && b) || (a && !b)) {
    return false;
  }

  if (!keys) {
    return isEqual(a, b);
  }

  keys = [keys].flat();

  const getObj = obj => {
    const newObj = {};
    keys.forEach(key => (newObj[key] = obj[key]));
    return newObj;
  };

  return isEqual(getObj(a), getObj(b));
}

export function compareArrays(a, b, checkOrder) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.error('Arguments must be arrays');
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  if (!checkOrder) {
    a = sortBy(a);
    b = sortBy(b);
  }

  return isEqual(a, b);
}

export function call(thisOrMethod, methodOrArg, ...args) {
  if (isFunction(thisOrMethod)) {
    return thisOrMethod.apply(this, [methodOrArg, ...args]);
  }

  if (isFunction(methodOrArg)) {
    return methodOrArg.apply(thisOrMethod, [...args]);
  }
}

export function isAdjustableRate(type) {
  if (!type) {
    return false;
  }

  return !!type.trim().match(/^adjustable$/i);
}

export function isFixedRate(type) {
  if (!type) {
    return false;
  }

  return !!type.trim().match(/^fixed$/i);
}

export function isPurchase(type) {
  if (!type) {
    return false;
  }

  return !!type.trim().match(/^purchase$/i);
}

export function isRefinance(type) {
  if (!type) {
    return false;
  }

  return !!type.trim().match(/^refinance$/i);
}

export function isValidDate(date) {
  date = new Date(date);
  return date instanceof Date && !isNaN(date);
}

export function getLoanTerm(months, type) {
  if (!months || !type) {
    console.log('Undefined term or product type');
    return null;
  }

  if (type.trim().match(/^fixed/i)) {
    if (isNaN(months) || Number(months) % 12 !== 0) {
      console.error('Invalid fixed term', months);
      return null;
    }

    return String(Number(months) / 12);
  } else if (type.trim().match(/^adjustable/i)) {
    const termArr = months.split('/');
    const fixedTerm = Number(termArr[0]);

    if (
      termArr.length === 1 ||
      isNaN(fixedTerm) ||
      fixedTerm % 12 !== 0
    ) {
      console.error('Invalid adjustable term', months);
      return null;
    }

    return `${fixedTerm / 12}/1`;
  } else {
    console.error('Invalid product type', type);
    return null;
  }
}

// Returns the time difference (defaults to milliseconds)
export function getTimeDifference(a, b, unit) {
  a = new Date(a);
  b = new Date(b);

  if (!isValidDate(a) || !isValidDate(b)) {
    console.error('Invalid date');
    return null;
  }

  let diffMs = Math.abs(b - a);
  let diff = diffMs;

  if (unit === 'minutes') {
    diff = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  } else if (unit === 'hours') {
    diff = Math.floor((diffMs % 86400000) / 3600000);
  } else if (unit === 'days') {
    diff = Math.floor(diffMs / 86400000);
  }

  return diff;
}
