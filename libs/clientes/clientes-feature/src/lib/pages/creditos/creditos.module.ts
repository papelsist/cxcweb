import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CDS_MODULES } from '../common-modules';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';
import { AgGridModule } from 'ag-grid-angular';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';

import { CreditosComponent } from './creditos.component';
import { ClienteNotasGridComponent } from './cliente-notas/cliente-notas-grid.component';

const routes: Routes = [{ path: '', component: CreditosComponent }];

@NgModule({
  declarations: [CreditosComponent, ClienteNotasGridComponent],
  imports: [
    ...CDS_MODULES,
    CfdiUiCommonModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
})
export class CreditosModule {}
