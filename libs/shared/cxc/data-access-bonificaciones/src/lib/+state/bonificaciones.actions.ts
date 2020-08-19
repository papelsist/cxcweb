import { createAction, props } from '@ngrx/store';
import { BonificacionesEntity } from './bonificaciones.models';
import { Periodo, NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';

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

export const updateBonificacion = createAction(
  '[Bonificaciones Facade] Update bonificacion',
  props<{ update: Update<BonificacionesEntity> }>()
);
export const updateBonificacionFail = createAction(
  '[Bonificaciones Effects] Update bonificacion fail',
  props<{ error: any }>()
);
export const updateBonificacionSuccess = createAction(
  '[Bonificaciones Effecs] Update bonificacion success',
  props<{ bonificacion: BonificacionesEntity }>()
);

export const timbrarBonificacion = createAction(
  '[Bonificacion Component] Timbrar bonificacion',
  props<{ bonificacion: Partial<BonificacionesEntity> }>()
);
export const timbrarBonificacionFail = createAction(
  '[Bonificaciones effects] Timbrar bonificacion fail',
  props<{ error: any }>()
);
export const timbrarBonificacionSuccess = createAction(
  '[Bonificaciones effects] Timbrar bonificacion success',
  props<{ bonificacion: BonificacionesEntity }>()
);

export const cancelarBonificacion = createAction(
  '[Bonificacion Component] Cancelar bonificacion',
  props<{ bonificacion: Partial<BonificacionesEntity>; motivo: string }>()
);
export const cancelarBonificacionFail = createAction(
  '[Bonificaciones effects] Cancelar bonificacion fail',
  props<{ error: any }>()
);
export const cancelarBonificacionSuccess = createAction(
  '[Bonificaciones effects] Cancelar bonificacion success',
  props<{ bonificacion: BonificacionesEntity }>()
);

export const deleteBonificacion = createAction(
  '[Bonificacion Component] Delete bonificacion',
  props<{ bonificacion: Partial<BonificacionesEntity> }>()
);
export const deleteBonificacionFail = createAction(
  '[Bonificaciones effects] Delete bonificacion fail',
  props<{ error: any }>()
);
export const deleteBonificacionSuccess = createAction(
  '[Bonificaciones effects] Delete bonificacion success',
  props<{ bonificacion: Partial<BonificacionesEntity> }>()
);

export const aplicar = createAction(
  '[Bonificacion Component] Aplicar bonificacion',
  props<{ bonificacion: Partial<BonificacionesEntity> }>()
);
export const aplicarFail = createAction(
  '[Bonificaciones effects] Aplicar bonificacion fail',
  props<{ error: any }>()
);
export const aplicarSuccess = createAction(
  '[Bonificaciones effects] Aplicar bonificacion success',
  props<{ bonificacion: BonificacionesEntity }>()
);
