import React, { useCallback, useMemo } from 'react';
import { Slider } from '@input';
import { formatPercent, formatCurrency } from '@helpers';
import { keys } from '@enums';

export default function Sliders({ data, filterState, setFilterState }) {
  const [min, max] = useMemo(() => {
    const defaultValues = {
      [keys.RATE]: null,
      [keys.CLOSING_COSTS]: null,
      [keys.PAYMENT]: null
    };

    const min = { ...defaultValues };
    const max = { ...defaultValues };

    if (!data?.length) {
      return [min, max];
    }

    // data.forEach(({ rate, apr, closingCosts, payment }, index) => {
    //   if (index === 0) {
    //     min.rate = rate;
    //     min.apr = apr;
    //     max.rate = rate;
    //     max.apr = apr;
    //   } else {
    //     min.rate = Math.min(min.rate, rate);
    //     min.apr = Math.min(min.apr, apr);
    //     max.rate = Math.max(max.rate, rate);
    //     max.apr = Math.max(max.rate, apr);
    //   }
    // });

    data.forEach((item, index) => {
      [keys.RATE, keys.CLOSING_COSTS, keys.PAYMENT].forEach(key => {
        if (index === 0) {
          min[key] = item[key];
          max[key] = item[key];
        } else {
          min[key] = Math.min(min[key], item[key]);
          max[key] = Math.max(max[key], item[key]);
        }
      });
    });

    return [min, max];
  }, [data]);

  const handleChange = useCallback(
    (value, name) => {
      const [min, max] = value;
      setFilterState({ [name]: { min, max } }, name);
    },
    [setFilterState]
  );

  return (
    <React.Fragment>
      <Slider
        label="Interest Rate"
        name={keys.RATE}
        value={getValue(
          [filterState[keys.RATE].min, filterState[keys.RATE].max],
          min[keys.RATE],
          max[keys.RATE]
        )}
        min={min[keys.RATE]}
        max={max[keys.RATE]}
        minDistance={0.025}
        step={0.001}
        inputWidth={65}
        transformValue={v => formatPercent(v, null, true)}
        onAfterChange={handleChange}
        isPercent
      />

      <Slider
        label="Closing Costs"
        name={keys.CLOSING_COSTS}
        value={getValue(
          [filterState[keys.CLOSING_COSTS].min, filterState[keys.CLOSING_COSTS].max],
          min[keys.CLOSING_COSTS],
          max[keys.CLOSING_COSTS]
        )}
        min={min[keys.CLOSING_COSTS]}
        max={max[keys.CLOSING_COSTS]}
        minDistance={70}
        transformValue={v => formatCurrency(v)}
        onAfterChange={handleChange}
        step={1}
        isCurrency
      />

      <Slider
        label="Monthly Payments"
        name={keys.PAYMENT}
        value={getValue(
          [filterState[keys.PAYMENT].min, filterState[keys.PAYMENT].max],
          min[keys.PAYMENT],
          max[keys.PAYMENT]
        )}
        min={min[keys.PAYMENT]}
        max={max[keys.PAYMENT]}
        minDistance={55}
        transformValue={v => formatCurrency(v)}
        onAfterChange={handleChange}
        step={1}
        isCurrency
      />
    </React.Fragment>
  );
}

function getValue(value, min, max) {
  return [Math.max(min, value[0] ?? min), Math.min(max, value[1] ?? max)];
}
