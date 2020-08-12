import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { createEffect, Actions, ofType } from '@ngrx/effects';

import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';

import * as fromAuth from '../+state/auth.reducer';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { saveSessionInStore } from '../+state/auth.entities';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      fetch({
        run: ({ authenticate }) => {
          return this.service
            .login(authenticate)
            .pipe(map((session) => AuthActions.loginSuccess({ session })));
        },
        onError: (action, error) => {
          console.error('Error login in ', error);
          return AuthActions.loginFail({ error });
        },
      })
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ session }) => {
          saveSessionInStore(session);
        }),
        tap(() => {
          const redirect = this.route.snapshot.queryParams['redirect'];
          console.log('Redirect: ', redirect);
          const path = redirect || '/';
          this.router.navigate([path]);
        }),
        map(() => AuthActions.fetchUserInfo())
      ),
    { dispatch: true }
  );

  fetchUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.fetchUserInfo),
      fetch({
        run: () => {
          return this.service
            .fetchSession()
            .pipe(
              map((sessionInfo) =>
                AuthActions.fetchUserInfoSuccess({ sessionInfo })
              )
            );
        },
        onError: (action, error) => {
          console.error('Error login in ', error);
          return AuthActions.fetchUserInfoFail({ error });
        },
      })
    )
  );

  constructor(
    private actions$: Actions,
    private service: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
}
