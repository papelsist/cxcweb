import { Cfdi } from '../core';

export interface AnticipoSat {
  id: string;
  sucursal: string;
  cliente: string;
  nombre: string;
  rfc: string;
  fecha: string;
  cxc: string;
  cxcDocumento: number;
  moneda: string;
  tipoDeCambio: number;
  cfdi: string;
  cfdiSerie: string;
  cfdiFolio: string;
  uuid: string;
  importe: number;
  impuesto: number;
  total: number;
  disponible: number;
  disponibleCalculado: number;
  comentario: string;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
  aplicaciones: AnticipoSatDet[];
}

export interface AnticipoSatDet {
  id: string;
  cfdi?: Partial<Cfdi>;
  fecha: string;
  cxc: string;
  cxcDocumento: number;
  cxcTipo: string;
  uuid: string;
  moneda: string;
  tipoDeCambio: number;
  sucursal: string;

  egresoCfdi: string;
  egresoUrl: string;
  egresoUuid: string;

  cobro: string;
  importe: number;
  comentario: string;
  anticipo?: Partial<AnticipoSat>;

  dateCreated: string;
  lastUpdated: string;

  createUser: string;
  updateUser: string;
}
