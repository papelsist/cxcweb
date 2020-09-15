import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CreditosComponent } from './creditos.component';


const routes: Routes = [
  { path: '', component: CreditosComponent }
];

@NgModule({
  declarations: [CreditosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CreditosModule { }
