import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CfdisComponent } from './cfdis.component';


const routes: Routes = [
  { path: '', component: CfdisComponent }
];

@NgModule({
  declarations: [CfdisComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CfdisModule { }
