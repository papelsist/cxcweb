import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';

import * as fromStore from '../+state/cxc.reducer';
import { getCartera } from '../+state/cxc.selectors';
import { setCartera } from '../+state/cxc.actions';
import { Cartera } from '@nx-papelsa/shared/utils/core-models';

@Injectable()
export class CXCCarteraGuard implements CanActivate {
  constructor(private store: Store<fromStore.CXCState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const cartera: Cartera = route.data.cartera;
    return this.checkCartera(cartera).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkCartera(cartera: Cartera): Observable<Cartera> {
    return this.store.pipe(
      select(getCartera),
      tap((target) => {
        if (!target || target.clave !== cartera.clave) {
          this.store.dispatch(setCartera({ cartera }));
        }
      }),
      filter((res) => res.clave === cartera.clave),
      take(1)
    );
  }
}
