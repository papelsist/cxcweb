import { createAction, props } from '@ngrx/store';
import { DevolucionesEntity } from './devoluciones.models';
import { Periodo, Cartera } from '@nx-papelsa/shared/utils/core-models';

export const setDevolucionesSearchTerm = createAction(
  '[Devoluciones Page] Set search term',
  props<{ searchTerm: string }>()
);

export const setPeriodoDeDevoluciones = createAction(
  '[Devoluciones Page] Set periodo',
  props<{ periodo: Periodo }>()
);

export const loadDevoluciones = createAction(
  '[Devoluciones] Load Devoluciones',
  props<{ periodo: Periodo; cartera: Cartera }>()
);

export const loadDevolucionesSuccess = createAction(
  '[Devoluciones] Load Devoluciones Success',
  props<{ devoluciones: DevolucionesEntity[] }>()
);

export const loadDevolucionesFailure = createAction(
  '[Devoluciones] Load Devoluciones Failure',
  props<{ error: any }>()
);
