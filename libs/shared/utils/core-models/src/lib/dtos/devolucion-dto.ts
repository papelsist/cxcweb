export interface DevolucionDto {
  id: string;
  documento: number;
  sucursal: string;
  fecha: string;
  cliente: string;
  moneda: string;
  importe: number;
  impuesto: number;
  total: number;
}
