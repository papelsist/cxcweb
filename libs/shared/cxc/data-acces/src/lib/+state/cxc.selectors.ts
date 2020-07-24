import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFeature from './cxc.reducer';

// Lookup the 'CXCState' feature state managed by NgRx
export const getCXCState = createFeatureSelector<fromFeature.CXCState>(
  fromFeature.CXC_FEATURE_KEY
);

export const getCartera = createSelector(getCXCState, (state) => state.cartera);
