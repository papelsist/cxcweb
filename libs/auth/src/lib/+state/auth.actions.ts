import { createAction, props } from '@ngrx/store';
import { Authenticate, AuthSession, SessionInfo } from './auth.entities';
import { User } from '@nx-papelsa/shared/utils/core-models';

export const login = createAction(
  '[Login Page] Login ',
  props<{ authenticate: Authenticate }>()
);

export const loginFail = createAction(
  '[Login Effects] Login fail',
  props<{ error: any }>()
);

export const loginSuccess = createAction(
  '[Login Effects] Login success',
  props<{ session: AuthSession }>()
);

export const loginRedirect = createAction('[Router Effects] Login redirect');

export const fetchUserInfo = createAction('[Auth effects] Fetch user info');
export const fetchUserInfoFail = createAction(
  '[Auth effects] Fetch usert info fail',
  props<{ error: any }>()
);
export const fetchUserInfoSuccess = createAction(
  '[Auth effects] Fetch user info success',
  props<{ sessionInfo: SessionInfo }>()
);
