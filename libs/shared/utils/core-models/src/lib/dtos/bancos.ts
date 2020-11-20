export interface BancoDto {
  id: string;
  nombre: string;
}

export interface CuentaDeBancoDto {
  id: string;
  numero: string;
  descripcion: string;
  activo: boolean;
  moneda: string;
}
