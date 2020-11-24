import { Autorizacion, Cliente } from '@nx-papelsa/shared/utils/core-models';

/**
 * Interface for the 'Depositos' data
 */
export interface Deposito {
  id?: string;
  folio?: number;
  cartera: 'CRE' | 'JUR' | 'CHE';
  sucursal?: string;
  cliente: Partial<Cliente>;
  nombre: string;
  rfc: string;
  banco: any;
  cuenta: any;
  fecha: string;
  fechaDeposito: string;
  transferencia: boolean;
  importes?: DepositoImportes;
  total: number;
  rechazo?: any;
  estado: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO' | 'ATENDIDO';
  vendedor: string;
  cerrado?: boolean;
  cerradoTime?: string;
  referencia?: string;
  createUser?: string;
  updateUser?: string;
  lastUpdated?: string;
  autorizacion: Autorizacion;
}

export interface DepositoImportes {
  efectivo: number;
  cheque: number;
  tarjeta: number;
}
