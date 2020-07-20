import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';

@NgModule({
  imports: [UiCommonModule, ReactiveFormsModule, UiMaterialModule],
})
export class UiCargosModule {}
