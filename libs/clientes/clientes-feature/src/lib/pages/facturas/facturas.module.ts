import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FacturasComponent } from './facturas.component';


const routes: Routes = [
  { path: '', component: FacturasComponent }
];

@NgModule({
  declarations: [FacturasComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FacturasModule { }
