import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react';
import Content from './components/Content';
import Hero from './components/Hero';
import getInitialState from '@utils/getInitialState';
import { keys } from '@enums';
import CacheService from '@utils/CacheService';
import API from '@utils/API';
import { getState, isInFootprint } from '@helpers';

const cache = new CacheService();
const api = new API();
const initialState = getInitialState();

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);
  const [zipCodes, setZipCodes] = useState(() =>
    cache.get(keys.ZIP_CODES)
  );
  const [data, setData] = useState(null);
  const [state, _setState] = useState(initialState);
  const [hasInitialLocation, setHasInitialLocation] = useState(() => {
    return !!(
      initialState.userSetLocation ||
      cache.getSession(keys.CURRENT_LOCATION)
    );
  });

  const [effectiveDate, setEffectiveDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setState = useCallback((value, name) => {
    _setState(state => {
      const newState = getState(state, value, name);

      if (state.zipCode !== newState.zipCode) {
        newState.userSetLocation = true;
      }

      api.fetchRates(newState);
      cache.set(keys.LOAN_STATE, newState);
      return newState;
    });
  }, []);

  // Loads zip codes if they aren't cached in local storage
  const zipCodeInitComplete = useRef(!!zipCodes);
  useEffect(() => {
    if (!zipCodeInitComplete.current) {
      zipCodeInitComplete.current = true;

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
    }
  }, []);

  // Get the user's location if not cached in session storage
  const locationInitComplete = useRef(hasInitialLocation && zipCodes);
  useEffect(() => {
    if (zipCodes && !locationInitComplete.current) {
      locationInitComplete.current = true;

      if (
        !initialState.userSetLocation &&
        !cache.getSession(keys.CURRENT_LOCATION)
      ) {
        const getUserLocation = async () => {
          try {
            const response = await fetch(
              'https://freegeoip.app/json/'
            );
            const { zip_code: zipCode } = await response.json();

            if (zipCode) {
              const zipCodes = cache.get(keys.ZIP_CODES, {});
              const [city] = zipCodes[zipCode] ?? [];

              if (isInFootprint(zipCode)) {
                const currentLocation = {
                  zipCode,
                  city
                };
                setState(currentLocation);

                // Only store current location in session. This allows us
                // to prevent refetching location on reload or page navigation
                // but will still find their location next time they visit
                cache.setSession(
                  keys.CURRENT_LOCATION,
                  currentLocation
                );
              }
            }
          } catch (error) {
            console.error(error);
          } finally {
            setHasInitialLocation(true);
          }
        };

        getUserLocation();
      }
    }
  }, [setState, zipCodes]);

  // Manage whether additional rates are displayed
  const [showMoreClicked, _setShowMoreClicked] = useState({
    purchase: false,
    refinance: false
  });

  const { loanType } = state;
  const setShowMoreClicked = useCallback(
    value => {
      _setShowMoreClicked(state => {
        return { ...state, [loanType]: value };
      });
    },
    [loanType]
  );

  // Add state callbacks to API instance
  useEffect(() => {
    api.setCallbacks({
      setData,
      setIsLoading,
      setEffectiveDate,
      setShowMoreClicked: _setShowMoreClicked
    });
  }, [setData, setIsLoading, setEffectiveDate, _setShowMoreClicked]);

  // Fetch initially displayed rates
  const rateInitComplete = useRef(false);
  useEffect(() => {
    if (zipCodes && hasInitialLocation && !rateInitComplete.current) {
      rateInitComplete.current = true;
      api.fetchRates(state);
    }
  }, [zipCodes, hasInitialLocation, state]);

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
        data={data}
        isLoading={isLoading}
        controlsHeight={controlsHeight}
        effectiveDate={effectiveDate}
        loanType={loanType}
        showMoreClicked={showMoreClicked}
        setShowMoreClicked={setShowMoreClicked}
        setControlsOpen={setControlsOpen}
      />
    </div>
  );
}

export { cache, api };
