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
  on(ClientesActions.loadClientes, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ClientesActions.loadClientesSuccess, (state, { clientes }) =>
    clientesAdapter.setAll(clientes, { ...state, loaded: true })
  ),
  on(ClientesActions.loadClientesFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return clientesReducer(state, action);
}
