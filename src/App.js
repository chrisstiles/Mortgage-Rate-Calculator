import React, { useState } from 'react';
import './fonts/fonts.scss';
import './styles/general.scss';
import Header from './components/Header';
import Content from './components/Content';
import config from '@config';
import { getUrlParam } from '@helpers';

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);
  const [loanType, setLoanType] = useState(() => {
    const type = getUrlParam('loanType') ?? config.defaultLoanType;
    
    if (/^(purchase|refinance)$/i.test(type)) {
      return type.toLowerCase();
    }

    return 'purchase';
  });

  return (
    <React.Fragment>
      <Header
        loanType={loanType}
        controlsHeight={controlsHeight}
        setLoanType={setLoanType}
        setControlsOpen={setControlsOpen}
        setControlsHeight={setControlsHeight}
      />
      <Content
        controlsHeight={controlsHeight}
        controlsOpen={controlsOpen}
      />
    </React.Fragment>
  );
}