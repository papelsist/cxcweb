import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';

import {
  CuentaPorCobrarDTO,
  formatFormaDePago,
  formatTipoDocto,
  formatUUID,
} from '@nx-papelsa/shared/utils/core-models';

import { FormatService } from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-selector-cxc-grid',
  template: `
    <div class="grid-container">
      <ag-grid-angular
        #agGrid
        class="ag-theme-alpine grid"
        style="width: 100%; height: 100%;"
        [rowData]="rows"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [gridOptions]="gridOptions"
        [rowSelection]="rowSelection"
        [rowMultiSelectWithClick]="true"
        (selectionChanged)="onChangeSelection($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdated($event)"
        [rowClassRules]="rowClassRules"
        [quickFilterText]="searchTerm"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: flex;
        flex-direction: column;
        height: 100%;

        .grid {
          flex: 1 1 auto;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorCxcGridComponent implements OnInit {
  @Input() rows: CuentaPorCobrarDTO[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() hideCliente = false;

  @Output() selectionChange = new EventEmitter<CuentaPorCobrarDTO[]>();
  @Output() drillDown = new EventEmitter<CuentaPorCobrarDTO>();
  @Output() print = new EventEmitter<CuentaPorCobrarDTO>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  rowClassRules;
  defaultColDef;

  constructor(private format: FormatService) {
    this.rowClassRules = {
      'warning-row': ({ data: { atrasoMaximo } }) =>
        atrasoMaximo > 0 && atrasoMaximo < 7,
      'danger-row': ({ data: { atrasoMaximo } }) => atrasoMaximo >= 7,
    };
  }

  ngOnInit(): void {
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};

    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 120,
      sortable: true,
      resizable: true,
    };

    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);

    this.gridOptions.onRowDoubleClicked = (event) => {
      event.api.deselectAll();
      this.drillDown.emit(event.data);
    };
    this.gridOptions.rowHeight = 35;
    this.gridOptions.headerHeight = 40;
    this.gridOptions.suppressCellSelection = true;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      this.gridColumnApi.autoSizeAllColumns();
      this.gridApi.resetRowHeights();
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
    if (!params.data.cfdi) {
      return {
        'font-weight': 'bold',
        'font-style': 'italic',
        color: 'rgb(190, 26, 26)',
      };
    }
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  formatCurrency(data: any) {
    return this.format.formatCurrency(data);
  }

  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return this.format.formatDate(data, format);
    } else {
      return '';
    }
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Docto',
        field: 'documento',
        maxWidth: 110,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Tipo',
        field: 'tipoDocumento',
        width: 90,
        valueFormatter: (params) => formatTipoDocto(params.value),
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 120,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 205,
        hide: this.hideCliente,
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        maxWidth: 110,
      },

      {
        headerName: 'F.P.',
        field: 'formaDePago',
        width: 110,
        valueFormatter: (params) => formatFormaDePago(params.value),
      },
      {
        headerName: 'M',
        field: 'moneda',
        width: 70,
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 120,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Pagos',
        field: 'pagos',
        width: 115,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 120,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Vto',
        field: 'vencimiento',
        width: 120,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Atraso',
        field: 'atraso',
        width: 100,
        cellClass: (params) => (params.value > 5 ? 'warn-cell' : ''),
      },
      {
        headerName: 'CFDI',
        field: 'cfdi',
        maxWidth: 100,
        valueFormatter: (params) =>
          params.value ? formatUUID(params.value.uuid) : '',
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        minWidth: 200,
      },
      {
        headerName: 'Cancelado',
        field: 'cancelada',
        valueFormatter: (params) => this.formatDate(params.value),
        resizable: false,
      },
    ];
  }
}
