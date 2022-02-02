import React, { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { initializeIcons } from '@fluentui/react';
import { CallPage } from './pages/CallPage';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { NoticePage } from './pages/NoticePage';

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

type ErrorPageDetails = {
  message: string;
  error: string;
}

function App() {
  const [callDetails, setCallDetails] = useState<CallDetails | undefined>();
  const [userCredentials, setUserCredentials] = useState<UserCredentials>();
  const [error, setError] = useState<ErrorPageDetails | undefined>();

  // Get Azure Communications Service token from the server
  useEffect(() => {
    (async () => {
      try {
        const { token, user } = await fetchTokenResponse();
        setUserCredentials({ token, userId: user });
      } catch (e) {
        setError({
          message: 'Failed to get user credentials from server',
          error: (e as any).message as string
        })
      }
    })();
  }, []);

  const appState: AppState = !!error ? 'ErrorPage' : (!!callDetails && !!userCredentials) ? 'CallPage' : 'Landing';

  switch(appState) {
    case 'Landing': return <LandingPage onStartCall={(callDetails) => {setCallDetails(callDetails)}} />;
    case 'CallPage': return (
      <CallPage
        userId={userCredentials!.userId}
        token={userCredentials!.token}
        displayName={callDetails!.displayName}
        callLocator={{groupId: '13b75848-eeb0-4f6e-8e86-84107652be14' /** random guid for now */}}
        // callLocator={callDetails!.teamsUserMRI as any}
      />);
    case 'ErrorPage' : return <NoticePage title={error!.message} moreDetails={error!.error} iconName='AlertSolid' />
  }
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
