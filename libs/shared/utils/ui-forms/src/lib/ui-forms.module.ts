import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';

import { COMPONENTS } from './components';

@NgModule({
  imports: [UiCommonModule, UiMaterialModule, MatAutocompleteModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class UiFormsModule {}
