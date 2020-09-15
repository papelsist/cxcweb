import { VentaDet } from './venta-det';
import { Cfdi } from './cfdi';
import { CuentaPorCobrar } from '../cxc';
import { Sucursal } from './sucursal';
import { Cliente } from './cliente';
import { Vendedor } from './vendedor';

export interface Venta {
  id: string;
  fecha: string;
  sucursal: Partial<Sucursal>;
  cliente: Partial<Cliente>;
  nombre?: string;
  vendedor?: Partial<Vendedor>;
  tipo: string;
  documento: number;

  // Importes y totales
  importe: number;
  descuento: number;
  descuentoOriginal?: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  // END Importes y totales
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  kilos: number;
  partidas: Array<VentaDet>;
  vale?: boolean;
  clasificacionVale?: string;
  atencion?: string;
  cod?: boolean;
  cargosPorManiobra?: number;
  comisionTarjeta?: number;
  comisionTarjetaImporte?: number;
  corteImporte?: number;
  facturar?: string;
  cuentaPorCobrar?: Partial<CuentaPorCobrar>;
  cfdiMail?: string;
  usoDeCfdi?: string;
  puesto?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  envio?: any;
  sinExistencia?: false;
  createUser?: string;
  updateUser?: string;
  comentario?: string;
  lastUdated?: string;
  dateCreated?: string;
  statusInfo?: string;
  chequePostFechado?: boolean;
  facturarUsuario?: string;
  ventaIne?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  complementoIne?: any;
  noFacturable?: boolean;
  surtido?: boolean;
  sw2?: string;
  callcenter?: boolean;

  // partidas: Partial<VentaDet>[];

  cfdi: Partial<Cfdi>;
}

export interface VentaCredito {
  id: string;
  cliente: string;
  nombre: string;
  cuentaPorCobrar: Partial<CuentaPorCobrar>;
  plazo: number;
  vencimientoFactura: boolean;
  vencimiento: string;
  fechaRecepcionCxc: string;
  diaRevision: number;
  fechaRevision: string;
  fechaRevisionCxc: string;
  descuento: number;
  revision: boolean;
  revisada: boolean;
  diaPago: number;
  fechaPago: string;
  reprogramarPago: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cobrador: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socio?: any;
  operador: number;
  comentario?: string;
  comentarioReprogramarPago: string;
  total: number;
  saldo: number;
  actualizacion?: string;
}
