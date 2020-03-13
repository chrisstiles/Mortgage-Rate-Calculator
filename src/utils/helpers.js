import { isPlainObject, isFunction } from 'lodash';
import { cache } from '@app';
import { footprint } from '@config';

export function getState(state, value, name) {
  if (!isPlainObject(state) || (!value && !name)) {
    console.log('Here')
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

export function isInFootprint(zipCodeOrState) {
  if (!zipCodeOrState) {
    return false;
  }

  zipCodeOrState = String(zipCodeOrState);

  const states = footprint ?? ['CA'];
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