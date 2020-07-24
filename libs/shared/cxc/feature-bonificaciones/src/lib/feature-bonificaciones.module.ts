import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  DataAccessBonificacionesModule,
  BonificacionExistsGuard,
  BonificacionesGuard,
} from '@nx-papelsa/shared/cxc/data-access-bonificaciones';

@NgModule({
  imports: [
    CommonModule,
    DataAccessBonificacionesModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./bonificaciones-page/bonificaciones-page.module').then(
            (m) => m.BonificacionesPageModule
          ),
        canActivate: [BonificacionesGuard],
      },

      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./bonificacion-page/bonificacion-page.module').then(
            (m) => m.BonificacionPageModule
          ),
        canActivate: [BonificacionExistsGuard],
      },
    ]),
  ],
  declarations: [],
})
export class FeatureBonificacionesModule {}
