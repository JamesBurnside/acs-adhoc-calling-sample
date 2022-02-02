import { mergeStyles, TextField } from '@fluentui/react';
import React, { useState } from 'react';

interface DisplayNameFieldProps {
  setName(displayName: string): void;
  setEmptyWarning?(isEmpty: boolean): void;
  isEmpty?: boolean;
  defaultName?: string;
}

const DISPLAY_NAME_MAX_CHARS = 256;
const TEXTFIELD_LABEL = 'Display name';
const TEXTFIELD_ID = 'displayName';
const TEXTFIELD_PLACEHOLDER = 'Enter a name';
const TEXTFIELD_EMPTY_ERROR_MSG = 'Name cannot be empty';
const TEXTFIELD_EXCEEDS_MAX_CHARS = `Name cannot exceed ${DISPLAY_NAME_MAX_CHARS} characters`;

const hasValidLength = (name: string): boolean => {
  return name.length <= DISPLAY_NAME_MAX_CHARS;
};

export const DisplayNameField = (props: DisplayNameFieldProps): JSX.Element => {
  const { setName, setEmptyWarning, isEmpty, defaultName } = props;
  const [isInvalidLength, setIsInvalidLength] = useState<boolean>(!hasValidLength(defaultName ?? ''));

  const onNameTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue === undefined) {
      return;
    }

    if (!hasValidLength(newValue)) {
      setIsInvalidLength(true);
      // The button below DisplayNameField is being disabled if name is empty.
      // To ensure that the Join Call button is disabled when the name is too long, we have to clear it from the state.
      setName('');
      return;
    } else {
      setIsInvalidLength(false);
    }

    setName(newValue);
    if (setEmptyWarning && !newValue) {
      setEmptyWarning(true);
    } else {
      setEmptyWarning && setEmptyWarning(false);
    }
  };

  return (
    <TextField
      autoComplete="off"
      defaultValue={defaultName}
      inputClassName={inputBoxTextStyle}
      label={TEXTFIELD_LABEL}
      required={true}
      className={inputBoxStyle}
      onChange={onNameTextChange}
      id={TEXTFIELD_ID}
      placeholder={TEXTFIELD_PLACEHOLDER}
      styles={TextFieldStyleProps}
      errorMessage={isEmpty ? TEXTFIELD_EMPTY_ERROR_MSG : isInvalidLength ? TEXTFIELD_EXCEEDS_MAX_CHARS : undefined}
    />
  );
};

const TextFieldStyleProps = {
  fieldGroup: {
    height: '2.3rem'
  }
};

const inputBoxStyle = mergeStyles({
  boxSizing: 'border-box',
  borderRadius: '0.125rem'
});

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
