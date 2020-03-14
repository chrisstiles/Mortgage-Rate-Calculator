// The list of all possible keys used in 
// both editable fields and URL parameters
export const keys = Object.freeze({
  CURRENT_LOCATION: 'currentLocation',
  CITY: 'city',
  CREDIT_SCORE: 'creditScore',
  HAS_VISITED: 'hasVisited',
  HOME_VALUE: 'homeValue',
  LOAN_AMOUNT: 'loanAmount',
  LOAN_SIZE: 'loanSize',
  LOAN_STATE: 'loanState',
  LOAN_TYPE: 'loanType',
  PROPERTY_TYPE: 'propertyType',
  SORT_STATE: 'sortState',
  STATE: 'state',
  USER_SET_LOCATION: 'userSetLocation',
  ZIP_CODE: 'zipCode',
  ZIP_CODES: 'zipCodes'
});

// The list of all possible fields to include in
// the loan assumptions box for the user to edit.
export const field = Object.freeze({
  CREDIT_SCORE: keys.CREDIT_SCORE,
  HOME_VALUE: keys.HOME_VALUE,
  LOAN_TYPE: keys.LOAN_TYPE,
  LOAN_AMOUNT: keys.LOAN_AMOUNT,
  PROPERTY_TYPE: keys.PROPERTY_TYPE,
  ZIP_CODE: keys.ZIP_CODE
});

export const creditScoreRanges = Object.freeze({
  EXCELLENT: {
    value: 740,
    label: 'Excellent',
    info: '740+'
  },
  GOOD: {
    value: 739,
    label: 'Good',
    info: '700-739'
  },
  AVERAGE: {
    value: 699,
    label: 'Average',
    info: '660-699'
  },
  BELOW_AVERAGE: {
    value: 659,
    label: 'Below average',
    info: '659-'
  }
});

export const propertyTypes = Object.freeze({
  SFR: { value: 'sfr', label: 'Single family home'},
  PUD: { value: 'pud', label: 'Planned development' },
  CONDO: { value: 'condo', label: 'Condo' },
  MULTI_UNIT: { value: 'multiUnit', label: '2-4 Unit' },
  MANUFACTURED: { value: 'manufacturedHome', label: 'Manufactured home' }
});

// The columns and order user can
// sort the rate table by
export const sort = Object.freeze({
  by: {
    PRODUCT: ['type', 'term'],
    RATE: ['rate', 'apr'],
    CLOSING_COSTS: 'closingCosts',
    PAYMENT: 'payment'
  },
  order: {
    ASC: 'asc',
    DESC: 'desc'
  }
});