import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DevolucionesPageComponent } from './devoluciones-page.component';


const routes: Routes = [
  { path: '', component: DevolucionesPageComponent }
];

@NgModule({
  declarations: [DevolucionesPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DevolucionesPageModule { }
