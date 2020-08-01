import { Cliente } from '../core/cliente';
import { Cfdi } from '../core';

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

  primerAplicacion: string;
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
}

export interface AplicacionDeCobro {
  id: string;
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
