import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DataAccessCobrosModule } from '@nx-papelsa/shared/cxc/data-access-cobros';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./cobros-page/cobros-page.module').then(
            (m) => m.CobrosPageModule
          ),
      },
      {
        path: '/edit/:cobroId',
        loadChildren: () =>
          import('./cobro-page/cobro-page.module').then(
            (m) => m.CobroPageModule
          ),
      },
    ]),
  ],
})
export class FeatureCobrosModule {}
