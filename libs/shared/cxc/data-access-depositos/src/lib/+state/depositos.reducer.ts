import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as DepositosActions from './depositos.actions';
import { Deposito } from './depositos.models';

export const DEPOSITOS_FEATURE_KEY = 'depositos';

export interface State extends EntityState<Deposito> {
  selectedId?: string | number; // which Depositos record has been selected
  loaded: boolean; // has the Depositos list been loaded
  error?: string | null; // last none error (if any)
}

export interface DepositosPartialState {
  readonly [DEPOSITOS_FEATURE_KEY]: State;
}

export const depositosAdapter: EntityAdapter<Deposito> = createEntityAdapter<
  Deposito
>();

export const initialState: State = depositosAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const depositosReducer = createReducer(
  initialState,
  on(DepositosActions.loadDepositos, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(DepositosActions.loadDepositosSuccess, (state, { depositos }) =>
    depositosAdapter.setAll(depositos, { ...state, loaded: true })
  ),
  on(DepositosActions.loadDepositosFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return depositosReducer(state, action);
}
