import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { initializeIcons } from '@fluentui/react';

initializeIcons();

type AppState = 'Landing' | 'FuturePage';

function App() {
  const [displayName, setDisplayName] = useState<string | undefined>();

  const appState: AppState = !displayName ? 'Landing' : 'FuturePage';

  switch(appState) {
    case 'Landing': return <LandingPage onStartCall={() => {}} />;
    case 'FuturePage': return <>Future Page...</>;
  }
}

export default App;
