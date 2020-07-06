import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ClientesGridComponent } from './clientes-grid/clientes-grid.component';

@NgModule({
  declarations: [ClientesGridComponent, DashboardComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
