import { NgModule } from '@angular/core';

import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { CfdiUiCommonModule } from '@nx-papelsa/shared/cfdi/ui-common';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { MatExpansionModule } from '@angular/material/expansion';
import { AgGridModule } from 'ag-grid-angular';

import {
  SELECTORS,
  SELECTORS_ENTRY_COMONENTS,
  SelectorCxcService,
} from './selectores';
import { CxcViewComponent } from './cxc-view/cxc-view.component';
import { AplicacionesGridComponent } from './cxc-panel/aplicaciones-grid.component';
import { CxcPanelComponent } from './cxc-panel/cxc-panel.component';
import { CxcDialogComponent } from './cxc-dialog/cxc-dialog.component';

@NgModule({
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    CfdiUiCommonModule,
    CovalentDataTableModule,
    MatExpansionModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [
    ...SELECTORS,
    CxcViewComponent,
    CxcPanelComponent,
    CxcDialogComponent,
    AplicacionesGridComponent,
  ],
  entryComponents: [...SELECTORS_ENTRY_COMONENTS],
  exports: [
    ...SELECTORS,
    CxcViewComponent,
    CxcPanelComponent,
    CxcDialogComponent,
  ],
  providers: [SelectorCxcService],
})
export class UiCxcCommonModule {}
