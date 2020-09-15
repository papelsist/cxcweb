import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { UiCxcCommonModule } from '@nx-papelsa/shared/cxc/ui-cxc-common';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';

import { CobroPageComponent } from './cobro-page.component';
import { COMPONENTS } from './components';

@NgModule({
  declarations: [CobroPageComponent, ...COMPONENTS],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    UiCxcCommonModule,
    CfdiUiCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CobroPageComponent,
      },
    ]),
  ],
})
export class CobroPageModule {}
