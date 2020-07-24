import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  BONIFICACIONES_FEATURE_KEY,
  State,
  BonificacionesPartialState,
  bonificacionesAdapter,
} from './bonificaciones.reducer';

// Lookup the 'Bonificaciones' feature state managed by NgRx
export const getBonificacionesState = createFeatureSelector<
  BonificacionesPartialState,
  State
>(BONIFICACIONES_FEATURE_KEY);

const { selectAll, selectEntities } = bonificacionesAdapter.getSelectors();

export const getBonificacionesPeriodo = createSelector(
  getBonificacionesState,
  (state: State) => state.periodo
);

export const getBonificacionesSearchTerm = createSelector(
  getBonificacionesState,
  (state: State) => state.searchTerm
);

export const getBonificacionesLoading = createSelector(
  getBonificacionesState,
  (state: State) => state.loading
);

export const getBonificacionesLoaded = createSelector(
  getBonificacionesState,
  (state: State) => state.loaded
);

export const getBonificacionesError = createSelector(
  getBonificacionesState,
  (state: State) => state.error
);

export const getAllBonificaciones = createSelector(
  getBonificacionesState,
  (state: State) => selectAll(state)
);

export const getBonificacionesEntities = createSelector(
  getBonificacionesState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getBonificacionesState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getBonificacionesEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
