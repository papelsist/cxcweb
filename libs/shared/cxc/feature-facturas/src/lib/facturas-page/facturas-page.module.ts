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

import { FacturasPageComponent } from './facturas-page.component';
import { FacturasGridComponent } from './facturas-grid/facturas-grid.component';

@NgModule({
  declarations: [FacturasPageComponent, FacturasGridComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    CfdiUiCommonModule,
    AgGridModule.withComponents([AgPrinterRendererComponent]),
    RouterModule.forChild([{ path: '', component: FacturasPageComponent }]),
  ],
})
export class FacturasPageModule {}
