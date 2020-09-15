import { Venta, Cliente, Cfdi, VentaCredito } from '../core';

export interface CuentaPorCobrar {
  id: string;
  cliente: Partial<Cliente>;
  nombre: string;
  sucursal: string;
  tipo: string;
  tipoDocumento: string;
  documento: number;
  fecha: string;
  vencimiento: string;
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  importe: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  cargo?: number;
  comentario?: string;
  uuid?: string;
  cfdi?: Partial<Cfdi>;
  venta?: Partial<Venta>;
  credito?: Partial<VentaCredito>;

  pagos: number;
  saldo: number;
  saldoReal: number;
  atraso: number;
  atrasoCalculado: number;
  chequePostFechado?: boolean;
  cancelada?: string;
  cancelacionUsuario?: string;
  cancelacionMotivo?: string;
  juridico?: string;

  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}

export function formatTipoDocto(tipoDocumento: string) {
  switch (tipoDocumento) {
    case 'NOTA_DE_CARGO':
      return 'CAR';
    case 'VENTA':
      return 'VTA';
    default:
      return tipoDocumento;
  }
}
