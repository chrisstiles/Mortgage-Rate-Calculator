import { endpoint } from '@config';
import { keys, requestBody } from '@enums';
import { isPlainObject } from 'lodash';
import {
  compareObjects,
  call,
  getLoanTerm,
  isAdjustableRate,
  isFixedRate
} from '@helpers';

export default class API {
  #isFetching = false;
  #callbacks = {};
  #prevState = null;
  #finishFetching;

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

  async fetchRates(state) {
    const stateKeys = Object.keys(state).filter(
      k => k !== keys.LOAN_TYPE
    );

    if (
      !this.#prevState ||
      !compareObjects(state, this.#prevState, stateKeys)
    ) {
      this.#isFetching = true;
      call(this.#callbacks.setIsLoading, true);

      const init = {
        method: 'POST'
      };

      try {
        init.body = formatRequestBody(state);
      } catch (e) {
        console.error(e);
        this.#isFetching = false;
        call(this.#callbacks.setData, []);
        call(this.#callbacks.setIsLoading, false);
        return;
      }

      const response = await fetch(endpoint, init);

      // Fetch rates here
      setTimeout(() => {
        call(this.#callbacks.setEffectiveDate, new Date());
        call(this.#callbacks.setIsLoading, false);
      }, 1000);
    }

    this.#isFetching = false;
    this.#prevState = state;
  }

  // #finishFetching(data) {

  // }
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

  return;
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
