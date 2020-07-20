import { Direccion } from './common';

export interface Socio {
  id: string;
  clave?: string;
  nombre: string;
  direccion?: string;
  direccionFiscal: Direccion;
}
