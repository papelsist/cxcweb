import { createAction, props } from '@ngrx/store';

import { Cobro, Periodo } from '@nx-papelsa/shared/utils/core-models';

export const loadCobros = createAction(
  '[Cobros] Load Cobros',
  props<{ periodo: Periodo; cartera: string }>()
);

export const loadCobrosSuccess = createAction(
  '[Cobros] Load Cobros Success',
  props<{ cobros: Cobro[] }>()
);

export const loadCobrosFailure = createAction(
  '[Cobros] Load Cobros Failure',
  props<{ error: any }>()
);

export const setSearchTerm = createAction(
  '[Cobros Page] Set search term',
  props<{ searchTerm: string }>()
);

export const setPeriodo = createAction(
  '[Cobros Page] Set periodo',
  props<{ periodo: Periodo }>()
);

export const upsertCobro = createAction(
  '[Cobros exists guard] Upsert cobro',
  props<{ cobro: Cobro }>()
);
export const setCurrentCobroId = createAction(
  '[Cobro exists guard] Set current cobro id',
  props<{ id: string }>()
);
export const toggleDisponibles = createAction(
  '[Cobros page] Toggle Disponibles'
);
