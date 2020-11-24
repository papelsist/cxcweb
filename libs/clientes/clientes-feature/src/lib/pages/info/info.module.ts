import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { CDS_MODULES } from '../common-modules';

import { InfoComponent } from './info.component';
import { GeneralesFormComponent } from './generales-form/generales-form.component';
import { CreditoFormComponent } from './credito-form/credito-form.component';
import { CreditoCardComponent } from './credito-card/credito-card.component';
import { GeneralesCardComponent } from './generales-card/generales-card.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomicilioPanelComponent } from './generales-card/domicilio-panel.component';
import { TelefonosPanelComponent } from './generales-card/telefonos-panel.component';
import { ComentariosPanelComponent } from './generales-card/comentarios-panel.component';
import { ComentarioDialogComponent } from './generales-card/comentario-dialog.component';

const routes: Routes = [{ path: '', component: InfoComponent }];

@NgModule({
  declarations: [
    InfoComponent,
    CreditoCardComponent,
    GeneralesFormComponent,
    GeneralesCardComponent,
    DomicilioPanelComponent,
    CreditoFormComponent,
    TelefonosPanelComponent,
    ComentariosPanelComponent,
    ComentarioDialogComponent,
  ],
  imports: [...CDS_MODULES, RouterModule.forChild(routes), MatExpansionModule],
})
export class InfoModule {}
