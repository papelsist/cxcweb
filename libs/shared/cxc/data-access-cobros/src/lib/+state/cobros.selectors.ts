import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  COBROS_FEATURE_KEY,
  State,
  CobrosPartialState,
  cobrosAdapter,
} from './cobros.reducer';

// Lookup the 'Cobros' feature state managed by NgRx
export const getCobrosState = createFeatureSelector<CobrosPartialState, State>(
  COBROS_FEATURE_KEY
);

const { selectAll, selectEntities } = cobrosAdapter.getSelectors();

export const getCobrosPeriodo = createSelector(
  getCobrosState,
  (state: State) => state.periodo
);

export const getCobrosSearchTerm = createSelector(
  getCobrosState,
  (state: State) => state.searchTerm
);

export const getCobrosDisponibles = createSelector(
  getCobrosState,
  (state: State) => state.disponibles
);
export const getCobrosPorTimbrar = createSelector(
  getCobrosState,
  (state: State) => state.porTimbrar
);

export const isPeriodoDisabled = createSelector(
  getCobrosDisponibles,
  getCobrosPorTimbrar,
  (disponibles, porTibrar) => disponibles || porTibrar
);

export const getCobrosLoaded = createSelector(
  getCobrosState,
  (state: State) => state.loaded
);
export const getCobrosLoading = createSelector(
  getCobrosState,
  (state: State) => state.loading
);

export const getCobrosError = createSelector(
  getCobrosState,
  (state: State) => state.error
);

export const getAllCobros = createSelector(getCobrosState, (state: State) =>
  selectAll(state)
);

export const getCobrosEntities = createSelector(
  getCobrosState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getCobrosState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getCobrosEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
