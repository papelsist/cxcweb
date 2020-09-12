import { Socio } from './socio';
import { Direccion } from './common';
import { Cobrador } from './cobrador';

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
  id: string;
  cliente: Partial<Cliente>;
  creditoActivo: boolean;
  lineaDeCredito: number;
  descuentoFijo: number;
  plazo: number;
  venceFactura: boolean;
  revision: boolean;
  diaRevision: number;
  diaCobro: number;
  postfechado: boolean;
  saldo: number;
  atrasoMaximo: number;
  operador: number;
  cobrador: Partial<Cobrador>;
  socio: Partial<Socio>;
  usoDeCfdi?: string;
  createUser?: string;
  updateUser?: string;
  dateCreated?: string;
  lastUpdated?: string;
}

export interface ClienteDireccion {
  id?: string;
  nombre: string;
  direccion: Direccion;
  cliente?: Partial<Cliente>;
}
