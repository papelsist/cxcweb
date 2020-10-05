import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CDS_MODULES } from '../common-modules';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';
import { AgGridModule } from 'ag-grid-angular';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';

import { CobrosComponent } from './cobros.component';
import { ClienteCobrosGridComponent } from './cliente-cobros/cliente-cobros-grid.component';

const routes: Routes = [{ path: '', component: CobrosComponent }];

@NgModule({
  declarations: [CobrosComponent, ClienteCobrosGridComponent],
  imports: [
    ...CDS_MODULES,
    CfdiUiCommonModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
})
export class CobrosModule {}
