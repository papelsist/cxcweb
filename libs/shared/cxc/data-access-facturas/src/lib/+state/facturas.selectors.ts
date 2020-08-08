import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  FACTURAS_FEATURE_KEY,
  State,
  FacturasPartialState,
  facturasAdapter,
} from './facturas.reducer';

// Lookup the 'Facturas' feature state managed by NgRx
export const getFacturasState = createFeatureSelector<
  FacturasPartialState,
  State
>(FACTURAS_FEATURE_KEY);

const { selectAll, selectEntities } = facturasAdapter.getSelectors();

export const getFacturasPeriodo = createSelector(
  getFacturasState,
  (state: State) => state.periodo
);

export const getFacturasSearchTerm = createSelector(
  getFacturasState,
  (state: State) => state.searchTerm
);

export const getFacturasLoading = createSelector(
  getFacturasState,
  (state: State) => state.loading
);

export const getFacturasLoaded = createSelector(
  getFacturasState,
  (state: State) => state.loaded
);

export const getFacturasError = createSelector(
  getFacturasState,
  (state: State) => state.error
);

export const getAllFacturas = createSelector(getFacturasState, (state: State) =>
  selectAll(state)
);

export const getFacturasEntities = createSelector(
  getFacturasState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getFacturasState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getFacturasEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
