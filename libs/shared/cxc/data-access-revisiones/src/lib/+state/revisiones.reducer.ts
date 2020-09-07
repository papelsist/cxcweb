import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as RevisionesActions from './revisiones.actions';
import { RevisionesEntity } from './revisiones.models';

export const REVISIONES_FEATURE_KEY = 'revisiones';

export interface State extends EntityState<RevisionesEntity> {
  selectedId?: string | number; // which Revisiones record has been selected
  loading: boolean;
  loaded: boolean; // has the Revisiones list been loaded
  error?: string | null; // last none error (if any)
  searchTerm?: string;
  selection: string[];
}

export interface RevisionesPartialState {
  readonly [REVISIONES_FEATURE_KEY]: State;
}

export const revisionesAdapter: EntityAdapter<RevisionesEntity> = createEntityAdapter<
  RevisionesEntity
>();

export const initialState: State = revisionesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  loading: false,
  selection: [],
});

const revisionesReducer = createReducer(
  initialState,
  on(RevisionesActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(RevisionesActions.loadRevisiones, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    RevisionesActions.actualizarRevisiones,
    RevisionesActions.registrarRecepcion,
    RevisionesActions.batchUpdateRevisiones,
    RevisionesActions.registrarRevision,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(RevisionesActions.loadRevisionesSuccess, (state, { revisiones }) =>
    revisionesAdapter.setAll(revisiones, {
      ...state,
      loaded: true,
      loading: false,
      selection: [],
    })
  ),
  on(RevisionesActions.actualizarRevisionesSuccess, (state, { revisiones }) =>
    revisionesAdapter.setAll(revisiones, {
      ...state,
      loading: false,
      selection: [],
    })
  ),
  on(
    RevisionesActions.registrarRecepcionSuccess,
    RevisionesActions.batchUpdateRevisionesSuccess,
    RevisionesActions.registrarRevisionSuccess,
    (state, { revisiones }) =>
      revisionesAdapter.upsertMany(revisiones, {
        ...state,
        loading: false,
        selection: [],
      })
  ),

  on(
    RevisionesActions.loadRevisionesFailure,
    RevisionesActions.actualizarRevisionesFail,
    RevisionesActions.registrarRecepcionFail,
    RevisionesActions.batchUpdateRevisionesFail,
    RevisionesActions.registrarRevisionFail,
    (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })
  ),
  on(RevisionesActions.selectRevisiones, (state, { ids }) => ({
    ...state,
    selection: ids,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return revisionesReducer(state, action);
}
