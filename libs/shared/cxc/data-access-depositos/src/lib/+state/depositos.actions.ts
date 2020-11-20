import { createAction, props } from '@ngrx/store';
import { Deposito } from './depositos.models';

export const loadDepositos = createAction('[Depositos] Load Depositos');

export const loadDepositosSuccess = createAction(
  '[Depositos] Load Depositos Success',
  props<{ depositos: Deposito[] }>()
);

export const loadDepositosFailure = createAction(
  '[Depositos] Load Depositos Failure',
  props<{ error: any }>()
);
