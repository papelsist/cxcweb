import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { AgGridModule } from 'ag-grid-angular';
import { UiDevolucionesModule } from '@nx-papelsa/shared/cxc/ui-devoluciones';

import { DevolucionesPageComponent } from './devoluciones-page.component';

@NgModule({
  declarations: [DevolucionesPageComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    UiDevolucionesModule,
    CfdiUiCommonModule,
    AgGridModule.withComponents([]),
    RouterModule.forChild([{ path: '', component: DevolucionesPageComponent }]),
  ],
})
export class DevolucionesPageModule {}
