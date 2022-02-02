// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Icon, mergeStyles, Stack, Text, IStyle } from '@fluentui/react';

/**
 * @private
 */
export interface NoticePageProps {
  iconName: string;
  title: string;
  moreDetails?: string;
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePageProps): JSX.Element {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center">
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        {props.iconName && <Icon iconName={props.iconName} />}
        <Text className={mergeStyles(titleStyles)}>{props.title}</Text>
        <Text className={mergeStyles(moreDetailsStyles)}>{props.moreDetails}</Text>
      </Stack>
    </Stack>
  );
}

const containerStyle = {
  maxWidth: '22.5rem',
  // Ensure some space around the text on a narrow viewport.
  margin: '1rem'
};

const containerItemGap = {
  childrenGap: '0.5rem'
};

const titleStyles: IStyle = {
  fontSize: '1.25rem',
  fontWeight: 600
};

const moreDetailsStyles = {
  fontSize: '1rem'
};
