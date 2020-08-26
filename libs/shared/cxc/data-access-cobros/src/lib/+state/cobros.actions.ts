import { createAction, props } from '@ngrx/store';

import { Cobro, Periodo } from '@nx-papelsa/shared/utils/core-models';

export const loadCobros = createAction(
  '[Cobros] Load Cobros',
  props<{ periodo?: Periodo; cartera?: string }>()
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
export const togglePorTimbrar = createAction(
  '[Cobros page] Toggle Por timbrar'
);

export const eliminarAplicacion = createAction(
  '[Cobro Page Facade] Eliminar aplicacion de cobro',
  props<{ id: string; aplicacionId: string }>()
);
export const eliminarAplicacionFail = createAction(
  '[Cobros Effects] Eliminar aplicacion fail',
  props<{ error: any }>()
);

export const aplicarCobros = createAction(
  '[Cobros Facade] Aplicar cobros',
  props<{ cobro: string; cuentas: string[] }>()
);
export const aplicarCobrosFail = createAction(
  '[Cobros Effects] Aplicar cobros fail',
  props<{ error: any }>()
);

export const generarRecibo = createAction(
  '[Cobros Facade Cobro Page] Generar recibo de pago',
  props<{ id: string }>()
);
export const generarReciboFail = createAction(
  '[Cobros Effects] Generar recibo de pago fail',
  props<{ error: any }>()
);
export const generarReciboSuccess = createAction(
  '[Cobros Effects] Generar recibo de pago success',
  props<{ cobro: Cobro }>()
);
