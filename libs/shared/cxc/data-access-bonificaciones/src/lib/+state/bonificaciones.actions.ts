import { createAction, props } from '@ngrx/store';
import { BonificacionesEntity } from './bonificaciones.models';
import {
  Periodo,
  Cartera,
  NotaDeCredito,
} from '@nx-papelsa/shared/utils/core-models';

export const loadBonificaciones = createAction(
  '[Bonificaciones] Load Bonificaciones',
  props<{ periodo: Periodo; cartera: string }>()
);

export const loadBonificacionesSuccess = createAction(
  '[Bonificaciones] Load Bonificaciones Success',
  props<{ bonificaciones: BonificacionesEntity[] }>()
);

export const loadBonificacionesFailure = createAction(
  '[Bonificaciones] Load Bonificaciones Failure',
  props<{ error: any }>()
);

export const setSearchTerm = createAction(
  '[Bonificaciones Page] Set search term',
  props<{ searchTerm: string }>()
);

export const setPeriodo = createAction(
  '[Bonificaciones Page] Set periodo',
  props<{ periodo: Periodo }>()
);

export const upsertBonificacion = createAction(
  '[Bonificacion exists guard] Upsert bonificacion',
  props<{ bonificacion: BonificacionesEntity }>()
);
export const setCurrentBonificacionId = createAction(
  '[Bonificacion exists guard] Set current bonificacion id',
  props<{ id: string }>()
);

export const saveBonificacion = createAction(
  '[Bonificaciones Page] Save bonificacion',
  props<{ bonificacion: Partial<BonificacionesEntity> }>()
);
export const saveBonificacionFail = createAction(
  '[Bonificaciones Effects] Save bonificacion fail',
  props<{ error: any }>()
);
export const saveBonificacionSuccess = createAction(
  '[Bonificaciones Effecs] Save bonificacion success',
  props<{ bonificacion: BonificacionesEntity }>()
);
