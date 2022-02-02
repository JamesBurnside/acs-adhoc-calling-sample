import React, { useState } from 'react';
import { Image, mergeStyles, PrimaryButton, Stack, Text, TextField } from '@fluentui/react';
import heroSVG from '../assets/hero.svg';
import { DisplayNameField } from '../components/DisplayNameField';

enum LocalStorageKeys {
  DisplayName = 'DisplayName',
  TeamsUserMRI = 'TeamsUserMRI'
};

export interface LandingPageProps {
  onStartCall(callDetails: { displayName: string; teamsUserMRI: string }): void;
  disableButton?: boolean;
}

export const LandingPage = (props: LandingPageProps) => {
  const [displayName, setDisplayName] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.DisplayName)) ?? undefined);
  const [teamsUserMRI, setTeamsUserMRI] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.TeamsUserMRI)) ?? undefined);
  const buttonDisabled = props.disableButton || !(displayName && teamsUserMRI);

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
    >
      <Stack.Item className={imgContainerStyle}>
        <Image alt="logo" src={heroSVG.toString()} />
      </Stack.Item>
      <Stack.Item>
        <Stack>
          <Text role={'heading'} aria-level={1} className={headerStyle}>ACS Teams Adhoc Sample</Text>
        </Stack>
        <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
          <Stack.Item>
            <DisplayNameField defaultName={displayName} setName={setDisplayName} />
          </Stack.Item>
          <Stack.Item>
            <TextField
              inputClassName={inputBoxTextStyle}
              label="Enter Teams User MRI"
              onChange={(_, newValue) => setTeamsUserMRI(newValue)}
              required
              styles={textFieldStyleProps}
              placeholder="8:orgid:"
              defaultValue={teamsUserMRI ?? undefined}
            />
          </Stack.Item>
          <Stack.Item>
            <PrimaryButton
              disabled={buttonDisabled}
              className={buttonStyle}
              text={'Start Call'}
              onClick={() => {
                if (displayName && teamsUserMRI) {
                  (window.localStorage && window.localStorage.setItem(LocalStorageKeys.DisplayName, displayName));
                  (window.localStorage && window.localStorage.setItem(LocalStorageKeys.TeamsUserMRI, teamsUserMRI));
                  props.onStartCall({ displayName, teamsUserMRI });
                }
              }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}

const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  marginBottom: '1.5rem'
});

const imgContainerStyle = mergeStyles({
  width: '16.5rem',
  padding: '0.5rem',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  },

  marginRight: '4rem', //space between image and right-hand-side info
  marginLeft: '-6rem' //quick hack back into the center
});

const configContainerStackTokens = {
  childrenGap: '1.25rem'
};

const configContainerStyle = mergeStyles({
  minWidth: '10rem',
  width: 'auto',
  height: 'auto'
});

const textFieldStyleProps = {
  fieldGroup: {
    height: '2.3rem'
  }
};

const inputBoxTextStyle = mergeStyles({
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.5rem',
  '::-webkit-input-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  '::-moz-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  ':-moz-placeholder': {
    fontSize: '0.875rem',
    fontWeight: 600
  }
});

const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem',
  width: '100%',
  height: '2.5rem',
  borderRadius: 3,
  padding: '0.625rem',
  marginTop: '1rem'
});