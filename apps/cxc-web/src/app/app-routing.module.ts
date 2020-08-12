import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MainPageComponent } from './core/main-page/main-page.component';
import { CXCCarteraGuard } from '@nx-papelsa/shared/cxc/data-acces';
import { AuthGuard } from '@nx-papelsa/auth';

const routes: Route[] = [
  {
    path: 'credito',
    loadChildren: () =>
      import('@nx-papelsa/cxc/feature-cobranza-cre').then(
        (m) => m.FeatureCobranzaCreModule
      ),
    data: { cartera: { clave: 'CRE', descripcion: 'CREDITO' } },
    canActivate: [AuthGuard, CXCCarteraGuard],
  },
  // {
  //   path: 'cartera',
  //   loadChildren: () =>
  //     import('@nx-papelsa/cxc/feature-cartera').then(
  //       (m) => m.CxcFeatureCarteraModule
  //     ),
  // },
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
