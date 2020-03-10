import './fonts/fonts.scss';
import './styles/general.scss';
import '@utils/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import 'focus-visible';
import App from './App';

ReactDOM.render(<App />, document.getElementById('mortgage-rates-wrapper'));