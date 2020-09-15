import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { DevolucionesGridComponent } from './devoluciones-grid/devoluciones-grid.component';
import { RmdPartidasGridComponent } from './rmd-partidas-grid/rmd-partidas-grid.component';
import { DevolucionCreateDialogComponent } from './devolucion-create-dialog/devolucion-create-dialog.component';
import { RmdSelectorBtnComponent } from './rmd-selector/rmd-selector.component';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCommonModule } from '@nx-papelsa/shared/utils/ui-common';
import { UiCxcCommonModule } from '@nx-papelsa/shared/cxc/ui-cxc-common';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { RmdSelectorDialogComponent } from './rmd-selector/rmd-selector-dialog.component';

@NgModule({
  imports: [
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    UiCxcCommonModule,
    CovalentDataTableModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [
    DevolucionesGridComponent,
    RmdPartidasGridComponent,
    DevolucionCreateDialogComponent,
    RmdSelectorBtnComponent,
    RmdSelectorDialogComponent,
  ],
  exports: [
    DevolucionesGridComponent,
    RmdPartidasGridComponent,
    DevolucionCreateDialogComponent,
    RmdSelectorBtnComponent,
    RmdSelectorDialogComponent,
  ],
})
export class UiDevolucionesModule {}
