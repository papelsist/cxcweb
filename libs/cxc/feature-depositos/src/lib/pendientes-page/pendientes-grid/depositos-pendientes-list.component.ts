import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';

import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';
import { SolicitudDeDeposito } from '@nx-papelsa/shared/cxc/data-access-depositos';

@Component({
  selector: 'nx-papelsa-solicitudes-pendientes-grid',
  template: `
    <div class="grid-container">
      <ag-grid-angular
        #agGrid
        class="ag-theme-alpine grid"
        style="width: 100%; height: 100%;"
        [rowData]="rows"
        [columnDefs]="columnDefs"
        [gridOptions]="gridOptions"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdated($event)"
        [quickFilterText]="searchTerm"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: flex;
        height: 100%;
        width: 100%;

        .grid {
          height: calc(100% - 1px);
          width: calc(100% - 1px);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesPendientesGridComponent implements OnInit {
  @Input() rows: SolicitudDeDeposito[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<SolicitudDeDeposito[]>();
  @Output() drillDown = new EventEmitter<SolicitudDeDeposito>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit(): void {
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};

    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true,
      resizable: true,
    };
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
    this.gridOptions.onRowDoubleClicked = (event) => {
      this.drillDown.emit(event.data);
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      this.gridColumnApi.autoSizeAllColumns();
    }
  }

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    if (params.data.auth) {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    if (params.data.rechazo) {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'red' };
    }
    if (!params.data.auth) {
      return {
        'font-weight': 'bold',
        'font-style': 'italic',
        color: 'rgb(190, 119, 26)',
      };
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
        headerName: 'Folio',
        field: 'folio',
        sortable: true,
        filter: true,
        width: 100,
        pinned: 'left',
      },
      {
        headerName: 'Cartera',
        field: 'tipo',
        width: 90,
        pinned: 'left',
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        sortable: true,
        width: 110,
        pinned: 'left',
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Banco',
        field: 'banco',
        width: 120,
        valueGetter: (params) => params.data.banco.nombre,
      },
      {
        headerName: 'Cuenta',
        field: 'cuenta',
        width: 120,
        valueGetter: (params) =>
          params.data.cuenta.descripcion +
          '(' +
          params.data.cuenta.numero +
          ')',
      },
      {
        headerName: 'Cliente',
        field: 'nombre',
        sortable: true,
        filter: true,
        width: 250,
        resizable: true,
        valueGetter: (params) => params.data.cliente.nombre,
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 70,
      },
      {
        headerName: 'Total',
        field: 'total',
        sortable: true,
        filter: true,
        width: 110,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Actualizó',
        field: 'updateUser',
      },
    ];
  }
}
