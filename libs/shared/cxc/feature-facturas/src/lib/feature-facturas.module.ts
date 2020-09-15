import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  DataAccessFacturasModule,
  FacturasGuard,
  FacturaExistsGuard,
} from '@nx-papelsa/shared/cxc/data-access-facturas';

@NgModule({
  imports: [
    CommonModule,
    DataAccessFacturasModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./facturas-page/facturas-page.module').then(
            (m) => m.FacturasPageModule
          ),
        canActivate: [FacturasGuard],
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./factura-page/factura-page.module').then(
            (m) => m.FacturaPageModule
          ),
        canActivate: [FacturaExistsGuard],
      },
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
    ]),
  ],
})
export class FeatureFacturasModule {}
