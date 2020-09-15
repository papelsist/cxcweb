import { ClientesUiService } from './clientes-ui.service';
import { ClientesGuard } from './clientes.guard';

export const CLIENTES_SERVICES = [ClientesUiService, ClientesGuard];

export * from './clientes-ui.service';
export * from './clientes.guard';
