import { createAction, props } from '@ngrx/store';
import { RevisionesEntity } from './revisiones.models';

export const loadRevisiones = createAction('[Revisiones] Load Revisiones');

export const loadRevisionesSuccess = createAction(
  '[Revisiones] Load Revisiones Success',
  props<{ revisiones: RevisionesEntity[] }>()
);

export const loadRevisionesFailure = createAction(
  '[Revisiones] Load Revisiones Failure',
  props<{ error: any }>()
);

export const setSearchTerm = createAction(
  '[Revisiones Page] Set search term',
  props<{ searchTerm: string }>()
);

export const selectRevisiones = createAction(
  '[Revisiones Page] Select revisiones',
  props<{ ids: string[] }>()
);

export const actualizarRevisiones = createAction(
  '[Revisiones page] Actualizar revisiones'
);
export const actualizarRevisionesFail = createAction(
  '[Revision Effects] Actualizar revisiones fail ',
  props<{ error: any }>()
);
export const actualizarRevisionesSuccess = createAction(
  '[Revision Effects] Actualizar revisiones success',
  props<{ revisiones: RevisionesEntity[] }>()
);

export const registrarRecepcion = createAction(
  '[Revisiones page] Registrar recepcion',
  props<{ recibidas: boolean; facturas: string[] }>()
);
export const registrarRecepcionFail = createAction(
  '[Revision Effects] Registrar recepcion  fail ',
  props<{ error: any }>()
);
export const registrarRecepcionSuccess = createAction(
  '[Revision Effects] Registrar recepcion success',
  props<{ revisiones: RevisionesEntity[] }>()
);

export const batchUpdateRevisiones = createAction(
  '[Revisiones page] BatchUpdate Revisiones',
  props<{ template: Partial<RevisionesEntity>; facturas: string[] }>()
);
export const batchUpdateRevisionesFail = createAction(
  '[Revision Effects] BatchUpdate Revisiones  fail ',
  props<{ error: any }>()
);
export const batchUpdateRevisionesSuccess = createAction(
  '[Revision Effects] BatchUpdate Revisiones success',
  props<{ revisiones: RevisionesEntity[] }>()
);

export const registrarRevision = createAction(
  '[Revisiones page] Registrar revision',
  props<{ revisada: boolean; facturas: string[] }>()
);
export const registrarRevisionFail = createAction(
  '[Revision Effects] Registrar revision  fail ',
  props<{ error: any }>()
);
export const registrarRevisionSuccess = createAction(
  '[Revision Effects] Registrar revision success',
  props<{ revisiones: RevisionesEntity[] }>()
);
