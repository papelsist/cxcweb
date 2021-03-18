import {
  Autorizacion,
  Cliente,
  Sucursal,
} from '@nx-papelsa/shared/utils/core-models';

export interface SolicitudDeDeposito extends Deposito {}

/**
 * Interface for the 'Depositos' data
 */
export interface Deposito {
  id?: string;
  folio?: number;
  cartera: 'CRE' | 'JUR' | 'CHE';
  sucursal?: Partial<Sucursal>;
  cliente: Partial<Cliente>;
  nombre: string;
  rfc: string;
  banco: any;
  cuenta: any;
  fecha: string;
  fechaDeposito: string;
  transferencia: number;
  efectivo: number;
  cheque: number;
  tarjeta: number;
  total: number;
  estado: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO' | 'ATENDIDO';
  vendedor: string;
  rechazo?: any;
  referencia?: string;
  createUser?: string;
  updateUser?: string;
  lastUpdated?: string;
  autorizacion: Autorizacion;
}
