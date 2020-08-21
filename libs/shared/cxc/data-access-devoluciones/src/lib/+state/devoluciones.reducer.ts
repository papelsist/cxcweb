import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as DevolucionesActions from './devoluciones.actions';
import { DevolucionesEntity } from './devoluciones.models';

import { Periodo } from '@nx-papelsa/shared/utils/core-models';

export const DEVOLUCIONES_FEATURE_KEY = 'devoluciones';

export interface State extends EntityState<DevolucionesEntity> {
  selectedId?: string;
  loaded: boolean;
  loading: boolean;
  error?: string | null; // last none error (if any)
  periodo: Periodo;
  searchTerm?: string;
}

export interface DevolucionesPartialState {
  readonly [DEVOLUCIONES_FEATURE_KEY]: State;
}

export const devolucionesAdapter: EntityAdapter<DevolucionesEntity> = createEntityAdapter<
  DevolucionesEntity
>();

export const initialState: State = devolucionesAdapter.getInitialState({
  loaded: false,
  loading: false,
  periodo: Periodo.fromNow(60),
});

const devolucionesReducer = createReducer(
  initialState,
  on(DevolucionesActions.setPeriodoDeDevoluciones, (state, { periodo }) => ({
    ...state,
    periodo,
  })),

  on(
    DevolucionesActions.setDevolucionesSearchTerm,
    (state, { searchTerm }) => ({
      ...state,
      searchTerm,
    })
  ),
  on(DevolucionesActions.loadDevoluciones, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(DevolucionesActions.cancelarDevolucion, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DevolucionesActions.loadDevolucionesSuccess, (state, { devoluciones }) =>
    devolucionesAdapter.setAll(devoluciones, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),
  on(DevolucionesActions.cancelarDevolucionSuccess, (state, { devolucion }) =>
    devolucionesAdapter.upsertOne(devolucion, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(
    DevolucionesActions.loadDevolucionesFailure,
    DevolucionesActions.cancelarDevolucionFail,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(DevolucionesActions.upsertDevolucion, (state, { devolucion }) =>
    devolucionesAdapter.upsertOne(devolucion, {
      ...state,
    })
  ),
  on(DevolucionesActions.setCurrentDevolucionId, (state, { id }) => ({
    ...state,
    selectedId: id,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return devolucionesReducer(state, action);
}
