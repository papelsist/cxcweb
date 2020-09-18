import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { GridApi, ColumnApi, ColDef, GridOptions } from 'ag-grid-community';

import { FormatService, AgGridText } from '@nx-papelsa/shared/utils/ui-common';
import { CuentaPorCobrarDTO } from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'papx-cxc-cxcs-grid',
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      style="width: 100%; height: 90%;"
      [rowData]="rows"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      rowSelection="single"
      [rowMultiSelectWithClick]="true"
      (selectionChanged)="onChangeSelection($event)"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdated($event)"
      [quickFilterText]="searchTerm"
      (firstDataRendered)="onFirstDataRendered($event)"
      [rowClassRules]="rowClassRules"
      [defaultColDef]="defaultColDef"
      [pinnedBottomRowData]="pinnedBottomRowData"
    >
    </ag-grid-angular>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxcsGridComponent implements OnInit {
  private _rows: CuentaPorCobrarDTO[];
  @Input() columnDefs = this.buildColumnDef();
  @Input() searchTerm: string;
  @Input() selectedRows = [];
  @Output() selectionChange = new EventEmitter<
    CuentaPorCobrarDTO[] | CuentaPorCobrarDTO
  >(); // Single selection
  @Output() drillDown = new EventEmitter<CuentaPorCobrarDTO>();
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;

  constructor(private formatService: FormatService) {
    this.rowClassRules = {
      'warning-row': ({ data: { atraso } }) => atraso > 6 && atraso < 14,
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
      width: 150,
      sortable: true,
      resizable: true,
    };
    this.gridOptions.onRowDoubleClicked = (event) => {
      this.drillDown.emit(event.data);
    };

    this.gridOptions.rowClass = 'medium-row';

    this.gridOptions.rowHeight = 35;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.getRowStyle = this.buildRowStyle;
    this.gridOptions.localeText = AgGridText;
    this.gridOptions.getRowNodeId = (data) => data.id;
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    this.actualizarTotales();
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      this.actualizarTotales();
      this.actualizarSeleccion();
    }
  }

  actualizarTotales() {
    const totales = {
      saldo: 0.0,
      total: 0.0,
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

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData[0]); // Single selection
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  private actualizarSeleccion() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.selectedRows.forEach((row) => {
        const node = this.gridApi.getRowNode(row);
        if (!node.isSelected()) {
          node.selectThisNode(true);
        }
      });
    } else {
      if (this.gridApi.getSelectedRows().length > 0) {
        this.clearSelection();
      }
    }
  }

  formatCurrency(data: any) {
    return this.formatService.formatCurrency(data);
  }

  formatDate(data: any) {
    return this.formatService.formatDate(data);
  }

  @Input()
  get rows() {
    return this._rows;
  }
  set rows(value: any[]) {
    this._rows = value;
    // console.log('Rows:', this._rows);
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'Fcatura',
        field: 'documento',
        width: 100,
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
        width: 100,
      },
      {
        headerName: 'Origen',
        field: 'tipoDocumento',
        width: 100,
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 100,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Vto',
        field: 'vencimiento',
        width: 110,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 90,
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 125,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        width: 125,
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Atraso',
        field: 'atraso',
        width: 125,
      },
    ];
  }
}
