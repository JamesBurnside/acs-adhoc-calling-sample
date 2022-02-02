import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';

const postRefreshTokenParameters = {
  method: 'POST'
};

/**
 * Create credentials that auto-refresh asynchronously.
 */
export const createAutoRefreshingCredential = (userId: string, token: string): AzureCommunicationTokenCredential => {
  const options: CommunicationTokenRefreshOptions = {
    token: token,
    tokenRefresher: refreshTokenAsync(userId),
    refreshProactively: true
  };
  return new AzureCommunicationTokenCredential(options);
};

const refreshTokenAsync = (userIdentity: string): ((abortSignal?: any) => Promise<string>) => {
  return async (): Promise<string> => {
    const response = await fetch(`/refreshToken/${userIdentity}`, postRefreshTokenParameters);
    if (response.ok) {
      return (await response.json()).token;
    } else {
      throw new Error('could not refresh token');
    }
  };
};
