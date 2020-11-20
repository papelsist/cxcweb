import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiBonificacionesModule } from '@nx-papelsa/shared/cxc/ui-bonificaciones';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { AgGridModule } from 'ag-grid-angular';
import { PendientesPageComponent } from './pendientes-page.component';
import { DepositoCreateBtnComponent } from './deposito-create/deposito-create-btn.component';
import { DepositoCreateComponent } from './deposito-create/deposito-create.component';

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
  ],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    UiBonificacionesModule,
    CfdiUiCommonModule,
    AgGridModule.withComponents(),
    RouterModule.forChild(routes),
  ],
})
export class DepositosPendientesPageModule {}
