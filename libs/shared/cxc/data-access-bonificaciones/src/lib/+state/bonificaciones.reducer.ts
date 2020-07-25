import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as BonificacionesActions from './bonificaciones.actions';
import { BonificacionesEntity } from './bonificaciones.models';

import { Periodo } from '@nx-papelsa/shared/utils/core-models';

export const BONIFICACIONES_FEATURE_KEY = 'bonificaciones';
export const BONIFICACIONES_STORAGE_PERIODO_KEY =
  'nx-papelsa-bonificaciones.periodo';

export interface State extends EntityState<BonificacionesEntity> {
  selectedId?: string | number; // which Bonificaciones record has been selected
  loading: boolean;
  loaded: boolean; // has the Bonificaciones list been loaded
  error?: string | null; // last none error (if any)
  periodo: Periodo;
  searchTerm?: string;
}

export interface BonificacionesPartialState {
  readonly [BONIFICACIONES_FEATURE_KEY]: State;
}

export const bonificacionesAdapter: EntityAdapter<BonificacionesEntity> = createEntityAdapter<
  BonificacionesEntity
>();

export const initialState: State = bonificacionesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  loading: false,
  periodo: Periodo.fromStorage(
    BONIFICACIONES_STORAGE_PERIODO_KEY,
    Periodo.fromNow(10)
  ),
});

const bonificacionesReducer = createReducer(
  initialState,

  on(BonificacionesActions.setPeriodo, (state, { periodo }) => ({
    ...state,
    periodo,
  })),

  on(BonificacionesActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),

  on(
    BonificacionesActions.loadBonificaciones,
    BonificacionesActions.saveBonificacion,
    BonificacionesActions.updateBonificacion,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    BonificacionesActions.loadBonificacionesSuccess,
    (state, { bonificaciones }) =>
      bonificacionesAdapter.setAll(bonificaciones, {
        ...state,
        loaded: true,
        loading: false,
      })
  ),
  on(
    BonificacionesActions.loadBonificacionesFailure,
    BonificacionesActions.saveBonificacionFail,
    BonificacionesActions.updateBonificacionFail,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(BonificacionesActions.upsertBonificacion, (state, { bonificacion }) =>
    bonificacionesAdapter.upsertOne(bonificacion, {
      ...state,
    })
  ),
  on(BonificacionesActions.setCurrentBonificacionId, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(BonificacionesActions.saveBonificacionSuccess, (state, { bonificacion }) =>
    bonificacionesAdapter.addOne(bonificacion, {
      ...state,
      loading: false,
    })
  ),
  /// Update Bonificacion
  on(
    BonificacionesActions.updateBonificacionSuccess,
    (state, { bonificacion }) =>
      bonificacionesAdapter.upsertOne(bonificacion, {
        ...state,
        loading: false,
      })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return bonificacionesReducer(state, action);
}
