import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromClientes from './clientes.reducer';
import * as ClientesSelectors from './clientes.selectors';
import * as ClientesActions from './clientes.actions';
import {
  Cliente,
  ClienteComentario,
  ClienteCredito,
  MedioDeContacto,
} from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';
import { identity } from 'lodash';

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

  updateMedioDeContacto(clienteId: string, medio: Update<MedioDeContacto>) {
    this.dispatch(ClientesActions.updateMedioDeContacto({ clienteId, medio }));
  }

  addMedioDeContacto(clienteId: string, medio: Partial<MedioDeContacto>) {
    this.dispatch(ClientesActions.addMedioDeContacto({ clienteId, medio }));
  }
  deleteMedioDeContacto(clienteId: string, medio: MedioDeContacto) {
    this.dispatch(ClientesActions.deleteMedioDeContacto({ clienteId, medio }));
  }

  altaDeLineaDeCredito(cliente: Cliente) {
    if (!cliente.credito) {
      this.dispatch(
        ClientesActions.createClienteCredito({ clienteId: cliente.id })
      );
    }
  }

  addComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.dispatch(
      ClientesActions.addClienteComentario({
        clienteId: cliente.id,
        comentario: { ...comentario, fecha: new Date().toISOString() },
      })
    );
  }

  deleteComentario(cliente: Cliente, comentario: ClienteComentario) {
    this.dispatch(
      ClientesActions.deleteClienteComentario({
        clienteId: cliente.id,
        comentario,
      })
    );
  }

  updateComentario(cliente: Cliente, comentario: ClienteComentario) {
    console.log('Update: ', comentario);
    const update: Update<ClienteComentario> = {
      id: comentario.id,
      changes: { ...comentario },
    };
    this.dispatch(
      ClientesActions.updateClienteComentario({
        clienteId: cliente.id,
        comentario: update,
      })
    );
  }
}
