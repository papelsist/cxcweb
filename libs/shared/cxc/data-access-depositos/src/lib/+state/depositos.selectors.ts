import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DEPOSITOS_FEATURE_KEY,
  State,
  DepositosPartialState,
  depositosAdapter,
} from './depositos.reducer';

// Lookup the 'Depositos' feature state managed by NgRx
export const getDepositosState = createFeatureSelector<
  DepositosPartialState,
  State
>(DEPOSITOS_FEATURE_KEY);

const { selectAll, selectEntities } = depositosAdapter.getSelectors();

export const getDepositosLoaded = createSelector(
  getDepositosState,
  (state: State) => state.loaded
);

export const getDepositosError = createSelector(
  getDepositosState,
  (state: State) => state.error
);

export const getAllDepositos = createSelector(
  getDepositosState,
  (state: State) => selectAll(state)
);

export const getDepositosEntities = createSelector(
  getDepositosState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getDepositosState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getDepositosEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
