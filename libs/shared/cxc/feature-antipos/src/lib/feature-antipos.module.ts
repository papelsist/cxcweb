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
          import('./anticipos-page/anticipos-page.module').then(
            (m) => m.AnticiposPageModule
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./anticipo-page/anticipo-page.module').then(
            (m) => m.AnticipoPageModule
          ),
      },
    ]),
  ],
})
export class FeatureAntiposModule {}
