import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiCxcCommonModule } from '@nx-papelsa/shared/cxc/ui-cxc-common';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';
import { UiBonificacionesModule } from '@nx-papelsa/shared/cxc/ui-bonificaciones';

import { CovalentDataTableModule } from '@covalent/core/data-table';

import { BonificacionPageComponent } from './bonificacion-page.component';
import { COMPONENTS } from './components';

const routes: Routes = [{ path: '', component: BonificacionPageComponent }];

@NgModule({
  declarations: [BonificacionPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiFormsModule,
    UiMaterialModule,
    UiCovalentModule,
    UiCxcCommonModule,
    CfdiUiCommonModule,
    CovalentDataTableModule,
    UiBonificacionesModule,
    RouterModule.forChild(routes),
  ],
})
export class BonificacionPageModule {}
