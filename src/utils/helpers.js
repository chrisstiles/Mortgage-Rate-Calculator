import { isPlainObject } from 'lodash';
import { cache } from '@app';
import { footprint } from '@config';

export function getState(state, value, name) {
  if (!isPlainObject(state) || (!value && !name)) {
    return state;
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

export function isInFootprint(zipCode) {
  if (!zipCode) {
    return false;
  }

  const states = footprint ?? ['CA'];
  const zipCodes = cache.get('zipCodes', {});
  const state = (zipCodes[zipCode] ?? [])[1];

  console.log(state, states, zipCode)

  return !!(state && states.find(s => s.toLowerCase() === state.toLowerCase()));
}