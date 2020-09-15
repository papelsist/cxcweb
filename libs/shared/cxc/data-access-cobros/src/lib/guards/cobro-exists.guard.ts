import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../+state/cobros.reducer';
import * as fromActions from '../+state/cobros.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { CobroService } from '../services/cobro.service';

@Injectable()
export class CobroExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.CobrosPartialState>,
    private service: CobroService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.id;
    return this.hasCobroInApi(id);
  }

  hasCobroInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map((cobro) => fromActions.upsertCobro({ cobro })),
      tap((action) => this.store.dispatch(action)),
      tap((action) =>
        this.store.dispatch(
          fromActions.setCurrentCobroId({ id: action.cobro.id })
        )
      ),
      map((action) => !!action.cobro),
      catchError(() => {
        console.error('Not in AIP Guard error');
        return of(false);
      })
    );
  }
}
