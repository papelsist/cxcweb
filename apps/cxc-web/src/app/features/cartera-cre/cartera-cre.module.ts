import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';

import { CarteraCreRoutingModule } from './cartera-cre-routing.module';
import { CarteraCreComponent } from './cartera-cre.component';

const routes: Routes = [{ path: '', component: CarteraCreComponent }];

@NgModule({
  declarations: [CarteraCreComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    CarteraCreRoutingModule,
    RouterModule.forChild(routes),
  ],
})
export class CarteraCreModule {}
