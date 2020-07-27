import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FacturaPageComponent } from './factura-page.component';


const routes: Routes = [
  { path: '', component: FacturaPageComponent }
];

@NgModule({
  declarations: [FacturaPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FacturaPageModule { }
