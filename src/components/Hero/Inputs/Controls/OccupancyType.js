import React from 'react';
import { Select } from '@input';
import { keys, occupancyTypes } from '@enums';

const options = Object.values(occupancyTypes);

function OccupancyType(props) {
  return (
    <Select
      label="Property Type"
      placeholder="Property Type"
      name={keys.OCCUPANCY_TYPE}
      maxWidth={190}
      options={options}
      {...props}
    />
  );
}

function validate(value) {
  if (!value) {
    return 'Please select an occupancy type';
  }

  if (!options.find(o => value === o.value)) {
    return 'Invalid occupancy type';
  }
}

export default { Component: OccupancyType, validate };