import React, { useEffect, useState, useCallback } from 'react';
import Content from './components/Content';
import Hero from './components/Hero';
import getInitialState from './getInitialState';
import CacheService from '@utils/CacheService';
import { footprint } from '@config';
import { getState } from '@helpers';

const cache = new CacheService();
const initialState = getInitialState();

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
      console.log('Getting zip codes')
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

  const [hasInitialLocation, setHasInitialLocation] = useState(() => {
    return !!(initialState.userSetLocation || cache.getSession('currentLocation'));
  });

  useEffect(() => {
    if (!initialState.userSetLocation && !cache.getSession('currentLocation')) {
      const getUserLocation = async () => {
        try {
          const response = await fetch('https://freegeoip.app/json/');
          const { zip_code: zipCode } = await response.json();

          if (zipCode) {
            const zipCodes = cache.get('zipCodes', {});
            const [city, state] = zipCodes[zipCode] ?? [];
            
            if (footprint?.includes(state)) {
              const currentLocation = { zipCode, city };
              setState(currentLocation);

              // Only store current location in session. This allows us
              // to prevent refetching location on reload or page navigation
              // but will still find their location next time they visit
              cache.setSession('currentLocation', currentLocation);
            }
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false);
          setHasInitialLocation(true);
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
        hasInitialLocation={hasInitialLocation}
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

export { cache };