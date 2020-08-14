# Fremont Bank Mortgage Rate Calculator

This React application allows our clients to get customized rates based on their individual situation.

## Installation

To run the calculator locally run `npm install` to install the dependencies, then `npm start` to run the development version of the calculator.

## Building the production application

Run `npm run build` to build the production files. Webpack outputs single HTML, CSS and JavaScript files for the application. It also outputs a `zipcodes.js` file separate from the main bundle. This is a large file with all US zip codes and is used in validation, error messages and in displaying the user's initial location. This file is loaded asynchronously and then cached in the user's local storage.
