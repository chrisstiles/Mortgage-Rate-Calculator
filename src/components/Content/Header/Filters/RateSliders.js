import React, { useMemo, useCallback } from 'react';
import { Slider } from '@input';
import { formatPercent } from '@helpers';

export default function RateSliders({ data, filterState, setFilterState }) {
  const [min, max] = useMemo(() => {
    const min = { rate: null, apr: null };
    const max = { rate: null, apr: null };

    if (!data?.length) {
      return [min, max];
    }

    data.forEach(({ rate, apr }, index) =>  {
      if (index === 0) {
        min.rate = rate;
        min.apr = apr;
        max.rate = rate;
        max.apr = apr;
      } else {
        min.rate = Math.min(min.rate, rate);
        min.apr = Math.min(min.apr, apr);
        max.rate = Math.max(max.rate, rate);
        max.apr = Math.max(max.rate, apr);
      }
    });

    return [min, max];
  }, [data]);

  console.log(filterState.rate.min)

  const handleChange = useCallback((value, name) => {
    const [min, max] = value;
    setFilterState({ [name]: { min, max } }, name);
  }, [setFilterState]);

  return (
    <React.Fragment>
      <Slider
        label="Interest Rate"
        name="rate"
        value={getValue([filterState.rate.min, filterState.rate.max], min.rate, max.rate)}
        min={min.rate}
        max={max.rate}
        minDistance={.030}
        step={.001}
        inputWidth={70}
        transformValue={v => formatPercent(v, null, true)}
        onAfterChange={handleChange}
        isPercent
      />

      <Slider
        label="Closing Costs"
        value={[min.rate, max.rate]}
        min={min.rate}
        max={max.rate}
        minDistance={1}
        step={1}
        isCurrency
      />

      <Slider
        label="Monthly Payments"
        value={[min.rate, max.rate]}
        min={min.rate}
        max={max.rate}
        minDistance={1}
        step={1}
        isCurrency
      />
    </React.Fragment>
  );
}

function getValue(value, min, max) {
  return [
    Math.max(min, value[0] ?? min),
    Math.min(max, value[1] ?? max)
  ];
}