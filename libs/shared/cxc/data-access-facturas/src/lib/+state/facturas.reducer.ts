import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as FacturasActions from './facturas.actions';
import { FacturasEntity } from './facturas.models';

export const FACTURAS_FEATURE_KEY = 'facturas';

export interface State extends EntityState<FacturasEntity> {
  selectedId?: string | number; // which Facturas record has been selected
  loaded: boolean; // has the Facturas list been loaded
  error?: string | null; // last none error (if any)
}

export interface FacturasPartialState {
  readonly [FACTURAS_FEATURE_KEY]: State;
}

export const facturasAdapter: EntityAdapter<FacturasEntity> = createEntityAdapter<
  FacturasEntity
>();

export const initialState: State = facturasAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const facturasReducer = createReducer(
  initialState,
  on(FacturasActions.loadFacturas, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(FacturasActions.loadFacturasSuccess, (state, { facturas }) =>
    facturasAdapter.addAll(facturas, { ...state, loaded: true })
  ),
  on(FacturasActions.loadFacturasFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return facturasReducer(state, action);
}
