import { CfdiDto } from '../dtos';

export interface GrupoDeCfdis {
  nombre: string;
  target: string;
  cfdis: Partial<CfdiDto>[];
}
