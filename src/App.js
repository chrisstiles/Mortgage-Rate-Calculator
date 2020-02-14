import React, { useState, useEffect } from 'react';
import './fonts/fonts.scss';
import './styles/general.scss';
import Header from './components/Header';
import Content from './components/Content';
import config from '@config';
import { getUrlParam } from '@helpers';

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

  const [zipCodes, setZipCodes] = useState(getCachedZipCodes());

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
  }, []);

  return (
    <React.Fragment>
      <Header
        loanType={loanType}
        controlsHeight={controlsHeight}
        setLoanType={setLoanType}
        setControlsOpen={setControlsOpen}
        setControlsHeight={setControlsHeight}
      />
      <Content
        controlsHeight={controlsHeight}
        controlsOpen={controlsOpen}
      />
    </React.Fragment>
  );
}

function getCachedZipCodes() {
  try {
    return JSON.parse(window.localStorage.getItem('zipCodes'));
  } catch {
    return null;
  }
}

function setCachedZipCodes(data) {
  try {
    window.localStorage.setItem('zipCodes', JSON.stringify(data));
  } catch {}
}