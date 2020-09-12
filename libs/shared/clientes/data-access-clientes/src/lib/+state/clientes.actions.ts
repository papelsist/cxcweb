import { createAction, props } from '@ngrx/store';

import { Cliente, ClienteCredito } from '@nx-papelsa/shared/utils/core-models';
import { Update } from '@ngrx/entity';

export const loadClientes = createAction('[Clientes Facade] Load Clientes');
export const loadClientesSuccess = createAction(
  '[Clientes API] Load Clientes Success',
  props<{ clientes: Cliente[] }>()
);
export const loadClientesFailure = createAction(
  '[Clientes API] Load Clientes Failure',
  props<{ error: any }>()
);
export const setCurrentCliente = createAction(
  '[Cliente Guard ] Select current cliente',
  props<{ cliente: Cliente }>()
);

// export const upsertCliente = createAction('[]', props<{update: Update<Cliente}>());
export const updateCliente = createAction(
  '[Cliente Info Page] Cliente update',
  props<{ update: Update<Cliente> }>()
);
export const updateClienteFail = createAction(
  '[Cliente API] Cliente update fail',
  props<{ error: any }>()
);
export const updateClienteSuccess = createAction(
  '[Cliente API] Cliente update success',
  props<{ cliente: Cliente }>()
);

export const updateClienteCredito = createAction(
  '[ClienteCredito Info Page] ClienteCredito update',
  props<{ clienteId: string; credito: Update<ClienteCredito> }>()
);
export const updateClienteCreditoFail = createAction(
  '[ClienteCredito API] ClienteCredito update fail',
  props<{ error: any }>()
);
export const updateClienteCreditoSuccess = createAction(
  '[ClienteCredito API] ClienteCredito update success',
  props<{ credito: ClienteCredito }>()
);
