import React, { useState } from 'react';
import './fonts/fonts.scss';
import './styles/general.scss';
import Header from './components/Header';
import Content from './components/Content';

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(null);

  return (
    <React.Fragment>
      <Header
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