import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DevolucionesPageComponent } from './devoluciones-page.component';

const routes: Routes = [{ path: '', component: DevolucionesPageComponent }];

@NgModule({
  declarations: [DevolucionesPageComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    UiMaterialModule,
    RouterModule.forChild(routes),
  ],
})
export class DevolucionesPageModule {}
