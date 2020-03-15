import React from 'react';
import { Text } from '@input';
import { isInFootprint } from '@helpers';
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
      return `We don't currently lend in ${city}, ${state}`;
    }

    return 'Zip code not found';
  }
}

export default { Component: ZipCode, validate };