import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../+state/bonificaciones.reducer';
import * as fromActions from '../+state/bonificaciones.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { BonificacionesService } from '../services/bonificaciones.service';

@Injectable()
export class BonificacionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.BonificacionesPartialState>,
    private service: BonificacionesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.id;
    return this.hasNotaInApi(id);
  }

  hasNotaInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map((bonificacion) => fromActions.upsertBonificacion({ bonificacion })),
      tap((action) => this.store.dispatch(action)),
      tap((action) =>
        this.store.dispatch(
          fromActions.setCurrentBonificacionId({ id: action.bonificacion.id })
        )
      ),
      map((action) => !!action.bonificacion),
      catchError(() => {
        console.error('Not in AIP Guard error');
        return of(false);
      })
    );
  }
}
