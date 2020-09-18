import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';
import { MatTabsModule } from '@angular/material/tabs';

import { AntiguedadPageComponent } from './antiguedad-page.component';
import { AntiguedadGridComponent } from './antiguedad-grid/antiguedad-grid.component';
import { ResumenCardComponent } from './resumen-card/resumen-card.component';
import { CxcsGridComponent } from './cxcs-grid/cxcx-grid.component';

const routes: Routes = [{ path: '', component: AntiguedadPageComponent }];

@NgModule({
  declarations: [
    AntiguedadPageComponent,
    AntiguedadGridComponent,
    ResumenCardComponent,
    CxcsGridComponent,
  ],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    MatTabsModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
})
export class AntiguedadPageModule {}
