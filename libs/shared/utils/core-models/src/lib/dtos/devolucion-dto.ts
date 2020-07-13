export interface DevolucionDto {
  id: string;
  documento: number;
  sucursal: string;
  fecha: string;
  cliente: string;
  nombre: string;
  factura: string;
  moneda: string;
  importe: number;
  impuesto: number;
  total: number;
}
