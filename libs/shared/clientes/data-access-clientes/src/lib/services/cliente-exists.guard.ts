import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../+state/clientes.reducer';
import * as fromActions from '../+state/clientes.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ClientesService } from './clientes.service';

@Injectable()
export class ClienteExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.ClientesPartialState>,
    private service: ClientesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.clienteId;
    return this.hasCobroInApi(id);
  }

  hasCobroInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map((cliente) => fromActions.setCurrentCliente({ cliente })),
      tap((action) => this.store.dispatch(action)),
      map((action) => !!action.cliente),
      catchError(() => {
        console.error('Cant find Cliente in AIP Guard');
        return of(false);
      })
    );
  }
}
