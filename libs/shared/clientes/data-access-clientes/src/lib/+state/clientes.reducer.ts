import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ClientesActions from './clientes.actions';
import { Cliente } from '@nx-papelsa/shared/utils/core-models';

export const CLIENTES_FEATURE_KEY = 'clientes';

export interface State extends EntityState<Cliente> {
  selectedId?: string | number;
  loaded: boolean;
  loading: boolean;
  error?: string | null; // last none error (if any)
}

export interface ClientesPartialState {
  readonly [CLIENTES_FEATURE_KEY]: State;
}

export const clientesAdapter: EntityAdapter<Cliente> = createEntityAdapter<
  Cliente
>();

export const initialState: State = clientesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  loading: false,
});

const clientesReducer = createReducer(
  initialState,
  on(
    ClientesActions.loadClientes,
    ClientesActions.updateCliente,
    ClientesActions.updateClienteCredito,
    (state) => ({
      ...state,
      loaded: false,
      loading: true,
      error: null,
    })
  ),
  on(ClientesActions.loadClientesSuccess, (state, { clientes }) =>
    clientesAdapter.setAll(clientes, { ...state, loaded: true })
  ),
  on(
    ClientesActions.loadClientesFailure,
    ClientesActions.updateClienteFail,
    ClientesActions.updateClienteCreditoFail,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(ClientesActions.updateClienteSuccess, (state, { cliente }) =>
    clientesAdapter.upsertOne(cliente, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ClientesActions.updateClienteCreditoSuccess, (state, { credito }) => {
    const clienteExistente = state.entities[credito.cliente.id];
    const clienteUpdated = {
      ...clienteExistente,
      credito,
    };
    return clientesAdapter.upsertOne(clienteUpdated, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(ClientesActions.setCurrentCliente, (state, { cliente }) =>
    clientesAdapter.upsertOne(cliente, { ...state, selectedId: cliente.id })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return clientesReducer(state, action);
}
