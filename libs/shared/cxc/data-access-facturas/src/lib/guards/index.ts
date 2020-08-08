import { FacturasGuard } from './facturas.guard';
import { FacturaExistsGuard } from './factura-exists.guard';

export const FACTURAS_GUARDS = [FacturasGuard, FacturaExistsGuard];

export * from './facturas.guard';
export * from './factura-exists.guard';
