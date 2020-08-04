import { endpoint, useSampleData, sampleLoadingTime } from '@config';
import { keys, requestBody } from '@enums';
import { isPlainObject } from 'lodash';
import {
  compareObjects,
  call,
  getLoanTerm,
  isAdjustableRate,
  isFixedRate,
  isPurchase,
  isRefinance
} from '@helpers';
import sampleData from './sample-data.json';

export default class API {
  #isFetching = false;
  #callbacks = {};
  #currentState = null;
  #currentType = null;
  #currentData = {
    purchase: null,
    refinance: null
  };

  isFetching() {
    return this.#isFetching;
  }

  setCallbacks(callbacks) {
    if (!isPlainObject(callbacks)) {
      console.error('Callbacks must be passed in an object');
      return;
    }

    this.#callbacks = callbacks;
  }

  async fetchRates(state = {}) {
    if (
      !state ||
      (!isPurchase(state[keys.LOAN_TYPE]) &&
        !isRefinance(state[keys.LOAN_TYPE]))
    ) {
      return;
    }

    // const currentType = state[keys.LOAN_TYPE].toLowerCase();

    const stateKeys = Object.keys(state).filter(
      k => k !== keys.LOAN_TYPE
    );

    if (
      !this.#currentState ||
      !compareObjects(state, this.#currentState, stateKeys)
    ) {
      this.#isFetching = true;
      call(this.#callbacks.setIsLoading, true);
      this.#currentState = state;

      if (useSampleData) {
        setTimeout(() => {
          this.finishFetching(sampleData);
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
          this.finishFetching();
          return;
        }

        const json = await response.json();

        this.finishFetching(json);
      } catch (e) {
        console.error(e);
        this.finishFetching();
        return;
      }
    }
  }

  finishFetching(data = []) {
    this.#isFetching = false;
    call(this.#callbacks.setData, formatData(data));
    call(
      this.#callbacks.setEffectiveDate,
      data?.length ? new Date() : null
    );
    call(this.#callbacks.setIsLoading, false);
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

      if (!p.term || (!p.isAdjustable && !p.isFixed)) {
        return null;
      }

      // We store a numeric value for the term for sorting
      p.termValue = parseInt(p.term.split('/')[0]);
      p.type = p.type.toLowerCase();

      return p;
    })
    .filter(p => p);
}
