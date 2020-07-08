import { CfdiDto } from './cfdi-dto';

export interface CuentaPorCobrarDTO {
  id: string;
  clienteId: string;
  nombre: string;
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
}
