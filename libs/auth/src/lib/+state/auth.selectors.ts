import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, AuthState, AuthPartialState } from './auth.reducer';

import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

const helper = new JwtHelperService();

export const getAuhState = createFeatureSelector<AuthPartialState, AuthState>(
  AUTH_FEATURE_KEY
);

export const getSession = createSelector(getAuhState, (state) => state.session);
export const getToken = createSelector(getSession, (session) =>
  session ? session.access_token : null
);
export const getRoles = createSelector(getSession, (session) => session.roles);
export const getDisplayName = createSelector(getToken, (token) => {
  return token ? helper.decodeToken(token)['displayName'] : null;
});
export const getAuthLoading = createSelector(
  getAuhState,
  (state) => state.loading
);
export const getAuthError = createSelector(getAuhState, (state) => state.error);
export const getUser = createSelector(getAuhState, (state) => state.user);

export const getAppInfo = createSelector(getAuhState, (state) => state.appInfo);

export const getTokenExpirationDate = createSelector(getSession, (session) => {
  if (session) {
    return helper.getTokenExpirationDate(session.access_token);
  } else {
    return undefined;
  }
});

export const isLoggedIn = createSelector(getSession, (session) => {
  if (session) {
    return !helper.isTokenExpired(session.access_token);
  } else {
    return false;
  }
});

export const getSessionExpiration = createSelector(
  getTokenExpirationDate,
  (date) => moment().to(date, true)
);
