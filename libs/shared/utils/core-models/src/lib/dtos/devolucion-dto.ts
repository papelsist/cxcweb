export interface DevolucionDto {
  id: string;
  documento: number;
  sucursal: string;
  fecha: string;
  tipo: string;
  cliente: string;
  factura: string;
  moneda: string;
  importe: number;
  impuesto: number;
  total: number;
}
