const {
  field,
  sort,
  keys,
  creditScoreRanges,
  propertyTypes,
  occupancyTypes
} = require('@enums');

module.exports = {
  /*-- Form Fields --*/

  // Configure which fields to include in the
  // assumptions input box. Fields not included will use
  // default assumptions defined in MORRIS. Use formFields
  // enum to ensure field is added correctly
  formFields: [
    field.LOAN_AMOUNT,
    field.HOME_VALUE,
    field.ZIP_CODE,
    field.CREDIT_SCORE,
    field.PROPERTY_TYPE,
    field.OCCUPANCY_TYPE
  ],

  /*-- Values --*/

  // Default values for loan assumptions
  defaults: {
    [keys.CITY]: 'Fremont',
    [keys.CREDIT_SCORE]: creditScoreRanges.EXCELLENT.value,
    [keys.HOME_VALUE]: 500000,
    [keys.LOAN_AMOUNT]: 400000,
    [keys.LOAN_TYPE]: 'purchase',
    [keys.OCCUPANCY_TYPE]: occupancyTypes.OWNER_OCCUPIED.value,
    [keys.PROPERTY_TYPE]: propertyTypes.SFR.value,
    [keys.STATE]: 'CA',
    [keys.ZIP_CODE]: '94538'
  },

  /*-- URL Parameters --*/

  // URL parameters to change loan assumptions based based on
  // the values passed. For example, on a Jumbo loans page you
  // could use the loanSize parameter when linking here to
  // ensure the loan amount is considered jumbo.
  // These values override both the default values and
  // any cached state in the user's browser
  urlParams: {
    [keys.LOAN_TYPE]: ['purchase', 'refinance'],
    [keys.LOAN_SIZE]: {
      jumbo: 750000,
      highBalance: 600000
    }
  },

  /*-- Rate/Lending Options --*/

  // Fremont Bank's lending footprint. An error will be shown
  // if the user enters a zip code not in one of these states.
  // States should be formatted as 2 letter abbreviation (i.e. CA).
  footprint: ['CA'],

  // Max and minimum number of decimals on the rate and APR. For example:
  // minDecimals: 2 => 3.25%, minDecimals: 3 => 3.250%
  // maxDecimals: 3 => 3.325%, maxDecimals: 2 => 3.33%
  minDecimals: 3,
  maxDecimals: 3,

  // Maximum and minimum loan amounts
  minLoanAmount: 0,
  maxLoanAmount: 5000000,

  /*-- Rate Table Messages --*/

  messages: {
    // Displayed if no rates were returned for the loan
    // assumptions the user has entered
    noData: `We couldn't find any products available for the loan details you entered. Try changing your loan assumptions.`,

    // Displayed if no products met the user's filter criteria
    noFilteredData: `No products found that meet your filter criteria. Try changing the rate and product filters.`
  },

  /*-- UI Options --*/

  // Colors associated with each different product type.
  // These are used in rate table and filters
  colors: {
    '10': { main: '#288dd4', text: '#1e689c' },
    '20': { main: '#3e9c5b', text: '#2d8046' },
    '15': { main: '#116A7F', text: '#006076' },
    '30': { main: '#E36F2B', text: '#99491A' },
    '5/1': { main: '#219D9F', text: '#007173' },
    '7/1': { main: '#F0B023', text: '#9F6F00' },
    '10/1': { main: '#2a529a', text: '#2a529a' },
    default: { main: '#a9a9a9', text: '#8c8c8c' }
  },

  // Switches either purchase or refinance (whichever is default)
  // to display as the first tab on the left.
  displayDefaultTabFirst: true,

  // Bolds the text on the lowest rate and/or monthly payment
  highlightLowestRate: true,
  highlightLowestPayment: true,

  // Display badge icons for lowest rate, payment and on NCC
  showBadges: true,

  // The column and direction the rate table should be sorted by
  sortBy: sort.by.PRODUCT,
  sortOrder: sort.order.DESC,

  // Show pulse animation to help indicate that the
  // assumptions box is clickable
  displayPulse: true,
  pulseCount: 4,

  // Prevent the pulse from animating on subsequent visits
  hidePulseAfterFirstVisit: false,

  // Window width that triggers mobile UI
  // This can be changed from styles/variables.scss
  mobileSize: parseInt(require('@styles/variables.scss').mobileSize)
};
