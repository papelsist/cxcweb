import { createAction, props } from '@ngrx/store';
import { DevolucionesEntity } from './devoluciones.models';
import { Periodo, Cartera } from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';

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

export const saveDevolucion = createAction(
  '[Devoluciones Page] Save devolucion',
  props<{ devolucion: Partial<DevolucionesEntity> }>()
);
export const saveDevolucionFail = createAction(
  '[Devoluciones Effects] Save devolucion fail',
  props<{ error: any }>()
);
export const saveDevolucionSuccess = createAction(
  '[Devoluciones Effecs] Save devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);

export const updateDevolucion = createAction(
  '[Devoluciones Facade] Update devolucion',
  props<{ update: Update<DevolucionesEntity> }>()
);
export const updateDevolucionFail = createAction(
  '[Devoluciones Effects] Update devolucion fail',
  props<{ error: any }>()
);
export const updateDevolucionSuccess = createAction(
  '[Devoluciones Effecs] Update devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);

export const timbrarDevolucion = createAction(
  '[Devolucion Component] Timbrar devolucion',
  props<{ devolucion: Partial<DevolucionesEntity> }>()
);
export const timbrarDevolucionFail = createAction(
  '[Devoluciones effects] Timbrar devolucion fail',
  props<{ error: any }>()
);
export const timbrarDevolucionSuccess = createAction(
  '[Devoluciones effects] Timbrar devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);

export const deleteDevolucion = createAction(
  '[Devolucion Component] Delete devolucion',
  props<{ devolucion: DevolucionesEntity }>()
);
export const deleteDevolucionFail = createAction(
  '[Devoluciones effects] Delete devolucion fail',
  props<{ error: any }>()
);
export const deleteDevolucionSuccess = createAction(
  '[Devoluciones effects] Delete devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);

// CANCELACION
export const cancelarDevolucion = createAction(
  '[Devolucion Component] Cancelar devolucion',
  props<{ devolucion: DevolucionesEntity; motivo: string }>()
);
export const cancelarDevolucionFail = createAction(
  '[Devoluciones effects] Cancelar devolucion fail',
  props<{ error: any }>()
);
export const cancelarDevolucionSuccess = createAction(
  '[Devoluciones effects] Cancelar devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);

export const aplicar = createAction(
  '[Devolucion Component] Aplicar devolucion',
  props<{ devolucion: Partial<DevolucionesEntity> }>()
);
export const aplicarFail = createAction(
  '[Devoluciones effects] Aplicar devolucion fail',
  props<{ error: any }>()
);
export const aplicarSuccess = createAction(
  '[Devoluciones effects] Aplicar devolucion success',
  props<{ devolucion: DevolucionesEntity }>()
);
