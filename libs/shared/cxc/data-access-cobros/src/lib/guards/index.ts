import { CobroExistsGuard } from './cobro-exists.guard';
import { CobrosGuard } from './cobros.guard';

export const COBROS_GUARDS = [CobrosGuard, CobroExistsGuard];

export * from './cobros.guard';
export * from './cobro-exists.guard';
