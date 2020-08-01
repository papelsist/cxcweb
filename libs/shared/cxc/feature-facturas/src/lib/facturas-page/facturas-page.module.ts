import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';

import { FacturasPageComponent } from './facturas-page.component';

@NgModule({
  declarations: [FacturasPageComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents(),
    RouterModule.forChild([{ path: '', component: FacturasPageComponent }]),
  ],
})
export class FacturasPageModule {}
