import React, { useEffect, useState } from 'react';
import Content from './components/Content';
import Hero from './components/Hero';
import config from '@config';
import { getUrlParam } from '@helpers';
import getInitialState from './getInitialState';

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);
  const [loanType, setLoanType] = useState(() => {
    const type = getUrlParam('loanType') ?? config.defaultLoanType;
    
    if (/^(purchase|refinance)$/i.test(type)) {
      return type.toLowerCase();
    }

    return 'purchase';
  });

  // TODO Get user's location with https://freegeoip.app/ if not passed from Kentico

  // fetch('https://freegeoip.app/json/').then(response => {
  //   const data = response.json();
  //   console.log(data)
  // });

  const [zipCodes, setZipCodes] = useState(getCachedZipCodes());
  const [state, setState] = useState(getInitialState(zipCodes));

  useEffect(() => {
    if (!window.localStorage.getItem('zipCodes')) {
      import(
        /* webpackChunkName: "zipcodes" */
        '@utils/zipcodes.json'
      ).then(data => {
        setZipCodes(data);
        setCachedZipCodes(data);
      });
    }

    // fetch('https://freegeoip.app/', { mode: 'no-cors' }).then(response => {
    //   console.log(response.body)
    // })
  }, []);

  return (
    <React.Fragment>
      <Hero
        loanType={loanType}
        controlsOpen={controlsOpen}
        controlsHeight={controlsHeight}
        setLoanType={setLoanType}
        setControlsOpen={setControlsOpen}
        setControlsHeight={setControlsHeight}
      />
      <Content
        controlsHeight={controlsHeight}
        controlsOpen={controlsOpen}
        loanType={loanType}
      />
    </React.Fragment>
  );
}

function getCachedZipCodes() {
  try {
    return JSON.parse(window.localStorage.getItem('zipCodes'));
  } catch {
    return {};
  }
}

function setCachedZipCodes(data) {
  try {
    window.localStorage.setItem('zipCodes', JSON.stringify(data));
  } catch {}
}