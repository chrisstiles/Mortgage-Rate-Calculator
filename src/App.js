import React, { useEffect, useState, useCallback } from 'react';
import Content from './components/Content';
import Hero from './components/Hero';
import getInitialState from '@utils/getInitialState';
import { keys } from '@enums';
import CacheService from '@utils/CacheService';
import { getState, isInFootprint } from '@helpers';

const cache = new CacheService();
const initialState = getInitialState();

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);
  const [zipCodes, setZipCodes] = useState(() => cache.get(keys.ZIP_CODES));
  const [state, _setState] = useState(initialState);
  const [hasInitialLocation, setHasInitialLocation] = useState(() => {
    return !!(initialState.userSetLocation || cache.getSession(keys.CURRENT_LOCATION));
  });

  const [isLoading, setIsLoading] = useState(true);
  const setState = useCallback((value, name) => {
    _setState(state => {
      const newState = getState(state, value, name);

      if (state.zipCode !== newState.zipCode) {
        newState.userSetLocation = true;
      }

      cache.set(keys.LOAN_STATE, newState);
      return newState;
    });
  }, []);

  useEffect(() => {
    if (!cache.get(keys.ZIP_CODES)) {
      const getZipCodes = async () => {
        try {
          const data = await import(
            /* webpackChunkName: "zipcodes" */
            '@utils/zipcodes.json'
          );
          
          setZipCodes(data);
          cache.set(keys.ZIP_CODES, data);
        } catch {
          setZipCodes({});
        }
      };

      getZipCodes();
    }
  }, []);

  useEffect(() => {
    if (!initialState.userSetLocation && !cache.getSession(keys.CURRENT_LOCATION)) {
      const getUserLocation = async () => {
        try {
          const response = await fetch('https://freegeoip.app/json/');
          const { zip_code: zipCode } = await response.json();

          if (zipCode) {
            const zipCodes = cache.get(keys.ZIP_CODES, {});
            const [city] = zipCodes[zipCode] ?? [];
            
            if (isInFootprint(zipCode)) {
              const currentLocation = { zipCode, city };
              setState(currentLocation);

              // Only store current location in session. This allows us
              // to prevent refetching location on reload or page navigation
              // but will still find their location next time they visit
              cache.setSession(keys.CURRENT_LOCATION, currentLocation);
            }
          }
        } catch (error) {
          console.log(error)
        } finally {
          setHasInitialLocation(true);
        }
      };

      getUserLocation();
    }
  }, [setState]);

  // Loading placeholder
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className={controlsOpen ? 'controlsOpen' : 'controlsClosed'}>
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
        isLoading={isLoading}
        controlsHeight={controlsHeight}
        loanType={state.loanType}
      />
    </div>
  );
}

export { cache };