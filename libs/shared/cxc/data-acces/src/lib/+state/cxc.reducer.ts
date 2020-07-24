import { createReducer, on, Action } from '@ngrx/store';

import * as CXCActions from './cxc.actions';
import { Cartera } from '@nx-papelsa/shared/utils/core-models';

export const CXC_FEATURE_KEY = 'cobranza';

export interface CXCState {
  cartera: Cartera | null;
}
export const initialState: CXCState = {
  cartera: null,
};

const cxcReducer = createReducer(
  initialState,
  on(CXCActions.setCartera, (state, { cartera }) => ({ ...state, cartera }))
);

export function reducer(state: CXCState | undefined, action: Action) {
  return cxcReducer(state, action);
}
