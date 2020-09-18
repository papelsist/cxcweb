import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgGridModule } from 'ag-grid-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ClientesGridComponent } from './clientes-grid/clientes-grid.component';
import { CarteraGridComponent } from './cartera-grid/cartera-grid.component';

@NgModule({
  declarations: [
    ClientesGridComponent,
    DashboardComponent,
    CarteraGridComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    MatTableModule,
    MatCheckboxModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
