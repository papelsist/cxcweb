import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { DevolucionesGridComponent } from './devoluciones-grid/devoluciones-grid.component';
import { RmdPartidasGridComponent } from './rmd-partidas-grid/rmd-partidas-grid.component';

@NgModule({
  imports: [CommonModule, AgGridModule.withComponents([])],
  declarations: [DevolucionesGridComponent, RmdPartidasGridComponent],
  exports: [DevolucionesGridComponent, RmdPartidasGridComponent],
})
export class UiDevolucionesModule {}
