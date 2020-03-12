// The list of all possible keys used in 
// both editable fields and URL parameters
export const keys = Object.freeze({
  CURRENT_LOCATION: 'currentLocation',
  CITY: 'city',
  HAS_VISITED: 'hasVisited',
  HOME_VALUE: 'homeValue',
  LOAN_SIZE: 'loanSize',
  LOAN_STATE: 'loanState',
  LOAN_TYPE: 'loanType',
  LOAN_AMOUNT: 'loanAmount',
  SORT_STATE: 'sortState',
  STATE: 'state',
  USER_SET_LOCATION: 'userSetLocation',
  ZIP_CODE: 'zipCode',
  ZIP_CODES: 'zipCodes'
});

// The list of all possible fields to include in
// the loan assumptions box for the user to edit.
export const field = Object.freeze({
  LOAN_TYPE: keys.LOAN_TYPE,
  LOAN_AMOUNT: keys.LOAN_AMOUNT,
  ZIP_CODE: keys.ZIP_CODE,
  HOME_VALUE: keys.HOME_VALUE
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