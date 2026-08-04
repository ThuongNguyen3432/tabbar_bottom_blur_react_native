import { logger } from '../logger';

const log = logger('notifications');

export type PushToken = string;

export interface NotificationClient {
  requestPermission(): Promise<boolean>;
  getToken(): Promise<PushToken | null>;
  onMessage(handler: (payload: Record<string, unknown>) => void): () => void;
}

/**
 * No push provider is wired up. The interface is here so features can be built
 * against it, and so choosing a provider later touches this file rather than
 * every call site.
 */
export const notifications: NotificationClient = {
  async requestPermission() {
    log.debug('requestPermission — no provider configured');
    return false;
  },
  async getToken() {
    return null;
  },
  onMessage() {
    return () => {};
  },
};
