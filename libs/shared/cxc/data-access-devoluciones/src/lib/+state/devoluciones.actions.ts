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
  props<{ periodo?: Periodo; cartera?: Cartera }>()
);

export const loadDevolucionesSuccess = createAction(
  '[Devoluciones] Load Devoluciones Success',
  props<{ devoluciones: DevolucionesEntity[] }>()
);

export const loadDevolucionesFailure = createAction(
  '[Devoluciones] Load Devoluciones Failure',
  props<{ error: any }>()
);

export const setCurrentDevolucionId = createAction(
  '[Devolucion exists guard] Set current devolucion id',
  props<{ id: string }>()
);

export const upsertDevolucion = createAction(
  '[Devolucion exists guard] Upsert devolucion',
  props<{ devolucion: DevolucionesEntity }>()
);

// CANCELACION
export const cancelarDevolucion = createAction(
  '[Devolucion Component] Cancelar devolucion',
  props<{ devolucion: Partial<DevolucionesEntity>; motivo: string }>()
);
export const cancelarDevolucionFail = createAction(
  '[Devoluciones effects] Cancelar devolucion fail',
  props<{ error: any }>()
);
export const cancelarDevolucionSuccess = createAction(
  '[Devoluciones effects] Cancelar devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);
