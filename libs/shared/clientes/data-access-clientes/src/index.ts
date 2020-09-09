import * as ClientesActions from './lib/+state/clientes.actions';
import * as ClientesFeature from './lib/+state/clientes.reducer';
import * as ClientesSelectors from './lib/+state/clientes.selectors';
export { ClientesActions, ClientesFeature, ClientesSelectors };
export * from './lib/+state/clientes.models';
export * from './lib/+state/clientes.facade';
export * from './lib/data-access-clientes.module';
