import { NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';

/**
 * Interface for the 'Devoluciones' data
 */
export interface DevolucionesEntity extends NotaDeCredito {
  rmd?: number;
  rmdSucursal?: string;
}
