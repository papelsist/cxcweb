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
import {
  AplicacionDeCobro,
  formatFormaDePago,
} from '@nx-papelsa/shared/utils/core-models';

@Component({
  selector: 'papx-cxc-aplicaciones-grid',
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      style="width: 100%; height: 100%;"
      [rowData]="rows"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdated($event)"
      [defaultColDef]="defaultColDef"
      [pinnedBottomRowData]="pinnedBottomRowData"
    >
    </ag-grid-angular>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AplicacionesGridComponent implements OnInit {
  private _rows: AplicacionDeCobro[];
  columnDefs = this.buildColumnDef();

  @Input() searchTerm: string;
  @Input() selectedRows = [];
  @Output() selectionChange = new EventEmitter<AplicacionDeCobro[]>(); // Single selection
  @Output() drillDown = new EventEmitter<AplicacionDeCobro>();

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  gridOptions: GridOptions;
  defaultColDef;
  rowClassRules;
  pinnedBottomRowData;
  exportKey = 'EX';

  constructor(private formatService: FormatService) {
    this.rowClassRules = {};
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
      // this.gridColumnApi.autoSizeAllColumns();
      this.gridApi.sizeColumnsToFit();
      // this.gridColumnApi.autoSizeAllColumns();
    }
  }

  actualizarTotales() {}

  onChangeSelection(event) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.selectionChange.emit(selectedData);
  }

  clearSelection() {
    this.gridApi.deselectAll();
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

  exportData(prefix: string = this.exportKey) {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`,
    };
    this.gridApi.exportDataAsCsv(params);
  }

  private buildColumnDef(): ColDef[] {
    return [
      {
        headerName: 'fecha',
        field: 'fecha',
        pinned: 'left',
        valueFormatter: ({ value }) => this.formatDate(value),
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        pinned: 'left',
      },
      {
        headerName: 'T.C',
        field: 'tipoDeCambio',
        pinned: 'left',
      },
      {
        headerName: 'F.Pago',
        colId: 'formaDePago',
        valueGetter: ({ data: { cobro } }) => cobro.formaDePago,
      },
      {
        headerName: 'Referencia',
        colId: 'referencia',
        valueGetter: ({ data: { cobro } }) => cobro.referencia,
      },
      {
        headerName: 'F.Pago',
        colId: 'fpago',
        valueGetter: ({ data: { cobro } }) => cobro.fecha,
        valueFormatter: (params) => this.formatDate(params.value),
      },
      {
        headerName: 'Importe',
        field: 'importe',
        valueFormatter: (params) => this.formatCurrency(params.value),
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        valueGetter: ({ data: { cobro } }) => cobro.comentario,
      },
      {
        headerName: 'Id',
        field: 'id',
      },
    ];
  }
}
