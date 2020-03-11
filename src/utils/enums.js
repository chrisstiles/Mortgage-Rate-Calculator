// The list of all possible fields to include in
// the loan assumptions box for the user to edit.
export const field = Object.freeze({
  LOAN_TYPE: 'loanType',
  LOAN_AMOUNT: 'loanAmount',
  ZIP_CODE: 'zipCode',
  HOME_VALUE: 'homeValue'
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