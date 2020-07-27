import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';

import { CobrosPageComponent } from './cobros-page.component';
import { COMPONENTS } from './components';
import { CobrosGridComponent } from './cobros-grid/cobros-grid.component';

@NgModule({
  declarations: [CobrosPageComponent, ...COMPONENTS, CobrosGridComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents(),
    RouterModule.forChild([
      {
        path: '',
        component: CobrosPageComponent,
      },
    ]),
  ],
})
export class CobrosPageModule {}
