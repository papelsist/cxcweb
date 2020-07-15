import { Cfdi } from '../../core';

export interface NotaDeCargoDto {
  id: string;
  folio: number;
  serie: string;
  tipo: string;
  fecha: string;
  nombre: string;
  moneda: string;
  tipoDeCambio: number;
  total: number;
  comentario?: string;
  cfdi: Partial<Cfdi>;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
