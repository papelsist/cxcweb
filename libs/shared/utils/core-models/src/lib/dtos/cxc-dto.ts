import { CfdiDto } from './cfdi-dto';
import { Cliente } from '../core/cliente';
import { Venta, VentaCredito } from '../core';

export interface CuentaPorCobrarDTO {
  id: string;
  cliente: Partial<Cliente>;
  clienteId: string;
  nombre: string;
  cfdiMail: string;
  sucursal: string;
  tipo: string;
  tipoDocumento: string;
  fecha: string;
  vencimiento: string;
  formaDePago: string;
  documento: number;
  moneda: string;
  tipoDeCambio: number;
  importe: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  pagos: number;
  saldo: number;
  atraso: number;
  cancelada: string;
  cancelacionUsuario: string;
  cancelacionMotivo: string;
  juridico: string;
  cfdi?: CfdiDto;
  venta?: Partial<Venta>;
  credito?: Partial<VentaCredito>;
}
