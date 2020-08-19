import { User } from '@nx-papelsa/shared/utils/core-models';

export interface Authenticate {
  username: string;
  password: string;
}

export interface AuthSession {
  username: string;
  access_token: string;
  refresh_token: string;
  roles: string[];
  token_type: string;
  expires_in: number;
  start: Date;
}

export interface SessionInfo {
  appInfo: AppInfo;
  user: Partial<User>;
}

export interface AppInfo {
  name: string;
  version: string;
  grailsVersion: string;
  environment: string;
  dataSourceUrl: string;
}

export const SESSION_KEY = 'papelsa-siipapx';

export function readSessionFromStore(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return JSON.parse(raw);
}

export function saveSessionInStore(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function removeSessionFromStore() {
  localStorage.removeItem(SESSION_KEY);
}
