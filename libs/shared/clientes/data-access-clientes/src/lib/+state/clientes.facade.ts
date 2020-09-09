import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromClientes from './clientes.reducer';
import * as ClientesSelectors from './clientes.selectors';

@Injectable()
export class ClientesFacade {
  loaded$ = this.store.pipe(select(ClientesSelectors.getClientesLoaded));
  allClientes$ = this.store.pipe(select(ClientesSelectors.getAllClientes));
  selectedClientes$ = this.store.pipe(select(ClientesSelectors.getSelected));

  constructor(private store: Store<fromClientes.ClientesPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
