import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  DataAccessDevolucionesModule,
  DevolucionExistsGuard,
} from '@nx-papelsa/shared/cxc/data-access-devoluciones';

@NgModule({
  imports: [
    CommonModule,
    DataAccessDevolucionesModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./devoluciones-page/devoluciones-page.module').then(
            (m) => m.DevolucionesPageModule
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./devolucion-page/devolucion-page.module').then(
            (m) => m.DevolucionPageModule
          ),
        canActivate: [DevolucionExistsGuard],
      },
    ]),
  ],
})
export class FeatureDevolucionesModule {}
