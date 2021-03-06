import {
  endpoint,
  useSampleData,
  sampleLoadingTime,
  rateCacheExpiration,
  additionalPlanNumbers
} from '@config';
import { keys, requestBody, field } from '@enums';
import { isPlainObject, round, uniqueId, shuffle } from 'lodash';
import {
  compareObjects,
  call,
  getLoanTerm,
  getTimeDifference,
  isAdjustableRate,
  isFixedRate,
  isPurchase,
  isRefinance,
  isValidDate
} from '@helpers';
import { cache } from '@app';
import sampleDataPurchase from './sample-data-purchase.json';
import sampleDataPurchaseAdditional from './sample-data-purchase-additional.json';
import sampleDataRefinance from './sample-data-refinance.json';
import sampleDataRefinanceAdditional from './sample-data-refinance-additional.json';

export default class API {
  #callbacks = {};
  #currentState = null;
  #currentType = null;
  // Data gets split into first and second fetches
  #currentData = {
    purchase: {
      first: null,
      second: null
    },
    refinance: {
      first: null,
      second: null
    }
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
    } else {
      this.removeCachedData(false);
    }
  }

  getCachedData(type) {
    const key = getCacheKey(type);
    const { effectiveDate, data } = cache.get(key, {});

    if (effectiveDate && data) {
      const date = new Date(effectiveDate);

      if (isValidDate(date) && !effectiveDateExpired(date)) {
        this.#currentData[type] = data;
        this.#effectiveDates[type] = date;
      } else {
        this.removeCachedData(false, type);
      }
    } else {
      this.removeCachedData(false, type);
    }
  }

  setCachedData() {
    const type = this.#currentType;
    const data = this.#currentData[type];
    const effectiveDate = this.#effectiveDates[type];

    if (data && effectiveDate) {
      const key = getCacheKey(type);
      cache.set(key, {
        effectiveDate: new Date(effectiveDate).toISOString(),
        data
      });
      cache.set(keys.CACHED_REQUEST_STATE, this.#currentState);
    }
  }

  removeCachedData(removeRequestState = true, type) {
    const data = { first: null, second: null };

    if (type) {
      this.#currentData[type] = { ...data };
      this.#effectiveDates[type] = null;
      cache.remove(getCacheKey(type));
    } else {
      this.#currentData.purchase = { ...data };
      this.#currentData.refinance = { ...data };
      this.#effectiveDates = { purchase: null, refinance: null };
      cache.remove(keys.CACHED_RATES_PURCHASE);
      cache.remove(keys.CACHED_RATES_REFINANCE);
    }

    if (removeRequestState) {
      cache.remove(keys.CACHED_REQUEST_STATE);
    }
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
      Object.values(field).filter(k => k !== keys.LOAN_TYPE)
    );

    if (
      !forceFetch &&
      !inputsChanged &&
      typeChanged &&
      this.#currentData[currentType] &&
      !effectiveDateExpired(this.#effectiveDates[currentType])
    ) {
      this.#currentType = currentType;
      this.setEffectiveDate();
      call(this.#callbacks.setData, this.#currentData[currentType]);
      call(this.#callbacks.setIsLoading, false);
      return;
    } else if (inputsChanged || currentType !== this.#currentType) {
      this.#currentType = currentType;

      if (inputsChanged || forceFetch) {
        this.removeCachedData();
      }

      this.makeRequest(state, currentType);
    }
  }

  async makeRequest(state, type) {
    const fetchId = uniqueId('fetch');
    this.#fetchIds[type] = fetchId;

    call(this.#callbacks.setIsLoading, true);
    call(this.#callbacks.setShowMoreClicked, {
      purchase: false,
      refinance: false
    });

    this.#currentState = state;

    if (useSampleData) {
      setTimeout(() => {
        this.finishFetching(
          shuffle(sampleData[type]).slice(0, 5),
          fetchId,
          type
        );

        // Fetch additional products
        setTimeout(() => {
          this.finishFetching(
            shuffle(sampleData[`${type}Additional`]).slice(0, 5),
            fetchId,
            type,
            true
          );
        }, sampleLoadingTime * 5);
      }, sampleLoadingTime);

      return;
    }

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        Accept: '*/*'
      }
    };

    try {
      init.body = formatRequestBody(state);
      const firstResponse = await fetch(endpoint, init);

      const handleInvalidResponse = () => {
        console.error('Invalid response', firstResponse);
        this.finishFetching(null, fetchId, type);
      };

      if (!firstResponse.ok) {
        handleInvalidResponse();
        return;
      }

      const firstData = await firstResponse.json();
      this.finishFetching(firstData, fetchId, type);

      // Start second request for additional products
      init.body = formatRequestBody(state, true);
      const secondResponse = await fetch(endpoint, init);

      if (!firstResponse.ok) {
        handleInvalidResponse();
        return;
      }

      const secondData = await secondResponse.json();
      this.finishFetching(secondData, fetchId, type, true);
    } catch (e) {
      console.error(e);
      this.finishFetching(null, fetchId, type);
      return;
    }
  }

  finishFetching(data = [], fetchId, type, isAdditionalData) {
    if (this.#fetchIds[type] !== fetchId) {
      return;
    }

    if (isAdditionalData) {
      this.#fetchIds[type] = null;
    }

    const fetchKey = isAdditionalData ? 'second' : 'first';

    if (this.#currentType === type) {
      const newData = { ...this.#currentData[type] };
      newData[fetchKey] = formatData(data);
      call(this.#callbacks.setData, newData);

      if (!isAdditionalData) {
        this.setEffectiveDate(data?.length ? new Date() : null);
        call(this.#callbacks.setIsLoading, false);
      }
    }

    if (data?.length) {
      this.#currentData[type][fetchKey] = data;
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

function formatRequestBody(state, isSecondRequest) {
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

  if (isSecondRequest) {
    request.PlanNumbers = additionalPlanNumbers;
  }

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
      p.term = getLoanTerm(p);
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
  purchaseAdditional: sampleDataPurchaseAdditional,
  refinance: sampleDataRefinance,
  refinanceAdditional: sampleDataRefinanceAdditional
};

function effectiveDateExpired(date) {
  if (!date) {
    return true;
  }

  const diff = getTimeDifference(date, new Date());
  return diff === null || diff > rateCacheExpiration;
}
