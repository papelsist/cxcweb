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
          import('./cargos-page/cargos-page.module').then(
            (m) => m.CargosPageModule
          ),
      },
      {
        path: 'edit/:cargoId',
        loadChildren: () =>
          import('./cargo-page/cargo-page.module').then(
            (m) => m.CargoPageModule
          ),
      },
    ]),
  ],
})
export class FeatureCargosModule {}
