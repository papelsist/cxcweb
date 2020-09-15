import { createReducer, on, Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthSession, readSessionFromStore, AppInfo } from './auth.entities';

import { User } from '@nx-papelsa/shared/utils/core-models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  user: Partial<User>;
  appInfo?: AppInfo;
  session: AuthSession;
  loading: boolean;
  error?: any;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

const initialState: AuthState = {
  session: readSessionFromStore(),
  user: undefined,
  appInfo: undefined,
  loading: false,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, loading: true })),
  on(AuthActions.loginFail, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.loginSuccess, (state, { session }) => ({
    ...state,
    loading: false,
    session: { ...session, start: new Date() },
  })),
  on(AuthActions.fetchUserInfoSuccess, (state, { sessionInfo }) => ({
    ...state,
    appInfo: { ...sessionInfo.appInfo },
    user: { ...sessionInfo.user },
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    error: null,
    user: null,
    session: null,
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
