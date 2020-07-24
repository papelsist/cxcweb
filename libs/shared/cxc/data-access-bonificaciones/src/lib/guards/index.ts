import { BonificacionExistsGuard } from './bonificacion-exists.guard';
import { BonificacionesGuard } from './bonificaciones.guard';

export const BONIFICACIONES_GUARDS = [
  BonificacionesGuard,
  BonificacionExistsGuard,
];

export * from './bonificaciones.guard';
export * from './bonificacion-exists.guard';
