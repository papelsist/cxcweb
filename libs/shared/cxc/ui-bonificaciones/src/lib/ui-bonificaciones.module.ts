import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  UiCommonModule,
  AgBooleanRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';
import { UiFormsModule } from '@nx-papelsa/shared/utils/ui-forms';

import { AgGridModule } from 'ag-grid-angular';

import { BonificacionesGridComponent } from './bonificaciones-grid/bonificaciones-grid.component';
import { BonificacionConceptoFieldComponent } from './bonificacion-concepto/bonificacion-concepto-field.component';

@NgModule({
  imports: [
    CommonModule,
    UiCommonModule,
    UiMaterialModule,
    UiCovalentModule,
    UiFormsModule,
    AgGridModule.withComponents([AgBooleanRendererComponent]),
  ],
  declarations: [
    BonificacionesGridComponent,
    BonificacionConceptoFieldComponent,
  ],
  exports: [BonificacionesGridComponent, BonificacionConceptoFieldComponent],
})
export class UiBonificacionesModule {}
