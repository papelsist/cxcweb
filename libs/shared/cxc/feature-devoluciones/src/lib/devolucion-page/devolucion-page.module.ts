import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiDevolucionesModule } from '@nx-papelsa/shared/cxc/ui-devoluciones';

import { DevolucionResolver } from '@nx-papelsa/shared/cxc/data-acces';
import { DevolucionPageComponent } from './devolucion-page.component';

const routes: Routes = [
  {
    path: '',
    component: DevolucionPageComponent,
    resolve: { devolucion: DevolucionResolver },
  },
];

@NgModule({
  declarations: [DevolucionPageComponent],
  imports: [
    CommonModule,
    UiMaterialModule,
    FlexLayoutModule,
    UiDevolucionesModule,
    RouterModule.forChild(routes),
  ],
})
export class DevolucionPageModule {}
