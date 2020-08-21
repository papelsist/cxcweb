import { Cliente } from '../core/cliente';
import { Cfdi } from '../core';
import { CuentaPorCobrar } from './cuenta-por-cobrar';
import { CuentaPorCobrarDTO } from '../dtos';
import { Cobro } from './cobro';

export interface NotaDeCredito {
  id: string;
  cliente: Partial<Cliente>;
  nombre: string;
  serie: string;
  folio: number;
  concepto?: string;
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
  cobro?: Partial<Cobro>;
  disponible?: number;
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

  autorizo?: string;
  autorizoFecha?: string;
}

export interface NotaDeCreditoDet {
  id: string | null;
  cuentaPorCobrar: Partial<CuentaPorCobrar>;
  base: number;
  impuesto: number;
  importe: number;
  total: number;
  documento: number;
  tipoDeDocumento: string;
  fechaDocumento: string;
  totalDocumento: number;
  saldoDocumento: number;
  uuid?: string;
  sucursal: string;
  comentario?: string;
}

export const BONIFICACIONES_CONCEPTOS = [
  'PRONTO PAGO',
  'DIFERENCIA',
  'ESPECIAL',
  'OTRO',
];

export function buildNotaDetFromFactura(
  cxc: CuentaPorCobrarDTO
): NotaDeCreditoDet {
  const {
    cfdi: { uuid },
  } = cxc;
  return {
    id: null,
    base: 0.0,
    importe: 0.0,
    impuesto: 0.0,
    total: 0.0,
    cuentaPorCobrar: { id: cxc.id },
    documento: cxc.documento,
    tipoDeDocumento: cxc.tipo,
    fechaDocumento: cxc.fecha,
    saldoDocumento: cxc.saldo,
    totalDocumento: cxc.total,
    sucursal: cxc.sucursal,
    uuid,
  };
}
