import React, { useEffect, useState } from 'react';
import Content from './components/Content';
import Hero from './components/Hero';
import getInitialState from './getInitialState';
import CacheService from '@utils/CacheService';

const cache = new CacheService();

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);

  // TODO Get user's location with https://freegeoip.app/ if not passed from Kentico

  // fetch('https://freegeoip.app/json/').then(response => {
  //   const data = response.json();
  //   console.log(data)
  // });

  const [zipCodes, setZipCodes] = useState(() => cache.get('zipCodes'));
  const [state, setState] = useState(() => getInitialState(cache));

  useEffect(() => {
    if (!cache.get('zipCodes')) {
      import(
        /* webpackChunkName: "zipcodes" */
        '@utils/zipcodes.json'
      ).then(data => {
        setZipCodes(data);
        cache.set('zipCodes', data);
      }).catch(() => setZipCodes({}));
    }

    // fetch('https://freegeoip.app/', { mode: 'no-cors' }).then(response => {
    //   console.log(response.body)
    // })
  }, []);

  return (
    <React.Fragment>
      <Hero
        state={state}
        controlsOpen={controlsOpen}
        controlsHeight={controlsHeight}
        zipCodes={zipCodes}
        setState={setState}
        setControlsOpen={setControlsOpen}
        setControlsHeight={setControlsHeight}
      />
      <Content
        controlsHeight={controlsHeight}
        controlsOpen={controlsOpen}
        loanType={state.loanType}
      />
    </React.Fragment>
  );
}