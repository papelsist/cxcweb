import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  DataAccessCobrosModule,
  CobrosGuard,
  CobroExistsGuard,
} from '@nx-papelsa/shared/cxc/data-access-cobros';

@NgModule({
  imports: [
    CommonModule,
    DataAccessCobrosModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./cobros-page/cobros-page.module').then(
            (m) => m.CobrosPageModule
          ),
        canActivate: [CobrosGuard],
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./cobro-page/cobro-page.module').then(
            (m) => m.CobroPageModule
          ),
        canActivate: [CobroExistsGuard],
      },
    ]),
  ],
})
export class FeatureCobrosModule {}
