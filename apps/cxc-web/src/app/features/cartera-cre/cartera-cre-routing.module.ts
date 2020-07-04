import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarteraCreComponent } from './cartera-cre.component';

const routes: Routes = [{ path: '', component: CarteraCreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteraCreRoutingModule { }
