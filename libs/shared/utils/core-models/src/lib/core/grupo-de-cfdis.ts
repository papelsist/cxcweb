import { CfdiDto } from '../dtos';

export interface GrupoDeCfdis {
  nombre: string;
  target: string;
  zip?: boolean;
  cfdis: Partial<CfdiDto>[];
}
