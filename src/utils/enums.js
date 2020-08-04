// The list of all possible keys used in
// both editable fields and URL parameters
export const keys = Object.freeze({
  APR: 'apr',
  CASH_OUT_AMOUNT: 'cashOutAmount',
  CURRENT_LOCATION: 'currentLocation',
  CITY: 'city',
  CLOSING_COSTS: 'closingCosts',
  CREDIT_SCORE: 'creditScore',
  FILTER_STATE: 'filterState',
  HAS_VISITED: 'hasVisited',
  HOME_VALUE: 'homeValue',
  LOAN_AMOUNT: 'loanAmount',
  LOAN_SIZE: 'loanSize',
  LOAN_STATE: 'loanState',
  LOAN_TYPE: 'loanType',
  OCCUPANCY_TYPE: 'occupancyType',
  PAYMENT: 'payment',
  PROPERTY_TYPE: 'propertyType',
  RATE: 'rate',
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
  OCCUPANCY_TYPE: keys.OCCUPANCY_TYPE,
  PROPERTY_TYPE: keys.PROPERTY_TYPE,
  ZIP_CODE: keys.ZIP_CODE
});

export const requestBody = Object.freeze({
  LoanAmount: keys.LOAN_AMOUNT,
  PropertyValue: keys.HOME_VALUE,
  LoanPurpose: keys.LOAN_TYPE,
  PropertyType: keys.PROPERTY_TYPE,
  OccupancyType: keys.OCCUPANCY_TYPE,
  ZipCode: keys.ZIP_CODE,
  FicoScore: keys.CREDIT_SCORE,
  CashOutAmount: keys.CASH_OUT_AMOUNT
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
  SFR: {
    value: 'Single Family - 1 unit',
    label: 'Single family home'
  },
  PUD: {
    value: 'Planned Unit Development (PUD)',
    label: 'Planned development'
  },
  CONDO: { value: 'Condo', label: 'Condo' },
  MULTI_UNIT: { value: '2-4 Unit', label: '2-4 Unit' },
  MANUFACTURED: {
    value: 'Manufactured Home',
    label: 'Manufactured home'
  }
});

export const occupancyTypes = Object.freeze({
  OWNER_OCCUPIED: {
    value: 'Owner Occupied',
    label: 'Owner occupied'
  },
  SECOND_HOME: { value: 'Second Home', label: 'Second home' },
  INVESTMENT: { value: 'Investment Property', label: 'Investment' }
});

// The columns and order user can
// sort the rate table by
export const sort = Object.freeze({
  by: {
    PRODUCT: ['type', 'termValue'],
    RATE: ['rate', 'apr'],
    CLOSING_COSTS: 'closingCosts',
    PAYMENT: 'payment'
  },
  order: {
    ASC: 'asc',
    DESC: 'desc'
  }
});
