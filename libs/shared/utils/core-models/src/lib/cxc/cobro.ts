import { Cliente } from '../core/cliente';
import { Cfdi } from '../core';
import { CuentaPorCobrar } from './cuenta-por-cobrar';

export interface Cobro {
  id: string;
  tipo: string;
  nombre: string;
  cliente: Partial<Cliente>;
  sucursal: { id: string };
  sucursalNombre: string;
  fecha: string;
  formaDePago: string;
  referencia: string;
  moneda: string;
  tipoDeCambio: number;

  primeraAplicacion: string;
  anticipo: boolean;
  enviado: boolean;

  aplicaciones: Partial<AplicacionDeCobro>[];
  importe: number;
  aplicado: number;
  diferencia: number;
  saldo: number;

  diferenciaFecha: string;
  comentario: string;
  cfdi: Partial<Cfdi>;
  recibo: string;

  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
  cierre?: string;
  cierreUser?: string;
  timbrable: boolean;
}

export interface AplicacionDeCobro {
  id?: string;
  cuentaPorCobrar: Partial<CuentaPorCobrar>;
  cobro: Partial<Cobro>;
  importe: number;
  fecha: string;
  formaDePago: string;
  recibo: string;
  sucursal?: string;
  fechaDocumento?: string;
  folioDocumento?: string;
  serieDocumento?: string;
  totalDocumento?: number;
  pagoslDocumento?: number;
  saldoDocumento?: number;
  uuidDocumento?: string;
  moneda?: string;
  tipoDeCambio?: number;
}

export function formatFormaDePago(formaDePago: string) {
  switch (formaDePago) {
    case 'TARJETA_DEBITO':
      return 'TAR_DEV';
    case 'TARJETA_CREDITO':
      return 'TAR_CRE';
    case 'TRANSFERENCIA':
      return 'TRANSF';
    case 'DEPOSITO_EFECTIVO':
      return 'DEP_EFE';
    case 'DEPOSITO_CHEQUE':
      return 'DEP_CHE';
    case 'BONIFICACION':
      return 'BON';
    case 'DEVOLUCION':
      return 'DEV';
    default:
      return formaDePago;
  }
}
