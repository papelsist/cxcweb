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
          import('./bonificaciones-page/bonificaciones-page.module').then(
            (m) => m.BonificacionesPageModule
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./bonificacion-page/bonificacion-page.module').then(
            (m) => m.BonificacionPageModule
          ),
      },
    ]),
  ],
  declarations: [],
})
export class FeatureBonificacionesModule {}
