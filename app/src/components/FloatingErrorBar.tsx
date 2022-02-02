import { MessageBar, MessageBarType } from '@fluentui/react';

export interface FloatingErrorBarProps {
  shortMessage: string;
  moreDetails: string;
  onDismiss: () => void;
}

export const FloatingErrorBar = (props: FloatingErrorBarProps) => (
  <MessageBar
    messageBarType={MessageBarType.error}
    isMultiline={true}
    onDismiss={props.onDismiss}
    dismissButtonAriaLabel="Close"
    styles={{
      root: {
        position: 'fixed',
        top: '0'
      }
    }}
  >
    {props.shortMessage}<br />
    {props.moreDetails}
  </MessageBar>
);