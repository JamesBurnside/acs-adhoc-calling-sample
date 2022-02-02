import React, { useState } from 'react';
import { ChoiceGroup, IChoiceGroupOption, Image, mergeStyles, PrimaryButton, Stack, Text, TextField } from '@fluentui/react';
import heroSVG from '../assets/hero.svg';
import { DisplayNameField } from '../components/DisplayNameField';
import { Login } from '@microsoft/mgt-react';
import { useIsSignedIn } from '../hooks/useIsSignedIn';
import { PeoplePicker } from '@microsoft/mgt-react';

enum LocalStorageKeys {
  DisplayName = 'DisplayName',
  TeamsUserMRI = 'TeamsUserMRI'
};

const callDetailsEntryOptionsGroupLabel = 'Option to enter outbound call details';
const callDetailsEntryOptions: IChoiceGroupOption[] = [
  { key: 'GraphSearch', text: 'Graph Search', disabled: true },
  { key: 'Manual', text: 'Manual Entry' }
];

export interface LandingPageProps {
  onStartCall(callDetails: { displayName: string; teamsUserMRI: string }): void;
  disableButton?: boolean;
}

export const LandingPage = (props: LandingPageProps) => {
  const [displayName, setDisplayName] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.DisplayName)) ?? undefined);
  const [teamsUserMRI, setTeamsUserMRI] = useState<string | undefined>((window.localStorage && window.localStorage.getItem(LocalStorageKeys.TeamsUserMRI)) ?? undefined);
  const [callEntryChosenOption, setCallEntryChosenOption] = useState<IChoiceGroupOption>(callDetailsEntryOptions[1]);
  // const [isSignedIn, setIsSignedIn] = useState(false);
  const buttonDisabled = props.disableButton || !(callEntryChosenOption.key === 'Manual' && displayName && teamsUserMRI);

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
        <Heading />
        <RadioGroupChoice optionChosen={setCallEntryChosenOption} />
        {callEntryChosenOption.key === 'GraphSearch' && <GraphSearchEntry />}
        {callEntryChosenOption.key === 'Manual' && <ManualEntryOptions
          defaultName={displayName}
          defaultTeamsUserMRI={teamsUserMRI}
          setDisplayName={setDisplayName}
          setTeamsUserMRI={setTeamsUserMRI}
        />}
        <StartCallButton
          disabled={buttonDisabled}
          onStartCallClick={() => {
            if (displayName && teamsUserMRI) {
              (window.localStorage && window.localStorage.setItem(LocalStorageKeys.DisplayName, displayName));
              (window.localStorage && window.localStorage.setItem(LocalStorageKeys.TeamsUserMRI, teamsUserMRI));
              props.onStartCall({ displayName, teamsUserMRI });
            }
          }}
        />
      </Stack.Item>
    </Stack>
  );
}

const Heading = (): JSX.Element => (
  <Stack>
    <Text role={'heading'} aria-level={1} className={headerStyle}>ACS Teams Adhoc Sample</Text>
  </Stack>
)

const RadioGroupChoice = (props: {optionChosen: (option: IChoiceGroupOption ) => void}): JSX.Element => (
  <Stack>
    <ChoiceGroup
      styles={callOptionsGroupStyles}
      label={callDetailsEntryOptionsGroupLabel}
      defaultSelectedKey="Manual"
      options={callDetailsEntryOptions}
      required={true}
      onChange={(_, option) => option && props.optionChosen(option)}
    />
  </Stack>
);

const ManualEntryOptions = (props: {
  defaultName: string | undefined;
  defaultTeamsUserMRI: string | undefined;
  setDisplayName: (newDisplayName: string) => void;
  setTeamsUserMRI: (newTeamsUserMRI: string) => void;
}) => (
  <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
    <Stack.Item>
      <DisplayNameField defaultName={props.defaultName} setName={props.setDisplayName} />
    </Stack.Item>
    <Stack.Item>
      <TextField
        inputClassName={inputBoxTextStyle}
        label="Enter Teams User MRI"
        onChange={(_, newValue) => props.setTeamsUserMRI(newValue ?? '')}
        required
        styles={textFieldStyleProps}
        placeholder="8:orgid:"
        defaultValue={props.defaultTeamsUserMRI}
      />
    </Stack.Item>
    <Stack.Item>
    </Stack.Item>
  </Stack>
);

const GraphSearchEntry = () => {
  const isSignedIn = useIsSignedIn();

  return (
    <>
      {!isSignedIn && <Login />}
      {isSignedIn && <PeoplePicker />}
    </>
  );
};

const StartCallButton = (props: {
  disabled: boolean;
  onStartCallClick: () => void;
}) => (
  <Stack>
    <PrimaryButton
      disabled={props.disabled}
      className={buttonStyle}
      text={'Start Call'}
      onClick={props.onStartCallClick}
    />
  </Stack>
)

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
  childrenGap: '0.75rem'
};

const configContainerStyle = mergeStyles({
  minWidth: '10rem',
  width: 'auto',
  height: 'auto',
  marginTop: '1rem'
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
  marginTop: '1.5rem'
});

const callOptionsGroupStyles = {
  label: { padding: 0 }
};
