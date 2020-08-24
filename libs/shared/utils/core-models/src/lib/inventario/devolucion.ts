import { Sucursal } from '../core/sucursal';
import { Venta } from '../core/venta';
import { TransactionLog } from '../core/transaction-log';
import { DevolucionDet } from './devolucion-det';
import { Cobro } from '../cxc';

export interface Devolucion extends TransactionLog {
  id: string;
  nombre: string;
  venta: Partial<Venta>;
  cobro: Partial<Cobro>;
  documento: number;
  fecha: string;
  sucursal: Partial<Sucursal>;
  sucursalNombre?: string;
  importe: number;
  impuesto: number;
  total: number;
  importeCortes: number;
  comentario: string;
  partidas: DevolucionDet[];
  fechaInventario: string;
  asignado: string;
  parcial: boolean;
  cancelado: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nota: any;
}
