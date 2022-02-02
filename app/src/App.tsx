import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { initializeIcons } from '@fluentui/react';

initializeIcons();

type AppState = 'Landing' | 'FuturePage';

type CallDetails = {
  displayName: string;
  teamsUserMRI: string
}

function App() {
  const [callDetails, setCallDetails] = useState<CallDetails | undefined>();

  const appState: AppState = !callDetails ? 'Landing' : 'FuturePage';

  switch(appState) {
    case 'Landing': return <LandingPage onStartCall={(callDetails) => {setCallDetails(callDetails)}} />;
    case 'FuturePage': return <>Future Page...</>;
  }
}

export default App;
