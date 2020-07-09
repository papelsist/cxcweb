import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MainPageComponent } from './core/main-page/main-page.component';

const routes: Route[] = [
  // {
  //   path: 'home',
  //   component: MainPageComponent,
  // },
  {
    path: 'cartera',
    loadChildren: () =>
      import('@nx-papelsa/cxc/feature-cartera').then(
        (m) => m.CxcFeatureCarteraModule
      ),
  },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
