import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiBonificacionesModule } from '@nx-papelsa/shared/cxc/ui-bonificaciones';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { AgGridModule } from 'ag-grid-angular';
import { AutorizadosPageComponent } from './autorizados-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AutorizadosPageComponent,
  },
];

@NgModule({
  declarations: [AutorizadosPageComponent],
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
export class DepositosAutorizadosPageModule {}
