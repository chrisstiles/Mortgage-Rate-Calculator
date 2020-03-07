import { isPlainObject } from 'lodash';

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