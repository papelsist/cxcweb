import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store, Action } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { Authenticate } from './auth.entities';

@Injectable()
export class AuthFacade {
  loading$ = this.store.pipe(select(AuthSelectors.getAuthLoading));
  user$ = this.store.pipe(select(AuthSelectors.getUser));
  isLoggedIn$ = this.store.pipe(select(AuthSelectors.isLoggedIn));
  error$ = this.store.pipe(select(AuthSelectors.getAuthError));
  displayName$ = this.store.pipe(select(AuthSelectors.getDisplayName));

  constructor(
    private store: Store<fromAuth.AuthPartialState>,
    private router: Router
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  login(username: string, password: string) {
    const authenticate: Authenticate = { username, password };
    this.dispatch(AuthActions.login({ authenticate }));
  }

  fetchUserInfo() {
    this.dispatch(AuthActions.fetchUserInfo());
  }

  logout() {
    this.dispatch(AuthActions.logout());
  }
}
