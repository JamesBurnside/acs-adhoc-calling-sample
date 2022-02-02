// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterState,
  CallComposite,
  createAzureCommunicationCallAdapter,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';
import { FontIcon, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallPageProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  displayName: string;
}

export const CallPage = (props: CallPageProps): JSX.Element => {
  const { token, userId, callLocator, displayName } = props;
  const [adapter, setAdapter] = useState<CallAdapter>();
  const callIdRef = useRef<string>();
  const adapterRef = useRef<CallAdapter>();
  const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());

  // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
  useEffect(() => {
    const updateIsMobile = (): void => setIsMobileSession(detectMobileSession());
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, [setIsMobileSession]);

  useEffect(() => {
    (async () => {
      const adapter = await createAzureCommunicationCallAdapter({
        userId,
        displayName,
        credential: createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
        locator: callLocator
      });
      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.onStateChange((state: CallAdapterState) => {
        callIdRef.current = state?.call?.id;
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [callLocator, displayName, token, userId]);

  if (!adapter) {
    return (
      <Stack verticalFill verticalAlign='center'>
        <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />
      </Stack>
    );
  }

  return (
    <CallComposite
      adapter={adapter}
      callInvitationUrl={window.location.href}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
      options={{
        callControls: {
          onFetchCustomButtonProps:[
            () => ({
              placement: 'afterEndCallButton',
              text: !isMobileSession ? 'Call Diagnostics' : undefined,
              onRenderIcon: DownloadCallLogsIcon,
              onClick: () => {
                alert('button clicked!');
              }
            })
          ]
        }
      }}
    />
  );
};

const DownloadCallLogsIcon = (): JSX.Element | null => {
  return (
    <FontIcon style={{height: '20px', width: '20px'}} iconName="UnknownCall" />
  )
};
