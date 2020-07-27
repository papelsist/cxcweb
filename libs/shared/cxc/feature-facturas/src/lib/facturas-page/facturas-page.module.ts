import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FacturasPageComponent } from './facturas-page.component';


const routes: Routes = [
  { path: '', component: FacturasPageComponent }
];

@NgModule({
  declarations: [FacturasPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FacturasPageModule { }
