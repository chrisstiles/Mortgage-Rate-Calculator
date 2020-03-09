module.exports = {
  /*-- Values --*/

  // Default values for loan assumptions
  defaults: {
    "loanType": "purchase",
    "loanAmount": 400000,
    "zipCode": "94538",
    "city": "Fremont",
    "state": "CA"
  },

  /*-- URL Parameters --*/

  // URL parameters to change loan assumptions based based on
  // the values passed. For example, on a Jumbo loans page you
  // could use the loanSize parameter when linking here to 
  // ensure the loan amount is considered jumbo.
  // These values override both the default values and
  // any cached state in the user's browser
  "urlParams": {
    "loanType": ["purchase", "refinance"],
    "loanSize": {
      "jumbo": 750000,
      "highBalance": 600000
    }
  },

  /*-- Rate/Lending Options --*/

  // Fremont Bank's lending footprint. An error will be shown
  // if the user enters a zip code not in one of these states.
  // States should be formatted as 2 letter abbreviation (i.e. CA).
  "footprint": ["CA"],

  // Max and minimum number of decimals on the rate and APR. For example:
  // maxDecimals: 3  =>  3.325%
  // maxDecimals: 2  =>  3.33%
  // minDecimals: 2 => 3.25%
  // minDecimals: 3 => 3.250%
  "maxDecimals": 3,
  "minDecimals": 2,

  /*-- UI Options --*/

  // Switches either purchase or refinance (whichever is default)
  // to display as the first tab on the left.
  "displayDefaultTabFirst": true,

  // Bolds the text on the lowest rate and/or monthly payment
  "highlightLowestRate": true,
  "highlightLowestPayment": true,

  // Display badge icons for lowest rate, payment and on NCC
  "showBadges": true,

  // Show pulse animation to help indicate that the
  // assumptions box is clickable
  "displayPulse": true,
  "pulseCount": 4,

  // Prevent the pulse from animating on subsequent visits
  "hidePulseAfterFirstVisit": false
};