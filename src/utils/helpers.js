import { isPlainObject, isFunction, isString, findKey, isEqual } from 'lodash';
import { cache } from '@app';
import { footprint } from '@config';
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
  num = Number(num).toLocaleString('en-US', {
    maximumFractionDigits: 2
  });

  return `$${num}`;
}

export function formatPercent(num1, num2) {
  return `${Math.round(((num1 / num2) * 100))}%`;
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

window.footprint = footprint;

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

  return !!(state && states.find(s => s.toLowerCase() === state.toLowerCase()));
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
  if (!keys) {
    return isEqual(a, b);
  }

  keys = [keys].flat();

  const getObj = obj => {
    const newObj = {};
    keys.forEach(key => newObj[key] = obj[key]);
    return newObj;
  };

  return isEqual(getObj(a), getObj(b));
}

export function call(thisOrMethod, methodOrArg, ...args) {
  if (isFunction(thisOrMethod)) {
    return thisOrMethod.apply(this, [methodOrArg, ...args]);
  }

  if (isFunction(methodOrArg)) {
    return methodOrArg.apply(thisOrMethod, [...args]);
  }
}