// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'];

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};
