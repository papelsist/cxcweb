import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import {
  UiCommonModule,
  AgPrinterRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { AgGridModule } from 'ag-grid-angular';
import { JurCxcPageComponent } from './jur-cxc-page.component';
import { JurCxcGridComponent } from './jur-cxc-grid/jur-cxc-grid.component';

@NgModule({
  declarations: [JurCxcPageComponent, JurCxcGridComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    CfdiUiCommonModule,
    AgGridModule.withComponents([AgPrinterRendererComponent]),
    RouterModule.forChild([{ path: '', component: JurCxcPageComponent }]),
  ],
})
export class JurCxcPageModule {}
