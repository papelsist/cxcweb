import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../+state/devoluciones.reducer';
import * as fromActions from '../+state/devoluciones.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { DevolucionesService } from '@nx-papelsa/shared/cxc/data-acces';

@Injectable()
export class DevolucionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.DevolucionesPartialState>,
    private service: DevolucionesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.id;
    return this.hasNotaInApi(id);
  }

  hasNotaInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map((devolucion) => fromActions.upsertDevolucion({ devolucion })),
      tap((action) => this.store.dispatch(action)),
      tap((action) =>
        this.store.dispatch(
          fromActions.setCurrentDevolucionId({ id: action.devolucion.id })
        )
      ),
      map((action) => !!action.devolucion),
      catchError(() => {
        console.error('Not in AIP Guard error');
        return of(false);
      })
    );
  }
}
