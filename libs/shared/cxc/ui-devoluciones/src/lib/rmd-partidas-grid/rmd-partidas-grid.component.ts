import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  LOCALE_ID,
} from '@angular/core';

import { formatCurrency, formatDate } from '@angular/common';
import { GridApi, ColumnApi, ColDef } from 'ag-grid-community';

@Component({
  selector: 'nx-papelsa-rmd-partidas-grid',
  templateUrl: './rmd-partidas-grid.component.html',
  styleUrls: ['./rmd-partidas-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RmdPartidasGridComponent implements OnInit {
  @Input() partidas: any[];
  @Input() columnDefs = this.buildColumnDef();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit(): void {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.autoSizeAllColumns();
  }
  onModelUpdated(event) {
    if (this.gridApi) {
      this.gridColumnApi.autoSizeAllColumns();
      console.log(this.partidas);
    }
  }

  formatCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }
  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Cantidad',
        field: 'cantidad',
      },
      {
        headerName: 'Producto',
        field: 'producto',
        colId: 'producto',
        valueFormatter: (params) => params.value.clave,
      },
      {
        headerName: 'Descripción',
        field: 'producto',
        colId: 'descrpcion',
        valueFormatter: (params) => params.value.descripcion,
      },
    ];
  }
}
