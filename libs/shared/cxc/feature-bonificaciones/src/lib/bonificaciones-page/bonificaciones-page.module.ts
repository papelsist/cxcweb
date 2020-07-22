import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';

import { BonificacionesPageComponent } from './bonificaciones-page.component';

export const routes: Routes = [
  {
    path: '',
    component: BonificacionesPageComponent,
  },
];

@NgModule({
  declarations: [BonificacionesPageComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents(),
    RouterModule.forChild(routes),
  ],
})
export class BonificacionesPageModule {}
