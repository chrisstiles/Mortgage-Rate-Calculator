import { cache } from '@app';
import { keys } from '@enums';
import { isBoolean, isPlainObject } from 'lodash';

function getMinMax() {
  return {
    defaultValue: {
      min: null,
      max: null
    },
    validate: value => {
      if (!value || !isPlainObject) {
        return false;
      }

      const { min, max } = value;

      return (min === null || !isNaN(min)) && (max === null || !isNaN(max));
    },
    transform: ({ min, max }) => {
      if (min !== null) {
        min = Math.max(0, parseFloat(min));
      }

      if (max !== null) {
        max = isNaN(min) ? null : Math.max(min + 1, parseFloat(max));
      }

      return { min, max };
    }
  };
}

const state = {
  fixed: {
    defaultValue: false,
    validate: isBoolean
  },
  adjustable: {
    defaultValue: true,
    validate: isBoolean
  },
  products: {
    defaultValue: [],
    validate: Array.isArray,
    transform: (products = []) => {
      if (!Array.isArray(products)) {
        products = [];
      }

      return products.map(String);
    }
  },
  rate: getMinMax(),
  apr: getMinMax(),
  closingCosts: getMinMax(),
  payment: getMinMax()
};

export default function getInitialFilterState() {
  const cachedFilters = cache.get(keys.FILTER_STATE, {});
  const formattedState = {};

  Object.keys(state).forEach(key => {
    const { defaultValue, validate, transform } = state[key];
    const cachedValue = cachedFilters[key];

    if (validate(cachedValue)) {
      formattedState[key] = transform ? transform(cachedValue) : cachedValue;
    } else {
      formattedState[key] = transform ? transform(defaultValue) : defaultValue;
    }
  });

  return formattedState;
}