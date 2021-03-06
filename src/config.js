const {
  field,
  sort,
  keys,
  creditScoreRanges,
  propertyTypes,
  occupancyTypes
} = require('@enums');

module.exports = {
  /*-- Data --*/

  // Marketing phone number
  phoneNumber: '(877) 528-1514',

  // The app caches fetched rates in the user's browser
  // to make loading quicker. This value is the maximum
  // amount of time (in minutes) those cached rates are valid
  rateCacheExpiration: 30, // minutes

  // Whether or not to use sample data to prevent
  // continuously loading data from MORRIS API in
  useSampleData: false,
  sampleLoadingTime: 2000,

  /*-- API --*/

  endpoint:
    'https://morris.fremontbank.com/api/external/getretailloanproducts',

  // TODO: This is currently using a proxy
  // to get around CORS issue making requests
  // from outside fremontbank.com
  // endpoint:
  //   'https://cors-anywhere.herokuapp.com/https://morris.fremontbank.com/api/external/getretailloanproducts',

  // We fetch rates in two separate requests to speed up the calculator.
  // The initial request gets a fixed list of products, and
  // on the second request we send a list of plan numbers
  // to fetch. These are what is displayed when the user clicks
  // on the 'load more rates' button.
  additionalPlanNumbers: ['611', '610', '607'],

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
    // Displayed on the initial page load before any
    // rates have already been displayed
    initialLoad: 'Loading your customized rates...',

    // Text that replaces the effective date while loading
    effectiveDateLoadingText: 'Loading rates and products...',

    // Displayed if no rates were returned for the loan
    // assumptions the user has entered
    noData: `We couldn't find any products available for the loan details you entered. Try changing your loan assumptions.`,

    // Products have been loaded, but none meet
    // the user's current filter criteria
    noFilteredData: `No products found that meet your filter criteria. Try changing the rate and product filters.`
  },

  /*-- UI Options --*/

  // Colors associated with each different product type.
  // These are used in rate table and filters
  colors: {
    '10': { main: '#288dd4', text: '#1e689c' },
    '15': { main: '#116A7F', text: '#006076' },
    '20': { main: '#3e9c5b', text: '#2d8046' },
    '30': { main: '#E36F2B', text: '#99491A' },
    '5/1': { main: '#219D9F', text: '#007173' },
    '7/1': { main: '#F0B023', text: '#9F6F00' },
    '10/1': { main: '#2a529a', text: '#2a529a' },
    default: { main: '#a9a9a9', text: '#8c8c8c' }
  },

  // Hero can have a dark or light style
  darkHeroStyle: false,

  // Switches either purchase or refinance (whichever is default)
  // to display as the first tab on the left.
  displayDefaultTabFirst: true,

  // Bolds the text on the lowest rate and/or monthly payment
  highlightLowestRate: true,
  highlightLowestPayment: true,

  // Displays a stylized No Closing Costs icon in the rate table
  showNCCIcon: true,

  // Display badge icons for lowest rate and payment
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
