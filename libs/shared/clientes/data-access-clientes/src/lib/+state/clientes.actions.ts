import { createAction, props } from '@ngrx/store';

import {
  Cliente,
  ClienteCredito,
  MedioDeContacto,
} from '@nx-papelsa/shared/utils/core-models';
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

export const updateMedioDeContacto = createAction(
  '[Cliente Info Page] MedioDeContacto update',
  props<{ clienteId: string; medio: Update<MedioDeContacto> }>()
);
export const updateMedioDeContactoFail = createAction(
  '[MedioDeContacto API] MedioDeContacto update fail',
  props<{ error: any }>()
);
export const updateMedioDeContactoSuccess = createAction(
  '[MedioDeContacto API] MedioDeContacto update success',
  props<{ medio: MedioDeContacto }>()
);

export const addMedioDeContacto = createAction(
  '[Cliente Info Page] MedioDeContacto add',
  props<{ clienteId: string; medio: Partial<MedioDeContacto> }>()
);
export const addMedioDeContactoFail = createAction(
  '[MedioDeContacto API] MedioDeContacto add fail',
  props<{ error: any }>()
);
export const addMedioDeContactoSuccess = createAction(
  '[MedioDeContacto API] MedioDeContacto add success',
  props<{ medio: MedioDeContacto }>()
);

export const deleteMedioDeContacto = createAction(
  '[Cliente Info Page] MedioDeContacto delete',
  props<{ clienteId: string; medio: MedioDeContacto }>()
);
export const deleteMedioDeContactoFail = createAction(
  '[MedioDeContacto API] MedioDeContacto delete fail',
  props<{ error: any }>()
);
export const deleteMedioDeContactoSuccess = createAction(
  '[MedioDeContacto API] MedioDeContacto delete success',
  props<{ medio: MedioDeContacto }>()
);
