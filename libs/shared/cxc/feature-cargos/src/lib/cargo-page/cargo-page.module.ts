import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CargoPageComponent } from './cargo-page.component';


const routes: Routes = [
  { path: '', component: CargoPageComponent }
];

@NgModule({
  declarations: [CargoPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CargoPageModule { }
