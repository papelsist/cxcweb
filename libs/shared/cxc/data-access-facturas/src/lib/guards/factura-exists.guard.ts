import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../+state/facturas.reducer';
import * as fromActions from '../+state/facturas.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { CxcService } from '@nx-papelsa/shared/cxc/data-acces';
import { FacturasEntity } from '../+state/facturas.models';

@Injectable()
export class FacturaExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.FacturasPartialState>,
    private service: CxcService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.id;
    return this.hasNotaInApi(id);
  }

  hasNotaInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map((factura: FacturasEntity) => fromActions.upsertFactura({ factura })),
      tap((action) => this.store.dispatch(action)),
      tap((action) =>
        this.store.dispatch(
          fromActions.setCurrentFacturaId({ id: action.factura.id })
        )
      ),
      map((action) => !!action.factura),
      catchError(() => {
        console.error(
          'La Factura (Cuenta por cobrar) no se localizo en el servidor'
        );
        return of(false);
      })
    );
  }
}
