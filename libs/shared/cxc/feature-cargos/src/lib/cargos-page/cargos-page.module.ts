import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import {
  UiCommonModule,
  AgBooleanRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';

import { CargosPageComponent } from './cargos-page.component';

import { COMPONENTS, ENTRY_COMPONENTS } from './components';

export const routes: Routes = [
  {
    path: '',
    component: CargosPageComponent,
  },
];

@NgModule({
  declarations: [CargosPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class CargosPageModule {}
