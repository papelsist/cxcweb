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

import {
  CuentaPorCobrarDTO,
  formatFormaDePago,
  formatTipoDocto,
  formatUUID,
} from '@nx-papelsa/shared/utils/core-models';

import {
  AgGridText,
  AgPrinterRendererComponent,
} from '@nx-papelsa/shared/utils/ui-common';

@Component({
  selector: 'nx-papelsa-cliente-facturas-grid',
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
        rowSelection="multiple"
        [rowMultiSelectWithClick]="true"
        (selectionChanged)="onChangeSelection($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdated($event)"
        [quickFilterText]="searchTerm"
        [rowClassRules]="rowClassRules"
        [pinnedBottomRowData]="pinnedBottomRowData"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: flex;
        flex-direction: column;
        height: 95%;

        .grid {
          flex: 1 1 auto;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteFacturasGridComponent implements OnInit {
  @Input() rows: CuentaPorCobrarDTO[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;

  @Output() selectionChange = new EventEmitter<CuentaPorCobrarDTO[]>();
  @Output() drillDown = new EventEmitter<CuentaPorCobrarDTO>();
  @Output() print = new EventEmitter<CuentaPorCobrarDTO>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.rowClassRules = {
      'warning-row': ({ data: { atraso } }) => atraso > 7 && atraso < 14,
      'danger-row': ({ data: { atraso } }) => atraso >= 14,
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

    this.gridOptions.onCellClicked = (event) => {
      if (event.colDef.colId === 'print') {
        event.api.deselectAll();
        this.print.emit(event.data);
      }
    };
    this.gridOptions.rowClass = 'medium-row';
    this.gridOptions.rowHeight = 35;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.suppressCellSelection = true;
    this.gridOptions.localeText = AgGridText;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      // this.gridColumnApi.autoSizeAllColumns();
      // this.gridApi.resetRowHeights();
      this.actualizarTotales();
      this.actualizarSeleccion();
    }
  }

  actualizarTotales() {
    const totales = {
      total: 0.0,
      pagos: 0.0,
      saldo: 0.0,
    };
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter(({ data }, index) => {
        Object.keys(totales).forEach((key) => {
          const v = data[key];
          if (v && typeof v === 'number') {
            totales[key] += v;
          }
        });
      });
    }
    const res = [
      {
        ...totales,
      },
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  private actualizarSeleccion() {
    // if (this.selectedRows && this.selectedRows.length > 0) {
    //   this.selectedRows.forEach((row) => {
    //     const node = this.gridApi.getRowNode(row);
    //     if (!node.isSelected()) {
    //       node.selectThisNode(true);
    //     }
    //   });
    // } else {
    //   if (this.gridApi.getSelectedRows().length > 0) {
    //     this.clearSelection();
    //   }
    // }
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
    return formatCurrency(data, this.locale, '$');
  }

  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    const fecha = this.changeDate(data)
    if (fecha) {
      return formatDate(fecha, format, this.locale);
    } else {
      return '';
    }
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt
    }
    return fecha
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
        headerName: 'Sucursal',
        field: 'sucursal',
        maxWidth: 110,
      },

      {
        headerName: 'M',
        field: 'moneda',
        width: 70,
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 160,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Pagos',
        field: 'pagos',
        width: 150,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 150,
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
      // {
      //   headerName: 'P',
      //   colId: 'print',
      //   width: 50,
      //   cellRendererFramework: AgPrinterRendererComponent,
      //   resizable: false,
      //   sortable: false,
      //   filter: false,
      // },
    ];
  }
}
