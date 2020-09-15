import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CLIENTES_FEATURE_KEY,
  State,
  ClientesPartialState,
  clientesAdapter,
} from './clientes.reducer';

// Lookup the 'Clientes' feature state managed by NgRx
export const getClientesState = createFeatureSelector<
  ClientesPartialState,
  State
>(CLIENTES_FEATURE_KEY);

const { selectAll, selectEntities } = clientesAdapter.getSelectors();

export const getClientesLoaded = createSelector(
  getClientesState,
  (state: State) => state.loaded
);

export const getClientesError = createSelector(
  getClientesState,
  (state: State) => state.error
);

export const getAllClientes = createSelector(getClientesState, (state: State) =>
  selectAll(state)
);

export const getClientesEntities = createSelector(
  getClientesState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getClientesState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getClientesEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
