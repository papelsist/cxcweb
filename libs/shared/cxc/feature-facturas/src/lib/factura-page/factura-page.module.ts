import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentSidesheetModule } from '@covalent/core/sidesheet';

import { FacturaPageComponent } from './factura-page.component';
import { COMPONENTS } from './components';

@NgModule({
  declarations: [FacturaPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    CfdiUiCommonModule,
    CovalentDataTableModule,
    CovalentSidesheetModule,
    MatSidenavModule,
    RouterModule.forChild([{ path: '', component: FacturaPageComponent }]),
  ],
})
export class FacturaPageModule {}
