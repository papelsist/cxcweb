import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  REVISIONES_FEATURE_KEY,
  State,
  RevisionesPartialState,
  revisionesAdapter,
} from './revisiones.reducer';
import { RevisionesEntity } from './revisiones.models';

// Lookup the 'Revisiones' feature state managed by NgRx
export const getRevisionesState = createFeatureSelector<
  RevisionesPartialState,
  State
>(REVISIONES_FEATURE_KEY);

const { selectAll, selectEntities } = revisionesAdapter.getSelectors();

export const getRevisionesSearchTerm = createSelector(
  getRevisionesState,
  (state: State) => state.searchTerm
);

export const getRevisionesLoading = createSelector(
  getRevisionesState,
  (state: State) => state.loading
);

export const getRevisionesLoaded = createSelector(
  getRevisionesState,
  (state: State) => state.loaded
);

export const getRevisionesError = createSelector(
  getRevisionesState,
  (state: State) => state.error
);

export const getAllRevisiones = createSelector(
  getRevisionesState,
  (state: State) => selectAll(state)
);

export const getRevisionesEntities = createSelector(
  getRevisionesState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getRevisionesState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getRevisionesEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getSelection = createSelector(
  getRevisionesState,
  (state: State) => state.selection
);

export const getSelectedRevisiones = createSelector(
  getRevisionesEntities,
  getSelection,
  (entites, ids) => ids.map((id) => entites[id])
);

// map((facturas) => facturas.filter((item) => !item.fechaRecepcionCxc))
export const getPorRecibir = createSelector(getSelectedRevisiones, (facturas) =>
  facturas.filter((item) => !item.fechaRecepcionCxc)
);

export const getRecibidas = createSelector(getSelectedRevisiones, (facturas) =>
  facturas.filter((item) => item.fechaRecepcionCxc)
);

export const getRecibidasCancelables = createSelector(
  getRecibidas,
  (facturas) => facturas.filter((item) => !item.revisada).map((item) => item.id)
);

export const getPorRevisar = createSelector(getRecibidas, (facturas) =>
  facturas.filter((item) => !item.revisada)
);

export const getPorRevisadas = createSelector(getRecibidas, (facturas) =>
  facturas.filter((item) => item.revisada)
);
export const getUltimaActualizacion = createSelector(
  getAllRevisiones,
  (facturas) => (facturas.length > 0 ? facturas[0].actualizacion : null)
);
