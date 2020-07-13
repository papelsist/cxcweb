import { VentaDet } from '../core/venta-det';

export interface DevolucionDet {
  id: string;
  ventaDet: Partial<VentaDet>;
}
