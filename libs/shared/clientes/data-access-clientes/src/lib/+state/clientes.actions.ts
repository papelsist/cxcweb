import { createAction, props } from '@ngrx/store';

import { Cliente } from '@nx-papelsa/shared/utils/core-models';

export const loadClientes = createAction('[Clientes Facade] Load Clientes');
export const loadClientesSuccess = createAction(
  '[Clientes API] Load Clientes Success',
  props<{ clientes: Cliente[] }>()
);
export const loadClientesFailure = createAction(
  '[Clientes API] Load Clientes Failure',
  props<{ error: any }>()
);
