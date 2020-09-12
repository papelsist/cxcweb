import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromClientes from './clientes.reducer';
import * as ClientesSelectors from './clientes.selectors';
import * as ClientesActions from './clientes.actions';
import { Cliente, ClienteCredito } from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';

@Injectable()
export class ClientesFacade {
  loaded$ = this.store.pipe(select(ClientesSelectors.getClientesLoaded));
  allClientes$ = this.store.pipe(select(ClientesSelectors.getAllClientes));
  currentCliente$ = this.store.pipe(select(ClientesSelectors.getSelected));

  constructor(private store: Store<fromClientes.ClientesPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  updateCliente(update: Update<Cliente>) {
    this.dispatch(ClientesActions.updateCliente({ update }));
  }

  updateClienteCredito(clienteId: string, credito: Update<ClienteCredito>) {
    this.dispatch(ClientesActions.updateClienteCredito({ clienteId, credito }));
  }
}
