export interface Cobrador {
  id: string;
  sw2?: number;
  activo: boolean;
  clave: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  curp: string;
  rfc: string;
  comision: number;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
