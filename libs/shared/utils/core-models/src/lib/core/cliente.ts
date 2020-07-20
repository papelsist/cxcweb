import { Socio } from './socio';
import { Direccion } from './common';

export interface Cliente {
  id: string;
  nombre: string;
  clave: string;
  rfc: string;
  cfdiMail?: string;
  credito?: ClienteCredito;
  permiteCheque: boolean;
  folioRFC: number;
  chequeDevuelto: number;
  activo: true;
  juridico: false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  medios?: any[];
  direccion: Direccion;
  direcciones?: ClienteDireccion[];
  direccionesEntrega?: ClienteDireccion[];
  dateCreated?: string;
  lastUpdated?: string;
  telefonos?: string | number;
  createUser?: string;
  updateUser?: string;
  socios?: Partial<Socio>[];
}

export interface ClienteCredito {
  descuentoFijo: number;
  postfechado: boolean;
  lineaDeCredito: number;
  plazo: number;
  saldo: number;
  atrasoMaximo: number;
  creditoActivo: boolean;
  usoDeCfdi?: string;
}

export interface ClienteDireccion {
  id?: string;
  nombre: string;
  direccion: Direccion;
  cliente?: Partial<Cliente>;
}
