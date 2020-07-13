import { VentaDet } from './venta-det';
import { Cfdi } from './cfdi';

export interface Venta {
  id: string;
  partidas: Partial<VentaDet>[];
  folio: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moneda: string;
  cuentaPorCobrar: any;
  total: number;
  cfdi: Partial<Cfdi>;
}
