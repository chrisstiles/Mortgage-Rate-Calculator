import React, { useState } from 'react';
import './fonts/fonts.scss';
import './styles/general.scss';
import Header from './components/Header';
import Content from './components/Content';

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <React.Fragment>
      <Header setControlsOpen={setControlsOpen} />
      <Content controlsOpen={controlsOpen} />
    </React.Fragment>
  );
}