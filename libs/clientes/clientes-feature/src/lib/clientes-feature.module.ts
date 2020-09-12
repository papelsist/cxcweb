import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';
import { RouterModule, Route } from '@angular/router';

// import { CovalentDialogsModule } from '@covalent/core/dialogs';
import {
  UiCommonModule,
  AgBooleanRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { throwIfAlreadyLoaded } from '@nx-papelsa/shared/utils/core-models';

import { ClientesUiService } from './services';
import { CLIENTES_COMPONENTS } from './components';

import { AgGridModule } from 'ag-grid-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClientesGuard } from './services/clientes.guard';
import { ClientesPageComponent } from './pages/clientes-page.component';

const routes: Route[] = [
  {
    path: '',
    canActivate: [ClientesGuard],
    component: ClientesPageComponent,
  },
  {
    path: ':clienteId',
    loadChildren: () =>
      import('./pages/cliente-dashboard/cliente-dashboard.module').then(
        (m) => m.ClienteDashboardModule
      ),
  },
];

@NgModule({
  declarations: [...CLIENTES_COMPONENTS, ClientesPageComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    MatExpansionModule,
    RouterModule.forChild(routes),
  ],
  providers: [ClientesUiService, ClientesGuard],
})
export class ClientesFeatureModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ClientesFeatureModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'ClientesFeatureModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClientesFeatureModule,
      providers: [ClientesUiService],
    };
  }
}
