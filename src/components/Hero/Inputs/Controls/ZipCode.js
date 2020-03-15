import React from 'react';
import { Text } from '@input';
import { isInFootprint, getFootprint } from '@helpers';
import { cache } from '@app';
import { keys } from '@enums';

function ZipCode(props) {
  return (
    <Text
      label="Zip Code"
      placeholder="Zip Code"
      name={keys.ZIP_CODE}
      format="#####"
      hasError={props.hasError}
      maxWidth={87}
      {...props}
    />
  );
}

function validate(zipCode) {
  if (!zipCode?.match(/^\d{5}$/)) {
    return 'Please enter a valid zip code';
  }

  if (!isInFootprint(zipCode)) {
    const zipCodes = cache.get('zipCodes', {});
    const [city, state] = zipCodes[zipCode] ?? [];

    if (city && state) {
      const fp = getFootprint('long');

      if (fp.length > 1) {
        const i = fp.length - 1;
        fp[i] = `or ${fp[i]}`;
      }
      
      const footprintText = fp.join(', ').replace(', or', ' or');

      return `We don't currently lend in ${city}, ${state}. Try entering a zip code in ${footprintText}.`;
    }

    return 'Zip code not found';
  }
}

export default { Component: ZipCode, validate };