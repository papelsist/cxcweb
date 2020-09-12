import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { CDS_MODULES } from '../common-modules';

import { InfoComponent } from './info.component';
import { GeneralesFormComponent } from './generales-form/generales-form.component';
import { CreditoFormComponent } from './credito-form/credito-form.component';
import { CreditoCardComponent } from './credito-card/credito-card.component';
import { GeneralesCardComponent } from './generales-card/generales-card.component';

const routes: Routes = [{ path: '', component: InfoComponent }];

@NgModule({
  declarations: [
    InfoComponent,
    CreditoCardComponent,
    GeneralesFormComponent,
    GeneralesCardComponent,
    CreditoFormComponent,
  ],
  imports: [...CDS_MODULES, RouterModule.forChild(routes)],
})
export class InfoModule {}
