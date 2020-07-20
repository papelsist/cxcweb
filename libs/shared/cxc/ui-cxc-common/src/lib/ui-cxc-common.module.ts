import { NgModule } from '@angular/core';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { DataAccesModule } from '@nx-papelsa/shared/cxc/data-acces';

import {
  SELECTORS,
  SELECTORS_ENTRY_COMONENTS,
  SelectorCxcService,
} from './selectores';

@NgModule({
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    CovalentDataTableModule,
    DataAccesModule,
  ],
  declarations: [...SELECTORS],
  entryComponents: [...SELECTORS_ENTRY_COMONENTS],
  exports: [...SELECTORS],
  providers: [SelectorCxcService],
})
export class UiCxcCommonModule {}
