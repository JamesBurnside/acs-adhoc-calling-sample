// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterState,
  CallComposite,
  createAzureCommunicationCallAdapter,
  toFlatCommunicationIdentifier,
  CustomCallControlButtonCallback
} from '@azure/communication-react';
import { FontIcon, Panel, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallPageProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator?: GroupCallLocator | TeamsMeetingLinkLocator;
  teamsUserMRI?: string;
  displayName: string;
}

export const CallPage = (props: CallPageProps): JSX.Element => {
  const { token, userId, callLocator, teamsUserMRI, displayName } = props;
  const [adapter, setAdapter] = useState<CallAdapter>();
  const callIdRef = useRef<string>();
  const adapterRef = useRef<CallAdapter>();
  const [isMobileSession, setIsMobileSession] = useState(detectMobileSession());
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
        locator: callLocator as any,
        outboundTeamsUserMRI: teamsUserMRI
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
  }, [callLocator, displayName, token, userId, teamsUserMRI]);

  if (!adapter) {
    return (
      <Stack verticalFill verticalAlign='center'>
        <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />
      </Stack>
    );
  }

  const callDiagnosticButton: CustomCallControlButtonCallback = () => ({
    placement: 'afterEndCallButton',
    text: !isMobileSession ? 'Call Diagnostics' : undefined,
    onRenderIcon: () => <FontIcon style={{height: '20px', width: '20px'}} iconName="UnknownCall" />,
    onClick: () => {
      setIsPanelOpen(true);
    }
  });

  return (
    <>
      <CallComposite
        adapter={adapter}
        callInvitationUrl={window.location.href}
        formFactor={isMobileSession ? 'mobile' : 'desktop'}
        options={{
          callControls: {
            onFetchCustomButtonProps:[callDiagnosticButton]
          }
        }}
      />
      <Panel
        isLightDismiss
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        closeButtonAriaLabel="Close"
        headerText="Call Diagnostics"
      >
        <p>Call details goes here...</p>
      </Panel>
    </>
  );
};
