import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      {
        path: 'all',
        loadChildren: () =>
          import('./facturas-page/facturas-page.module').then(
            (m) => m.FacturasPageModule
          ),
      },
      {
        path: 'edit/:cxcId',
        loadChildren: () =>
          import('./factura-page/factura-page.module').then(
            (m) => m.FacturaPageModule
          ),
      },
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
    ]),
  ],
})
export class FeatureFacturasModule {}
