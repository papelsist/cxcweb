import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';

import { COMPONENTS } from './components';
import { ReportService } from './report.service';

@NgModule({
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    MatAutocompleteModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [ReportService],
})
export class UiFormsModule {}
