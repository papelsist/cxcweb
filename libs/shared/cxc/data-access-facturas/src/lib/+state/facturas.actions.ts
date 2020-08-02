import { createAction, props } from '@ngrx/store';
import { FacturasEntity } from './facturas.models';

export const loadFacturas = createAction('[Facturas] Load Facturas');

export const loadFacturasSuccess = createAction(
  '[Facturas] Load Facturas Success',
  props<{ facturas: FacturasEntity[] }>()
);

export const loadFacturasFailure = createAction(
  '[Facturas] Load Facturas Failure',
  props<{ error: any }>()
);
