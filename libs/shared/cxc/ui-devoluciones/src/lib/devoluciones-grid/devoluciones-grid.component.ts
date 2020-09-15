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

import { NotaDeCredito } from '@nx-papelsa/shared/utils/core-models';
import { AgBooleanRendererComponent } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cxc-devoluciones-grid',
  template: `
    <div class="grid-container">
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
export class DevolucionesGridComponent implements OnInit {
  @Input() rows: NotaDeCredito[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<NotaDeCredito[]>();
  @Output() drillDown = new EventEmitter<NotaDeCredito>();
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

    if (params.data.cancelacion) {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'red' };
    } else {
      if (params.data.status === 'CERRADO') {
        return {
          'font-weight': 'bold',
          'font-style': 'italic',
          color: 'green',
        };
      }
      if (!params.data.cfdi) {
        return {
          'font-weight': 'bold',
          'font-style': 'italic',
          color: 'rgb(190, 119, 26)',
        };
      }
    }
  }
  clearSelection() {
    this.gridApi.deselectAll();
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
        checkboxSelection: true,
        headerCheckboxSelection: true,
        sortable: true,
        filter: true,
        width: 100,
      },
      {
        headerName: 'Serie',
        field: 'serie',
        sortable: true,
        width: 100,
      },
      {
        headerName: 'Sucursal',
        field: 'sucursalNombre',
        sortable: true,
        width: 110,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        sortable: true,
        width: 120,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        sortable: true,
        filter: true,
        resizable: true,
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        sortable: true,
        filter: true,
        width: 250,
        resizable: true,
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
        headerName: 'CFDI',
        field: 'cfdi',
        cellRendererFramework: AgBooleanRendererComponent,
        width: 90,
      },
      {
        headerName: 'Modificado',
        field: 'lastUpdated',
        valueFormatter: (params) =>
          this.formatDate(params.value, 'dd/MM/yyyy HH:mm'),
      },
      {
        headerName: 'Actualizó',
        field: 'updateUser',
      },
      {
        headerName: 'Cancelada',
        field: 'cancelacion',
        valueFormatter: (params) =>
          this.formatDate(params.value, 'dd/MM/yyyy HH:mm'),
      },
    ];
  }
}
