import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiCxcCommonModule } from '@nx-papelsa/shared/cxc/ui-cxc-common';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';
import { UiDevolucionesModule } from '@nx-papelsa/shared/cxc/ui-devoluciones';

import { DevolucionPageComponent } from './devolucion-page.component';
import { COMPONENTS } from './components';

@NgModule({
  declarations: [DevolucionPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiFormsModule,
    UiMaterialModule,
    UiCovalentModule,
    UiCxcCommonModule,
    UiDevolucionesModule,
    CfdiUiCommonModule,
    RouterModule.forChild([{ path: '', component: DevolucionPageComponent }]),
  ],
})
export class DevolucionPageModule {}
