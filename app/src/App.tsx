import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { initializeIcons } from '@fluentui/react';
import { CallPage } from './pages/CallPage';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { FloatingErrorBar } from './components/FloatingErrorBar';

import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

Providers.globalProvider = new Msal2Provider({
  clientId: 'REPLACE_WITH_CLIENTID',
  scopes: ['user.read', 'people.read']
});

initializeIcons();

type AppState = 'Landing' | 'CallPage' | 'ErrorPage';

type CallDetails = {
  displayName: string;
  teamsUserMRI: string
}

type UserCredentials = {
  token: string;
  userId: CommunicationUserIdentifier
}

type ErrorDetails = {
  message: string;
  error: string;
}

function App() {
  const [callDetails, setCallDetails] = useState<CallDetails | undefined>();
  const [userCredentials, setUserCredentials] = useState<UserCredentials>();
  const [error, setError] = useState<ErrorDetails | undefined>();
  const [fetchingCredentials, setFetchingCredentials] = useState(false);

  const fetchUserCredentials = async () => {
    try {
        setFetchingCredentials(true);
        const { token, user } = await fetchTokenResponse();
        setUserCredentials({ token, userId: user });
      } catch (e) {
        setError({
          message: 'Failed to get user credentials from server',
          error: (e as any).message as string
        })
      }
      setFetchingCredentials(false);
  }

  const appState: AppState = (!!callDetails && !!userCredentials) ? 'CallPage' : 'Landing';

  const pageContent = () => {
    switch(appState) {
      case 'Landing': return (
        <LandingPage
          disableButton={fetchingCredentials}
          onStartCall={(callDetails) => {
            fetchUserCredentials();
            setCallDetails(callDetails)
          }}
        />);
      case 'CallPage': return (
        <CallPage
          userId={userCredentials!.userId}
          token={userCredentials!.token}
          displayName={callDetails!.displayName}
          callLocator={{groupId: '13b75848-eeb0-4f6e-8e86-84107652be14' /** random guid for now */}}
          teamsUserMRI={callDetails!.teamsUserMRI}
        />);
      default: <>Page unknown</>;
    }
  }

  return (
    <>
      {error && <FloatingErrorBar shortMessage={error.message} moreDetails={error.error} onDismiss={() => setError(undefined)} />}
      {pageContent()}
    </>
  );
}

export default App;

const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch('/token');
  if (response.ok) {
    const responseAsJson = await response.json();
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw new Error('Invalid token response');
};
