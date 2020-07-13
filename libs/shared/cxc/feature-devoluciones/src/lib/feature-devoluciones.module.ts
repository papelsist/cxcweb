import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./devoluciones-page/devoluciones-page.module').then(
            (m) => m.DevolucionesPageModule
          ),
      },
      {
        path: 'show/:id',
        loadChildren: () =>
          import('./devolucion-page/devolucion-page.module').then(
            (m) => m.DevolucionPageModule
          ),
      },
    ]),
  ],
})
export class FeatureDevolucionesModule {}
