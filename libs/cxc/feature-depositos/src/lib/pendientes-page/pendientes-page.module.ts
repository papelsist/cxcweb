import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  UiCommonModule,
  AgBooleanRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { AgGridModule } from 'ag-grid-angular';
import { PendientesPageComponent } from './pendientes-page.component';
import { DepositoCreateBtnComponent } from './deposito-create/deposito-create-btn.component';
import { DepositoCreateComponent } from './deposito-create/deposito-create.component';
import { SolicitudesPendientesGridComponent } from './pendientes-grid/depositos-pendientes-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PendientesPageComponent,
  },
];

@NgModule({
  declarations: [
    PendientesPageComponent,
    DepositoCreateBtnComponent,
    DepositoCreateComponent,
    SolicitudesPendientesGridComponent,
  ],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    CfdiUiCommonModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
})
export class DepositosPendientesPageModule {}
