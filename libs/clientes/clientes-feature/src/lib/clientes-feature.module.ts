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

export const clientesFeatureRoutes: Route[] = [];

@NgModule({
  declarations: [...CLIENTES_COMPONENTS],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    MatExpansionModule,
    RouterModule,
  ],
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
