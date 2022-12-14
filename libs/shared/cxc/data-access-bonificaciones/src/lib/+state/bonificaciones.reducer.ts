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
>({
  sortComparer: (d1, d2) =>
    d1.folio > d2.folio ? -1 : d1.folio < d2.folio ? 1 : 0,
});

export const initialState: State = bonificacionesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  loading: false,
  periodo: Periodo.fromNow(30),
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
    BonificacionesActions.solicitarAutorizacion,
    BonificacionesActions.aplicar,
    BonificacionesActions.deleteBonificacion,
    BonificacionesActions.cancelarBonificacion,
    BonificacionesActions.timbrarBonificacion,
    BonificacionesActions.timbrarBonificacionV4,
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
    BonificacionesActions.solicitarAutorizacionFail,
    BonificacionesActions.aplicarFail,
    BonificacionesActions.deleteBonificacionFail,
    BonificacionesActions.cancelarBonificacionFail,
    BonificacionesActions.timbrarBonificacionFail,
    BonificacionesActions.timbrarBonificacionV4Fail,
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
    BonificacionesActions.solicitarAutorizacionSuccess,
    BonificacionesActions.aplicarSuccess,
    BonificacionesActions.cancelarBonificacionSuccess,
    BonificacionesActions.timbrarBonificacionSuccess,
    BonificacionesActions.timbrarBonificacionV4Success,
    BonificacionesActions.updateBonificacionSuccess,
    (state, { bonificacion }) =>
      bonificacionesAdapter.upsertOne(bonificacion, {
        ...state,
        loading: false,
        error: null,
      })
  ),
  on(
    BonificacionesActions.deleteBonificacionSuccess,
    (state, { bonificacion }) =>
      bonificacionesAdapter.removeOne(bonificacion.id, { ...state })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return bonificacionesReducer(state, action);
}
