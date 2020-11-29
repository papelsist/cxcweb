import { CuentaPorCobrar } from './cuenta-por-cobrar';

export interface Juridico {
  id?: string;
  nombre: string;
  cxc: Partial<CuentaPorCobrar>;
  importe: number;
  saldo: number;
  comentario: string;
  despacho: Partial<Despacho>;
  abogado: string;
  traspaso: string;
  asignacion?: string;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface Despacho {
  id: string;
  nombre: string;
  rfc: string;
  activo: boolean;
  telefono1: string;
  telefono2: string;
  telefono3: string;
  abogados: string[];
  dateCreated?: string;
  lastUpdated?: string;
  updateUser?: string;
  createUser?: string;
}
