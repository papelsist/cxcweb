import { createAction, props } from '@ngrx/store';
import { FacturasEntity } from './facturas.models';
import {
  Periodo,
  CuentaPorCobrar,
  CuentaPorCobrarDTO,
} from '@nx-papelsa/shared/utils/core-models';

export const loadFacturas = createAction('[Facturas Guard] Load Facturas');

export const loadFacturasSuccess = createAction(
  '[Facturas] Load Facturas Success',
  props<{ facturas: FacturasEntity[] }>()
);

export const loadFacturasFailure = createAction(
  '[Facturas] Load Facturas Failure',
  props<{ error: any }>()
);

export const setFacturasSearchTerm = createAction(
  '[Facturas Page] Set search term',
  props<{ searchTerm: string }>()
);

export const setFacturasPeriodo = createAction(
  '[Facturas Page] Set periodo',
  props<{ periodo: Periodo }>()
);

export const upsertFactura = createAction(
  '[FacturaExist Guard]',
  props<{ factura: FacturasEntity }>()
);

export const setCurrentFacturaId = createAction(
  '[FacturaExists Guard]',
  props<{ id: string }>()
);
