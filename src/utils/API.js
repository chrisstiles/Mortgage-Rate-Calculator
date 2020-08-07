import {
  endpoint,
  useSampleData,
  sampleLoadingTime,
  rateCacheExpiration
} from '@config';
import { keys, requestBody } from '@enums';
import { isPlainObject, round, uniqueId } from 'lodash';
import {
  compareObjects,
  call,
  getLoanTerm,
  getTimeDifference,
  isAdjustableRate,
  isFixedRate,
  isPurchase,
  isRefinance
} from '@helpers';
import { cache } from '@app';
import getInitialState from '@utils/getInitialState';
import sampleDataPurchase from './sample-data-purchase.json';
import sampleDataRefinance from './sample-data-refinance.json';

export default class API {
  #callbacks = {};
  #currentState = null;
  #currentType = null;
  #currentData = {
    purchase: null,
    refinance: null
  };
  #effectiveDates = {
    purchase: null,
    refinance: null
  };
  #fetchIds = {
    purchase: null,
    refinance: null
  };

  constructor() {
    this.#currentState = cache.get(keys.CACHED_REQUEST_STATE);

    if (this.#currentState) {
      this.getCachedData('purchase');
      this.getCachedData('refinance');
    }
  }

  getCachedData(type) {
    const key = getCacheKey(type);
    const { effectiveDate, data } = cache.get(key, {});

    if (effectiveDate && data) {
      const date = new Date(effectiveDate);
      const diff = getTimeDifference(date, new Date(), 'minutes');

      if (diff !== null && diff <= rateCacheExpiration) {
        this.#currentData[type] = data;
        this.#effectiveDates[type] = date;
      }
    }
  }

  setCachedData() {
    const type = this.#currentType;
    const data = this.#currentData[type];
    const effectiveDate = this.#effectiveDates[type];

    if (data && effectiveDate) {
      const key = getCacheKey(type);
      cache.set(key, { effectiveDate, data });
      cache.set(keys.CACHED_REQUEST_STATE, this.#currentState);
    }
  }

  removeCachedData() {
    cache.set(keys.CACHED_RATES_PURCHASE, null);
    cache.set(keys.CACHED_RATES_REFINANCE, null);
    cache.set(keys.CACHED_REQUEST_STATE, null);
  }

  isFetching() {
    return this.#fetchIds[this.#currentType] !== null;
  }

  setCallbacks(callbacks) {
    if (!isPlainObject(callbacks)) {
      console.error('Callbacks must be passed in an object');
      return;
    }

    this.#callbacks = callbacks;
  }

  async fetchRates(state = {}, forceFetch) {
    if (
      !state ||
      (!isPurchase(state[keys.LOAN_TYPE]) &&
        !isRefinance(state[keys.LOAN_TYPE]))
    ) {
      return;
    }

    const currentType = state[keys.LOAN_TYPE].toLowerCase();
    const typeChanged = currentType !== this.#currentType;
    const inputsChanged = !compareObjects(
      state,
      this.#currentState,
      Object.keys(state).filter(k => k !== keys.LOAN_TYPE)
    );

    if (
      !forceFetch &&
      !inputsChanged &&
      typeChanged &&
      this.#currentData[currentType]
    ) {
      this.#currentType = currentType;
      this.setEffectiveDate();
      call(this.#callbacks.setData, this.#currentData[currentType]);
      call(this.#callbacks.setIsLoading, false);
      return;
    } else if (inputsChanged || currentType !== this.#currentType) {
      this.#currentType = currentType;

      if (inputsChanged || forceFetch) {
        this.#currentData.purchase = null;
        this.#currentData.refinance = null;
        this.removeCachedData();
      }

      this.makeRequest(state, currentType);
    }
  }

  async makeRequest(state, type) {
    const fetchId = uniqueId('fetch');
    this.#fetchIds[type] = fetchId;

    call(this.#callbacks.setIsLoading, true);
    this.#currentState = state;

    if (useSampleData) {
      setTimeout(() => {
        this.finishFetching(sampleData[type], fetchId, type);
      }, sampleLoadingTime);

      return;
    }

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        Accept: '*/*',
        // TODO: Remove this header once CORS issue is resolved
        origin: 'morris.fremontbank.com'
      }
    };

    try {
      init.body = formatRequestBody(state);
      const response = await fetch(endpoint, init);

      if (!response.ok) {
        console.error('Invalid response', response);
        this.finishFetching(null, fetchId, type);
        return;
      }

      const json = await response.json();
      this.finishFetching(json, fetchId, type);
    } catch (e) {
      console.error(e);
      this.finishFetching(null, fetchId, type);
      return;
    }
  }

  finishFetching(data = [], fetchId, type) {
    if (this.#fetchIds[type] !== fetchId) {
      return;
    }

    this.#fetchIds[type] = null;

    if (this.#currentType === type) {
      this.setEffectiveDate(data?.length ? new Date() : null);
      call(this.#callbacks.setData, formatData(data));
      call(this.#callbacks.setIsLoading, false);
    }

    if (data?.length) {
      this.#currentData[type] = data;
      this.setCachedData();
    }
  }

  setEffectiveDate(date) {
    if (date === undefined) {
      date = this.#effectiveDates[this.#currentType] ?? new Date();
    }

    this.#effectiveDates[this.#currentType] = date;
    call(this.#callbacks.setEffectiveDate, date);
  }
}

function formatRequestBody(state) {
  if (!isPlainObject(state)) {
    return JSON.stringify({});
  }

  const request = {};

  Object.keys(requestBody).forEach(requestKey => {
    const stateKey = requestBody[requestKey];

    if (state.hasOwnProperty(stateKey)) {
      const value = String(state[stateKey]);

      if (value) {
        request[requestKey] = value;
      }
    }
  });

  return JSON.stringify(request);
}

function formatData(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(p => {
      // Converts term value to be formatted based on product
      // IE: fixed: 30, adjustable: 5/1
      p.term = getLoanTerm(p.months, p.type);
      p.isAdjustable = isAdjustableRate(p.type);
      p.isFixed = isFixedRate(p.type);
      p.payment = round(p.payment, 2);
      p.closingCosts = round(p.closingCosts, 2);

      if (
        !p.term ||
        isNaN(p.payment) ||
        isNaN(p.closingCosts) ||
        (!p.isAdjustable && !p.isFixed)
      ) {
        return null;
      }

      // We store a numeric value for the term for sorting
      p.termValue = parseInt(p.term.split('/')[0]);
      p.type = p.type.toLowerCase();
      p.payment = round(p.payment, 2);

      return p;
    })
    .filter(p => p);
}

function getCacheKey(type) {
  return isPurchase(type)
    ? keys.CACHED_RATES_PURCHASE
    : keys.CACHED_RATES_REFINANCE;
}

const sampleData = {
  purchase: sampleDataPurchase,
  refinance: sampleDataRefinance
};
