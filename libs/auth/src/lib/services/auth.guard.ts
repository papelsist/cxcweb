import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import * as fromFeature from '../+state/auth.reducer';
import { isLoggedIn } from '../+state/auth.selectors';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromFeature.AuthPartialState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedIn),
      tap((loggedIn) => console.log('Is currently logged In: ', loggedIn)),
      map((loggedIn) => {
        if (!loggedIn) {
          // this.store.dispatch(new fromRoot.Go({ path: ['/login'] }));
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
