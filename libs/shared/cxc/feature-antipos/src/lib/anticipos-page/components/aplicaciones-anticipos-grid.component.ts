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

import { AnticipoSatDet } from '@nx-papelsa/shared/utils/core-models';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-anticipos-aplicaciones-grid',
  template: `
    <div class="cargos-grid-container">
      <ag-grid-angular
        #agGrid
        class="ag-theme-alpine grid"
        style="width: 100%; height: 100%;"
        [rowData]="rows"
        [columnDefs]="columnDefs"
        [gridOptions]="gridOptions"
        rowSelection="multiple"
        [rowMultiSelectWithClick]="true"
        (selectionChanged)="onChangeSelection($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdated($event)"
        [quickFilterText]="searchTerm"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .cargos-grid-container {
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
export class AplicacionesAnticiposGridComponent implements OnInit {
  @Input() rows: AnticipoSatDet[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<AnticipoSatDet[]>();
  @Output() drillDown = new EventEmitter<AnticipoSatDet>();
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
      console.log('Rows:', this.rows);
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
    if (params.data.status === 'CERRADO') {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    if (!params.data.cfdi) {
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
        headerName: 'Factura',
        colId: 'factura',
        sortable: true,
        filter: true,
        width: 100,
        pinned: 'left',
        valueGetter: (params) =>
          `${params.data['cxcTipo']} - ${params.data['cxcDocumento']}`,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        sortable: true,
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        sortable: true,
        width: 110,
      },
      {
        headerName: 'Cliente',
        field: 'cliente',
        sortable: true,
        filter: true,
        width: 250,
        resizable: true,
      },
      {
        headerName: 'Aplicado',
        field: 'importe',
        sortable: true,
        filter: true,
        width: 110,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'CFDI',
        field: 'egresoCfdi',
        valueFormatter: (params) => (params.value ? 'OK' : 'PENDIENTE'),
      },
      {
        headerName: 'Anticipo',
        colId: 'anticipoFactura',
        sortable: true,
        filter: true,
        resizable: true,
        valueGetter: (params) => params.data['anticipo'].cxcDocumento,
      },
      {
        headerName: 'Importe',
        colId: 'anticipoTotal',
        sortable: true,
        filter: true,
        width: 110,
        valueFormatter: (params) => this.formatCurrency(params.value),
        valueGetter: (params) => params.data['anticipo'].total,
      },
      {
        headerName: 'Disponible',
        colId: 'anticipoDisponible',
        sortable: true,
        filter: true,
        width: 110,
        valueFormatter: (params) => this.formatCurrency(params.value),
        valueGetter: (params) => params.data['anticipo'].disponible,
      },
    ];
  }
}
