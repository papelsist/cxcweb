import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiBonificacionesModule } from '@nx-papelsa/shared/cxc/ui-bonificaciones';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';

import { BonificacionesPageComponent } from './bonificaciones-page.component';
import { COMPONENTS } from './components';

export const routes: Routes = [
  {
    path: '',
    component: BonificacionesPageComponent,
  },
];

@NgModule({
  declarations: [BonificacionesPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    UiBonificacionesModule,
    AgGridModule.withComponents(),
    RouterModule.forChild(routes),
  ],
})
export class BonificacionesPageModule {}
