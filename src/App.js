import React, { useEffect, useState, useCallback } from 'react';
import Content from './components/Content';
import Hero from './components/Hero';
import getInitialState from './getInitialState';
import CacheService from '@utils/CacheService';
import { defaults } from '@config';
import { getState } from '@helpers';

const cache = new CacheService();
const initialState = getInitialState(cache);

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);
  const [zipCodes, setZipCodes] = useState(() => cache.get('zipCodes'));
  const [state, _setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const setState = useCallback((value, name) => {
    _setState(state => getState(state, value, name));
  }, []);

  useEffect(() => {
    if (!cache.get('zipCodes')) {
      const getZipCodes = async () => {
        try {
          const data = await import(
            /* webpackChunkName: "zipcodes" */
            '@utils/zipcodes.json'
          );
          
          setZipCodes(data);
          cache.set('zipCodes', data);
        } catch {
          setZipCodes({});
        }
      };

      getZipCodes();
    }
  }, []);

  useEffect(() => {
    if (!initialState.userSetLocation) {
      const getUserLocation = async () => {
        try {
          const response = await fetch('https://freegeoip.app/json/');
          const { zip_code: zipCode } = response.json();

          if (zipCode) {
            const zipCodes = cache.get('zipCodes', {});
            const [city, state] = zipCodes[zipCode] ?? [];
            
            if (defaults.footprint?.includes(state)) {
              setState({ zipCode, city });
            }
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false);
        }
      };

      getUserLocation();
    }
  }, [setState]);

  return (
    <React.Fragment>
      <Hero
        state={state}
        isLoading={isLoading}
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