import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataAccessRevisionesModule } from '@nx-papelsa/shared/cxc/data-access-revisiones';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    DataAccessRevisionesModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./revisiones-page/revisiones-page.module').then(
            (m) => m.RevisionesPageModule
          ),
      },
    ]),
  ],
})
export class FeatureRevisionModule {}
