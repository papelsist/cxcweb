import { createReducer, on, Action } from '@ngrx/store';
import {
  EntityState,
  EntityAdapter,
  createEntityAdapter,
  Update,
} from '@ngrx/entity';

import * as FacturasActions from './facturas.actions';
import { FacturasEntity } from './facturas.models';
import { CuentaPorCobrar, Periodo } from '@nx-papelsa/shared/utils/core-models';

export const FACTURAS_FEATURE_KEY = 'facturas';

export interface State extends EntityState<FacturasEntity> {
  selectedId?: string | number; // which Facturas record has been selected
  loaded: boolean; // has the Facturas list been loaded
  loading: boolean;
  error?: string | null; // last none error (if any)
  periodo: Periodo;
  searchTerm?: string;
  pendientes: boolean;
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
  loading: false,
  periodo: Periodo.fromNow(60),
  pendientes: false,
});

const facturasReducer = createReducer(
  initialState,
  on(FacturasActions.setFacturasPeriodo, (state, { periodo }) => ({
    ...state,
    periodo,
  })),

  on(FacturasActions.setFacturasSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(FacturasActions.loadFacturas, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FacturasActions.loadFacturasSuccess, (state, { facturas }) =>
    facturasAdapter.setAll(facturas, { ...state, loaded: true, loading: false })
  ),
  on(FacturasActions.loadFacturasFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(FacturasActions.upsertFactura, (state, { factura }) =>
    facturasAdapter.upsertOne(factura, { ...state })
  ),
  on(FacturasActions.setCurrentFacturaId, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(FacturasActions.togglePendientes, (state) => ({
    ...state,
    pendientes: !state.pendientes,
  })),
  on(FacturasActions.toJuridicoSuccess, (state, { juridico }) => {
    const id = juridico.cxc.id;
    const factura: Update<FacturasEntity> = {
      id,
      changes: { juridico: juridico.traspaso },
    };
    return facturasAdapter.updateOne(factura, { ...state });
  })
);

export function reducer(state: State | undefined, action: Action) {
  return facturasReducer(state, action);
}
