import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DEVOLUCIONES_FEATURE_KEY,
  State,
  DevolucionesPartialState,
  devolucionesAdapter,
} from './devoluciones.reducer';

// Lookup the 'Devoluciones' feature state managed by NgRx
export const getDevolucionesState = createFeatureSelector<
  DevolucionesPartialState,
  State
>(DEVOLUCIONES_FEATURE_KEY);

const { selectAll, selectEntities } = devolucionesAdapter.getSelectors();

export const getDevolucionesPeriodo = createSelector(
  getDevolucionesState,
  (state: State) => state.periodo
);

export const getDevolucionesSearchTerm = createSelector(
  getDevolucionesState,
  (state: State) => state.searchTerm
);

export const getDevolucionesLoaded = createSelector(
  getDevolucionesState,
  (state: State) => state.loaded
);
export const getDevolucionesLoading = createSelector(
  getDevolucionesState,
  (state: State) => state.loading
);

export const getDevolucionesError = createSelector(
  getDevolucionesState,
  (state: State) => state.error
);

export const getAllDevoluciones = createSelector(
  getDevolucionesState,
  (state: State) => selectAll(state)
);

export const getDevolucionesEntities = createSelector(
  getDevolucionesState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getDevolucionesState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getDevolucionesEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
