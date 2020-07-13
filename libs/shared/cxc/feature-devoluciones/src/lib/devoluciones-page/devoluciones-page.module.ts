import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DevolucionesPageComponent } from './devoluciones-page.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { UiMaterialModule } from '@nx-papelsa/shared/utils/ui-material';
import { UiDevolucionesModule } from '@nx-papelsa/shared/cxc/ui-devoluciones';

const routes: Routes = [{ path: '', component: DevolucionesPageComponent }];

@NgModule({
  declarations: [DevolucionesPageComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    UiMaterialModule,
    UiDevolucionesModule,
    RouterModule.forChild(routes),
  ],
})
export class DevolucionesPageModule {}
