import React from 'react';
import { Select } from '@input';
import { keys, propertyTypes } from '@enums';

const options = Object.values(propertyTypes);

function PropertyType(props) {
  return (
    <Select
      label="Property Type"
      placeholder="Property Type"
      name={keys.PROPERTY_TYPE}
      maxWidth={190}
      options={options}
      {...props}
    />
  );
}

function validate(value) {
  if (!value) {
    return 'Please select a property type';
  }

  if (!options.find(o => value === o.value)) {
    return 'Invalid property type';
  }
}

export default { Component: PropertyType, validate };