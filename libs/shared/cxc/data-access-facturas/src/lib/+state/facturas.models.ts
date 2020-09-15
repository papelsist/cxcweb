import { CuentaPorCobrarDTO } from '@nx-papelsa/shared/utils/core-models';
/**
 * Interface for the 'Facturas' data
 */
export interface FacturasEntity extends CuentaPorCobrarDTO {
  comentario?: string;
}
