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
import { CovalentDataTableModule } from '@covalent/core/data-table';

import { RevisionesPageComponent } from './revisiones-page.component';
import { COMPONENTS } from './components';

const routes: Routes = [{ path: '', component: RevisionesPageComponent }];

@NgModule({
  declarations: [RevisionesPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    CfdiUiCommonModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    CovalentDataTableModule,
    RouterModule.forChild(routes),
  ],
})
export class RevisionesPageModule {}
