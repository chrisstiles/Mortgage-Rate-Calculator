import React, { useMemo } from 'react';
import { Slider } from '@input';
import styles from './filters.module.scss';

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

  console.log(min.rate, max.rate)

  return (
    <div className={styles.column}>
      <Slider
        label="Interest Rate"
        value={[min.rate, max.rate]}
        min={min.rate}
        max={max.rate}
        minDistance={.001}
        step={.001}
      />
    </div>
  );
}