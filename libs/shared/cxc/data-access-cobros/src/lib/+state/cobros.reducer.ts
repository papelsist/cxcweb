import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CobrosActions from './cobros.actions';
import { Cobro, Periodo } from '@nx-papelsa/shared/utils/core-models';

export const COBROS_FEATURE_KEY = 'cobros';

export interface State extends EntityState<Cobro> {
  selectedId?: string | number; // which Cobros record has been selected
  loaded: boolean; // has the Cobros list been loaded
  loading: boolean;
  error?: string | null; // last none error (if any)
  periodo: Periodo;
  searchTerm?: string;
  disponibles: boolean;
}

export interface CobrosPartialState {
  readonly [COBROS_FEATURE_KEY]: State;
}

export const cobrosAdapter: EntityAdapter<Cobro> = createEntityAdapter<Cobro>();

export const initialState: State = cobrosAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  loading: false,
  periodo: Periodo.fromNow(10),
  disponibles: true,
});

const cobrosReducer = createReducer(
  initialState,
  on(CobrosActions.setPeriodo, (state, { periodo }) => ({
    ...state,
    periodo,
  })),
  on(CobrosActions.toggleDisponibles, (state) => ({
    ...state,
    disponibles: !state.disponibles,
  })),
  on(CobrosActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),

  on(
    CobrosActions.loadCobros,
    CobrosActions.aplicarCobros,
    CobrosActions.eliminarAplicacion,
    CobrosActions.generarRecibo,
    (state) => ({
      ...state,
      loaded: false,
      loading: true,
      error: null,
    })
  ),
  on(CobrosActions.loadCobrosSuccess, (state, { cobros }) =>
    cobrosAdapter.setAll(cobros, { ...state, loaded: true, loading: false })
  ),
  on(
    CobrosActions.loadCobrosFailure,
    CobrosActions.aplicarCobrosFail,
    CobrosActions.eliminarAplicacionFail,
    CobrosActions.generarReciboFail,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),
  on(
    CobrosActions.upsertCobro,
    CobrosActions.generarReciboSuccess,
    (state, { cobro }) =>
      cobrosAdapter.upsertOne(cobro, {
        ...state,
        loading: false,
      })
  ),
  on(CobrosActions.setCurrentCobroId, (state, { id }) => ({
    ...state,
    selectedId: id,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return cobrosReducer(state, action);
}
