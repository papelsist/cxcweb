/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cliente } from '../core/cliente';
import { CuentaPorCobrarDTO } from '../dtos';

export interface NotaDeCargo {
  id?: string;
  cliente: Partial<Cliente>;
  nombre: string;
  folio: number;
  tipo: string;
  fecha: string;
  moneda: string;
  tipoDeCambio: number;
  cargo?: number;
  importe: number;
  impuesto: number;
  total: number;
  saldo: number;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
  partidas?: Array<NotaDeCargoDet>;
  cuentaPorCobrar: any;
  formaDePago?: any;
  usoDeCfdi?: any;
  comentario?: any;
  tipoDeCalculo?: any;
  uuid?: any;
  cfdi?: any;
  cancelacion?: string;
  cancelacionMotivo?: string;
  cancelacionUsuario?: string;
}

export interface NotaDeCargoDet {
  id?: string;
  concepto?: string;
  cargo: number;
  importe: number;
  impuesto: number;
  total: number;
  cuentaPorCobrar?: Partial<CuentaPorCobrarDTO>;
  documento?: number;
  documentoTipo?: string;
  documentoFecha?: string;
  documentoTotal?: number;
  documentoSaldo?: number;
  sucursal?: string;
  comentario?: string;
  uuid?: string;
}

export function buildFromFactura(cxc: CuentaPorCobrarDTO): NotaDeCargoDet {
  const {
    cfdi: { uuid },
  } = cxc;
  return {
    cargo: 0.0,
    importe: 0.0,
    impuesto: 0.0,
    total: 0.0,
    cuentaPorCobrar: { id: cxc.id },
    documento: cxc.documento,
    documentoTipo: cxc.tipo,
    documentoFecha: cxc.fecha,
    documentoSaldo: cxc.saldo,
    documentoTotal: cxc.total,
    sucursal: cxc.sucursal,
    uuid,
  };
}
