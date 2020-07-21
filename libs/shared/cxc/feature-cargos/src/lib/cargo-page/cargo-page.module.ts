import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiCxcCommonModule } from '@nx-papelsa/shared/cxc/ui-cxc-common';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { CovalentDataTableModule } from '@covalent/core/data-table';

import { CargoPageComponent } from './cargo-page.component';
import { CargoEditFormComponent } from './cargo-edit-form/cargo-edit-form.component';
import { CargoPartidasComponent } from './cargo-partidas/cargo-partidas.component';

const routes: Routes = [{ path: '', component: CargoPageComponent }];

@NgModule({
  declarations: [
    CargoPageComponent,
    CargoEditFormComponent,
    CargoPartidasComponent,
  ],
  imports: [
    UiCommonModule,
    UiFormsModule,
    UiMaterialModule,
    UiCovalentModule,
    UiCxcCommonModule,
    CfdiUiCommonModule,
    CovalentDataTableModule,
    RouterModule.forChild(routes),
  ],
})
export class CargoPageModule {}
