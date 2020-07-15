import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiCovalentModule } from '@nx-papelsa/shared/utils/ui-covalent';

import { AgGridModule } from 'ag-grid-angular';

import { CargosPageComponent } from './cargos-page.component';

import { COMPONENTS } from './components';
import { BooleanRendererComponent } from './components/boolean-renderer.component';

export const routes: Routes = [
  {
    path: '',
    component: CargosPageComponent,
  },
];

@NgModule({
  declarations: [CargosPageComponent, ...COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    UiMaterialModule,
    UiCovalentModule,
    AgGridModule.withComponents([BooleanRendererComponent]),
    RouterModule.forChild(routes),
  ],
})
export class CargosPageModule {}
