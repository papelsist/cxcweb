import { Cliente } from '../core/cliente';
import { Cfdi } from '../core';
import { CuentaPorCobrar } from './cuenta-por-cobrar';

export interface NotaDeCredito {
  id: string;
  cliente: Partial<Cliente>;
  nombre: string;
  serie: string;
  folio: number;
  tipo: 'BONIFICACION' | 'DEVOLUCION';
  tipoCartera: 'CRE' | 'CON' | 'CHE' | 'JUR' | 'COD';
  tipoDeCalculo?: 'PORCENTAJE' | 'PRORRATEO';
  baseDelCalculo?: 'Saldo' | 'Total' | 'Manual';
  fecha: string;
  moneda: string;
  tc: number;
  formaDePago?: string;
  usoDeCfdi?: string;
  importe: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  comentario?: string;
  partidas: NotaDeCreditoDet[];

  sucursal?: string;
  descuento: number;
  descuento2: number;
  financiero: boolean;
  cobro?: { id: string };
  rmd?: number;
  rmdSucursal?: string;
  sinReferencia?: boolean;

  cfdi?: Partial<Cfdi>;

  dateCreated: string;
  lastUpdated: string;
  createUser?: string;
  updateUser?: string;

  cancelacion?: string;
  cancelacionMotivo?: string;
  cancelacionUsuario?: string;
}

export interface NotaDeCreditoDet {
  id: string;
  cuentaPorCobrar: Partial<CuentaPorCobrar>;
  base: number;
  impuesto: number;
  importe: number;
  documento: number;
  tipoDeDocumento: string;
  fechaDocumento: string;
  totalDocumento: number;
  saldoDocumento: number;
  sucursal: string;
  comentario?: string;
}

export const BONIFICACIONES_CONCEPTOS = [
  'PRONTO PAGO',
  'DIFERENCIA',
  'ESPECIAL',
  'OTRO',
];
