import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { CobroPageComponent } from './cobro-page.component';

@NgModule({
  declarations: [CobroPageComponent],
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CobroPageComponent,
      },
    ]),
  ],
})
export class CobroPageModule {}
